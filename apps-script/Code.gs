/* global SpreadsheetApp, LockService, Utilities, UrlFetchApp, MailApp, PropertiesService, ContentService */

const VIC_SHEET_ID = "1CQiNWk2YZxKLlXA3asiB6K6ADqJSWwIFEymM156ol-A";
const SHEETS = { config: "CauHinh", fields: "TruongNhap", options: "LuaChon", applications: "DonUngTuyen", technical: "TrangThaiKyThuat" };
const APP_EXTRA_HEADERS = ["idempotency_key", "email_retry_count"];
const TECH_HEADERS = ["kind", "key", "value", "expires_at", "updated_at", "meta"];
const ADMIN_ACTIONS = ["adminGetForm", "adminListApplications", "adminPublishForm", "adminRetryEmail"];
const ALLOWED_TYPES = ["text", "textarea", "email", "url", "radio", "select", "checkbox"];
const MAX_TEXT_LENGTH = 5000;

function doGet() {
  return json_({ ok: true, data: { service: "VIC recruitment API", status: "ready" } });
}

function doPost(event) {
  try {
    const request = JSON.parse((event && event.postData && event.postData.contents) || "{}");
    const action = String(request.action || "");
    if (ADMIN_ACTIONS.indexOf(action) >= 0) requireAdmin_(request.idToken);
    if (action === "getForm") return json_({ ok: true, data: publicConfig_(readConfig_()) });
    if (action === "submitApplication") return json_({ ok: true, data: submitApplication_(request.payload || {}) });
    if (action === "adminGetForm") return json_({ ok: true, data: readConfig_() });
    if (action === "adminListApplications") return json_({ ok: true, data: listApplications_(request) });
    if (action === "adminPublishForm") return json_({ ok: true, data: publishForm_(request.config, request.expectedVersion) });
    if (action === "adminRetryEmail") return json_({ ok: true, data: retryEmail_(request.applicationId) });
    throw apiError_("UNKNOWN_ACTION", "Thao tác API không hợp lệ.", 400);
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return json_({ ok: false, error: { code: error.code || "INTERNAL_ERROR", message: error.expose ? error.message : "Máy chủ không thể xử lý yêu cầu.", status: error.status || 500, fieldErrors: error.fieldErrors || undefined, retryAfterSeconds: error.retryAfterSeconds || undefined, nextAllowedAt: error.nextAllowedAt || undefined, latestConfig: error.latestConfig || undefined } });
  }
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

function submitApplication_(payload) {
  if (String(payload.honeypot || "")) throw apiError_("SPAM_DETECTED", "Yêu cầu không hợp lệ.", 400);
  const idempotencyKey = String(payload.idempotencyKey || "").trim();
  if (!/^[a-zA-Z0-9-]{16,100}$/.test(idempotencyKey)) throw apiError_("INVALID_IDEMPOTENCY_KEY", "Mã chống gửi trùng không hợp lệ.", 400);
  verifyTurnstile_(String(payload.turnstileToken || ""));
  const answers = payload.answers && typeof payload.answers === "object" ? payload.answers : {};
  const email = normalizeEmail_(answers.school_email);
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw apiError_("BUSY", "Hệ thống đang bận. Vui lòng thử lại sau ít giây.", 503);
  let stored;
  try {
    initializeVicRecruitment();
    const prior = findIdempotentResult_(idempotencyKey);
    if (prior) return Object.assign({}, prior, { duplicate: true });
    const config = readConfig_();
    if (!config.isOpen) throw apiError_("FORM_CLOSED", config.closedMessage || "Đợt tuyển hiện đã đóng.", 409);
    if (String(payload.formId) !== config.formId || String(payload.campaignId) !== config.campaignId || String(payload.formVersion) !== config.formVersion) {
      const issue = apiError_("FORM_VERSION_CHANGED", "Biểu mẫu vừa được cập nhật. Hãy kiểm tra lại câu trả lời trước khi gửi.", 409);
      issue.latestConfig = publicConfig_(config);
      throw issue;
    }
    const fieldErrors = validateAnswers_(config, answers);
    if (Object.keys(fieldErrors).length) { const issue = apiError_("VALIDATION_ERROR", "Một số câu trả lời chưa hợp lệ.", 422); issue.fieldErrors = fieldErrors; throw issue; }
    const cooldownKey = hash_(email);
    const cooldown = getTechnical_("cooldown", cooldownKey);
    const now = new Date();
    if (cooldown && new Date(cooldown.expiresAt).getTime() > now.getTime()) {
      const seconds = Math.max(1, Math.ceil((new Date(cooldown.expiresAt).getTime() - now.getTime()) / 1000));
      const issue = apiError_("COOLDOWN", `Vui lòng chờ ${seconds} giây trước khi gửi lại.`, 429);
      issue.retryAfterSeconds = seconds; issue.nextAllowedAt = cooldown.expiresAt; throw issue;
    }
    enforceBurstLimit_(cooldownKey, now);
    const applicationId = createApplicationId_(now);
    const submittedAt = now.toISOString();
    const nextAllowedAt = new Date(now.getTime() + config.cooldownMinutes * 60000).toISOString();
    const snapshot = buildSnapshot_(config, answers);
    appendApplication_({ application_id: applicationId, submitted_at: submittedAt, campaign_id: config.campaignId, form_version: config.formVersion, school_email: email, student_id: String(answers.student_id || "").trim(), full_name: String(answers.full_name || "").trim(), class_name: String(answers.class_name || "").trim(), interests: answers.interests, motivation: answers.motivation, department: answers.department, weekly_time: answers.weekly_time, proud_of: answers.proud_of, portfolio_links: normalizePortfolio_(answers.portfolio_links), facebook_url: answers.facebook_url, message: answers.message, consent: answers.consent === true ? "TRUE" : "FALSE", email_status: "pending", email_sent_at: "", email_error: "", answers_snapshot: JSON.stringify({ formVersion: config.formVersion, answers: snapshot }), idempotency_key: idempotencyKey, email_retry_count: "0" });
    stored = { applicationId: applicationId, submittedAt: submittedAt, emailStatus: "pending", message: config.successMessage || "VIC đã nhận được đơn của bạn.", nextAllowedAt: nextAllowedAt };
    setTechnicalBatch_([
      { kind: "idempotency", key: idempotencyKey, value: JSON.stringify(stored), expiresAt: new Date(now.getTime() + 7 * 86400000).toISOString(), meta: applicationId },
      { kind: "cooldown", key: cooldownKey, value: applicationId, expiresAt: nextAllowedAt, meta: "" },
    ]);
  } finally { lock.releaseLock(); }

  try {
    sendConfirmationEmail_(stored.applicationId);
    stored.emailStatus = "sent";
    stored.message = stored.message || "VIC đã nhận được đơn của bạn.";
  } catch (emailError) {
    markEmailFailure_(stored.applicationId, emailError);
    stored.emailStatus = "failed";
    stored.message = `${stored.message} Email xác nhận đang chờ gửi lại; bạn không cần nộp thêm đơn.`;
  }
  updateIdempotentResult_(idempotencyKey, stored);
  return stored;
}

function readConfig_() {
  const spreadsheet = SpreadsheetApp.openById(VIC_SHEET_ID);
  const configRows = rowsAsObjects_(requiredSheet_(spreadsheet, SHEETS.config));
  const values = {};
  configRows.forEach(function (row) { values[String(row.key || "").trim()] = String(row.value == null ? "" : row.value).trim(); });
  const optionRows = rowsAsObjects_(requiredSheet_(spreadsheet, SHEETS.options));
  const optionsByField = {};
  optionRows.forEach(function (row) {
    const fieldId = String(row.field_id || "").trim();
    if (!optionsByField[fieldId]) optionsByField[fieldId] = [];
    optionsByField[fieldId].push({ fieldId: fieldId, optionId: String(row.option_id || "").trim(), label: String(row.label || ""), sortOrder: number_(row.sort_order, 999), active: bool_(row.active), infoUrl: String(row.info_url || "") || null });
  });
  const fields = rowsAsObjects_(requiredSheet_(spreadsheet, SHEETS.fields)).map(function (row) {
    const id = String(row.field_id || "").trim();
    return { fieldId: id, label: String(row.label || ""), type: String(row.type || "text"), required: bool_(row.required), active: bool_(row.active), sortOrder: number_(row.sort_order, 999), section: String(row.section || "Thông tin đăng ký"), helpText: String(row.help_text || "") || null, options: (optionsByField[id] || []).sort(sortOrder_), system: id === "school_email" || id === "consent" };
  }).filter(function (field) { return field.fieldId; }).sort(sortOrder_);
  return { formId: values.form_id, campaignId: values.campaign_id, formTitle: values.form_title, formDescription: values.form_description, isOpen: bool_(values.is_open), closedMessage: values.closed_message, successMessage: values.success_message, allowedEmailDomain: String(values.allowed_email_domain || "udn.vn").toLowerCase(), cooldownMinutes: number_(values.cooldown_minutes, 10), formVersion: String(values.form_version || "1"), contactEmail: values.contact_email || null, facebookUrl: values.facebook_url || null, fields: fields, source: "google-sheet" };
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
  const departmentField = config.fields.find(function (field) { return field.fieldId === "department"; });
  const mapped = rows.slice((page - 1) * pageSize, page * pageSize).map(function (row) {
    let snapshot = [];
    try { snapshot = JSON.parse(String(row.answers_snapshot || "{}")).answers || []; } catch (ignore) { snapshot = []; }
    const option = departmentField && departmentField.options.find(function (item) { return item.optionId === String(row.department); });
    return { applicationId: String(row.application_id), submittedAt: new Date(row.submitted_at).toISOString(), campaignId: String(row.campaign_id), formVersion: String(row.form_version), schoolEmail: String(row.school_email), studentId: String(row.student_id), fullName: String(row.full_name), department: String(row.department), departmentLabel: option ? option.label : String(row.department), emailStatus: String(row.email_status || "pending"), emailError: String(row.email_error || "") || null, answersSnapshot: snapshot };
  });
  return { applications: mapped, total: rows.length, page: page, pageSize: pageSize, sheetUrl: `https://docs.google.com/spreadsheets/d/${VIC_SHEET_ID}/edit` };
}

function retryEmail_(applicationId) {
  const row = findApplication_(String(applicationId || ""));
  if (!row) throw apiError_("NOT_FOUND", "Không tìm thấy đơn.", 404);
  if (String(row.data.email_status) === "sent") throw apiError_("ALREADY_SENT", "Email này đã được gửi.", 409);
  const retries = number_(row.data.email_retry_count, 0);
  if (retries >= 3) throw apiError_("RETRY_LIMIT", "Đã đạt giới hạn ba lần gửi lại.", 429);
  setApplicationCells_(row.row, { email_status: "pending", email_retry_count: String(retries + 1), email_error: "" });
  try { sendConfirmationEmail_(applicationId); return { status: "sent" }; }
  catch (error) { markEmailFailure_(applicationId, error); return { status: "failed" }; }
}

function sendConfirmationEmail_(applicationId) {
  const row = findApplication_(applicationId);
  if (!row) throw new Error("Không tìm thấy đơn để gửi email.");
  const data = row.data;
  const config = readConfig_();
  const departmentField = config.fields.find(function (field) { return field.fieldId === "department"; });
  const department = departmentField && departmentField.options.find(function (item) { return item.optionId === String(data.department); });
  const submitted = Utilities.formatDate(new Date(data.submitted_at), "Asia/Ho_Chi_Minh", "HH:mm dd/MM/yyyy");
  const contact = config.contactEmail ? ` Nếu cần hỗ trợ, liên hệ ${config.contactEmail}.` : "";
  const plain = `Chào ${data.full_name},\n\nVIC đã nhận đơn ứng tuyển của bạn.\nMã đơn: ${applicationId}\nBan đăng ký: ${department ? department.label : data.department}\nThời gian gửi: ${submitted}\n\nĐây là xác nhận tiếp nhận, chưa phải kết quả trúng tuyển.${contact}\n\nVIC — VKU IT Club`;
  const html = `<div style="font-family:Arial,sans-serif;color:#161616;line-height:1.7;max-width:600px"><div style="background:#161616;color:white;padding:20px 24px;border-radius:20px 20px 0 0"><strong style="color:#8ea8ff">VIC / VKU IT CLUB</strong><h1 style="font-size:24px;margin:8px 0 0">Đã nhận đơn ứng tuyển</h1></div><div style="border:1px solid #e5e7eb;border-top:0;padding:24px;border-radius:0 0 20px 20px"><p>Chào <strong>${html_(data.full_name)}</strong>,</p><p>VIC đã nhận đơn ứng tuyển của bạn.</p><p><strong>Mã đơn:</strong> ${html_(applicationId)}<br><strong>Ban đăng ký:</strong> ${html_(department ? department.label : data.department)}<br><strong>Thời gian gửi:</strong> ${html_(submitted)}</p><p style="background:#eaf0ff;padding:14px;border-radius:12px">Đây là xác nhận tiếp nhận, chưa phải kết quả trúng tuyển.</p>${config.contactEmail ? `<p>Nếu cần hỗ trợ, liên hệ ${html_(config.contactEmail)}.</p>` : ""}<p>VIC — VKU IT Club</p></div></div>`;
  MailApp.sendEmail({ to: normalizeEmail_(data.school_email), subject: "[VIC] Đã nhận đơn ứng tuyển của bạn", body: plain, htmlBody: html, name: "VIC — VKU IT Club" });
  setApplicationCells_(row.row, { email_status: "sent", email_sent_at: new Date().toISOString(), email_error: "" });
}

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

function verifyTurnstile_(token) {
  const secret = PropertiesService.getScriptProperties().getProperty("TURNSTILE_SECRET_KEY");
  if (!secret) return;
  if (!token) throw apiError_("TURNSTILE_REQUIRED", "Vui lòng hoàn thành bước xác minh chống bot.", 422);
  const response = UrlFetchApp.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "post", payload: { secret: secret, response: token }, muteHttpExceptions: true });
  const result = JSON.parse(response.getContentText() || "{}");
  if (!result.success) throw apiError_("TURNSTILE_FAILED", "Không thể xác minh chống bot. Vui lòng thử lại.", 422);
}

