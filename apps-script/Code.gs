/* global SpreadsheetApp, LockService, Utilities, UrlFetchApp, MailApp, PropertiesService, ContentService, CacheService, ScriptApp */

const VIC_SHEET_ID = "1CQiNWk2YZxKLlXA3asiB6K6ADqJSWwIFEymM156ol-A";
const SHEETS = { config: "CauHinh", fields: "TruongNhap", options: "LuaChon", applications: "DonUngTuyen", technical: "TrangThaiKyThuat" };
const APP_EXTRA_HEADERS = ["idempotency_key", "email_retry_count", "form_id"];
const TECH_HEADERS = ["kind", "key", "value", "expires_at", "updated_at", "meta"];
const ADMIN_ACTIONS = ["adminGetForm", "adminListApplications", "adminGetApplication", "adminPublishForm", "adminRetryEmail", "adminConfirmEmailSent"];
const ALLOWED_TYPES = ["text", "textarea", "email", "url", "radio", "select", "checkbox"];
const MAX_TEXT_LENGTH = 5000;
const SIGNATURE_MAX_AGE_MS = 120000;
const NONCE_TTL_MS = 600000;
const NONCE_CLEANUP_INTERVAL_MS = 300000;
const APPLICATION_COOLDOWN_MS = 600000;
const EMAIL_JOB_LEASE_MS = 600000;
const EMAIL_JOB_RETENTION_MS = 2592000000;
const EMAIL_RETRY_DELAYS_MS = [60000, 300000, 900000];
const EMAIL_QUEUE_BATCH_SIZE = 5;
const EMAIL_QUEUE_MAX_RUNTIME_MS = 240000;

function doGet() {
  return json_({ ok: true, data: { service: "VIC recruitment API", status: "ready" } });
}

function doPost(event) {
  const startedAt = Date.now();
  const context = createRequestContext_();
  let action = "unknown";
  try {
    const envelope = JSON.parse((event && event.postData && event.postData.contents) || "{}");
    const verifyStartedAt = Date.now();
    const request = verifySignedEnvelope_(envelope, context);
    context.timings.signatureAndNonceMs = Date.now() - verifyStartedAt;
    action = String(request.action || "unknown");
    const response = dispatchSignedRequest_(request, context);
    console.info(JSON.stringify({ event: "vic_api_request", action: action, durationMs: Date.now() - startedAt, phases: context.timings }));
    return response;
  } catch (error) {
    console.error(JSON.stringify({ event: "vic_api_error", action: action, code: error && error.code ? error.code : "INTERNAL_ERROR", durationMs: Date.now() - startedAt, phases: context.timings }));
    return json_({ ok: false, error: { code: error.code || "INTERNAL_ERROR", message: error.expose ? error.message : "Máy chủ không thể xử lý yêu cầu.", status: error.status || 500, fieldErrors: error.fieldErrors || undefined, retryAfterSeconds: error.retryAfterSeconds || undefined, nextAllowedAt: error.nextAllowedAt || undefined, latestConfig: error.latestConfig || undefined } });
  }
}

function dispatchSignedRequest_(request, context) {
  const action = String(request.action || "");
  if (ADMIN_ACTIONS.indexOf(action) >= 0) requireAdmin_(request.idToken);
  if (action === "getForm") return json_({ ok: true, data: publicConfig_(readConfig_(context)) });
  if (action === "submitApplication") return json_({ ok: true, data: submitApplication_(request.payload || {}, context) });
  if (action === "getSubmissionStatus") return json_({ ok: true, data: getSubmissionStatus_(request.idempotencyKey, context) });
  if (action === "adminGetForm") return json_({ ok: true, data: readConfig_() });
  if (action === "adminListApplications") return json_({ ok: true, data: listApplications_(request) });
  if (action === "adminGetApplication") return json_({ ok: true, data: getApplication_(request.applicationId) });
  if (action === "adminPublishForm") return json_({ ok: true, data: publishForm_(request.config, request.expectedVersion) });
  if (action === "adminRetryEmail") return json_({ ok: true, data: retryEmail_(request.applicationId, request.allowPossibleDuplicate === true) });
  if (action === "adminConfirmEmailSent") return json_({ ok: true, data: confirmEmailSent_(request.applicationId) });
  throw apiError_("UNKNOWN_ACTION", "Thao tác API không hợp lệ.", 400);
}

function createRequestContext_() {
  return { spreadsheet: null, sheets: {}, technicalMap: null, applicationRows: null, timings: {} };
}

function getSpreadsheet_(context) {
  if (!context) return SpreadsheetApp.openById(VIC_SHEET_ID);
  if (!context.spreadsheet) context.spreadsheet = SpreadsheetApp.openById(VIC_SHEET_ID);
  return context.spreadsheet;
}

function getContextSheet_(context, name) {
  if (!context) return requiredSheet_(SpreadsheetApp.openById(VIC_SHEET_ID), name);
  if (!context.sheets[name]) context.sheets[name] = requiredSheet_(getSpreadsheet_(context), name);
  return context.sheets[name];
}

function verifySignedEnvelope_(envelope, context) {
  if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) throw apiError_("INVALID_ENVELOPE", "Yêu cầu không hợp lệ.", 400);
  const protocolVersion = String(envelope.protocolVersion || "");
  const timestamp = String(envelope.timestamp || "");
  const nonce = String(envelope.nonce || "");
  const payloadJson = envelope.payloadJson;
  const signature = String(envelope.signature || "").toLowerCase();
  const secret = PropertiesService.getScriptProperties().getProperty("EXPRESS_HMAC_SECRET");
  if (!secret) throw apiError_("PROXY_AUTH_NOT_CONFIGURED", "Xác thực backend chưa được cấu hình.", 503);
  if (protocolVersion !== "1" || !/^\d{13}$/.test(timestamp) || !/^[A-Za-z0-9_-]{43}$/.test(nonce)
    || typeof payloadJson !== "string" || payloadJson.length > 32768 || !/^[a-f0-9]{64}$/.test(signature)) {
    throw apiError_("INVALID_ENVELOPE", "Yêu cầu không hợp lệ.", 400);
  }
  const now = Date.now();
  if (Math.abs(now - Number(timestamp)) > SIGNATURE_MAX_AGE_MS) throw apiError_("SIGNATURE_EXPIRED", "Yêu cầu đã hết hạn. Vui lòng thử lại.", 401);
  const signedText = signingText_(protocolVersion, timestamp, nonce, payloadJson);
  const expectedSignature = hmacHex_(signedText, secret);
  if (!constantTimeEquals_(signature, expectedSignature)) throw apiError_("INVALID_SIGNATURE", "Yêu cầu không hợp lệ.", 401);

  claimNonce_(nonce, now, context);
  let request;
  try { request = JSON.parse(payloadJson); }
  catch (ignore) { throw apiError_("INVALID_PAYLOAD", "Dữ liệu yêu cầu không hợp lệ.", 400); }
  if (!request || typeof request !== "object" || Array.isArray(request) || typeof request.action !== "string") {
    throw apiError_("INVALID_PAYLOAD", "Dữ liệu yêu cầu không hợp lệ.", 400);
  }
  return request;
}

function signingText_(protocolVersion, timestamp, nonce, payloadJson) {
  return protocolVersion + "\n" + timestamp + "\n" + nonce + "\n" + payloadJson;
}

