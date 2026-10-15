import type { LucideIcon } from "lucide-react";

export type Team = {
  id: string;
  name: string;
  description: string;
  focuses: string[];
  tags: string[];
  icon: LucideIcon;
};

export type Activity = {
  id: string;
  name: string;
  kind: string;
  description: string;
  featured?: boolean;
};

export type Project = {
  id: string;
  name: string;
  category: "Web" | "Game" | "Tool";
  description: string;
};

export type FaqItem = { id: string; question: string; answer: string };

export type OfficialLinks = {
  facebook: string | null;
  email: string | null;
  github: string | null;
  join: string | null;
};
