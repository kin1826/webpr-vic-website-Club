export const recruitmentEnvironment = {
  apiUrl: (import.meta.env.VITE_RECRUITMENT_API_URL as string | undefined)?.trim() ?? "",
  googleClientId: (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() ?? "",
  sheetUrl: (import.meta.env.VITE_RECRUITMENT_SHEET_URL as string | undefined)?.trim() ?? "",
  turnstileSiteKey: (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim() ?? "",
};

export const hasRecruitmentApi = Boolean(recruitmentEnvironment.apiUrl);
