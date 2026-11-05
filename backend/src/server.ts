import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";
import { loadServerConfig } from "./config/env.js";
import { createAdminAuthenticator } from "./services/admin-auth.js";
import { AppsScriptClient } from "./services/apps-script-client.js";
import { createTurnstileVerifier } from "./services/turnstile.js";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const config = loadServerConfig();
const app = createApp(config, {
  gateway: new AppsScriptClient(config),
  authenticateAdmin: createAdminAuthenticator(config),
  verifyTurnstile: createTurnstileVerifier(config),
});

const server = app.listen(config.port, "0.0.0.0", () => {
  console.info(`VIC recruitment API listening on port ${config.port}`);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
