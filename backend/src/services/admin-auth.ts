import { OAuth2Client } from "google-auth-library";
import type { ServerConfig } from "../config/env.js";
import { ApiError } from "../types/errors.js";

export type AdminIdentity = { email: string; subject: string };
export type AdminAuthenticator = (idToken: string) => Promise<AdminIdentity>;

export function createAdminAuthenticator(config: ServerConfig): AdminAuthenticator {
  const client = new OAuth2Client(config.googleOAuthClientId);
  return async (idToken) => {
    try {
      const ticket = await client.verifyIdToken({ idToken, audience: config.googleOAuthClientId });
      const claims = ticket.getPayload();
      const email = claims?.email?.trim().toLowerCase();
      if (!claims || !email || claims.email_verified !== true || !claims.sub) {
        throw new ApiError({ status: 401, code: "UNAUTHORIZED", message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." });
      }
      if (!config.adminEmails.has(email)) {
        throw new ApiError({ status: 403, code: "FORBIDDEN", message: "Tài khoản này không có quyền quản trị." });
      }
      return { email, subject: claims.sub };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError({ status: 401, code: "UNAUTHORIZED", message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.", cause: error });
    }
  };
}
