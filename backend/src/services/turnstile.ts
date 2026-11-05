import type { ServerConfig } from "../config/env.js";
import { ApiError } from "../types/errors.js";

type TurnstileResponse = { success?: boolean; hostname?: string; action?: string; "error-codes"?: string[] };

export type TurnstileVerifier = (token: string, remoteIp?: string) => Promise<void>;

export function createTurnstileVerifier(config: ServerConfig, fetcher: typeof fetch = fetch): TurnstileVerifier {
  return async (token, remoteIp) => {
    if (!config.turnstileRequired) return;
    if (!config.turnstileSecretKey) {
      throw new ApiError({ status: 503, code: "TURNSTILE_NOT_CONFIGURED", message: "Xác minh chống bot chưa được cấu hình." });
    }
    if (!token) throw new ApiError({ status: 422, code: "TURNSTILE_REQUIRED", message: "Vui lòng hoàn thành bước xác minh chống bot." });

    const body = new URLSearchParams({ secret: config.turnstileSecretKey, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);
    let result: TurnstileResponse;
    try {
      const response = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body,
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error(`Turnstile HTTP ${response.status}`);
      result = await response.json() as TurnstileResponse;
    } catch (error) {
      throw new ApiError({ status: 503, code: "TURNSTILE_UNAVAILABLE", message: "Không thể xác minh chống bot. Vui lòng thử lại.", cause: error });
    }

    const hostname = result.hostname?.trim().toLowerCase() ?? "";
    const expectedAction = config.turnstileExpectedAction;
    if (!result.success
      || !hostname
      || !config.turnstileAllowedHostnames.has(hostname)
      || (expectedAction && result.action !== expectedAction)) {
      throw new ApiError({ status: 422, code: "TURNSTILE_FAILED", message: "Xác minh chống bot không hợp lệ. Hãy xác minh lại rồi thử gửi lại." });
    }
  };
}
