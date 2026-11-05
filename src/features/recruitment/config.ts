export const recruitmentEnvironment = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim().replace(/\/$/, "") ?? "",
  googleClientId: (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() ?? "",
  sheetUrl: (import.meta.env.VITE_RECRUITMENT_SHEET_URL as string | undefined)?.trim() ?? "",
  turnstileSiteKey: (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim() ?? "",
};

export const hasRecruitmentApi = Boolean(recruitmentEnvironment.apiBaseUrl);
