export type DepartmentId = "learning" | "media";
export type ActivityCategory = "Học tập" | "Truyền thông" | "Giao lưu";
export type ActivityStatus = "upcoming" | "recap" | "undated";
export type ProjectCategory = "Web/App" | "Game" | "Thiết kế" | "Media";
export type ArticleTopic = "Lập trình" | "Công cụ" | "Dự án" | "Thiết kế & Media" | "Kinh nghiệm học tập";
export type RecruitmentStatus = "unknown" | "open" | "closed";

export type Department = {
  id: DepartmentId;
  slug: "hoctap" | "truyenthong";
  name: string;
  shortName: string;
  summary: string;
  description: string;
  tags: string[];
  directions: { title: string; description: string }[];
};

export type Member = {
  id: string;
  slug: string;
  name: string;
  role: string;
  departmentId: DepartmentId | null;
  summary: string;
  interests: string[];
  contributions: string[];
  projectIds: string[];
  articleIds: string[];
  portfolioUrl: string | null;
  socialUrl: string | null;
  isDemo: boolean;
};

export type OrganizationPosition = {
  id: string;
  title: string;
  departmentId: DepartmentId | null;
  memberId: string | null;
  note: string;
};

export type Activity = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: ActivityCategory;
  type: string;
  status: ActivityStatus;
  date: string | null;
  departmentIds: DepartmentId[];
  body: string[];
  relatedArticleIds: string[];
  relatedProjectIds: string[];
  registrationUrl: string | null;
  featured: boolean;
  isDemo: boolean;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: ProjectCategory;
  scope: "VIC" | "Cá nhân";
  departmentIds: DepartmentId[];
  contributorIds: string[];
  purpose: string;
  process: string[];
  result: string;
  tools: string[];
  demoUrl: string | null;
  sourceUrl: string | null;
  featured: boolean;
  isDemo: boolean;
};

export type ArticleBlock =
  | { type: "heading"; id: string; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; language: string; code: string };

export type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  topic: ArticleTopic;
  tags: string[];
  authorMemberId: string | null;
  publishedAt: string | null;
  departmentIds: DepartmentId[];
  content: ArticleBlock[];
  featured: boolean;
  isDemo: boolean;
};

export type FaqItem = { id: string; question: string; answer: string };

export type ClubSettings = {
  recruitmentStatus: RecruitmentStatus;
  applicationUrl: string | null;
  facebookUrl: string | null;
  contactEmail: string | null;
  githubUrl: string | null;
};