function rowsAsObjects_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(function (item) { return String(item).trim(); });
  return values.slice(1).filter(function (row) { return row.some(function (cell) { return cell !== ""; }); }).map(function (row) { const object = {}; headers.forEach(function (header, index) { object[header] = row[index]; }); return object; });
}

function appendApplication_(record) {
  const sheet = requiredSheet_(SpreadsheetApp.openById(VIC_SHEET_ID), SHEETS.applications);
  ensureHeaders_(sheet, APP_EXTRA_HEADERS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  sheet.appendRow(headers.map(function (header) { return safeCell_(record[header] == null ? "" : record[header]); }));
}

function findApplication_(applicationId) { return findApplicationBy_("application_id", applicationId); }
function findApplicationByIdempotency_(key) { return findApplicationBy_("idempotency_key", key); }
function findApplicationBy_(column, value) {
  const sheet = requiredSheet_(SpreadsheetApp.openById(VIC_SHEET_ID), SHEETS.applications);
  ensureHeaders_(sheet, APP_EXTRA_HEADERS);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String); const index = headers.indexOf(column);
  if (index < 0) return null;
  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) if (String(values[rowIndex][index]) === value) { const data = {}; headers.forEach(function (header, i) { data[header] = values[rowIndex][i]; }); return { row: rowIndex + 1, data: data }; }
  return null;
}