function hmacHex_(value, secret) {
  return Utilities.computeHmacSha256Signature(value, secret, Utilities.Charset.UTF_8)
    .map(function (byte) { return ("0" + ((byte + 256) % 256).toString(16)).slice(-2); }).join("");
}

function constantTimeEquals_(left, right) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return mismatch === 0;
}

function claimNonce_(nonce, now, context) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw apiError_("BUSY", "Hệ thống đang bận. Vui lòng thử lại sau ít giây.", 503);
  try {
    context = context || null;
    const sheet = getContextSheet_(context, SHEETS.technical);
    let values = sheet.getDataRange().getValues();
    values = pruneExpiredTechnicalRows_(sheet, values, now);
    const key = hash_(nonce);
    const headers = values[0].map(function (item) { return String(item).trim(); });
    const kindIndex = headers.indexOf("kind");
    const keyIndex = headers.indexOf("key");
    const technicalMap = technicalMapFromRows_(values, headers);
    if (technicalMap.has(technicalKey_("nonce", key))) throw apiError_("REPLAYED_REQUEST", "Yêu cầu đã được sử dụng. Vui lòng thử lại.", 409);
    const nowIso = new Date(now).toISOString();
    sheet.appendRow(["nonce", key, "", new Date(now + NONCE_TTL_MS).toISOString(), nowIso, ""]);
    technicalMap.set(technicalKey_("nonce", key), { value: "", expiresAt: new Date(now + NONCE_TTL_MS).toISOString(), meta: "" });
    if (context) context.technicalMap = technicalMap;
  } finally { lock.releaseLock(); }
}

function pruneExpiredTechnicalRows_(sheet, values, now) {
  const properties = PropertiesService.getScriptProperties();
  const lastCleanup = Number(properties.getProperty("EXPRESS_HMAC_NONCE_CLEANED_AT") || 0);
  if (now - lastCleanup < NONCE_CLEANUP_INTERVAL_MS) return values;
  const headers = values[0].map(function (item) { return String(item).trim(); });
  const expiresIndex = headers.indexOf("expires_at");
  const expiredIndexes = new Set();
  const expiredRows = [];
  for (let i = 1; i < values.length; i += 1) {
    const expiresAt = new Date(values[i][expiresIndex]).getTime();
    if (Number.isFinite(expiresAt) && expiresAt <= now) { expiredIndexes.add(i); expiredRows.push(i + 1); }
  }
  const ranges = [];
  expiredRows.forEach(function (row) {
    const last = ranges[ranges.length - 1];
    if (last && row === last.start + last.count) last.count += 1;
    else ranges.push({ start: row, count: 1 });
  });
  ranges.reverse().forEach(function (range) { sheet.deleteRows(range.start, range.count); });
  properties.setProperty("EXPRESS_HMAC_NONCE_CLEANED_AT", String(now));
  return values.filter(function (_row, index) { return !expiredIndexes.has(index); });
}

function technicalKey_(kind, key) { return `${kind}::${key}`; }

function technicalMapFromRows_(values, headers) {
  const indexes = { kind: headers.indexOf("kind"), key: headers.indexOf("key"), value: headers.indexOf("value"), expires_at: headers.indexOf("expires_at"), meta: headers.indexOf("meta") };
  const map = new Map();
  for (let i = 1; i < values.length; i += 1) {
    const row = values[i];
    map.set(technicalKey_(String(row[indexes.kind]), String(row[indexes.key])), {
      value: String(row[indexes.value] || ""),
      expiresAt: String(row[indexes.expires_at] || ""),
      meta: String(row[indexes.meta] || ""),
      row: i + 1,
    });
  }
  return map;
}

function initializeVicRecruitment() {
  const spreadsheet = SpreadsheetApp.openById(VIC_SHEET_ID);
  const applications = requiredSheet_(spreadsheet, SHEETS.applications);
  ensureHeaders_(applications, APP_EXTRA_HEADERS);
  let technical = spreadsheet.getSheetByName(SHEETS.technical);
  if (!technical) technical = spreadsheet.insertSheet(SHEETS.technical);
  if (technical.getLastRow() === 0) technical.getRange(1, 1, 1, TECH_HEADERS.length).setValues([TECH_HEADERS]);
  else ensureHeaders_(technical, TECH_HEADERS);
  technical.hideSheet();
  return { initialized: true, technicalSheet: SHEETS.technical };
}

function submitApplication_(payload, context) {
  const startedAt = Date.now();
  const phases = context ? context.timings : {};
  if (String(payload.honeypot || "")) throw apiError_("SPAM_DETECTED", "Yêu cầu không hợp lệ.", 400);
  const idempotencyKey = String(payload.idempotencyKey || "").trim();
  if (!/^[a-zA-Z0-9-]{16,100}$/.test(idempotencyKey)) throw apiError_("INVALID_IDEMPOTENCY_KEY", "Mã chống gửi trùng không hợp lệ.", 400);
  const answers = payload.answers && typeof payload.answers === "object" ? payload.answers : {};
  const email = normalizeEmail_(answers.school_email);
  const lockStartedAt = Date.now();
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw apiError_("BUSY", "Hệ thống đang bận. Vui lòng thử lại sau ít giây.", 503);
  if (context) phases.submitLockWaitMs = Date.now() - lockStartedAt;
  let stored;
  let requestHash = "";
  try {
    const config = readConfig_(context);
    const appLookupStartedAt = Date.now();
    requestHash = applicationRequestHash_(payload.formId, payload.campaignId, payload.formVersion, answers);
    const prior = findIdempotentResult_(idempotencyKey, requestHash, config, email, context);
    if (context) phases.duplicateCheckMs = Date.now() - appLookupStartedAt;
    if (prior) { if (context) phases.submitTotalMs = Date.now() - startedAt; return Object.assign({}, prior, { duplicate: true }); }
    if (!config.isOpen) throw apiError_("FORM_CLOSED", config.closedMessage || "Đợt tuyển hiện đã đóng.", 409);
    if (String(payload.formId) !== config.formId || String(payload.campaignId) !== config.campaignId || String(payload.formVersion) !== config.formVersion) {
      const issue = apiError_("FORM_VERSION_CHANGED", "Biểu mẫu vừa được cập nhật. Hãy kiểm tra lại câu trả lời trước khi gửi.", 409);
      issue.latestConfig = publicConfig_(config);
      throw issue;
    }
    const fieldErrors = validateAnswers_(config, answers);
    if (Object.keys(fieldErrors).length) { const issue = apiError_("VALIDATION_ERROR", "Một số câu trả lời chưa hợp lệ.", 422); issue.fieldErrors = fieldErrors; throw issue; }
    const cooldownKey = hash_(email);
    const cooldown = getTechnical_("cooldown", cooldownKey, context);
    const now = new Date();
    if (cooldown && new Date(cooldown.expiresAt).getTime() > now.getTime()) {
      const seconds = Math.max(1, Math.ceil((new Date(cooldown.expiresAt).getTime() - now.getTime()) / 1000));
      const issue = apiError_("COOLDOWN", `Vui lòng chờ ${seconds} giây trước khi gửi lại.`, 429);
      issue.retryAfterSeconds = seconds; issue.nextAllowedAt = cooldown.expiresAt; throw issue;
    }
    enforceBurstLimit_(cooldownKey, now, context);
    const applicationId = createApplicationId_(now);
    const submittedAt = now.toISOString();
    const nextAllowedAt = new Date(now.getTime() + APPLICATION_COOLDOWN_MS).toISOString();
    const snapshot = buildSnapshot_(config, answers);
    const appendStartedAt = Date.now();
    appendApplication_({ application_id: applicationId, submitted_at: submittedAt, form_id: config.formId, campaign_id: config.campaignId, form_version: config.formVersion, school_email: email, student_id: String(answers.student_id || "").trim(), full_name: String(answers.full_name || "").trim(), class_name: String(answers.class_name || "").trim(), interests: answers.interests, motivation: answers.motivation, department: answers.department, weekly_time: answers.weekly_time, proud_of: answers.proud_of, portfolio_links: normalizePortfolio_(answers.portfolio_links), facebook_url: answers.facebook_url, message: answers.message, consent: answers.consent === true ? "TRUE" : "FALSE", email_status: "pending", email_sent_at: "", email_error: "", answers_snapshot: JSON.stringify({ formVersion: config.formVersion, answers: snapshot }), idempotency_key: idempotencyKey, email_retry_count: "0" }, context);
    if (context) phases.applicationSheetWriteMs = Date.now() - appendStartedAt;
    stored = { applicationId: applicationId, submittedAt: submittedAt, emailStatus: "pending", message: "VIC đã ghi nhận đơn. Email xác nhận đang được xếp hàng gửi.", nextAllowedAt: nextAllowedAt };
    const technicalWriteStartedAt = Date.now();
    setTechnicalBatch_([
      { kind: "idempotency", key: idempotencyKey, value: JSON.stringify({ requestHash: requestHash, result: stored }), expiresAt: new Date(now.getTime() + 7 * 86400000).toISOString(), meta: applicationId },
      { kind: "cooldown", key: cooldownKey, value: applicationId, expiresAt: nextAllowedAt, meta: "" },
      { kind: "email_job", key: applicationId, value: JSON.stringify(newEmailJob_(now)), expiresAt: new Date(now.getTime() + EMAIL_JOB_RETENTION_MS).toISOString(), meta: "" },
    ], context);
    if (context) phases.technicalSheetWriteMs = Date.now() - technicalWriteStartedAt;
  } finally { lock.releaseLock(); }

  if (context) phases.submitTotalMs = Date.now() - startedAt;
  return stored;
}

