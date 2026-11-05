import type { ErrorRequestHandler, RequestHandler } from "express";
import { ApiError } from "../types/errors.js";

export const notFoundHandler: RequestHandler = (request, _response, next) => {
  next(new ApiError({ status: 404, code: "NOT_FOUND", message: `Không tìm thấy endpoint ${request.method} ${request.path}.` }));
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (response.headersSent) return;
  if (error instanceof ApiError) {
    if (error.retryAfterSeconds) response.setHeader("Retry-After", String(error.retryAfterSeconds));
    response.status(error.status).json({
      ok: false,
      error: {
        code: error.code,
        message: error.message,
        status: error.status,
        fieldErrors: error.fieldErrors,
        retryAfterSeconds: error.retryAfterSeconds,
        nextAllowedAt: error.nextAllowedAt,
        latestConfig: error.latestConfig,
        outcomeUnknown: error.outcomeUnknown,
      },
    });
    return;
  }
  const bodyError = error as { type?: string; status?: number };
  if (bodyError.type === "entity.too.large") {
    response.status(413).json({ ok: false, error: { code: "PAYLOAD_TOO_LARGE", message: "Dữ liệu gửi lên vượt quá giới hạn cho phép.", status: 413 } });
    return;
  }
  if (bodyError.type === "entity.parse.failed") {
    response.status(400).json({ ok: false, error: { code: "INVALID_JSON", message: "Nội dung JSON không hợp lệ.", status: 400 } });
    return;
  }
  response.status(500).json({ ok: false, error: { code: "INTERNAL_ERROR", message: "Máy chủ không thể xử lý yêu cầu.", status: 500 } });
};
