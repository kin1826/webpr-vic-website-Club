import { z } from "zod";

const optionSchema = z.object({
  fieldId: z.string().min(1).max(80),
  optionId: z.string().min(1).max(80),
  label: z.string().max(500),
  sortOrder: z.number().int().min(0).max(10000),
  active: z.boolean(),
  infoUrl: z.string().max(2048).nullable().optional(),
});

const fieldSchema = z.object({
  fieldId: z.string().regex(/^[a-z][a-z0-9_]{1,60}$/),
  label: z.string().max(500),
  type: z.enum(["text", "textarea", "email", "url", "radio", "select", "checkbox"]),
  required: z.boolean(),
  active: z.boolean(),
  sortOrder: z.number().int().min(0).max(10000),
  section: z.string().max(200),
  helpText: z.string().max(2000).nullable().optional(),
  options: z.array(optionSchema).max(100),
  system: z.boolean().optional(),
});

export const recruitmentFormSchema = z.object({
  formId: z.string().min(1).max(100),
  campaignId: z.string().min(1).max(100),
  formTitle: z.string().max(500),
  formDescription: z.string().max(5000),
  isOpen: z.boolean(),
  closedMessage: z.string().max(3000),
  successMessage: z.string().max(3000),
  allowedEmailDomain: z.string().min(1).max(253),
  cooldownMinutes: z.number().int().min(0).max(1440),
  formVersion: z.string().min(1).max(40),
  contactEmail: z.string().email().nullable().optional(),
  facebookUrl: z.string().url().nullable().optional(),
  fields: z.array(fieldSchema).max(100),
  source: z.enum(["google-sheet", "prototype"]),
});

export const applicationPayloadSchema = z.object({
  formId: z.string().min(1).max(100),
  campaignId: z.string().min(1).max(100),
  formVersion: z.string().min(1).max(40),
  idempotencyKey: z.string().uuid(),
  answers: z.record(z.string().min(1).max(80), z.union([z.string().max(5000), z.boolean()])).refine((answers) => Object.keys(answers).length <= 100, "Tối đa 100 trường trả lời."),
  honeypot: z.string().max(500).default(""),
  turnstileToken: z.string().max(4096).optional().default(""),
}).strict();

export const submissionStatusSchema = z.object({ idempotencyKey: z.string().uuid() }).strict();
export const retryEmailSchema = z.object({ allowPossibleDuplicate: z.boolean().default(false) }).strict();

export const publishFormPayloadSchema = z.object({
  config: recruitmentFormSchema,
  expectedVersion: z.string().min(1).max(40),
}).strict();

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(100000).default(1),
  pageSize: z.coerce.number().int().min(1).max(250).default(25),
});

export const applicationIdSchema = z.string().min(1).max(100).regex(/^VIC-[A-Za-z0-9-]+$/);