function newEmailJob_(now) {
  return { state: "queued", attempts: 0, nextAttemptAt: now.toISOString(), leaseUntil: "", leaseId: "", lastError: "" };
}

function getSubmissionStatus_(idempotencyKey, context) {
  const key = String(idempotencyKey || "").trim();
  if (!/^[a-zA-Z0-9-]{16,100}$/.test(key)) throw apiError_("INVALID_IDEMPOTENCY_KEY", "Mã kiểm tra đơn không hợp lệ.", 400);
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw apiError_("BUSY", "Hệ thống đang bận. Vui lòng kiểm tra lại sau.", 503);
  try {
    const application = findApplicationByIdempotency_(key, context);
    if (!application) return { state: "processing" };
    let technical = getTechnical_("idempotency", key, context);
    let job = getTechnical_("email_job", String(application.data.application_id), context);
    if (!technical) {
      const requestHash = fingerprintFromApplication_(application.data, null);
      if (!requestHash) throw apiError_("STATUS_UNAVAILABLE", "Chưa thể xác nhận kết quả. Hãy thử kiểm tra lại sau.", 503);
      const cooldownEnd = new Date(new Date(application.data.submitted_at).getTime() + APPLICATION_COOLDOWN_MS).toISOString();
      const result = applicationResult_(application.data);
      const repairs = [{ kind: "idempotency", key: key, value: JSON.stringify({ requestHash: requestHash, result: result }), expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(), meta: String(application.data.application_id) }];
      if (new Date(cooldownEnd).getTime() > Date.now()) repairs.push({ kind: "cooldown", key: hash_(application.data.school_email), value: String(application.data.application_id), expiresAt: cooldownEnd, meta: "recovered" });
      setTechnicalBatch_(repairs, context);
      technical = getTechnical_("idempotency", key, context);
    }
    if (String(application.data.email_status || "pending") === "pending" && !job) {
      const queuedAt = new Date(application.data.submitted_at);
      setTechnicalBatch_([{ kind: "email_job", key: String(application.data.application_id), value: JSON.stringify(newEmailJob_(queuedAt)), expiresAt: new Date(Date.now() + EMAIL_JOB_RETENTION_MS).toISOString(), meta: "recovered" }], context);
    }
    return { state: "received", result: applicationResult_(application.data) };
  } finally { lock.releaseLock(); }
}

function readConfig_(context) {
  const spreadsheet = getSpreadsheet_(context);
  const configRows = rowsAsObjects_(requiredSheet_(spreadsheet, SHEETS.config), context, "configRows");
  const values = {};
  configRows.forEach(function (row) { values[String(row.key || "").trim()] = String(row.value == null ? "" : row.value).trim(); });
  const optionRows = rowsAsObjects_(requiredSheet_(spreadsheet, SHEETS.options), context, "optionRows");
  const optionsByField = {};
  optionRows.forEach(function (row) {
    const fieldId = String(row.field_id || "").trim();
    if (!optionsByField[fieldId]) optionsByField[fieldId] = [];
    optionsByField[fieldId].push({ fieldId: fieldId, optionId: String(row.option_id || "").trim(), label: String(row.label || ""), sortOrder: number_(row.sort_order, 999), active: bool_(row.active), infoUrl: String(row.info_url || "") || null });
  });
  const fields = rowsAsObjects_(requiredSheet_(spreadsheet, SHEETS.fields), context, "fieldRows").map(function (row) {
    const id = String(row.field_id || "").trim();
    return { fieldId: id, label: String(row.label || ""), type: String(row.type || "text"), required: bool_(row.required), active: bool_(row.active), sortOrder: number_(row.sort_order, 999), section: String(row.section || "Thông tin đăng ký"), helpText: String(row.help_text || "") || null, options: (optionsByField[id] || []).sort(sortOrder_), system: id === "school_email" || id === "consent" };
  }).filter(function (field) { return field.fieldId; }).sort(sortOrder_);
  return { formId: values.form_id, campaignId: values.campaign_id, formTitle: values.form_title, formDescription: values.form_description, isOpen: bool_(values.is_open), closedMessage: values.closed_message, successMessage: values.success_message, allowedEmailDomain: String(values.allowed_email_domain || "udn.vn").toLowerCase(), cooldownMinutes: 10, formVersion: String(values.form_version || "1"), contactEmail: values.contact_email || null, facebookUrl: values.facebook_url || null, fields: fields, source: "google-sheet" };
}

function publicConfig_(config) {
  return { formId: config.formId, campaignId: config.campaignId, formTitle: config.formTitle, formDescription: config.formDescription, isOpen: config.isOpen, closedMessage: config.closedMessage, successMessage: config.successMessage, allowedEmailDomain: config.allowedEmailDomain, cooldownMinutes: config.cooldownMinutes, formVersion: config.formVersion, contactEmail: config.contactEmail, facebookUrl: config.facebookUrl, fields: config.fields, source: "google-sheet" };
}

