import { readFileSync } from "node:fs";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../apps-script/Code.gs", import.meta.url), "utf8");

function config(overrides: Record<string, unknown> = {}) {
  return {
    formId: "vic", campaignId: "2026", formVersion: "1", isOpen: true, closedMessage: "Đã đóng", successMessage: "Đã nhận", allowedEmailDomain: "udn.vn", cooldownMinutes: 10,
    fields: [
      { fieldId: "school_email", label: "Email", type: "email", required: true, active: true, sortOrder: 1, options: [] },
      { fieldId: "student_id", label: "MSSV", type: "text", required: true, active: true, sortOrder: 2, options: [] },
      { fieldId: "full_name", label: "Tên", type: "text", required: true, active: true, sortOrder: 3, options: [] },
      { fieldId: "department", label: "Ban", type: "radio", required: true, active: true, sortOrder: 4, options: [{ optionId: "hoc_tap", label: "Ban Học tập", active: true }] },
      { fieldId: "consent", label: "Đồng ý", type: "checkbox", required: true, active: true, sortOrder: 5, options: [] },
    ], ...overrides,
  };
}

function answers(overrides: Record<string, unknown> = {}) {
  return { school_email: "sv@vku.udn.vn", student_id: "00123", full_name: "Sinh viên", department: "hoc_tap", consent: true, ...overrides };
}

function harness(options: { emailFails?: boolean; appendFails?: boolean; locked?: boolean; form?: Record<string, unknown> } = {}) {
  const applications: Record<string, unknown>[] = [];
  const idem = new Map<string, Record<string, unknown>>();
  const technical = new Map<string, { value: string; expiresAt: string; meta: string }>();
  let emailFailureMarked = false;
  const context: Record<string, any> = {
    console, URL, Date, JSON, Math,
    SpreadsheetApp: {}, ContentService: {}, MailApp: {}, UrlFetchApp: {},
    LockService: { getScriptLock: () => ({ tryLock: () => options.locked !== false, releaseLock: () => undefined }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => null }) },
    Utilities: {
      Charset: { UTF_8: "UTF_8" }, DigestAlgorithm: { SHA_256: "SHA_256" },
      computeDigest: () => [1, 2, 3], getUuid: () => "abcdef-0000", formatDate: () => "20261016-120000",
    },
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  context.initializeVicRecruitment = () => undefined;
  context.verifyTurnstile_ = () => undefined;
  context.readConfig_ = () => options.form ?? config();
  context.publicConfig_ = (value: unknown) => value;
  context.findIdempotentResult_ = (key: string) => idem.get(key) ?? null;
  context.getTechnical_ = (kind: string, key: string) => technical.get(`${kind}:${key}`) ?? null;
  context.enforceBurstLimit_ = () => undefined;
  context.createApplicationId_ = () => `VIC-${applications.length + 1}`;
  context.hash_ = () => "email-hash";
  context.appendApplication_ = (record: Record<string, unknown>) => { if (options.appendFails) throw new Error("sheet failed"); applications.push(record); };
  context.setTechnicalBatch_ = (items: any[]) => items.forEach((item) => {
    technical.set(`${item.kind}:${item.key}`, { value: String(item.value), expiresAt: item.expiresAt, meta: item.meta });
    if (item.kind === "idempotency") idem.set(item.key, JSON.parse(item.value));
  });
  context.sendConfirmationEmail_ = () => { if (options.emailFails) throw new Error("mail failed"); };
  context.markEmailFailure_ = () => { emailFailureMarked = true; };
  context.updateIdempotentResult_ = (key: string, result: Record<string, unknown>) => idem.set(key, { ...result });
  return { context, applications, technical, idem, emailFailureMarked: () => emailFailureMarked };
}

function payload(key = "00000000-0000-4000-8000-000000000001", answerOverrides: Record<string, unknown> = {}) {
  return { formId: "vic", campaignId: "2026", formVersion: "1", idempotencyKey: key, answers: answers(answerOverrides), honeypot: "" };
}

describe("Apps Script submission gate", () => {
  it("lưu lần đầu và giữ MSSV dạng chuỗi", () => {
    const h = harness();
    const result = h.context.submitApplication_(payload());
    expect(result.applicationId).toBe("VIC-1");
    expect(h.applications).toHaveLength(1);
    expect(h.applications[0].student_id).toBe("00123");
  });
  it("retry cùng idempotency key trả lại một đơn", () => {
    const h = harness(); const request = payload();
    h.context.submitApplication_(request);
    const retry = h.context.submitApplication_(request);
    expect(h.applications).toHaveLength(1);
    expect(retry.duplicate).toBe(true);
  });
  it("hai request khác key cùng email không tạo hai đơn trong cooldown", () => {
    const h = harness();
    h.context.submitApplication_(payload());
    expect(() => h.context.submitApplication_(payload("00000000-0000-4000-8000-000000000002"))).toThrow(/Vui lòng chờ/);
    expect(h.applications).toHaveLength(1);
  });
  it("cho gửi lại khi đủ 600 giây", () => {
    const h = harness();
    h.technical.set("cooldown:email-hash", { value: "old", expiresAt: new Date(Date.now() - 1).toISOString(), meta: "" });
    h.context.submitApplication_(payload());
    expect(h.applications).toHaveLength(1);
  });
  it("lỗi lưu không bắt đầu cooldown", () => {
    const h = harness({ appendFails: true });
    expect(() => h.context.submitApplication_(payload())).toThrow("sheet failed");
    expect(h.technical.has("cooldown:email-hash")).toBe(false);
  });
  it("email lỗi không làm mất đơn và cooldown", () => {
    const h = harness({ emailFails: true });
    const result = h.context.submitApplication_(payload());
    expect(result.emailStatus).toBe("failed");
    expect(h.applications).toHaveLength(1);
    expect(h.technical.has("cooldown:email-hash")).toBe(true);
    expect(h.emailFailureMarked()).toBe(true);
  });
  it("form đóng không nhận đơn", () => {
    const h = harness({ form: config({ isOpen: false }) });
    expect(() => h.context.submitApplication_(payload())).toThrow("Đã đóng");
    expect(h.applications).toHaveLength(0);
  });
  it("phiên bản cũ bị từ chối rõ ràng", () => {
    const h = harness(); const request = payload(); request.formVersion = "0";
    try { h.context.submitApplication_(request); throw new Error("expected failure"); } catch (error: any) { expect(error.code).toBe("FORM_VERSION_CHANGED"); expect(error.latestConfig).toBeTruthy(); }
  });
  it("admin chưa được cấu hình không được đọc dữ liệu thật", () => {
    const h = harness();
    try { h.context.requireAdmin_("fake-token"); throw new Error("expected failure"); } catch (error: any) { expect(error.code).toBe("ADMIN_NOT_CONFIGURED"); }
  });
  it("chuỗi giống công thức được lưu dưới dạng văn bản", () => {
    const h = harness();
    expect(h.context.safeCell_("=IMPORTXML('x')")).toBe("'=IMPORTXML('x')");
    expect(h.context.safeCell_("+SUM(A1:A2)")).toBe("'+SUM(A1:A2)");
  });
});
