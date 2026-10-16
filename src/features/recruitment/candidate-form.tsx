import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, ExternalLink, LoaderCircle, RefreshCw, Send } from "lucide-react";
import { Button } from "../../components/ui/button";
import { fetchRecruitmentForm, submitRecruitmentApplication } from "./api";
import { hasRecruitmentApi } from "./config";
import type { ApiFailure, FieldErrorMap, RecruitmentAnswers, RecruitmentField, RecruitmentFormConfig, SubmitApplicationResult } from "./types";
import { isSafeInfoUrl, normalizeEmail, validateRecruitmentAnswers } from "./validation";
import { TurnstileChallenge } from "./turnstile";

const COOLDOWN_STORAGE_KEY = "vic_recruitment_next_allowed_at";

function textInputClass(hasError: boolean) {
  return `min-h-12 w-full rounded-2xl border bg-white/85 px-4 text-base text-vic-ink shadow-sm outline-none transition focus:border-vic-blue focus:ring-4 focus:ring-vic-blue/10 ${hasError ? "border-red-500" : "border-black/10"}`;
}

function FieldMessage({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return <p id={id} className="mt-2 text-sm font-medium text-red-700">{children}</p>;
}

function DynamicField({ field, value, error, onChange }: { field: RecruitmentField; value: string | boolean | undefined; error?: string; onChange: (value: string | boolean) => void }) {
  const describedBy = `${field.fieldId}-help ${field.fieldId}-error`;
  const common = { id: `field-${field.fieldId}`, name: field.fieldId, "aria-invalid": Boolean(error), "aria-describedby": describedBy } as const;
  return <div className="scroll-mt-32">
    {field.type !== "checkbox" && <label htmlFor={field.type === "radio" ? undefined : `field-${field.fieldId}`} className="block text-base font-semibold leading-7">
      {field.label} {field.required && <span className="text-vic-blue" aria-label="bắt buộc">*</span>}
    </label>}
    {field.helpText && <p id={`${field.fieldId}-help`} className="mt-1.5 text-sm leading-6 text-vic-muted">{field.helpText}</p>}
    <div className="mt-3">
      {field.type === "textarea" && <textarea {...common} rows={field.fieldId === "portfolio_links" ? 3 : 5} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className={`${textInputClass(Boolean(error))} resize-y py-3`} />}
      {(field.type === "text" || field.type === "email" || field.type === "url") && <input {...common} type={field.type} inputMode={field.type === "email" ? "email" : field.type === "url" ? "url" : undefined} autoComplete={field.fieldId === "school_email" ? "email" : field.fieldId === "full_name" ? "name" : "off"} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className={textInputClass(Boolean(error))} />}
      {field.type === "select" && <select {...common} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className={textInputClass(Boolean(error))}>
        <option value="">Chọn một phương án</option>
        {field.options.filter((option) => option.active).sort((a, b) => a.sortOrder - b.sortOrder).map((option) => <option key={option.optionId} value={option.optionId}>{option.label}</option>)}
      </select>}
      {field.type === "radio" && <fieldset id={`field-${field.fieldId}`} tabIndex={-1} aria-invalid={Boolean(error)} aria-describedby={describedBy} className="space-y-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-vic-blue/10">
        <legend className="sr-only">{field.label}</legend>
        {field.options.filter((option) => option.active).sort((a, b) => a.sortOrder - b.sortOrder).map((option) => <label key={option.optionId} className={`flex cursor-pointer items-center gap-3 rounded-2xl border bg-white/80 p-4 transition hover:border-vic-blue/40 ${value === option.optionId ? "border-vic-blue ring-4 ring-vic-blue/10" : "border-black/10"}`}>
          <input type="radio" name={field.fieldId} value={option.optionId} checked={value === option.optionId} onChange={() => onChange(option.optionId)} className="size-4 accent-vic-blue" />
          <span className="flex-1 font-medium">{option.label}</span>
          {isSafeInfoUrl(option.infoUrl) && <a href={option.infoUrl!} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold text-vic-blue hover:bg-vic-blue-soft" aria-label={`Tìm hiểu ${option.label}`}>ⓘ Tìm hiểu ban <ExternalLink size={13} /></a>}
        </label>)}
      </fieldset>}
      {field.type === "checkbox" && <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border bg-white/80 p-4 ${error ? "border-red-500" : "border-black/10"}`}>
        <input {...common} type="checkbox" checked={value === true} onChange={(event) => onChange(event.target.checked)} className="mt-1 size-4 accent-vic-blue" />
        <span className="text-sm leading-6">{field.label} {field.required && <span className="text-vic-blue" aria-label="bắt buộc">*</span>}</span>
      </label>}
    </div>
    <FieldMessage id={`${field.fieldId}-error`}>{error}</FieldMessage>
  </div>;
}

function useCountdown(nextAllowedAt: string | null) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const update = () => setSeconds(nextAllowedAt ? Math.max(0, Math.ceil((new Date(nextAllowedAt).getTime() - Date.now()) / 1000)) : 0);
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [nextAllowedAt]);
  return seconds;
}

function formatCountdown(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function CandidateForm() {
  const [config, setConfig] = useState<RecruitmentFormConfig | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<RecruitmentAnswers>({});
  const [errors, setErrors] = useState<FieldErrorMap>({});
  const [reviewing, setReviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<SubmitApplicationResult | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [nextAllowedAt, setNextAllowedAt] = useState<string | null>(() => sessionStorage.getItem(COOLDOWN_STORAGE_KEY));
  const idempotencyKey = useRef(crypto.randomUUID());
  const honeypot = useRef<HTMLInputElement>(null);
  const secondsRemaining = useCountdown(nextAllowedAt);
  const dirty = Object.values(answers).some((value) => value !== "" && value !== false);

  const load = async () => {
    setLoading(true); setLoadError("");
    try { setConfig(await fetchRecruitmentForm()); }
    catch (error) { setLoadError(error instanceof Error ? error.message : "Không thể tải biểu mẫu."); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty && !result) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, result]);

  const activeFields = useMemo(() => config?.fields.filter((field) => field.active).sort((a, b) => a.sortOrder - b.sortOrder) ?? [], [config]);
  const sections = useMemo(() => Array.from(new Set(activeFields.map((field) => field.section || "Thông tin đăng ký"))), [activeFields]);

  const focusFirstError = (nextErrors: FieldErrorMap) => {
    const first = activeFields.find((field) => nextErrors[field.fieldId]);
    window.setTimeout(() => document.getElementById(`field-${first?.fieldId}`)?.focus(), 0);
  };

  const beginReview = () => {
    if (!config) return;
    const normalized = { ...answers, school_email: normalizeEmail(String(answers.school_email ?? "")) };
    setAnswers(normalized);
    const nextErrors = validateRecruitmentAnswers(config, normalized);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { focusFirstError(nextErrors); return; }
    setReviewing(true); window.scrollTo({ top: document.getElementById("application-form")?.offsetTop ?? 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!config || submitting || secondsRemaining > 0) return;
    setSubmitting(true); setSubmitError("");
    try {
      const response = await submitRecruitmentApplication({ formId: config.formId, campaignId: config.campaignId, formVersion: config.formVersion, idempotencyKey: idempotencyKey.current, answers, honeypot: honeypot.current?.value ?? "", turnstileToken });
      setResult(response); setNextAllowedAt(response.nextAllowedAt); sessionStorage.setItem(COOLDOWN_STORAGE_KEY, response.nextAllowedAt); idempotencyKey.current = crypto.randomUUID();
    } catch (error) {
      const failure = error as ApiFailure;
      if (failure.fieldErrors) { setErrors(failure.fieldErrors); setReviewing(false); focusFirstError(failure.fieldErrors); }
      if (failure.nextAllowedAt) { setNextAllowedAt(failure.nextAllowedAt); sessionStorage.setItem(COOLDOWN_STORAGE_KEY, failure.nextAllowedAt); }
      if (failure.code === "FORM_VERSION_CHANGED" && failure.latestConfig) { setConfig(failure.latestConfig); setReviewing(false); }
      setSubmitError(failure.message || "Không thể gửi đơn. Câu trả lời của bạn vẫn được giữ lại.");
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="glass-surface flex min-h-72 items-center justify-center rounded-[2rem]" role="status"><LoaderCircle className="animate-spin text-vic-blue" /><span className="ml-3 font-semibold">Đang tải biểu mẫu…</span></div>;
  if (loadError || !config) return <div className="glass-surface rounded-[2rem] p-8 text-center"><AlertCircle className="mx-auto text-red-600" /><h2 className="mt-4 text-xl font-semibold">Không thể tải biểu mẫu</h2><p className="mt-2 text-vic-muted">{loadError}</p><Button className="mt-6" onClick={load}><RefreshCw size={16} /> Thử lại</Button></div>;

  if (!config.isOpen) return <div className="glass-surface rounded-[2rem] p-8 md:p-12"><span className="inline-flex rounded-full bg-vic-surface px-3 py-1 font-mono text-xs font-semibold">HIỆN ĐANG ĐÓNG</span><h2 className="mt-6 text-3xl font-bold tracking-[-.04em]">{config.formTitle}</h2><p className="mt-4 max-w-2xl leading-7 text-vic-muted">{config.closedMessage}</p>{config.contactEmail && <a className="mt-6 inline-flex font-semibold text-vic-blue" href={`mailto:${config.contactEmail}`}>Liên hệ {config.contactEmail}</a>}{config.facebookUrl && <a className="ml-5 mt-6 inline-flex font-semibold text-vic-blue" href={config.facebookUrl} target="_blank" rel="noreferrer">Facebook VIC</a>}{config.source === "prototype" && <p className="mt-8 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">Website chưa kết nối Google Sheet. Đây là trạng thái an toàn mặc định, không phải trạng thái đọc trực tiếp từ Sheet.</p>}</div>;

  if (result) return <div className="glass-surface rounded-[2rem] p-8 md:p-12" role="status"><CheckCircle2 className="text-vic-blue" size={42} /><h2 className="mt-6 text-3xl font-bold tracking-[-.04em]">{config.successMessage}</h2><p className="mt-4 leading-7 text-vic-muted">{result.message}</p><dl className="mt-7 grid gap-4 rounded-2xl bg-white/75 p-5 sm:grid-cols-2"><div><dt className="text-xs font-semibold uppercase tracking-wider text-vic-muted">Mã đơn</dt><dd className="mt-1 font-mono font-semibold">{result.applicationId}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-wider text-vic-muted">Email xác nhận</dt><dd className="mt-1 font-semibold">{result.emailStatus === "sent" ? "Đã gửi" : "Đang chờ xử lý"}</dd></div></dl>{secondsRemaining > 0 && <p className="mt-6 text-sm text-vic-muted">Có thể gửi lại sau <strong className="font-mono text-vic-ink">{formatCountdown(secondsRemaining)}</strong>. Backend vẫn là nguồn quyết định thời gian.</p>}</div>;

  return <div id="application-form" className="glass-surface rounded-[2rem] p-5 md:p-10">
    {!hasRecruitmentApi && <div className="mb-7 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Chế độ prototype local:</strong> lần gửi thử không ghi vào Google Sheet và không gửi email thật.</div>}
    <div className="border-b border-black/10 pb-7"><p className="font-mono text-xs font-semibold text-vic-blue">FORM / PHIÊN BẢN {config.formVersion}</p><h2 className="mt-3 text-3xl font-bold tracking-[-.04em]">{config.formTitle}</h2><p className="mt-3 leading-7 text-vic-muted">{config.formDescription}</p></div>
    <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px]" aria-hidden="true" />
    {!reviewing ? <form className="mt-9 space-y-11" onSubmit={(event) => { event.preventDefault(); beginReview(); }} noValidate>
      {sections.map((section, sectionIndex) => <fieldset key={section} className="space-y-7"><legend className="mb-2 flex w-full items-center gap-3 font-mono text-xs font-semibold tracking-wider text-vic-blue"><span>{String(sectionIndex + 1).padStart(2, "0")}</span><span className="h-px flex-1 bg-vic-blue/20" /><span>{section.toUpperCase()}</span></legend>{activeFields.filter((field) => (field.section || "Thông tin đăng ký") === section).map((field) => <DynamicField key={field.fieldId} field={field} value={answers[field.fieldId]} error={errors[field.fieldId]} onChange={(value) => { setAnswers((current) => ({ ...current, [field.fieldId]: value })); setErrors((current) => ({ ...current, [field.fieldId]: "" })); }} />)}</fieldset>)}
      {submitError && <p className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-800" role="alert">{submitError}</p>}
      <Button type="submit" className="w-full sm:w-auto">Xem lại thông tin <ArrowRight size={17} /></Button>
    </form> : <div className="mt-9">
      <div className="flex items-center gap-3 text-vic-blue"><Check size={18} /><p className="font-mono text-xs font-semibold">BƯỚC XÁC NHẬN</p></div><h3 className="mt-3 text-2xl font-bold">Kiểm tra trước khi gửi</h3><p className="mt-2 text-sm leading-6 text-vic-muted">Hãy kiểm tra kỹ email và ban đăng ký. Bạn có thể quay lại mà không mất nội dung.</p>
      <dl className="mt-7 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white/75 px-5">{activeFields.map((field) => { const raw = answers[field.fieldId]; const option = field.options.find((item) => item.optionId === raw); return <div key={field.fieldId} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr]"><dt className="text-sm font-semibold text-vic-muted">{field.label}</dt><dd className="break-words text-sm font-medium">{field.type === "checkbox" ? (raw ? "Đã đồng ý" : "Chưa đồng ý") : option?.label ?? String(raw || "—")}</dd></div>; })}</dl>
      {submitError && <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-800" role="alert">{submitError}</p>}
      {secondsRemaining > 0 && <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">Vui lòng chờ <strong className="font-mono">{formatCountdown(secondsRemaining)}</strong> trước khi gửi đơn tiếp theo.</p>}
      <div className="mt-6"><TurnstileChallenge onToken={setTurnstileToken} /></div>
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row"><Button variant="secondary" onClick={() => setReviewing(false)}><ArrowLeft size={17} /> Quay lại chỉnh sửa</Button><Button onClick={submit} disabled={submitting || secondsRemaining > 0}>{submitting ? <LoaderCircle className="animate-spin" size={17} /> : <Send size={17} />} {submitting ? "Đang gửi…" : "Gửi đơn ứng tuyển"}</Button></div>
    </div>}
  </div>;
}
