import type { FieldErrorMap, RecruitmentAnswers, RecruitmentFormConfig } from "./types";

export const MAX_TEXT_LENGTH = 5000;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isAllowedEmail(value: string, allowedDomain: string) {
  const email = normalizeEmail(value);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  const domain = email.slice(email.lastIndexOf("@") + 1);
  const allowed = allowedDomain.trim().toLowerCase();
  return domain === allowed || domain.endsWith(`.${allowed}`);
}

export function isSafeInfoUrl(value?: string | null) {
  if (!value) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function parsePortfolioUrls(value: string) {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

export function validateRecruitmentAnswers(config: RecruitmentFormConfig, answers: RecruitmentAnswers): FieldErrorMap {
  const errors: FieldErrorMap = {};
  for (const field of config.fields.filter((item) => item.active).sort((a, b) => a.sortOrder - b.sortOrder)) {
    const raw = answers[field.fieldId];
    const value = typeof raw === "string" ? raw.trim() : raw;
    const empty = value === undefined || value === "" || value === false;
    if (field.required && empty) {
      errors[field.fieldId] = field.type === "checkbox" ? "Bạn cần xác nhận mục này." : "Vui lòng điền trường này.";
      continue;
    }
    if (empty) continue;
    if (typeof value === "string" && value.length > MAX_TEXT_LENGTH) errors[field.fieldId] = `Nội dung không được vượt quá ${MAX_TEXT_LENGTH.toLocaleString("vi-VN")} ký tự.`;
    if (field.type === "email" && !isAllowedEmail(value as string, config.allowedEmailDomain)) errors[field.fieldId] = `Vui lòng dùng email @${config.allowedEmailDomain} hoặc tên miền con hợp lệ.`;
    if (field.type === "url" && !isValidUrl(value as string)) errors[field.fieldId] = "Vui lòng nhập URL bắt đầu bằng http:// hoặc https://.";
    if (field.fieldId === "portfolio_links" && parsePortfolioUrls(value as string).some((url) => !isValidUrl(url))) errors[field.fieldId] = "Mỗi dòng phải là một URL HTTP/HTTPS hợp lệ.";
    if ((field.type === "radio" || field.type === "select") && !field.options.some((option) => option.active && option.optionId === value)) errors[field.fieldId] = "Lựa chọn không còn hợp lệ. Vui lòng chọn lại.";
    if (field.fieldId === "consent" && value !== true) errors[field.fieldId] = "Bạn cần đồng ý trước khi gửi đơn.";
  }
  return errors;
}
