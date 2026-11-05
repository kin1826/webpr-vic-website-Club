import { createHmac } from "node:crypto";
import type { AddressInfo } from "node:net";
import { describe, expect, it, vi } from "vitest";
import { createApp } from "../backend/src/app.js";
import type { ServerConfig } from "../backend/src/config/env.js";
import { AppsScriptClient } from "../backend/src/services/apps-script-client.js";
import type { RecruitmentGateway } from "../backend/src/services/apps-script-client.js";
import { createTurnstileVerifier } from "../backend/src/services/turnstile.js";
import { applicationPayloadSchema } from "../backend/src/validation/schemas.js";
import type { AdminApplication, AdminApplicationsResponse, RecruitmentFormConfig, SubmitApplicationPayload } from "../backend/src/types/contracts.js";
import { ApiError } from "../backend/src/types/errors.js";

const secret = "b".repeat(64);

const form: RecruitmentFormConfig = {
  formId: "vic", campaignId: "2026", formTitle: "Tuyển thành viên", formDescription: "Đăng ký tham gia VIC", isOpen: true,
  closedMessage: "Đang đóng", successMessage: "Đã nhận đơn", allowedEmailDomain: "udn.vn", cooldownMinutes: 10,
  formVersion: "1", contactEmail: null, facebookUrl: null, fields: [], source: "google-sheet",
};

const application: AdminApplication = {
  applicationId: "VIC-20261105-120000-ABC123", submittedAt: "2026-11-05T05:00:00.000Z", campaignId: "2026", formVersion: "1",
  schoolEmail: "student@vku.udn.vn", studentId: "00123", fullName: "Sinh viên", department: "hoc_tap", departmentLabel: "Ban Học tập",
  emailStatus: "sent", answersSnapshot: [],
};

const applications: AdminApplicationsResponse = { applications: [application], total: 1, page: 1, pageSize: 25, sheetUrl: null };

function serverConfig(overrides: Partial<ServerConfig> = {}): ServerConfig {
  return {
    nodeEnv: "test", port: 3001, corsAllowedOrigins: new Set(["https://vic.example", "http://localhost:5173"]),
    appsScriptUrl: "https://script.google.com/macros/s/test/exec", appsScriptHmacSecret: secret, appsScriptTimeoutMs: 20000,
    googleOAuthClientId: "vic-client-id.apps.googleusercontent.com", adminEmails: new Set(["admin@vku.udn.vn"]),
    turnstileRequired: false, turnstileSecretKey: "", turnstileAllowedHostnames: new Set(), turnstileExpectedAction: "vic_recruitment",
    trustProxyHops: 0, formReadLimit: 120, applicationSubmitLimit: 30, adminApiLimit: 120,
    ...overrides,
  };
}

function makeGateway(): RecruitmentGateway {
  return {
    getForm: async () => form,
    submitApplication: async () => ({ applicationId: application.applicationId, submittedAt: application.submittedAt, emailStatus: "sent", message: "Đã nhận đơn.", nextAllowedAt: "2026-11-05T05:10:00.000Z" }),
    getSubmissionStatus: async () => ({ state: "received", result: { applicationId: application.applicationId, submittedAt: application.submittedAt, emailStatus: "pending", message: "Đã ghi nhận.", nextAllowedAt: "2026-11-05T05:10:00.000Z" } }),
    adminGetForm: async () => form,
    adminListApplications: async () => applications,
    adminGetApplication: async () => application,
    adminPublishForm: async () => ({ ...form, formVersion: "2" }),
    adminRetryEmail: async () => ({ status: "sent" }),
    adminConfirmEmailSent: async () => ({ status: "sent" }),
  };
}

async function withServer<T>(app: ReturnType<typeof createApp>, run: (baseUrl: string) => Promise<T>): Promise<T> {
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  const address = server.address() as AddressInfo;
  try { return await run(`http://127.0.0.1:${address.port}`); }
  finally { await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); }
}

function validSubmission(): SubmitApplicationPayload {
  return {
    formId: "vic", campaignId: "2026", formVersion: "1", idempotencyKey: "00000000-0000-4000-8000-000000000001",
    answers: { school_email: "student@vku.udn.vn", student_id: "00123", consent: true }, honeypot: "", turnstileToken: "valid-token",
  };
}

