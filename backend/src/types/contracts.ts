import type { z } from "zod";
import type { recruitmentFormSchema } from "../validation/schemas.js";

export type RecruitmentFormConfig = z.infer<typeof recruitmentFormSchema>;
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
  emailStatus: "pending" | "sent" | "failed" | "needs_review";
  message: string;
  nextAllowedAt: string;
  duplicate?: boolean;
};

export type SubmissionStatusResult = { state: "processing" } | { state: "received"; result: SubmitApplicationResult };

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
  emailStatus: "pending" | "sent" | "failed" | "needs_review";
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

export type PublishFormPayload = {
  idToken: string;
  config: RecruitmentFormConfig;
  expectedVersion: string;
};

export type AppScriptAction =
  | "getForm"
  | "submitApplication"
  | "adminGetForm"
  | "adminListApplications"
  | "adminGetApplication"
  | "adminPublishForm"
  | "adminRetryEmail"
  | "getSubmissionStatus"
  | "adminConfirmEmailSent";

export type AppScriptRequest = {
  action: AppScriptAction;
  [key: string]: unknown;
};
