import { cp, mkdir } from "node:fs/promises";

const routes = ["design-system"];

await Promise.all(routes.map(async (route) => {
  await mkdir(new URL(`../dist/${route}/`, import.meta.url), { recursive: true });
  await cp(new URL("../dist/index.html", import.meta.url), new URL(`../dist/${route}/index.html`, import.meta.url));
}));