describe("Express recruitment API", () => {
  it("serves health and public form with only an allowed CORS origin", async () => {
    const gateway = makeGateway();
    const app = createApp(serverConfig(), {
      gateway, authenticateAdmin: async () => ({ email: "admin@vku.udn.vn", subject: "sub" }), verifyTurnstile: async () => undefined,
    });
    await withServer(app, async (baseUrl) => {
      const health = await fetch(`${baseUrl}/api/health`, { headers: { Origin: "https://vic.example" } });
      expect(health.status).toBe(200);
      expect(health.headers.get("access-control-allow-origin")).toBe("https://vic.example");
      expect(await health.json()).toMatchObject({ ok: true, data: { status: "ready" } });

      const formResponse = await fetch(`${baseUrl}/api/recruitment/form`);
      expect(formResponse.status).toBe(200);
      expect(await formResponse.json()).toMatchObject({ ok: true, data: { formId: "vic", source: "google-sheet" } });

      const blocked = await fetch(`${baseUrl}/api/health`, { headers: { Origin: "https://vic.evil.example" } });
      expect(blocked.status).toBe(403);
      expect(blocked.headers.get("access-control-allow-origin")).toBeNull();
    });
  });

  it("requires a matching idempotency header and forwards a structured submission", async () => {
    const submit = vi.fn(async (payload: SubmitApplicationPayload) => ({ ...await makeGateway().submitApplication(payload) }));
    const gateway = { ...makeGateway(), submitApplication: submit };
    const verifyTurnstile = vi.fn(async () => undefined);
    const app = createApp(serverConfig(), { gateway, authenticateAdmin: async () => ({ email: "admin@vku.udn.vn", subject: "sub" }), verifyTurnstile });
    await withServer(app, async (baseUrl) => {
      const payload = validSubmission();
      const invalid = await fetch(`${baseUrl}/api/recruitment/applications`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      expect(invalid.status).toBe(400);
      expect(submit).not.toHaveBeenCalled();

      const response = await fetch(`${baseUrl}/api/recruitment/applications`, {
        method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": payload.idempotencyKey }, body: JSON.stringify(payload),
      });
      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({ ok: true, data: { applicationId: application.applicationId } });
      expect(verifyTurnstile).toHaveBeenCalledWith("valid-token", "127.0.0.1");
      expect(submit).toHaveBeenCalledOnce();
    });
  });

  it("checks an ambiguous submission by the same idempotency key without resubmitting it", async () => {
    const check = vi.fn(async () => ({ state: "processing" as const }));
    const gateway = { ...makeGateway(), getSubmissionStatus: check };
    const app = createApp(serverConfig(), { gateway, authenticateAdmin: async () => ({ email: "admin@vku.udn.vn", subject: "sub" }), verifyTurnstile: async () => undefined });
    await withServer(app, async (baseUrl) => {
      const key = validSubmission().idempotencyKey;
      const response = await fetch(`${baseUrl}/api/recruitment/applications/status`, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify({ idempotencyKey: key }) });
      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({ ok: true, data: { state: "processing" } });
      expect(check).toHaveBeenCalledWith(key);
    });
  });

  it("protects admin endpoints with a verified Bearer token and serves detail", async () => {
    const authenticateAdmin = vi.fn(async (token: string) => {
      if (token !== "valid-admin") throw new ApiError({ status: 403, code: "FORBIDDEN", message: "Không có quyền." });
      return { email: "admin@vku.udn.vn", subject: "sub" };
    });
    const getDetail = vi.fn(async () => application);
    const gateway = { ...makeGateway(), adminGetApplication: getDetail };
    const app = createApp(serverConfig(), { gateway, authenticateAdmin, verifyTurnstile: async () => undefined });
    await withServer(app, async (baseUrl) => {
      const denied = await fetch(`${baseUrl}/api/admin/recruitment/applications`);
      expect(denied.status).toBe(401);

      const forbidden = await fetch(`${baseUrl}/api/admin/recruitment/applications`, { headers: { Authorization: "Bearer bad-token" } });
      expect(forbidden.status).toBe(403);

      const detail = await fetch(`${baseUrl}/api/admin/recruitment/applications/${application.applicationId}`, { headers: { Authorization: "Bearer valid-admin" } });
      expect(detail.status).toBe(200);
      expect(await detail.json()).toMatchObject({ ok: true, data: { applicationId: application.applicationId } });
      expect(getDetail).toHaveBeenCalledWith("valid-admin", application.applicationId);
    });
  });

  it("returns HTTP 429 and Retry-After for the IP request limit", async () => {
    const app = createApp(serverConfig({ applicationSubmitLimit: 1 }), {
      gateway: makeGateway(), authenticateAdmin: async () => ({ email: "admin@vku.udn.vn", subject: "sub" }), verifyTurnstile: async () => undefined,
    });
    await withServer(app, async (baseUrl) => {
      const payload = validSubmission();
      const send = () => fetch(`${baseUrl}/api/recruitment/applications`, {
        method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": payload.idempotencyKey }, body: JSON.stringify(payload),
      });
      expect((await send()).status).toBe(200);
      const limited = await send();
      expect(limited.status).toBe(429);
      expect(Number(limited.headers.get("retry-after"))).toBeGreaterThan(0);
      expect(await limited.json()).toMatchObject({ ok: false, error: { code: "RATE_LIMIT", status: 429 } });
    });
  });

  it("rejects oversized and malformed application data before Apps Script", async () => {
    const submit = vi.fn(async () => ({ applicationId: application.applicationId, submittedAt: application.submittedAt, emailStatus: "sent" as const, message: "ok", nextAllowedAt: application.submittedAt }));
    const app = createApp(serverConfig(), {
      gateway: { ...makeGateway(), submitApplication: submit }, authenticateAdmin: async () => ({ email: "admin@vku.udn.vn", subject: "sub" }), verifyTurnstile: async () => undefined,
    });
    await withServer(app, async (baseUrl) => {
      const large = await fetch(`${baseUrl}/api/recruitment/applications`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: "x".repeat(40000) }) });
      expect(large.status).toBe(413);
      const malformed = await fetch(`${baseUrl}/api/recruitment/applications`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
      expect(malformed.status).toBe(400);
      expect(submit).not.toHaveBeenCalled();
    });
  });
});

