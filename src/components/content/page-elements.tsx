import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

export function PageHeader({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description: string; children?: ReactNode }) {
  return <header className="relative overflow-hidden bg-vic-surface pb-20 pt-40 md:pb-24 md:pt-44"><div className="gradient-orb pointer-events-none absolute -right-36 top-16 size-[26rem] rounded-full opacity-[.08]" /><div className="page-container relative"><p className="section-label">{eyebrow}</p><h1 className="max-w-5xl text-[clamp(2.8rem,7vw,6rem)] font-extrabold leading-[1.06] tracking-[-.06em] text-balance">{title}</h1><p className="section-intro max-w-2xl">{description}</p>{children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}</div></header>;
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-xs text-vic-muted"><Link to="/" className="hover:text-vic-blue">Trang chủ</Link>{items.map((item) => <span key={item.label} className="inline-flex items-center gap-2"><ChevronRight size={13} />{item.to ? <Link to={item.to} className="hover:text-vic-blue">{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}</nav>;
}

export function FilterChips<T extends string>({ values, active, onChange, label = "Bộ lọc" }: { values: readonly T[]; active: T; onChange: (value: T) => void; label?: string }) {
  return <div className="flex flex-wrap gap-2" aria-label={label}>{values.map((value) => <button type="button" key={value} aria-pressed={active === value} onClick={() => onChange(value)} className={cn("min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors", active === value ? "border-vic-blue bg-vic-blue text-white" : "border-black/10 bg-white hover:border-vic-blue/35 hover:text-vic-blue")}>{value}</button>)}</div>;
}
