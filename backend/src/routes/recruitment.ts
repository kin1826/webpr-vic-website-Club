import { Router } from "express";
import type { RequestHandler } from "express";
import { requireAdmin } from "../middleware/admin-auth.js";
import { createRateLimiter } from "../middleware/rate-limit.js";
import type { AdminAuthenticator } from "../services/admin-auth.js";
import type { RecruitmentGateway } from "../services/apps-script-client.js";
import type { TurnstileVerifier } from "../services/turnstile.js";
import { ApiError } from "../types/errors.js";
import {
  applicationIdSchema,
  applicationPayloadSchema,
  listQuerySchema,
  publishFormPayloadSchema,
  retryEmailSchema,
  submissionStatusSchema,
} from "../validation/schemas.js";

function parseOrThrow<T>(schema: { safeParse(value: unknown): { success: true; data: T } | { success: false; error: { issues: Array<{ path: PropertyKey[]; message: string }> } } }, value: unknown): T {
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const field = String(issue.path[0] ?? "request");
    fieldErrors[field] ??= issue.message;
  }
  throw new ApiError({ status: 422, code: "VALIDATION_ERROR", message: "Dữ liệu gửi lên chưa hợp lệ.", fieldErrors });
}

function asyncRoute(handler: RequestHandler): RequestHandler {
  return (request, response, next) => { Promise.resolve(handler(request, response, next)).catch(next); };
}

export function createRecruitmentRouter(options: {
  gateway: RecruitmentGateway;
  authenticateAdmin: AdminAuthenticator;
  verifyTurnstile: TurnstileVerifier;
  formReadLimit: number;
  applicationSubmitLimit: number;
  adminApiLimit: number;
}) {
  const publicRouter = Router();
  const adminRouter = Router();
  const readLimiter = createRateLimiter(10 * 60 * 1000, options.formReadLimit, "recruitment-read");
  const submitLimiter = createRateLimiter(10 * 60 * 1000, options.applicationSubmitLimit, "recruitment-submit");
  const adminLimiter = createRateLimiter(10 * 60 * 1000, options.adminApiLimit, "recruitment-admin");
  const admin = requireAdmin(options.authenticateAdmin);

  publicRouter.get("/form", readLimiter, asyncRoute(async (_request, response) => {
    response.json({ ok: true, data: await options.gateway.getForm() });
  }));

  publicRouter.post("/applications", submitLimiter, asyncRoute(async (request, response) => {
    const payload = parseOrThrow(applicationPayloadSchema, request.body);
    const keyHeader = request.get("idempotency-key");
    if (!keyHeader || keyHeader !== payload.idempotencyKey) {
      throw new ApiError({ status: 400, code: "INVALID_IDEMPOTENCY_KEY", message: "Idempotency-Key phải trùng với mã của lần nộp đơn." });
    }
    if (!payload.honeypot) await options.verifyTurnstile(payload.turnstileToken ?? "", request.ip);
    response.status(200).json({ ok: true, data: await options.gateway.submitApplication(payload) });
  }));

  publicRouter.post("/applications/status", readLimiter, asyncRoute(async (request, response) => {
    const { idempotencyKey } = parseOrThrow(submissionStatusSchema, request.body);
    if (request.get("idempotency-key") !== idempotencyKey) throw new ApiError({ status: 400, code: "INVALID_IDEMPOTENCY_KEY", message: "Idempotency-Key phải trùng với mã kiểm tra đơn." });
    response.json({ ok: true, data: await options.gateway.getSubmissionStatus(idempotencyKey) });
  }));

  adminRouter.use(adminLimiter, admin);
  adminRouter.get("/form", asyncRoute(async (_request, response) => {
    response.json({ ok: true, data: await options.gateway.adminGetForm(response.locals.adminToken as string) });
  }));
  adminRouter.put("/form", asyncRoute(async (request, response) => {
    const payload = parseOrThrow(publishFormPayloadSchema, request.body);
    const config = await options.gateway.adminPublishForm({ ...payload, idToken: response.locals.adminToken as string });
    response.json({ ok: true, data: config });
  }));
  adminRouter.get("/applications/:id", asyncRoute(async (request, response) => {
    const applicationId = parseOrThrow(applicationIdSchema, request.params.id);
    const data = await options.gateway.adminGetApplication(response.locals.adminToken as string, applicationId);
    response.json({ ok: true, data });
  }));
  adminRouter.get("/applications", asyncRoute(async (request, response) => {
    const query = parseOrThrow(listQuerySchema, request.query);
    const data = await options.gateway.adminListApplications(response.locals.adminToken as string, query.page, query.pageSize);
    response.json({ ok: true, data });
  }));
  adminRouter.post("/applications/:id/retry-email", asyncRoute(async (request, response) => {
    const applicationId = parseOrThrow(applicationIdSchema, request.params.id);
    const { allowPossibleDuplicate } = parseOrThrow(retryEmailSchema, request.body ?? {});
    const data = await options.gateway.adminRetryEmail(response.locals.adminToken as string, applicationId, allowPossibleDuplicate);
    response.json({ ok: true, data });
  }));
  adminRouter.post("/applications/:id/confirm-email-sent", asyncRoute(async (request, response) => {
    const applicationId = parseOrThrow(applicationIdSchema, request.params.id);
    const data = await options.gateway.adminConfirmEmailSent(response.locals.adminToken as string, applicationId);
    response.json({ ok: true, data });
  }));
  return { publicRouter, adminRouter };
}