describe("server to Apps Script signing", () => {
  it("signs the exact payload JSON with a fresh protocol envelope", async () => {
    let sentBody = "";
    const fetcher: typeof fetch = async (_input, init) => {
      sentBody = String(init?.body ?? "");
      return new Response(JSON.stringify({ ok: true, data: form }), { status: 200, headers: { "Content-Type": "application/json" } });
    };
    const client = new AppsScriptClient(serverConfig(), fetcher);
    expect(await client.getForm()).toEqual(form);
    const envelope = JSON.parse(sentBody) as { protocolVersion: string; timestamp: string; nonce: string; payloadJson: string; signature: string };
    const signedText = `${envelope.protocolVersion}\n${envelope.timestamp}\n${envelope.nonce}\n${envelope.payloadJson}`;
    expect(envelope.protocolVersion).toBe("1");
    expect(envelope.nonce).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(envelope.signature).toBe(createHmac("sha256", secret).update(signedText, "utf8").digest("hex"));
    expect(JSON.parse(envelope.payloadJson)).toEqual({ action: "getForm" });
  });

  it("marks a lost submission response as ambiguous so the same key can be retried", async () => {
    const client = new AppsScriptClient(serverConfig(), async () => { throw new TypeError("connection reset"); });
    await expect(client.submitApplication(validSubmission())).rejects.toMatchObject({
      code: "UPSTREAM_UNAVAILABLE",
      outcomeUnknown: true,
    });

    const upstreamFailure = new AppsScriptClient(serverConfig(), async () => new Response(JSON.stringify({
      ok: false,
      error: { code: "INTERNAL_ERROR", message: "Máy chủ không thể xử lý yêu cầu.", status: 500 },
    }), { status: 200 }));
    await expect(upstreamFailure.submitApplication(validSubmission())).rejects.toMatchObject({
      code: "INTERNAL_ERROR",
      outcomeUnknown: true,
    });
  });
});

describe("Turnstile server verification", () => {
  it("checks success, hostname and widget action", async () => {
    const config = serverConfig({
      turnstileRequired: true, turnstileSecretKey: "server-secret", turnstileAllowedHostnames: new Set(["vic.example"]),
      turnstileExpectedAction: "vic_recruitment",
    });
    const fetcher: typeof fetch = async (_input, init) => {
      expect(String(init?.body)).toContain("secret=server-secret");
      return new Response(JSON.stringify({ success: true, hostname: "vic.example", action: "vic_recruitment" }), { status: 200 });
    };
    const verify = createTurnstileVerifier(config, fetcher);
    await expect(verify("challenge-token", "203.0.113.5")).resolves.toBeUndefined();

    const rejected = createTurnstileVerifier(config, async () => new Response(JSON.stringify({ success: true, hostname: "vic.example.evil", action: "vic_recruitment" }), { status: 200 }));
    await expect(rejected("challenge-token")).rejects.toMatchObject({ code: "TURNSTILE_FAILED", status: 422 });
  });
  it("fails closed when enabled without a token or secret", async () => {
    const config = serverConfig({ turnstileRequired: true, turnstileSecretKey: "secret", turnstileAllowedHostnames: new Set(["localhost"]) });
    await expect(createTurnstileVerifier(config)("")).rejects.toMatchObject({ code: "TURNSTILE_REQUIRED", status: 422 });
    const invalid = serverConfig({ turnstileRequired: true, turnstileSecretKey: "", turnstileAllowedHostnames: new Set(["localhost"]) });
    await expect(createTurnstileVerifier(invalid)("token")).rejects.toMatchObject({ code: "TURNSTILE_NOT_CONFIGURED", status: 503 });
  });
});

describe("request schema", () => {
  it("requires a UUID idempotency key and bounded string/boolean answers", () => {
    expect(applicationPayloadSchema.safeParse(validSubmission()).success).toBe(true);
    expect(applicationPayloadSchema.safeParse({ ...validSubmission(), idempotencyKey: "not-a-uuid" }).success).toBe(false);
    expect(applicationPayloadSchema.safeParse({ ...validSubmission(), answers: { full_name: { nested: true } } }).success).toBe(false);
  });
});