function validateAnswers_(config, answers) {
  const errors = {};
  config.fields.filter(function (field) { return field.active; }).forEach(function (field) {
    const raw = answers[field.fieldId];
    const value = typeof raw === "string" ? raw.trim() : raw;
    const empty = value === undefined || value === "" || value === false;
    if (field.required && empty) { errors[field.fieldId] = field.type === "checkbox" ? "Bạn cần xác nhận mục này." : "Vui lòng điền trường này."; return; }
    if (empty) return;
    if (typeof value === "string" && value.length > MAX_TEXT_LENGTH) errors[field.fieldId] = "Nội dung vượt quá giới hạn cho phép.";
    if (field.type === "email" && !allowedEmail_(value, config.allowedEmailDomain)) errors[field.fieldId] = `Vui lòng dùng email @${config.allowedEmailDomain} hoặc tên miền con hợp lệ.`;
    if (field.type === "url" && !validUrl_(value)) errors[field.fieldId] = "URL không hợp lệ.";
    if (field.fieldId === "portfolio_links" && normalizePortfolio_(value).split("\n").filter(Boolean).some(function (url) { return !validUrl_(url); })) errors[field.fieldId] = "Mỗi dòng phải là URL HTTP/HTTPS hợp lệ.";
    if ((field.type === "radio" || field.type === "select") && !field.options.some(function (option) { return option.active && option.optionId === value; })) errors[field.fieldId] = "Lựa chọn không hợp lệ.";
    if (field.fieldId === "consent" && value !== true) errors[field.fieldId] = "Bạn cần đồng ý trước khi gửi đơn.";
  });
  return errors;
}

function buildSnapshot_(config, answers) {
  return config.fields.filter(function (field) { return field.active; }).map(function (field) {
    const value = field.fieldId === "school_email" ? normalizeEmail_(answers[field.fieldId]) : answers[field.fieldId];
    const option = field.options.find(function (item) { return item.optionId === value; });
    return { fieldId: field.fieldId, label: field.label, value: value == null ? "" : value, optionLabel: option ? option.label : null };
  });
}

function publishForm_(incoming, expectedVersion) {
  if (!incoming || !Array.isArray(incoming.fields)) throw apiError_("INVALID_SCHEMA", "Cấu hình form không hợp lệ.", 422);
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw apiError_("BUSY", "Hệ thống đang bận.", 503);
  try {
    const current = readConfig_();
    if (String(expectedVersion) !== current.formVersion) throw apiError_("VERSION_CONFLICT", "Form đã được một quản trị viên khác cập nhật. Hãy tải lại trước khi xuất bản.", 409);
    const protectedIds = ["school_email", "consent"];
    protectedIds.forEach(function (id) { const field = incoming.fields.find(function (item) { return item.fieldId === id; }); if (!field || !field.active || !field.required) throw apiError_("INVALID_SCHEMA", `Không được ẩn hoặc bỏ bắt buộc trường ${id}.`, 422); });
    const ids = {};
    incoming.fields.forEach(function (field) { if (!/^[a-z][a-z0-9_]{1,60}$/.test(field.fieldId) || ids[field.fieldId]) throw apiError_("INVALID_SCHEMA", "field_id không hợp lệ hoặc bị trùng.", 422); ids[field.fieldId] = true; if (ALLOWED_TYPES.indexOf(field.type) < 0) throw apiError_("INVALID_SCHEMA", "Loại trường không được hỗ trợ.", 422); });
    current.fields.forEach(function (oldField) { const next = incoming.fields.find(function (item) { return item.fieldId === oldField.fieldId; }); if (!next) throw apiError_("INVALID_SCHEMA", `Không được xóa field_id ${oldField.fieldId}.`, 422); if (next.type !== oldField.type) throw apiError_("INVALID_SCHEMA", `Không được đổi type của trường đã xuất bản: ${oldField.fieldId}.`, 422); });
    const nextVersion = String(number_(current.formVersion, 0) + 1);
    writeConfigValues_({ form_title: String(incoming.formTitle || "").trim(), form_description: String(incoming.formDescription || "").trim(), is_open: incoming.isOpen ? "TRUE" : "FALSE", closed_message: String(incoming.closedMessage || "").trim(), success_message: String(incoming.successMessage || "").trim(), allowed_email_domain: "udn.vn", cooldown_minutes: "10", form_version: nextVersion });
    writeFields_(incoming.fields);
    return readConfig_();
  } finally { lock.releaseLock(); }
}

function listApplications_(request) {
  const sheet = requiredSheet_(SpreadsheetApp.openById(VIC_SHEET_ID), SHEETS.applications);
  const rows = rowsAsObjects_(sheet).sort(function (a, b) { return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime(); });
  const pageSize = Math.min(250, Math.max(1, number_(request.pageSize, 25)));
  const page = Math.max(1, number_(request.page, 1));
  const config = readConfig_();
  const mapped = rows.slice((page - 1) * pageSize, page * pageSize).map(function (row) { return applicationRecord_(row, config); });
  return { applications: mapped, total: rows.length, page: page, pageSize: pageSize, sheetUrl: `https://docs.google.com/spreadsheets/d/${VIC_SHEET_ID}/edit` };
}

function getApplication_(applicationId) {
  const row = findApplication_(String(applicationId || ""));
  if (!row) throw apiError_("NOT_FOUND", "Không tìm thấy đơn.", 404);
  return applicationRecord_(row.data, readConfig_());
}

function applicationRecord_(row, config) {
  let snapshot = [];
  try { snapshot = JSON.parse(String(row.answers_snapshot || "{}")).answers || []; } catch (ignore) { snapshot = []; }
  const departmentField = config.fields.find(function (field) { return field.fieldId === "department"; });
  const option = departmentField && departmentField.options.find(function (item) { return item.optionId === String(row.department); });
  return { applicationId: String(row.application_id), submittedAt: new Date(row.submitted_at).toISOString(), campaignId: String(row.campaign_id), formVersion: String(row.form_version), schoolEmail: String(row.school_email), studentId: String(row.student_id), fullName: String(row.full_name), department: String(row.department), departmentLabel: option ? option.label : String(row.department), emailStatus: String(row.email_status || "pending"), emailError: String(row.email_error || "") || null, answersSnapshot: snapshot };
}

function retryEmail_(applicationId, allowPossibleDuplicate) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw apiError_("BUSY", "Hệ thống đang bận. Vui lòng thử lại sau.", 503);
  try {
    const context = createRequestContext_();
    const row = findApplication_(String(applicationId || ""), context);
    if (!row) throw apiError_("NOT_FOUND", "Không tìm thấy đơn.", 404);
    const status = String(row.data.email_status || "pending");
    if (status === "sent") throw apiError_("ALREADY_SENT", "Email này đã được gửi.", 409);
    if (status === "needs_review" && !allowPossibleDuplicate) throw apiError_("EMAIL_REVIEW_REQUIRED", "Hãy kiểm tra hộp thư gửi của VIC trước. Nếu xác nhận email chưa được gửi, chọn gửi lại dù có thể trùng.", 409);
    const retries = number_(row.data.email_retry_count, 0);
    if (retries >= 3) throw apiError_("RETRY_LIMIT", "Đã đạt giới hạn ba lần gửi lại.", 429);
    const job = getTechnical_("email_job", String(applicationId), context);
    if (job && JSON.parse(job.value || "{}").state === "sending") throw apiError_("EMAIL_SEND_IN_PROGRESS", "Email đang được xử lý. Vui lòng kiểm tra lại sau.", 409);
    const now = new Date();
    const retryJob = newEmailJob_(now);
    retryJob.manualRetry = true;
    retryJob.allowPossibleDuplicate = allowPossibleDuplicate;
    setTechnicalBatch_([{ kind: "email_job", key: String(applicationId), value: JSON.stringify(retryJob), expiresAt: new Date(now.getTime() + EMAIL_JOB_RETENTION_MS).toISOString(), meta: "admin retry" }], context);
    setApplicationCells_(row.row, { email_status: "pending", email_retry_count: String(retries + 1), email_error: "" }, context);
    return { status: "pending" };
  } finally { lock.releaseLock(); }
}

