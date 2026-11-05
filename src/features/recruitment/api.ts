import { recruitmentEnvironment } from "./config";
import { createPrototypeConfig, prototypeApplications } from "./prototype-data";
import type { AdminApplication, AdminApplicationsResponse, ApiFailure, RecruitmentFormConfig, SubmitApplicationPayload, SubmitApplicationResult } from "./types";

type ApiEnvelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code?: string; message: string; status?: number; fieldErrors?: Record<string, string>; retryAfterSeconds?: number; nextAllowedAt?: string; latestConfig?: RecruitmentFormConfig; outcomeUnknown?: boolean } };

type RequestOptions = {
  method?: "GET" | "POST" | "PUT";
  body?: unknown;
  idToken?: string;
  idempotencyKey?: string;
  timeoutMs?: number;
};

async function callApi<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!recruitmentEnvironment.apiBaseUrl) throw Object.assign(new Error("API tuyển thành viên chưa được cấu hình."), { code: "API_NOT_CONFIGURED" });
  const headers = new Headers();
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  if (options.idToken) headers.set("Authorization", `Bearer ${options.idToken}`);
  if (options.idempotencyKey) headers.set("Idempotency-Key", options.idempotencyKey);

  let response: Response;
  try {
    response = await fetch(`${recruitmentEnvironment.apiBaseUrl}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: AbortSignal.timeout(options.timeoutMs ?? 45_000),
    });
  } catch (error) {
    const timeout = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    const outcomeUnknown = path === "/api/recruitment/applications" && Boolean(options.idempotencyKey);
    const failure = Object.assign(
      new Error(outcomeUnknown
        ? "Chưa nhận được phản hồi từ máy chủ. Đơn có thể đã được lưu; hãy thử lại với cùng nội dung."
        : timeout
          ? "Máy chủ phản hồi quá thời gian. Vui lòng thử lại sau."
          : "Không thể kết nối máy chủ. Hãy kiểm tra mạng rồi thử lại."),
      { code: outcomeUnknown ? "REQUEST_OUTCOME_UNKNOWN" : timeout ? "REQUEST_TIMEOUT" : "NETWORK_ERROR", outcomeUnknown },
    );
    throw failure as ApiFailure;
  }

  let envelope: ApiEnvelope<T>;
  try { envelope = await response.json() as ApiEnvelope<T>; }
  catch { throw Object.assign(new Error("Máy chủ trả về phản hồi không hợp lệ."), { status: response.status, code: "INVALID_RESPONSE" }); }
  if (!response.ok || !envelope.ok) {
    const detail = envelope.ok ? { message: "Yêu cầu không thành công." } : envelope.error;
    throw Object.assign(new Error(detail.message), { status: response.status, ...detail }) as ApiFailure;
  }
  return envelope.data;
}

export async function fetchRecruitmentForm(): Promise<RecruitmentFormConfig> {
  if (!recruitmentEnvironment.apiBaseUrl) return createPrototypeConfig(import.meta.env.DEV);
  return callApi<RecruitmentFormConfig>("/api/recruitment/form");
}

export async function submitRecruitmentApplication(payload: SubmitApplicationPayload): Promise<SubmitApplicationResult> {
  if (!recruitmentEnvironment.apiBaseUrl) {
    if (!import.meta.env.DEV) throw Object.assign(new Error("Biểu mẫu thật chưa được kết nối."), { code: "API_NOT_CONFIGURED" });
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    const submittedAt = new Date().toISOString();
    return { applicationId: `VIC-DEMO-${Date.now().toString().slice(-6)}`, submittedAt, emailStatus: "pending", message: "Đây là lần gửi thử trong môi trường local; dữ liệu không được lưu.", nextAllowedAt: new Date(Date.now() + 600_000).toISOString() };
  }
  return callApi<SubmitApplicationResult>("/api/recruitment/applications", { method: "POST", body: payload, idempotencyKey: payload.idempotencyKey });
}

export async function fetchSubmissionStatus(idempotencyKey: string): Promise<{ state: "processing" } | { state: "received"; result: SubmitApplicationResult }> {
  return callApi("/api/recruitment/applications/status", { method: "POST", body: { idempotencyKey }, idempotencyKey, timeoutMs: 15_000 });
}

export async function fetchAdminForm(idToken: string) {
  if (!recruitmentEnvironment.apiBaseUrl && import.meta.env.DEV) return createPrototypeConfig(true);
  return callApi<RecruitmentFormConfig>("/api/admin/recruitment/form", { idToken });
}

export async function fetchAdminApplications(idToken: string): Promise<AdminApplicationsResponse> {
  if (!recruitmentEnvironment.apiBaseUrl && import.meta.env.DEV) return { applications: prototypeApplications, total: prototypeApplications.length, page: 1, pageSize: 25, sheetUrl: recruitmentEnvironment.sheetUrl || null };
  return callApi<AdminApplicationsResponse>("/api/admin/recruitment/applications?page=1&pageSize=250", { idToken });
}

export function fetchAdminApplication(idToken: string, applicationId: string): Promise<AdminApplication> {
  return callApi<AdminApplication>(`/api/admin/recruitment/applications/${encodeURIComponent(applicationId)}`, { idToken });
}

export async function publishAdminForm(idToken: string, config: RecruitmentFormConfig, expectedVersion: string) {
  if (!recruitmentEnvironment.apiBaseUrl && import.meta.env.DEV) return { ...config, formVersion: String(Number(expectedVersion) + 1), source: "prototype" as const };
  return callApi<RecruitmentFormConfig>("/api/admin/recruitment/form", { method: "PUT", body: { config, expectedVersion }, idToken });
}

export async function retryApplicationEmail(idToken: string, applicationId: string, allowPossibleDuplicate = false) {
  if (!recruitmentEnvironment.apiBaseUrl && import.meta.env.DEV) return { status: "pending" as const };
  return callApi<{ status: "pending" | "sent" | "failed" }>(`/api/admin/recruitment/applications/${encodeURIComponent(applicationId)}/retry-email`, { method: "POST", body: { allowPossibleDuplicate }, idToken });
}

export async function confirmApplicationEmailSent(idToken: string, applicationId: string) {
  return callApi<{ status: "sent" }>(`/api/admin/recruitment/applications/${encodeURIComponent(applicationId)}/confirm-email-sent`, { method: "POST", idToken });
}
