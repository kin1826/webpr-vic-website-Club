import type { RequestHandler } from "express";
import type { AdminAuthenticator } from "../services/admin-auth.js";
import { ApiError } from "../types/errors.js";

export function requireAdmin(authenticate: AdminAuthenticator): RequestHandler {
  return async (request, response, next) => {
    const authorization = request.get("authorization") ?? "";
    const match = /^Bearer\s+(.+)$/i.exec(authorization);
    if (!match) return next(new ApiError({ status: 401, code: "UNAUTHORIZED", message: "Bạn cần đăng nhập tài khoản quản trị." }));
    try {
      const identity = await authenticate(match[1]);
      response.locals.adminToken = match[1];
      response.locals.adminIdentity = identity;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}