function confirmEmailSent_(applicationId) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw apiError_("BUSY", "Hệ thống đang bận. Vui lòng thử lại sau.", 503);
  try {
    const context = createRequestContext_();
    const row = findApplication_(String(applicationId || ""), context);
    if (!row) throw apiError_("NOT_FOUND", "Không tìm thấy đơn.", 404);
    if (String(row.data.email_status) !== "needs_review") throw apiError_("EMAIL_REVIEW_NOT_REQUIRED", "Đơn này không cần xác nhận email thủ công.", 409);
    setApplicationCells_(row.row, { email_status: "sent", email_sent_at: new Date().toISOString(), email_error: "Đã xác nhận thủ công bởi quản trị viên." }, context);
    const job = getTechnical_("email_job", String(applicationId), context);
    if (job) setTechnicalBatch_([{ kind: "email_job", key: String(applicationId), value: JSON.stringify(Object.assign({}, JSON.parse(job.value || "{}"), { state: "sent", leaseId: "", leaseUntil: "" })), expiresAt: new Date(Date.now() + EMAIL_JOB_RETENTION_MS).toISOString(), meta: "admin confirmed sent" }], context);
    return { status: "sent" };
  } finally { lock.releaseLock(); }
}

function installConfirmationEmailTrigger() {
  const triggers = ScriptApp.getProjectTriggers().filter(function (trigger) { return trigger.getHandlerFunction() === "processConfirmationEmailQueue"; });
  triggers.forEach(function (trigger) { ScriptApp.deleteTrigger(trigger); });
  ScriptApp.newTrigger("processConfirmationEmailQueue").timeBased().everyMinutes(1).create();
  return { installed: true, handler: "processConfirmationEmailQueue", intervalMinutes: 1 };
}

function processConfirmationEmailQueue() {
  const startedAt = Date.now();
  const properties = PropertiesService.getScriptProperties();
  const deferredUntil = Number(properties.getProperty("VIC_EMAIL_QUEUE_DEFER_UNTIL") || 0);
  if (deferredUntil > Date.now()) return;
  if (MailApp.getRemainingDailyQuota() < 1) {
    properties.setProperty("VIC_EMAIL_QUEUE_DEFER_UNTIL", String(Date.now() + 24 * 60 * 60 * 1000));
    console.warn(JSON.stringify({ event: "vic_email_queue_deferred", reason: "daily_quota", durationMs: Date.now() - startedAt }));
    return;
  }
  properties.deleteProperty("VIC_EMAIL_QUEUE_DEFER_UNTIL");
  let processed = 0;
  let sent = 0;
  while (processed < EMAIL_QUEUE_BATCH_SIZE && Date.now() - startedAt < EMAIL_QUEUE_MAX_RUNTIME_MS) {
    if (MailApp.getRemainingDailyQuota() < 1) {
      properties.setProperty("VIC_EMAIL_QUEUE_DEFER_UNTIL", String(Date.now() + 24 * 60 * 60 * 1000));
      break;
    }
    const claim = claimNextEmailJob_();
    if (!claim) break;
    processed += 1;
    let message;
    try {
      message = buildConfirmationEmail_(claim.applicationId, claim.context);
    } catch (error) {
      recordEmailBuildFailure_(claim, error);
      continue;
    }
    try {
      MailApp.sendEmail(message);
    } catch (error) {
      markEmailNeedsReview_(claim, error);
      continue;
    }
    try {
      markEmailSent_(claim);
      sent += 1;
    } catch (error) {
      console.error(JSON.stringify({ event: "vic_email_finalize_error", applicationId: claim.applicationId, code: error && error.code ? error.code : "SHEET_WRITE_FAILED" }));
    }
  }
  console.info(JSON.stringify({ event: "vic_email_queue_run", processed: processed, sent: sent, durationMs: Date.now() - startedAt }));
}

function claimNextEmailJob_() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return null;
  try {
    const context = createRequestContext_();
    getTechnical_("__load__", "__load__", context);
    const now = Date.now();
    const pending = [];
    context.technicalMap.forEach(function (record, compositeKey) {
      if (compositeKey.indexOf("email_job::") !== 0) return;
      const applicationId = compositeKey.slice("email_job::".length);
      let job;
      try { job = JSON.parse(record.value || "{}"); } catch (ignore) { return; }
      if (job.state === "sending" && Number(job.leaseUntil) <= now) {
        const application = findApplication_(applicationId, context);
        if (application) setApplicationCells_(application.row, { email_status: "needs_review", email_error: "Không rõ email đã được gửi trước khi tiến trình dừng. Hãy kiểm tra hộp thư của VIC trước khi thử lại." }, context);
        job.state = "needs_review"; job.leaseId = ""; job.leaseUntil = ""; job.lastError = "Worker stopped while email delivery was in progress.";
        setTechnicalBatch_([{ kind: "email_job", key: applicationId, value: JSON.stringify(job), expiresAt: new Date(now + EMAIL_JOB_RETENTION_MS).toISOString(), meta: "delivery uncertain" }], context);
        return;
      }
      if (job.state === "queued" && new Date(job.nextAttemptAt || 0).getTime() <= now) pending.push({ applicationId: applicationId, job: job });
    });
    pending.sort(function (left, right) { return new Date(left.job.nextAttemptAt).getTime() - new Date(right.job.nextAttemptAt).getTime(); });
    if (!pending.length) return null;
    const next = pending[0];
    const application = findApplication_(next.applicationId, context);
    if (!application) {
      next.job.state = "failed"; next.job.lastError = "Application row was not found.";
      setTechnicalBatch_([{ kind: "email_job", key: next.applicationId, value: JSON.stringify(next.job), expiresAt: new Date(now + EMAIL_JOB_RETENTION_MS).toISOString(), meta: "missing application" }], context);
      return null;
    }
    next.job.state = "sending";
    next.job.attempts = number_(next.job.attempts, 0) + 1;
    next.job.leaseId = Utilities.getUuid();
    next.job.leaseUntil = String(now + EMAIL_JOB_LEASE_MS);
    setTechnicalBatch_([{ kind: "email_job", key: next.applicationId, value: JSON.stringify(next.job), expiresAt: new Date(now + EMAIL_JOB_RETENTION_MS).toISOString(), meta: "claimed" }], context);
    setApplicationCells_(application.row, { email_status: "pending", email_retry_count: String(Math.max(0, next.job.attempts - 1)), email_error: "" }, context);
    return { applicationId: next.applicationId, leaseId: next.job.leaseId, attempts: next.job.attempts, context: context };
  } finally { lock.releaseLock(); }
}

