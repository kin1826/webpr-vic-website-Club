import { recruitmentEnvironment } from "./config";
import { createPrototypeConfig, prototypeApplications } from "./prototype-data";
import type { AdminApplicationsResponse, ApiFailure, RecruitmentFormConfig, SubmitApplicationPayload, SubmitApplicationResult } from "./types";

type ApiEnvelope<T> = { ok: true; data: T } | { ok: false; error: { code?: string; message: string; status?: number; fieldErrors?: Record<string, string>; retryAfterSeconds?: number; nextAllowedAt?: string; latestConfig?: RecruitmentFormConfig } };

async function callApi<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  if (!recruitmentEnvironment.apiUrl) throw Object.assign(new Error("API tuyển thành viên chưa được cấu hình."), { code: "API_NOT_CONFIGURED" });
  const response = await fetch(recruitmentEnvironment.apiUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify({ action, ...payload }),
  });
  let envelope: ApiEnvelope<T>;
  try { envelope = await response.json() as ApiEnvelope<T>; }
  catch { throw Object.assign(new Error("Máy chủ trả về phản hồi không hợp lệ."), { status: response.status }); }
  if (!response.ok || !envelope.ok) {
    const detail = envelope.ok ? { message: "Yêu cầu không thành công." } : envelope.error;
    throw Object.assign(new Error(detail.message), { status: response.status, ...detail }) as ApiFailure;
  }
  return envelope.data;
}

export async function fetchRecruitmentForm(): Promise<RecruitmentFormConfig> {
  if (!recruitmentEnvironment.apiUrl) return createPrototypeConfig(import.meta.env.DEV);
  return callApi<RecruitmentFormConfig>("getForm");
}

export async function submitRecruitmentApplication(payload: SubmitApplicationPayload): Promise<SubmitApplicationResult> {
  if (!recruitmentEnvironment.apiUrl) {
    if (!import.meta.env.DEV) throw Object.assign(new Error("Biểu mẫu thật chưa được kết nối."), { code: "API_NOT_CONFIGURED" });
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    const submittedAt = new Date().toISOString();
    return { applicationId: `VIC-DEMO-${Date.now().toString().slice(-6)}`, submittedAt, emailStatus: "pending", message: "Đây là lần gửi thử trong môi trường local; dữ liệu không được lưu.", nextAllowedAt: new Date(Date.now() + 600_000).toISOString() };
  }
  return callApi<SubmitApplicationResult>("submitApplication", { payload });
}

export async function fetchAdminForm(idToken: string) {
  if (!recruitmentEnvironment.apiUrl && import.meta.env.DEV) return createPrototypeConfig(true);
  return callApi<RecruitmentFormConfig>("adminGetForm", { idToken });
}

export async function fetchAdminApplications(idToken: string): Promise<AdminApplicationsResponse> {
  if (!recruitmentEnvironment.apiUrl && import.meta.env.DEV) return { applications: prototypeApplications, total: prototypeApplications.length, page: 1, pageSize: 25, sheetUrl: recruitmentEnvironment.sheetUrl || null };
  return callApi<AdminApplicationsResponse>("adminListApplications", { idToken, page: 1, pageSize: 250 });
}

export async function publishAdminForm(idToken: string, config: RecruitmentFormConfig, expectedVersion: string) {
  if (!recruitmentEnvironment.apiUrl && import.meta.env.DEV) return { ...config, formVersion: String(Number(expectedVersion) + 1), source: "prototype" as const };
  return callApi<RecruitmentFormConfig>("adminPublishForm", { idToken, config, expectedVersion });
}

export async function retryApplicationEmail(idToken: string, applicationId: string) {
  if (!recruitmentEnvironment.apiUrl && import.meta.env.DEV) return { status: "pending" as const };
  return callApi<{ status: "pending" | "sent" | "failed" }>("adminRetryEmail", { idToken, applicationId });
}
