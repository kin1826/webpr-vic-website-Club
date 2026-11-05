import { createHmac, randomBytes } from "node:crypto";
import type { ServerConfig } from "../config/env.js";
import { ApiError } from "../types/errors.js";
import type {
  AdminApplication,
  AdminApplicationsResponse,
  AppScriptAction,
  AppScriptRequest,
  PublishFormPayload,
  RecruitmentFormConfig,
  SubmitApplicationPayload,
  SubmitApplicationResult,
  SubmissionStatusResult,
} from "../types/contracts.js";

export type SignedEnvelope = {
  protocolVersion: "1";
  timestamp: string;
  nonce: string;
  payloadJson: string;
  signature: string;
};

export function createSignedEnvelope(
  payload: AppScriptRequest,
  secret: string,
  now = Date.now(),
  nonce = randomBytes(32).toString("base64url"),
): SignedEnvelope {
  const protocolVersion = "1" as const;
  const timestamp = String(now);
  const payloadJson = JSON.stringify(payload);
  const signedText = `${protocolVersion}\n${timestamp}\n${nonce}\n${payloadJson}`;
  const signature = createHmac("sha256", secret).update(signedText, "utf8").digest("hex");
  return { protocolVersion, timestamp, nonce, payloadJson, signature };
}

type AppsScriptEnvelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code?: string; message?: string; status?: number; fieldErrors?: Record<string, string>; retryAfterSeconds?: number; nextAllowedAt?: string; latestConfig?: unknown; outcomeUnknown?: boolean } };

export interface RecruitmentGateway {
  getForm(): Promise<RecruitmentFormConfig>;
  submitApplication(payload: SubmitApplicationPayload): Promise<SubmitApplicationResult>;
  getSubmissionStatus(idempotencyKey: string): Promise<SubmissionStatusResult>;
  adminGetForm(idToken: string): Promise<RecruitmentFormConfig>;
  adminListApplications(idToken: string, page: number, pageSize: number): Promise<AdminApplicationsResponse>;
  adminGetApplication(idToken: string, applicationId: string): Promise<AdminApplication>;
  adminPublishForm(payload: PublishFormPayload): Promise<RecruitmentFormConfig>;
  adminRetryEmail(idToken: string, applicationId: string, allowPossibleDuplicate?: boolean): Promise<{ status: "pending" | "sent" | "failed" }>;
  adminConfirmEmailSent(idToken: string, applicationId: string): Promise<{ status: "sent" }>;
}

export class AppsScriptClient implements RecruitmentGateway {
  private cachedPublicForm: { value: RecruitmentFormConfig; expiresAt: number } | null = null;

  constructor(
    private readonly config: ServerConfig,
    private readonly fetcher: typeof fetch = fetch,
  ) {}

  async getForm() {
    if (this.cachedPublicForm && this.cachedPublicForm.expiresAt > Date.now()) return this.cachedPublicForm.value;
    const value = await this.call<RecruitmentFormConfig>({ action: "getForm" });
    this.cachedPublicForm = { value, expiresAt: Date.now() + 15_000 };
    return value;
  }

  submitApplication(payload: SubmitApplicationPayload) {
    const { turnstileToken: _verifiedToken, ...storedPayload } = payload;
    return this.call<SubmitApplicationResult>({ action: "submitApplication", payload: storedPayload });
  }

  getSubmissionStatus(idempotencyKey: string) {
    return this.call<SubmissionStatusResult>({ action: "getSubmissionStatus", idempotencyKey }, 12_000);
  }

  adminGetForm(idToken: string) {
    return this.call<RecruitmentFormConfig>({ action: "adminGetForm", idToken });
  }

  adminListApplications(idToken: string, page: number, pageSize: number) {
    return this.call<AdminApplicationsResponse>({ action: "adminListApplications", idToken, page, pageSize });
  }

  adminGetApplication(idToken: string, applicationId: string) {
    return this.call<AdminApplication>({ action: "adminGetApplication", idToken, applicationId });
  }