function buildConfirmationEmail_(applicationId, context) {
  const row = findApplication_(applicationId, context);
  if (!row) throw new Error("Không tìm thấy đơn để gửi email.");
  const data = row.data;
  const config = readConfig_(context);
  const departmentField = config.fields.find(function (field) { return field.fieldId === "department"; });
  const department = departmentField && departmentField.options.find(function (item) { return item.optionId === String(data.department); });
  const submitted = Utilities.formatDate(new Date(data.submitted_at), "Asia/Ho_Chi_Minh", "HH:mm dd/MM/yyyy");
  const contact = config.contactEmail ? ` Nếu cần hỗ trợ, liên hệ ${config.contactEmail}.` : "";
  const plain = `Chào ${data.full_name},\n\nVIC đã nhận đơn ứng tuyển của bạn.\nMã đơn: ${applicationId}\nBan đăng ký: ${department ? department.label : data.department}\nThời gian gửi: ${submitted}\n\nĐây là xác nhận tiếp nhận, chưa phải kết quả trúng tuyển.${contact}\n\nVIC — VKU IT Club`;
  const html = `<div style="font-family:Arial,sans-serif;color:#161616;line-height:1.7;max-width:600px"><div style="background:#161616;color:white;padding:20px 24px;border-radius:20px 20px 0 0"><strong style="color:#8ea8ff">VIC / VKU IT CLUB</strong><h1 style="font-size:24px;margin:8px 0 0">Đã nhận đơn ứng tuyển</h1></div><div style="border:1px solid #e5e7eb;border-top:0;padding:24px;border-radius:0 0 20px 20px"><p>Chào <strong>${html_(data.full_name)}</strong>,</p><p>VIC đã nhận đơn ứng tuyển của bạn.</p><p><strong>Mã đơn:</strong> ${html_(applicationId)}<br><strong>Ban đăng ký:</strong> ${html_(department ? department.label : data.department)}<br><strong>Thời gian gửi:</strong> ${html_(submitted)}</p><p style="background:#eaf0ff;padding:14px;border-radius:12px">Đây là xác nhận tiếp nhận, chưa phải kết quả trúng tuyển.</p>${config.contactEmail ? `<p>Nếu cần hỗ trợ, liên hệ ${html_(config.contactEmail)}.</p>` : ""}<p>VIC — VKU IT Club</p></div></div>`;
  return { to: normalizeEmail_(data.school_email), subject: "[VIC] Đã nhận đơn ứng tuyển của bạn", body: plain, htmlBody: html, name: "VIC — VKU IT Club" };
}

function saveEmailJobOutcome_(claim, outcome, error) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw apiError_("BUSY", "Hệ thống đang bận. Vui lòng thử lại sau.", 503);
  try {
    const context = createRequestContext_();
    const current = getTechnical_("email_job", claim.applicationId, context);
    const job = current ? JSON.parse(current.value || "{}") : null;
    if (!job || job.state !== "sending" || job.leaseId !== claim.leaseId) return false;
    const application = findApplication_(claim.applicationId, context);
    if (!application) throw apiError_("NOT_FOUND", "Không tìm thấy đơn.", 404);
    const now = Date.now();
    const message = String(error && error.message ? error.message : error || "").slice(0, 500);
    if (outcome === "sent") {
      job.state = "sent"; job.leaseId = ""; job.leaseUntil = ""; job.lastError = "";
      setApplicationCells_(application.row, { email_status: "sent", email_sent_at: new Date(now).toISOString(), email_error: "" }, context);
    } else if (outcome === "needs_review") {
      job.state = "needs_review"; job.leaseId = ""; job.leaseUntil = ""; job.lastError = message;
      setApplicationCells_(application.row, { email_status: "needs_review", email_error: "Không rõ email đã được gửi hay chưa. Kiểm tra hộp thư của VIC trước khi thử lại." }, context);
    } else {
      const retryIndex = job.attempts - 1;
      job.leaseId = ""; job.leaseUntil = ""; job.lastError = message;
      if (retryIndex < EMAIL_RETRY_DELAYS_MS.length) {
        job.state = "queued";
        job.nextAttemptAt = new Date(now + EMAIL_RETRY_DELAYS_MS[retryIndex]).toISOString();
        setApplicationCells_(application.row, { email_status: "pending", email_error: `Lỗi chuẩn bị email. Hệ thống sẽ thử lại (lần ${retryIndex + 1}/3).` }, context);
      } else {
        job.state = "failed";
        setApplicationCells_(application.row, { email_status: "failed", email_error: message || "Không thể chuẩn bị email sau ba lần thử lại." }, context);
      }
    }
    const retention = outcome === "needs_review" ? new Date(now + 365 * 86400000).toISOString() : new Date(now + EMAIL_JOB_RETENTION_MS).toISOString();
    setTechnicalBatch_([{ kind: "email_job", key: claim.applicationId, value: JSON.stringify(job), expiresAt: retention, meta: outcome }], context);
    return true;
  } finally { lock.releaseLock(); }
}

function markEmailSent_(claim) { return saveEmailJobOutcome_(claim, "sent", ""); }
function markEmailNeedsReview_(claim, error) { return saveEmailJobOutcome_(claim, "needs_review", error); }
function recordEmailBuildFailure_(claim, error) { return saveEmailJobOutcome_(claim, "retry_safe", error); }

