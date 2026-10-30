import { cp, mkdir } from "node:fs/promises";

const routes = [
  "design-system", "gioi-thieu", "hoctap", "truyenthong", "hoat-dong",
  "hoat-dong/tech-sharing-mau", "hoat-dong/mini-challenge-mau", "hoat-dong/build-and-show-mau",
  "san-pham", "san-pham/website-cong-dong-mau", "san-pham/mini-game-mau", "san-pham/bo-truyen-thong-mau",
  "hoc-thuat", "hoc-thuat/chia-nho-y-tuong", "hoc-thuat/checklist-ban-giao", "hoc-thuat/ghi-lai-dieu-da-hoc",
  "thanh-vien/ho-so-thanh-vien-mau", "tham-gia", "admin/tuyen-thanh-vien",
];

await Promise.all(routes.map(async (route) => {
  await mkdir(new URL(`../dist/${route}/`, import.meta.url), { recursive: true });
  await cp(new URL("../dist/index.html", import.meta.url), new URL(`../dist/${route}/index.html`, import.meta.url));
}));

await cp(new URL("../dist/index.html", import.meta.url), new URL("../dist/404.html", import.meta.url));
