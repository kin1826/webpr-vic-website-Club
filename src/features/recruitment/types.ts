export type RecruitmentFieldType = "text" | "textarea" | "email" | "url" | "radio" | "select" | "checkbox";

export type RecruitmentOption = {
  fieldId: string;
  optionId: string;
  label: string;
  sortOrder: number;
  active: boolean;
  infoUrl?: string | null;
};

export type RecruitmentField = {
  fieldId: string;
  label: string;
  type: RecruitmentFieldType;
  required: boolean;
  active: boolean;
  sortOrder: number;
  section: string;
  helpText?: string | null;
  options: RecruitmentOption[];
  system?: boolean;
};

export type RecruitmentFormConfig = {
  formId: string;
  campaignId: string;
  formTitle: string;
  formDescription: string;
  isOpen: boolean;
  closedMessage: string;
  successMessage: string;
  allowedEmailDomain: string;
  cooldownMinutes: number;
  formVersion: string;
  contactEmail?: string | null;
  facebookUrl?: string | null;
  fields: RecruitmentField[];
  source: "google-sheet" | "prototype";
};

export type RecruitmentAnswer = string | boolean;
export type RecruitmentAnswers = Record<string, RecruitmentAnswer>;

export type SubmitApplicationPayload = {
  formId: string;
  campaignId: string;
  formVersion: string;
  idempotencyKey: string;
  answers: RecruitmentAnswers;
  honeypot: string;
  turnstileToken?: string;
};

export type SubmitApplicationResult = {
  applicationId: string;
  submittedAt: string;
  emailStatus: "pending" | "sent" | "failed";
  message: string;
  nextAllowedAt: string;
  duplicate?: boolean;
};

export type FieldErrorMap = Record<string, string>;

export type AnswerSnapshotItem = {
  fieldId: string;
  label: string;
  value: RecruitmentAnswer;
  optionLabel?: string | null;
};

export type AdminApplication = {
  applicationId: string;
  submittedAt: string;
  campaignId: string;
  formVersion: string;
  schoolEmail: string;
  studentId: string;
  fullName: string;
  department: string;
  departmentLabel: string;
  emailStatus: "pending" | "sent" | "failed";
  emailError?: string | null;
  answersSnapshot: AnswerSnapshotItem[];
};

export type AdminApplicationsResponse = {
  applications: AdminApplication[];
  total: number;
  page: number;
  pageSize: number;
  sheetUrl?: string | null;
};

export type ApiFailure = Error & {
  status?: number;
  code?: string;
  fieldErrors?: FieldErrorMap;
  retryAfterSeconds?: number;
  nextAllowedAt?: string;
  latestConfig?: RecruitmentFormConfig;
};
