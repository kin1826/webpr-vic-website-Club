import { z } from "zod";

const booleanText = z.enum(["true", "false"]).transform((value) => value === "true");

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  CORS_ALLOWED_ORIGINS: z.string().min(1),
  APPS_SCRIPT_URL: z.string().url(),
  APPS_SCRIPT_HMAC_SECRET: z.string().min(32),
  APPS_SCRIPT_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(35000),
  GOOGLE_OAUTH_CLIENT_ID: z.string().min(10),
  ADMIN_EMAILS: z.string().min(3),
  TURNSTILE_REQUIRED: booleanText.prefault("false"),
  TURNSTILE_SECRET_KEY: z.string().optional().default(""),
  TURNSTILE_ALLOWED_HOSTNAMES: z.string().optional().default(""),
  TURNSTILE_EXPECTED_ACTION: z.string().optional().default("vic_recruitment"),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(5).default(0),
  FORM_READ_LIMIT: z.coerce.number().int().min(1).max(10000).default(120),
  APPLICATION_SUBMIT_LIMIT: z.coerce.number().int().min(1).max(10000).default(30),
  ADMIN_API_LIMIT: z.coerce.number().int().min(1).max(10000).default(120),
});

export type ServerConfig = {
  nodeEnv: "development" | "test" | "production";
  port: number;
  corsAllowedOrigins: Set<string>;
  appsScriptUrl: string;
  appsScriptHmacSecret: string;
  appsScriptTimeoutMs: number;
  googleOAuthClientId: string;
  adminEmails: Set<string>;
  turnstileRequired: boolean;
  turnstileSecretKey: string;
  turnstileAllowedHostnames: Set<string>;
  turnstileExpectedAction: string;
  trustProxyHops: number;
  formReadLimit: number;
  applicationSubmitLimit: number;
  adminApiLimit: number;
};

function parseOrigins(value: string) {
  const origins = value.split(",").map((item) => item.trim()).filter(Boolean);
  const normalized = origins.map((origin) => {
    if (origin === "*") throw new Error("CORS_ALLOWED_ORIGINS không được chứa wildcard.");
    const parsed = new URL(origin);
    if (parsed.origin !== origin || !["http:", "https:"].includes(parsed.protocol)) {
      throw new Error(`Origin CORS không hợp lệ: ${origin}`);
    }
    return parsed.origin;
  });
  if (!normalized.length) throw new Error("CORS_ALLOWED_ORIGINS cần ít nhất một origin.");
  return new Set(normalized);
}

export function loadServerConfig(environment: NodeJS.ProcessEnv = process.env): ServerConfig {
  const parsed = environmentSchema.safeParse(environment);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new Error(`Cấu hình backend không hợp lệ: ${details}`);
  }
  const value = parsed.data;
  const appScript = new URL(value.APPS_SCRIPT_URL);
  if (appScript.protocol !== "https:" || appScript.hostname !== "script.google.com" || !appScript.pathname.endsWith("/exec")) {
    throw new Error("APPS_SCRIPT_URL phải là URL HTTPS Web App của Apps Script kết thúc bằng /exec.");
  }
  if (value.TURNSTILE_REQUIRED && !value.TURNSTILE_SECRET_KEY.trim()) {
    throw new Error("TURNSTILE_REQUIRED=true nhưng TURNSTILE_SECRET_KEY chưa được cấu hình.");
  }
  const turnstileHosts = value.TURNSTILE_ALLOWED_HOSTNAMES.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  if (value.TURNSTILE_REQUIRED && !turnstileHosts.length) {
    throw new Error("TURNSTILE_REQUIRED=true nhưng TURNSTILE_ALLOWED_HOSTNAMES chưa được cấu hình.");
  }
  const adminEmails = value.ADMIN_EMAILS.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  if (!adminEmails.length || adminEmails.some((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    throw new Error("ADMIN_EMAILS phải chứa email hợp lệ, phân tách bằng dấu phẩy.");
  }
  return {
    nodeEnv: value.NODE_ENV,
    port: value.PORT,
    corsAllowedOrigins: parseOrigins(value.CORS_ALLOWED_ORIGINS),
    appsScriptUrl: appScript.toString(),
    appsScriptHmacSecret: value.APPS_SCRIPT_HMAC_SECRET,
    appsScriptTimeoutMs: value.APPS_SCRIPT_TIMEOUT_MS,
    googleOAuthClientId: value.GOOGLE_OAUTH_CLIENT_ID,
    adminEmails: new Set(adminEmails),
    turnstileRequired: value.TURNSTILE_REQUIRED,
    turnstileSecretKey: value.TURNSTILE_SECRET_KEY,
    turnstileAllowedHostnames: new Set(turnstileHosts),
    turnstileExpectedAction: value.TURNSTILE_EXPECTED_ACTION,
    trustProxyHops: value.TRUST_PROXY_HOPS,
    formReadLimit: value.FORM_READ_LIMIT,
    applicationSubmitLimit: value.APPLICATION_SUBMIT_LIMIT,
    adminApiLimit: value.ADMIN_API_LIMIT,
  };
}