function setApplicationCells_(rowNumber, updates) {
  const sheet = requiredSheet_(SpreadsheetApp.openById(VIC_SHEET_ID), SHEETS.applications);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  Object.keys(updates).forEach(function (key) { const index = headers.indexOf(key); if (index >= 0) sheet.getRange(rowNumber, index + 1).setValue(safeCell_(updates[key])); });
}

function markEmailFailure_(applicationId, error) { const row = findApplication_(applicationId); if (row) setApplicationCells_(row.row, { email_status: "failed", email_error: String(error && error.message ? error.message : error).slice(0, 500) }); }

function findIdempotentResult_(key) {
  const technical = getTechnical_("idempotency", key);
  if (technical && technical.value) { try { return JSON.parse(technical.value); } catch (ignore) {} }
  const application = findApplicationByIdempotency_(key);
  if (!application) return null;
  const data = application.data;
  return { applicationId: String(data.application_id), submittedAt: new Date(data.submitted_at).toISOString(), emailStatus: String(data.email_status || "pending"), message: "VIC đã nhận được đơn của bạn.", nextAllowedAt: new Date(new Date(data.submitted_at).getTime() + 600000).toISOString() };
}

function updateIdempotentResult_(key, result) { const existing = getTechnical_("idempotency", key); setTechnicalBatch_([{ kind: "idempotency", key: key, value: JSON.stringify(result), expiresAt: existing ? existing.expiresAt : new Date(Date.now() + 7 * 86400000).toISOString(), meta: result.applicationId }]); }

