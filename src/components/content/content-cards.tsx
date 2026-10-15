import { ArrowUpRight, CalendarDays, FileQuestion, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Activity, Article, Member, Project } from "../../types/content-model";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";

export function DemoBadge({ children = "Minh họa" }: { children?: ReactNode }) {
  return <Badge className="border-vic-blue/20 bg-vic-blue-soft text-vic-blue">{children}</Badge>;
}

export function ContentVisual({ variant, label, className }: { variant: string; label?: string; className?: string }) {
  const style = variant.toLowerCase();
  return <div className={cn("relative isolate h-52 overflow-hidden bg-[#e8ebf1]", className)} aria-hidden="true">
    <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(22,22,22,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(22,22,22,.08)_1px,transparent_1px)] [background-size:32px_32px]" />
    {style.includes("game") ? <><i className="absolute left-[18%] top-[28%] size-12 rotate-45 border border-vic-ink/40" /><i className="absolute right-[20%] top-[20%] size-20 rotate-45 bg-vic-blue shadow-[0_0_55px_rgba(36,87,245,.35)]" /><i className="absolute bottom-[8%] left-[45%] size-24 rotate-45 border border-vic-ink/25" /></> : style.includes("media") || style.includes("truyền") || style.includes("thiết") ? <><span className="absolute left-[12%] top-[18%] h-[64%] w-[38%] rounded-[1.5rem] bg-vic-ink" /><span className="absolute right-[12%] top-[27%] h-[46%] w-[42%] rounded-[1.5rem] bg-vic-blue" /><span className="absolute left-[31%] top-[39%] z-10 size-16 rounded-full border-[10px] border-white" /></> : <div className="absolute left-1/2 top-1/2 grid h-[58%] w-[72%] -translate-x-1/2 -translate-y-1/2 grid-cols-[.42fr_1fr] gap-3 rounded-[1.4rem] bg-white p-4 shadow-[0_22px_45px_rgba(22,22,22,.13)]"><span className="rounded-xl bg-vic-blue-soft" /><span className="rounded-xl bg-vic-blue" /></div>}
    {label && <span className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1 font-mono text-[.65rem] font-semibold backdrop-blur">{label}</span>}
  </div>;
}

const statusLabel = (status: Activity["status"]) => status === "upcoming" ? "Mẫu sắp diễn ra" : status === "recap" ? "Mẫu recap" : "Chưa có lịch";

export function ActivityCard({ activity }: { activity: Activity }) {
  return <Link to={`/hoat-dong/${activity.slug}`} className="glass-surface interactive-card group flex h-full flex-col overflow-hidden rounded-[2rem] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vic-blue/25">
    <ContentVisual variant={activity.category} label="HOẠT ĐỘNG MINH HỌA" />
    <div className="flex flex-1 flex-col p-6"><div className="mb-4 flex flex-wrap gap-2"><DemoBadge>Hoạt động minh họa</DemoBadge><Badge>{statusLabel(activity.status)}</Badge></div><p className="mb-2 font-mono text-[.68rem] font-semibold text-vic-blue">{activity.category} / {activity.type}</p><h3 className="text-xl font-semibold leading-snug tracking-[-.03em]">{activity.title}</h3><p className="mt-3 flex-1 text-sm leading-7 text-vic-muted">{activity.summary}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">Xem bố cục chi tiết <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span></div>
  </Link>;
}

export function ProjectCard({ project }: { project: Project }) {
  return <Link to={`/san-pham/${project.slug}`} className="glass-surface interactive-card group flex h-full flex-col overflow-hidden rounded-[2rem] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vic-blue/25">
    <ContentVisual variant={project.category} label="SẢN PHẨM MINH HỌA" />
    <div className="flex flex-1 flex-col p-6"><div className="mb-4 flex flex-wrap gap-2"><DemoBadge>Sản phẩm minh họa</DemoBadge><Badge>{project.scope}</Badge></div><p className="mb-2 font-mono text-[.68rem] font-semibold text-vic-blue">{project.category}</p><h3 className="text-xl font-semibold tracking-[-.03em]">{project.title}</h3><p className="mt-3 flex-1 text-sm leading-7 text-vic-muted">{project.summary}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">Khám phá sản phẩm <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span></div>
  </Link>;
}

export function ArticleCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  return <Link to={`/hoc-thuat/${article.slug}`} className={cn("group flex h-full flex-col border-t border-black/10 py-6 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vic-blue/20", !compact && "rounded-[1.5rem] border border-black/10 bg-white p-6")}>
    <div className="mb-4 flex flex-wrap items-center gap-2"><DemoBadge>Bài viết mẫu</DemoBadge><Badge>{article.topic}</Badge></div><h3 className="text-xl font-semibold leading-snug tracking-[-.03em] group-hover:text-vic-blue">{article.title}</h3><p className="mt-3 flex-1 text-sm leading-7 text-vic-muted">{article.summary}</p><div className="mt-5 flex items-center justify-between gap-4 text-xs text-vic-muted"><span>{article.publishedAt ?? "Chưa cập nhật ngày"}</span><span className="inline-flex items-center gap-1.5 font-semibold text-vic-ink">Đọc bài <ArrowUpRight size={14} /></span></div>
  </Link>;
}

export function MemberCard({ member }: { member: Member }) {
  return <Link to={`/thanh-vien/${member.slug}`} className="glass-surface interactive-card group rounded-[2rem] p-6 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vic-blue/25"><div className="mb-6 grid size-20 place-items-center rounded-[1.5rem] bg-vic-blue-soft text-vic-blue"><UserRound size={32} /></div><DemoBadge>Dữ liệu minh họa</DemoBadge><h3 className="mt-4 text-xl font-semibold tracking-[-.03em]">{member.name}</h3><p className="mt-1 text-sm font-medium text-vic-blue">{member.role}</p><p className="mt-3 text-sm leading-7 text-vic-muted">{member.summary}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">Xem hồ sơ & portfolio <ArrowUpRight size={15} /></span></Link>;
}

export function EmptyState({ title = "Chưa tìm thấy nội dung", description, action }: { title?: string; description: string; action?: ReactNode }) {
  return <div className="rounded-[2rem] border border-dashed border-black/20 bg-white/55 px-6 py-14 text-center"><FileQuestion className="mx-auto text-vic-blue" /><h3 className="mt-5 text-xl font-semibold">{title}</h3><p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-vic-muted">{description}</p>{action && <div className="mt-6">{action}</div>}</div>;
}

export function DateMeta({ value }: { value: string | null }) {
  return <span className="inline-flex items-center gap-2 text-sm text-vic-muted"><CalendarDays size={16} />{value ?? "Ngày sẽ được cập nhật"}</span>;
}
