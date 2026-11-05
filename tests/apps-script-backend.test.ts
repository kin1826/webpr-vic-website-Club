import { createHash, createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { createSignedEnvelope } from "../backend/src/services/apps-script-client.js";

const source = readFileSync(new URL("../apps-script/Code.gs", import.meta.url), "utf8");
const testSecret = "a".repeat(64);

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

function hashBytes(value: string, algorithm: "sha256" | "sha256-hmac", secret?: string) {
  const result = algorithm === "sha256"
    ? createHash("sha256").update(value, "utf8").digest()
    : createHmac("sha256", secret ?? "").update(value, "utf8").digest();
  return Array.from(result, (byte) => byte > 127 ? byte - 256 : byte);
}

function harness(options: { emailFails?: boolean; appendFails?: boolean; failFirstTechnicalWrite?: boolean; locked?: boolean; form?: Record<string, unknown> } = {}) {
  const applications: Record<string, unknown>[] = [];
  const technical = new Map<string, { value: string; expiresAt: string; meta: string }>();
  let emailFailureMarked = false;
  let firstTechnicalWrite = true;
  const context: Record<string, any> = {
    console, URL, Date, JSON, Math,
    SpreadsheetApp: {}, ContentService: {}, MailApp: {}, UrlFetchApp: {},
    LockService: { getScriptLock: () => ({ tryLock: () => options.locked !== false, releaseLock: () => undefined }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => null, setProperty: () => undefined }) },
    Utilities: {
      Charset: { UTF_8: "UTF_8" }, DigestAlgorithm: { SHA_256: "SHA_256" },
      computeDigest: (algorithm: string, value: string) => hashBytes(value, algorithm === "SHA_256" ? "sha256" : "sha256"),
      computeHmacSha256Signature: (value: string, secret: string) => hashBytes(value, "sha256-hmac", secret),
      getUuid: () => "abcdef-0000", formatDate: () => "20261016-120000",
    },
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  context.initializeVicRecruitment = () => undefined;
  context.readConfig_ = () => options.form ?? config();
  context.publicConfig_ = (value: unknown) => value;
  context.getTechnical_ = (kind: string, key: string) => technical.get(`${kind}:${key}`) ?? null;
  context.findApplicationByIdempotency_ = (key: string) => {
    const index = applications.findIndex((application) => application.idempotency_key === key);
    return index < 0 ? null : { row: index + 2, data: applications[index] };
  };
  context.enforceBurstLimit_ = () => undefined;
  context.createApplicationId_ = () => `VIC-${applications.length + 1}`;
  context.appendApplication_ = (record: Record<string, unknown>) => { if (options.appendFails) throw new Error("sheet failed"); applications.push(record); };
  context.setTechnicalBatch_ = (items: Array<{ kind: string; key: string; value: string; expiresAt: string; meta: string }>) => {
    if (options.failFirstTechnicalWrite && firstTechnicalWrite) { firstTechnicalWrite = false; throw new Error("technical sheet failed"); }
    items.forEach((item) => technical.set(`${item.kind}:${item.key}`, { value: String(item.value), expiresAt: item.expiresAt, meta: item.meta }));
  };
  context.sendConfirmationEmail_ = () => { if (options.emailFails) throw new Error("mail failed"); };
  context.markEmailFailure_ = () => { emailFailureMarked = true; };
  return { context, applications, technical, emailFailureMarked: () => emailFailureMarked };
}

function payload(key = "00000000-0000-4000-8000-000000000001", answerOverrides: Record<string, unknown> = {}) {
  return { formId: "vic", campaignId: "2026", formVersion: "1", idempotencyKey: key, answers: answers(answerOverrides), honeypot: "" };
}

function signatureHarness() {
  const nonceRows: unknown[][] = [["kind", "key", "value", "expires_at", "updated_at", "meta"]];
  const scriptProperties = new Map<string, string>([["EXPRESS_HMAC_SECRET", testSecret]]);
  let isLocked = false;
  const technicalSheet = {
    getDataRange: () => ({ getValues: () => nonceRows.map((row) => [...row]) }),
    appendRow: (row: unknown[]) => nonceRows.push(row),
    deleteRow: (row: number) => nonceRows.splice(row - 1, 1),
  };
  const context: Record<string, any> = {
    console, URL, Date, JSON, Math,
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => technicalSheet }) },
    LockService: { getScriptLock: () => ({ tryLock: () => { if (isLocked) return false; isLocked = true; return true; }, releaseLock: () => { isLocked = false; } }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (key: string) => scriptProperties.get(key) ?? null, setProperty: (key: string, value: string) => scriptProperties.set(key, value) }) },
    Utilities: {
      Charset: { UTF_8: "UTF_8" }, DigestAlgorithm: { SHA_256: "SHA_256" },
      computeDigest: (_algorithm: string, value: string) => hashBytes(value, "sha256"),
      computeHmacSha256Signature: (value: string, secret: string) => hashBytes(value, "sha256-hmac", secret),
    },
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  context.initializeVicRecruitment = () => undefined;
  return { context, nonceRows, scriptProperties };
}