function getTechnical_(kind, key) {
  const sheet = requiredSheet_(SpreadsheetApp.openById(VIC_SHEET_ID), SHEETS.technical);
  const rows = rowsAsObjects_(sheet);
  for (let i = rows.length - 1; i >= 0; i -= 1) if (String(rows[i].kind) === kind && String(rows[i].key) === key) return { value: String(rows[i].value || ""), expiresAt: new Date(rows[i].expires_at).toISOString(), meta: String(rows[i].meta || "") };
  return null;
}

function setTechnicalBatch_(items) {
  const sheet = requiredSheet_(SpreadsheetApp.openById(VIC_SHEET_ID), SHEETS.technical);
  const now = new Date().toISOString();
  const rows = items.map(function (item) { return [item.kind, item.key, safeCell_(item.value), item.expiresAt, now, safeCell_(item.meta || "")]; });
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, TECH_HEADERS.length).setValues(rows);
}

function enforceBurstLimit_(key, now) {
  const burst = getTechnical_("burst", key);
  const active = burst && new Date(burst.expiresAt).getTime() > now.getTime();
  const count = active ? number_(burst.value, 0) : 0;
  if (count >= 5) throw apiError_("RATE_LIMIT", "Có quá nhiều yêu cầu. Vui lòng thử lại sau một phút.", 429);
  setTechnicalBatch_([{ kind: "burst", key: key, value: String(count + 1), expiresAt: active ? burst.expiresAt : new Date(now.getTime() + 60000).toISOString(), meta: "" }]);
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
