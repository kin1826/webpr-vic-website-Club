import cors from "cors";
import express from "express";
import type { Express } from "express";
import type { ServerConfig } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import type { AdminAuthenticator } from "./services/admin-auth.js";
import type { RecruitmentGateway } from "./services/apps-script-client.js";
import type { TurnstileVerifier } from "./services/turnstile.js";
import { createRecruitmentRouter } from "./routes/recruitment.js";
import { ApiError } from "./types/errors.js";

export type ApiServices = {
  gateway: RecruitmentGateway;
  authenticateAdmin: AdminAuthenticator;
  verifyTurnstile: TurnstileVerifier;
};

export function createApp(config: ServerConfig, services: ApiServices): Express {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxyHops);

  app.use(cors({
    origin(origin, callback) {
      if (!origin || config.corsAllowedOrigins.has(origin)) return callback(null, true);
      return callback(new ApiError({ status: 403, code: "ORIGIN_NOT_ALLOWED", message: "Origin này chưa được phép gọi API." }));
    },
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "Idempotency-Key"],
    exposedHeaders: ["Retry-After", "RateLimit", "RateLimit-Policy"],
    maxAge: 600,
    credentials: false,
  }));
  app.use(express.json({ limit: "32kb", strict: true, type: "application/json" }));

  app.get("/api/health", (_request, response) => {
    response.json({ ok: true, data: { service: "VIC recruitment API", status: "ready" } });
  });
  const recruitment = createRecruitmentRouter({
    ...services,
    formReadLimit: config.formReadLimit,
    applicationSubmitLimit: config.applicationSubmitLimit,
    adminApiLimit: config.adminApiLimit,
  });
  app.use("/api/recruitment", recruitment.publicRouter);
  app.use("/api/admin/recruitment", recruitment.adminRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