describe("Apps Script submission gate", () => {
  it("lưu lần đầu và giữ MSSV dạng chuỗi", () => {
    const h = harness();
    const result = h.context.submitApplication_(payload());
    expect(result.applicationId).toBe("VIC-1");
    expect(h.applications).toHaveLength(1);
    expect(h.applications[0].student_id).toBe("00123");
  });
  it("retry cùng key và nội dung chỉ trả một đơn", () => {
    const h = harness(); const request = payload();
    h.context.submitApplication_(request);
    const retry = h.context.submitApplication_(request);
    expect(h.applications).toHaveLength(1);
    expect(retry.duplicate).toBe(true);
  });
  it("khôi phục kết quả đơn từ idempotency key mà không tạo thêm hàng", () => {
    const h = harness(); const request = payload();
    const accepted = h.context.submitApplication_(request);
    const status = h.context.getSubmissionStatus_(request.idempotencyKey, {});
    expect(status).toMatchObject({ state: "received", result: { applicationId: accepted.applicationId, emailStatus: "pending" } });
    expect(h.applications).toHaveLength(1);
  });
  it("từ chối dùng lại idempotency key với nội dung khác", () => {
    const h = harness(); const request = payload();
    h.context.submitApplication_(request);
    expect(() => h.context.submitApplication_(payload(request.idempotencyKey, { motivation: "Nội dung khác" }))).toThrow(/dùng cho nội dung khác/);
    expect(h.applications).toHaveLength(1);
  });
  it("hai key khác nhau cùng email phải chờ cooldown 600 giây", () => {
    const h = harness();
    h.context.submitApplication_(payload());
    expect(() => h.context.submitApplication_(payload("00000000-0000-4000-8000-000000000002"))).toThrow(/Vui lòng chờ/);
    expect(h.applications).toHaveLength(1);
  });
  it("cho gửi lại sau khi hết cooldown", () => {
    const h = harness();
    const emailHash = h.context.hash_("sv@vku.udn.vn");
    h.technical.set(`cooldown:${emailHash}`, { value: "old", expiresAt: new Date(Date.now() - 1).toISOString(), meta: "" });
    h.context.submitApplication_(payload());
    expect(h.applications).toHaveLength(1);
  });
  it("lỗi lưu không bắt đầu cooldown", () => {
    const h = harness({ appendFails: true });
    expect(() => h.context.submitApplication_(payload())).toThrow("sheet failed");
    expect(Array.from(h.technical.keys()).some((key) => key.startsWith("cooldown:"))).toBe(false);
  });
  it("retry phục hồi cooldown và idempotency sau khi đơn đã vào Sheet nhưng tab kỹ thuật lỗi", () => {
    const h = harness({ failFirstTechnicalWrite: true }); const request = payload();
    expect(() => h.context.submitApplication_(request)).toThrow("technical sheet failed");
    expect(h.applications).toHaveLength(1);

    const recovered = h.context.submitApplication_(request);
    expect(recovered.duplicate).toBe(true);
    expect(recovered.emailStatus).toBe("pending");
    expect(h.applications).toHaveLength(1);
    expect(Array.from(h.technical.keys()).some((key) => key.startsWith("idempotency:"))).toBe(true);
    expect(Array.from(h.technical.keys()).some((key) => key.startsWith("cooldown:"))).toBe(true);
  });
  it("retry phục hồi cooldown bị thiếu mà không tạo thêm đơn", () => {
    const h = harness(); const request = payload();
    h.context.submitApplication_(request);
    const emailHash = h.context.hash_("sv@vku.udn.vn");
    h.technical.delete(`cooldown:${emailHash}`);

    const retry = h.context.submitApplication_(request);
    expect(retry.duplicate).toBe(true);
    expect(h.applications).toHaveLength(1);
    expect(h.technical.has(`cooldown:${emailHash}`)).toBe(true);
  });
  it("xếp email nền cùng đơn; lỗi email không ảnh hưởng xác nhận ghi đơn", () => {
    const h = harness({ emailFails: true });
    const result = h.context.submitApplication_(payload());
    expect(result.emailStatus).toBe("pending");
    expect(h.applications).toHaveLength(1);
    expect(Array.from(h.technical.keys()).some((key) => key.startsWith("cooldown:"))).toBe(true);
    expect(Array.from(h.technical.entries()).some(([key, value]) => key.startsWith("email_job:") && JSON.parse(value.value).state === "queued")).toBe(true);
    expect(h.emailFailureMarked()).toBe(false);
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
  it("admin chưa cấu hình không được đọc dữ liệu", () => {
    const h = harness();
    try { h.context.requireAdmin_("fake-token"); throw new Error("expected failure"); } catch (error: any) { expect(error.code).toBe("ADMIN_NOT_CONFIGURED"); }
  });
  it("chuỗi giống công thức được lưu dưới dạng văn bản", () => {
    const h = harness();
    expect(h.context.safeCell_("=IMPORTXML('x')")).toBe("'=IMPORTXML('x')");
    expect(h.context.safeCell_("+SUM(A1:A2)")).toBe("'+SUM(A1:A2)");
  });
});

describe("Apps Script HMAC gate", () => {
  it("xác minh chữ ký trên payloadJson nguyên dạng trước khi claim nonce", () => {
    const h = signatureHarness();
    const payloadJson = '{"action":"getForm","label":"VIC / Đăng ký"}';
    const envelope = createSignedEnvelope(JSON.parse(payloadJson), testSecret);
    envelope.payloadJson = payloadJson;
    const signedText = `${envelope.protocolVersion}\n${envelope.timestamp}\n${envelope.nonce}\n${payloadJson}`;
    envelope.signature = createHmac("sha256", testSecret).update(signedText, "utf8").digest("hex");
    expect(h.context.verifySignedEnvelope_(envelope)).toEqual({ action: "getForm", label: "VIC / Đăng ký" });
    expect(h.nonceRows).toHaveLength(2);
  });
  it("từ chối chữ ký sai, timestamp hết hạn, replay và request cũ không ký", () => {
    const h = signatureHarness();
    const good = createSignedEnvelope({ action: "getForm" }, testSecret);
    const tampered = { ...good, payloadJson: '{"action":"adminListApplications"}' };
    expect(() => h.context.verifySignedEnvelope_(tampered)).toThrow(/không hợp lệ/);
    expect(h.nonceRows).toHaveLength(1);

    const expired = createSignedEnvelope({ action: "getForm" }, testSecret, Date.now() - 120001);
    expect(() => h.context.verifySignedEnvelope_(expired)).toThrow(/hết hạn/);
    expect(h.nonceRows).toHaveLength(1);

    h.context.verifySignedEnvelope_(good);
    expect(() => h.context.verifySignedEnvelope_(good)).toThrow(/đã được sử dụng/);
    expect(h.nonceRows).toHaveLength(2);
    expect(() => h.context.verifySignedEnvelope_({ action: "submitApplication", payload: {} })).toThrow(/không hợp lệ/);
  });
  it("fail closed khi shared secret bị thiếu", () => {
    const h = signatureHarness();
    h.scriptProperties.delete("EXPRESS_HMAC_SECRET");
    const envelope = createSignedEnvelope({ action: "getForm" }, testSecret);
    expect(() => h.context.verifySignedEnvelope_(envelope)).toThrow(/chưa được cấu hình/);
    expect(h.nonceRows).toHaveLength(1);
  });
});