  async adminPublishForm(payload: PublishFormPayload) {
    const config = await this.call<RecruitmentFormConfig>({
      action: "adminPublishForm",
      idToken: payload.idToken,
      config: payload.config,
      expectedVersion: payload.expectedVersion,
    });
    this.cachedPublicForm = null;
    return config;
  }

  adminRetryEmail(idToken: string, applicationId: string, allowPossibleDuplicate = false) {
    return this.call<{ status: "pending" | "sent" | "failed" }>({ action: "adminRetryEmail", idToken, applicationId, allowPossibleDuplicate });
  }

  adminConfirmEmailSent(idToken: string, applicationId: string) {
    return this.call<{ status: "sent" }>({ action: "adminConfirmEmailSent", idToken, applicationId });
  }

  private async call<T>(request: AppScriptRequest, timeoutMs = this.config.appsScriptTimeoutMs): Promise<T> {
    const action: AppScriptAction = request.action;
    const envelope = createSignedEnvelope(request, this.config.appsScriptHmacSecret);
    let response: Response;
    try {
      response = await this.fetcher(this.config.appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(envelope),
        redirect: "follow",
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (cause) {
      const timedOut = cause instanceof Error && (cause.name === "TimeoutError" || cause.name === "AbortError");
      const outcomeUnknown = action === "submitApplication";
      throw new ApiError({
        status: timedOut ? 504 : 502,
        code: timedOut ? "UPSTREAM_TIMEOUT" : "UPSTREAM_UNAVAILABLE",
        message: outcomeUnknown
          ? "Chưa nhận được kết quả cuối từ hệ thống lưu đơn. Đơn có thể đã được ghi; hãy thử lại với cùng nội dung và mã nộp đơn."
          : timedOut
            ? "Hệ thống tuyển thành viên phản hồi quá thời gian. Vui lòng thử lại sau."
          : "Không thể kết nối hệ thống tuyển thành viên. Vui lòng thử lại sau.",
        outcomeUnknown,
        cause,
      });
    }

    let envelopeResult: AppsScriptEnvelope<T>;
    try {
      envelopeResult = await response.json() as AppsScriptEnvelope<T>;
    } catch (cause) {
      throw new ApiError({
        status: 502,
        code: "UPSTREAM_INVALID_RESPONSE",
        message: action === "submitApplication"
          ? "Không nhận được kết quả cuối từ hệ thống lưu đơn. Đơn có thể đã được ghi; hãy thử lại với cùng nội dung và mã nộp đơn."
          : "Hệ thống tuyển thành viên trả về dữ liệu không hợp lệ.",
        outcomeUnknown: action === "submitApplication",
        cause,
      });
    }
    if (!response.ok) {
      throw new ApiError({
        status: 502,
        code: "UPSTREAM_HTTP_ERROR",
        message: action === "submitApplication"
          ? "Không nhận được kết quả cuối từ hệ thống lưu đơn. Đơn có thể đã được ghi; hãy thử lại với cùng nội dung và mã nộp đơn."
          : "Hệ thống tuyển thành viên chưa thể xử lý yêu cầu.",
        outcomeUnknown: action === "submitApplication",
      });
    }
    if (!envelopeResult.ok) {
      const issue = envelopeResult.error;
      throw new ApiError({
        status: issue.status ?? 502,
        code: issue.code ?? "UPSTREAM_ERROR",
        message: issue.message ?? "Không thể xử lý yêu cầu tuyển thành viên.",
        fieldErrors: issue.fieldErrors,
        retryAfterSeconds: issue.retryAfterSeconds,
        nextAllowedAt: issue.nextAllowedAt,
        latestConfig: issue.latestConfig,
        outcomeUnknown: issue.outcomeUnknown ?? (action === "submitApplication" && (issue.status ?? 502) >= 500),
      });
    }
    return envelopeResult.data;
  }
}
