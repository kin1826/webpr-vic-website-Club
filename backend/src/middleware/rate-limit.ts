import { rateLimit } from "express-rate-limit";
import type { Request } from "express";

export function createRateLimiter(windowMs: number, limit: number, prefix: string) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler(request, response) {
      const rateLimitInfo = (request as Request & { rateLimit?: { resetTime?: Date } }).rateLimit;
      const resetTime = rateLimitInfo?.resetTime?.getTime() ?? Date.now() + windowMs;
      const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - Date.now()) / 1000));
      response.setHeader("Retry-After", String(retryAfterSeconds));
      response.status(429).json({
        ok: false,
        error: { code: "RATE_LIMIT", message: "Có quá nhiều yêu cầu. Vui lòng thử lại sau.", status: 429, retryAfterSeconds },
      });
    },
    identifier: prefix,
  });
}