function requireAdmin_(idToken) {
  if (!idToken) throw apiError_("UNAUTHORIZED", "Bạn cần đăng nhập tài khoản quản trị.", 401);
  const properties = PropertiesService.getScriptProperties();
  const clientId = properties.getProperty("GOOGLE_OAUTH_CLIENT_ID");
  const allowed = String(properties.getProperty("ADMIN_EMAILS") || "").split(",").map(function (email) { return normalizeEmail_(email); }).filter(Boolean);
  if (!clientId || !allowed.length) throw apiError_("ADMIN_NOT_CONFIGURED", "Xác thực quản trị chưa được cấu hình.", 503);
  const response = UrlFetchApp.fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`, { muteHttpExceptions: true });
  if (response.getResponseCode() !== 200) throw apiError_("UNAUTHORIZED", "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.", 401);
  const identity = JSON.parse(response.getContentText());
  const email = normalizeEmail_(identity.email);
  if (identity.aud !== clientId || String(identity.email_verified) !== "true" || allowed.indexOf(email) < 0) throw apiError_("FORBIDDEN", "Tài khoản này không có quyền quản trị.", 403);
  return { email: email, sub: identity.sub };
}

function readTableValues_(sheet, context, cacheKey) {
  if (context && cacheKey && context[cacheKey]) return context[cacheKey];
  const values = sheet.getDataRange().getValues();
  if (context && cacheKey) context[cacheKey] = values;
  return values;
}

function rowsAsObjects_(sheet, context, cacheKey) {
  const values = readTableValues_(sheet, context, cacheKey);
  if (values.length < 2) return [];
  const headers = values[0].map(function (item) { return String(item).trim(); });
  return values.slice(1).filter(function (row) { return row.some(function (cell) { return cell !== ""; }); }).map(function (row) { const object = {}; headers.forEach(function (header, index) { object[header] = row[index]; }); return object; });
}

function appendApplication_(record, context) {
  const sheet = getContextSheet_(context, SHEETS.applications);
  ensureHeaders_(sheet, APP_EXTRA_HEADERS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  sheet.appendRow(headers.map(function (header) { return safeCell_(record[header] == null ? "" : record[header]); }));
  if (context) context.applicationRows = null;
}

function findApplication_(applicationId, context) { return findApplicationBy_("application_id", applicationId, context); }
function findApplicationByIdempotency_(key, context) { return findApplicationBy_("idempotency_key", key, context); }
function findApplicationBy_(column, value, context) {
  const sheet = getContextSheet_(context, SHEETS.applications);
  ensureHeaders_(sheet, APP_EXTRA_HEADERS);
  const values = readTableValues_(sheet, context, "applicationRows");
  const headers = values[0].map(String); const index = headers.indexOf(column);
  if (index < 0) return null;
  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) if (String(values[rowIndex][index]) === value) { const data = {}; headers.forEach(function (header, i) { data[header] = values[rowIndex][i]; }); return { row: rowIndex + 1, data: data }; }
  return null;
}

function setApplicationCells_(rowNumber, updates, context) {
  const sheet = getContextSheet_(context, SHEETS.applications);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const row = sheet.getRange(rowNumber, 1, 1, headers.length);
  const values = row.getValues()[0];
  Object.keys(updates).forEach(function (key) { const index = headers.indexOf(key); if (index >= 0) values[index] = safeCell_(updates[key]); });
  row.setValues([values]);
  if (context && context.applicationRows) context.applicationRows[rowNumber - 1] = values;
}

function markEmailFailure_(applicationId, error, context) { const row = findApplication_(applicationId, context); if (row) setApplicationCells_(row.row, { email_status: "failed", email_error: String(error && error.message ? error.message : error).slice(0, 500) }, context); }

function findIdempotentResult_(key, requestHash, config, email, context) {
  const technical = getTechnical_("idempotency", key, context);
  const cooldownKey = hash_(normalizeEmail_(email));
  const cooldown = getTechnical_("cooldown", cooldownKey, context);
  let prior = null;
  let priorHash = "";
  let hasRequestFingerprint = false;
  if (technical && technical.value) {
    try {
      const parsed = JSON.parse(technical.value);
      if (parsed && parsed.result && parsed.requestHash) { prior = parsed.result; priorHash = String(parsed.requestHash); hasRequestFingerprint = true; }
      else if (parsed && parsed.applicationId) prior = parsed;
    } catch (ignore) {}
  }
  const application = findApplicationByIdempotency_(key, context);
  if (!prior && !application) return null;
  if (application && !priorHash) priorHash = fingerprintFromApplication_(application.data, config);
  if (!priorHash) throw apiError_("IDEMPOTENCY_KEY_CONFLICT", "Không thể xác nhận nội dung lần gửi trước. Vui lòng liên hệ VIC trước khi gửi đơn mới.", 409);
  if (priorHash !== requestHash) throw apiError_("IDEMPOTENCY_KEY_CONFLICT", "Mã gửi này đã được dùng cho nội dung khác. Hãy tải lại biểu mẫu rồi kiểm tra đơn đã nộp.", 409);
  if (application) prior = applicationResult_(application.data);

  const repairs = [];
  if (application && !hasRequestFingerprint) {
    repairs.push({ kind: "idempotency", key: key, value: JSON.stringify({ requestHash: requestHash, result: prior }), expiresAt: technical && technical.expiresAt ? technical.expiresAt : new Date(Date.now() + 7 * 86400000).toISOString(), meta: prior.applicationId });
  }
  if (application && !cooldown) {
    const expiresAt = new Date(new Date(application.data.submitted_at).getTime() + APPLICATION_COOLDOWN_MS).toISOString();
    if (new Date(expiresAt).getTime() > Date.now()) repairs.push({ kind: "cooldown", key: cooldownKey, value: String(application.data.application_id), expiresAt: expiresAt, meta: "recovered" });
  }
  const emailJob = application ? getTechnical_("email_job", String(application.data.application_id), context) : null;
  if (application && String(application.data.email_status || "pending") === "pending" && !emailJob) {
    repairs.push({ kind: "email_job", key: String(application.data.application_id), value: JSON.stringify(newEmailJob_(new Date(application.data.submitted_at))), expiresAt: new Date(Date.now() + EMAIL_JOB_RETENTION_MS).toISOString(), meta: "recovered" });
  }
  if (repairs.length) setTechnicalBatch_(repairs, context);
  return prior;
}

function applicationResult_(data) {
  const status = String(data.email_status || "pending");
  const message = status === "sent" ? "VIC đã nhận được đơn của bạn. Email xác nhận đã gửi."
    : status === "failed" ? "VIC đã nhận đơn. Email xác nhận cần được gửi lại qua trang quản trị."
      : status === "needs_review" ? "VIC đã nhận đơn. Email xác nhận cần được kiểm tra thủ công."
        : "VIC đã ghi nhận đơn. Email xác nhận đang được xếp hàng gửi.";
  return { applicationId: String(data.application_id), submittedAt: new Date(data.submitted_at).toISOString(), emailStatus: status, message: message, nextAllowedAt: new Date(new Date(data.submitted_at).getTime() + APPLICATION_COOLDOWN_MS).toISOString() };
}

function updateIdempotentResult_(key, result, requestHash, context) { const existing = getTechnical_("idempotency", key, context); setTechnicalBatch_([{ kind: "idempotency", key: key, value: JSON.stringify({ requestHash: requestHash, result: result }), expiresAt: existing ? existing.expiresAt : new Date(Date.now() + 7 * 86400000).toISOString(), meta: result.applicationId }], context); }

function applicationRequestHash_(formId, campaignId, formVersion, answers) {
  const normalized = {};
  Object.keys(answers || {}).sort().forEach(function (key) {
    let value = answers[key];
    if (key === "school_email") value = normalizeEmail_(value);
    if (value !== "" && value !== null && value !== undefined) normalized[key] = value;
  });
  return hash_(JSON.stringify({ formId: String(formId || ""), campaignId: String(campaignId || ""), formVersion: String(formVersion || ""), answers: normalized }));
}

function fingerprintFromApplication_(data, config) {
  try {
    const snapshot = JSON.parse(String(data.answers_snapshot || "{}")).answers || [];
    const answers = {};
    snapshot.forEach(function (item) { if (item.value !== "" && item.value !== null && item.value !== undefined) answers[item.fieldId] = item.value; });
    const formId = String(data.form_id || (config && config.formId) || "");
    if (!formId) return "";
    return applicationRequestHash_(formId, data.campaign_id, data.form_version, answers);
  } catch (ignore) { return ""; }
}

function getTechnical_(kind, key, context) {
  const targetKey = technicalKey_(kind, key);
  if (context) {
    if (!context.technicalMap) {
      const sheet = getContextSheet_(context, SHEETS.technical);
      const values = readTableValues_(sheet, context, "technicalRows");
      context.technicalMap = technicalMapFromRows_(values, values[0].map(function (item) { return String(item).trim(); }));
    }
    return context.technicalMap.get(targetKey) || null;
  }
  const sheet = getContextSheet_(null, SHEETS.technical);
  const rows = rowsAsObjects_(sheet);
  for (let i = rows.length - 1; i >= 0; i -= 1) if (String(rows[i].kind) === kind && String(rows[i].key) === key) return { value: String(rows[i].value || ""), expiresAt: new Date(rows[i].expires_at).toISOString(), meta: String(rows[i].meta || "") };
  return null;
}

function setTechnicalBatch_(items, context) {
  const sheet = getContextSheet_(context, SHEETS.technical);
  const now = new Date().toISOString();
  const headers = sheet.getRange(1, 1, 1, Math.max(TECH_HEADERS.length, sheet.getLastColumn())).getValues()[0].map(String);
  const indexes = { kind: headers.indexOf("kind"), key: headers.indexOf("key"), value: headers.indexOf("value"), expires_at: headers.indexOf("expires_at"), updated_at: headers.indexOf("updated_at"), meta: headers.indexOf("meta") };
  const cachedRows = context ? readTableValues_(sheet, context, "technicalRows") : sheet.getDataRange().getValues();
  const rowByKey = new Map();
  for (let i = 1; i < cachedRows.length; i += 1) rowByKey.set(technicalKey_(String(cachedRows[i][indexes.kind]), String(cachedRows[i][indexes.key])), i + 1);
  const append = [];
  items.forEach(function (item) {
    const row = new Array(headers.length).fill("");
    row[indexes.kind] = item.kind; row[indexes.key] = item.key; row[indexes.value] = safeCell_(item.value); row[indexes.expires_at] = item.expiresAt; row[indexes.updated_at] = now; row[indexes.meta] = safeCell_(item.meta || "");
    const target = rowByKey.get(technicalKey_(item.kind, item.key));
    if (target) { sheet.getRange(target, 1, 1, headers.length).setValues([row]); cachedRows[target - 1] = row; }
    else { rowByKey.set(technicalKey_(item.kind, item.key), cachedRows.length + append.length + 1); append.push(row); }
  });
  if (append.length) { sheet.getRange(sheet.getLastRow() + 1, 1, append.length, headers.length).setValues(append); cachedRows.push.apply(cachedRows, append); }
  if (context && context.technicalMap) items.forEach(function (item) {
    context.technicalMap.set(technicalKey_(item.kind, item.key), { value: String(item.value || ""), expiresAt: item.expiresAt, meta: String(item.meta || ""), row: rowByKey.get(technicalKey_(item.kind, item.key)) });
  });
}

function enforceBurstLimit_(key, now, context) {
  const burst = getTechnical_("burst", key, context);
  const active = burst && new Date(burst.expiresAt).getTime() > now.getTime();
  const count = active ? number_(burst.value, 0) : 0;
  if (count >= 5) throw apiError_("RATE_LIMIT", "Có quá nhiều yêu cầu. Vui lòng thử lại sau một phút.", 429);
  setTechnicalBatch_([{ kind: "burst", key: key, value: String(count + 1), expiresAt: active ? burst.expiresAt : new Date(now.getTime() + 60000).toISOString(), meta: "" }], context);
}

function writeConfigValues_(updates) {
  const sheet = requiredSheet_(SpreadsheetApp.openById(VIC_SHEET_ID), SHEETS.config);
  const values = sheet.getDataRange().getValues(); const headers = values[0].map(String); const keyIndex = headers.indexOf("key"); const valueIndex = headers.indexOf("value");
  Object.keys(updates).forEach(function (key) { for (let row = 1; row < values.length; row += 1) if (String(values[row][keyIndex]) === key) { sheet.getRange(row + 1, valueIndex + 1).setValue(safeCell_(updates[key])); return; } sheet.appendRow(headers.map(function (header) { return header === "key" ? key : header === "value" ? safeCell_(updates[key]) : ""; })); });
}

function writeFields_(fields) {
  const spreadsheet = SpreadsheetApp.openById(VIC_SHEET_ID);
  const sheet = requiredSheet_(spreadsheet, SHEETS.fields); const optionSheet = requiredSheet_(spreadsheet, SHEETS.options);
  upsertRows_(sheet, "field_id", fields.map(function (field) { return { field_id: field.fieldId, label: field.label, type: field.type, required: field.required ? "TRUE" : "FALSE", active: field.active ? "TRUE" : "FALSE", sort_order: field.sortOrder, section: field.section, help_text: field.helpText || "" }; }));
  const options = [];
  fields.forEach(function (field) { (field.options || []).forEach(function (option) { options.push({ field_id: field.fieldId, option_id: option.optionId, label: option.label, sort_order: option.sortOrder, active: option.active ? "TRUE" : "FALSE", info_url: option.infoUrl || "" }); }); });
  upsertRows_(optionSheet, ["field_id", "option_id"], options);
}

function upsertRows_(sheet, keyColumns, records) {
  const keys = Array.isArray(keyColumns) ? keyColumns : [keyColumns];
  const values = sheet.getDataRange().getValues(); const headers = values[0].map(String);
  records.forEach(function (record) {
    let target = -1;
    for (let row = 1; row < values.length; row += 1) if (keys.every(function (key) { return String(values[row][headers.indexOf(key)]) === String(record[key]); })) { target = row + 1; break; }
    const rowValues = headers.map(function (header) { return safeCell_(record[header] == null ? "" : record[header]); });
    if (target > 0) sheet.getRange(target, 1, 1, headers.length).setValues([rowValues]); else sheet.appendRow(rowValues);
  });
}

function requiredSheet_(spreadsheet, name) { const sheet = spreadsheet.getSheetByName(name); if (!sheet) throw apiError_("SHEET_MISSING", `Không tìm thấy tab ${name}.`, 500); return sheet; }
function ensureHeaders_(sheet, required) { const lastColumn = Math.max(1, sheet.getLastColumn()); const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(function (item) { return String(item).trim(); }); const missing = required.filter(function (header) { return headers.indexOf(header) < 0; }); if (missing.length) sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]); }
function json_(body) { return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON); }
function apiError_(code, message, status) { const error = new Error(message); error.code = code; error.status = status; error.expose = true; return error; }
function normalizeEmail_(value) { return String(value || "").trim().toLowerCase(); }
function allowedEmail_(value, allowed) { const email = normalizeEmail_(value); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false; const domain = email.slice(email.lastIndexOf("@") + 1); const wanted = String(allowed || "").toLowerCase(); return domain === wanted || domain.endsWith(`.${wanted}`); }
function validUrl_(value) { return /^https?:\/\/[^\s]+$/i.test(String(value || "").trim()); }
function normalizePortfolio_(value) { return String(value || "").split(/\r?\n/).map(function (item) { return item.trim(); }).filter(Boolean).join("\n"); }
function bool_(value) { return value === true || String(value).trim().toUpperCase() === "TRUE"; }
function number_(value, fallback) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : fallback; }
function sortOrder_(a, b) { return a.sortOrder - b.sortOrder; }
function safeCell_(value) { const text = String(value == null ? "" : value); return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text; }
function hash_(value) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8).map(function (byte) { return (`0${(byte + 256).toString(16)}`).slice(-2); }).join(""); }
function createApplicationId_(date) { return `VIC-${Utilities.formatDate(date, "Asia/Ho_Chi_Minh", "yyyyMMdd-HHmmss")}-${Utilities.getUuid().slice(0, 6).toUpperCase()}`; }
function html_(value) { return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
