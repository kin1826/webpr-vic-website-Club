import type { OfficialLinks } from "../types/content";

export const officialLinks: OfficialLinks = {
  facebook: null,
  email: null,
  github: null,
  join: null,
};

export const navigation = [
  { label: "Về VIC", href: "#about" },
  { label: "Các ban", href: "#teams" },
  { label: "Hoạt động", href: "#activities" },
  { label: "Dự án", href: "#projects" },
] as const;
