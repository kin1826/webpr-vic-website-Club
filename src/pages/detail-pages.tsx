import { Check, Copy, ExternalLink, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ActivityCard, ArticleCard, ContentVisual, DateMeta, DemoBadge, ProjectCard } from "../components/content/content-cards";
import { Breadcrumb } from "../components/content/page-elements";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { activities, articles, departments, getActivityBySlug, getArticleBySlug, getMember, getMemberBySlug, getProjectBySlug, members, projects } from "../data/site-data";
import type { ArticleBlock } from "../types/content-model";
import { NotFoundPage } from "./not-found-page";

export function ActivityDetailPage() {
  const { slug = "" } = useParams();
  const activity = getActivityBySlug(slug);
  if (!activity) return <NotFoundPage embedded />;
  const relatedArticles = articles.filter((item) => activity.relatedArticleIds.includes(item.id));
  const relatedProjects = projects.filter((item) => activity.relatedProjectIds.includes(item.id));
  return <main id="main" className="pb-24 pt-36"><div className="page-container"><Breadcrumb items={[{ label: "Hoạt động", to: "/hoat-dong" }, { label: activity.title }]} /><div className="max-w-4xl"><div className="flex flex-wrap gap-2"><DemoBadge>Hoạt động minh họa</DemoBadge><Badge>{activity.category}</Badge><Badge>{activity.status === "recap" ? "Mẫu recap" : activity.status === "upcoming" ? "Mẫu sắp diễn ra" : "Chưa có lịch"}</Badge></div><h1 className="mt-6 text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[1.08] tracking-[-.055em]">{activity.title}</h1><p className="section-intro">{activity.summary}</p><div className="mt-6"><DateMeta value={activity.date} /></div></div><ContentVisual variant={activity.category} label="VISUAL MINH HỌA" className="mt-12 h-[clamp(18rem,48vw,36rem)] rounded-[2.5rem]" />
      <div className="mx-auto mt-14 max-w-3xl"><p className="mb-7 rounded-2xl bg-vic-blue-soft p-4 text-sm leading-7 text-[#193baf]">Trang này dùng để đánh giá bố cục chi tiết. Đây không phải thông báo một hoạt động thật đã hoặc sẽ diễn ra.</p>{activity.body.map((paragraph) => <p key={paragraph} className="mb-5 text-[1.05rem] leading-8 text-vic-muted">{paragraph}</p>)}</div>
      {(relatedArticles.length > 0 || relatedProjects.length > 0) && <section className="mt-20 border-t border-black/10 pt-12"><h2 className="text-3xl font-bold tracking-[-.04em]">Nội dung liên quan</h2><div className="mt-8 grid gap-5 md:grid-cols-2">{relatedArticles.map((item) => <ArticleCard key={item.id} article={item} />)}{relatedProjects.map((item) => <ProjectCard key={item.id} project={item} />)}</div></section>}
    </div></main>;
}

export function ProjectDetailPage() {
  const { slug = "" } = useParams();
  const project = getProjectBySlug(slug);
  if (!project) return <NotFoundPage embedded />;
  const contributors = members.filter((item) => project.contributorIds.includes(item.id));
  return <main id="main" className="pb-24 pt-36"><div className="page-container"><Breadcrumb items={[{ label: "Sản phẩm", to: "/san-pham" }, { label: project.title }]} /><div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]"><div><div className="flex flex-wrap gap-2"><DemoBadge>Sản phẩm minh họa</DemoBadge><Badge>{project.category}</Badge><Badge>{project.scope}</Badge></div><h1 className="mt-6 text-[clamp(2.8rem,7vw,6rem)] font-extrabold leading-[1.05] tracking-[-.06em]">{project.title}</h1><p className="section-intro">{project.summary}</p></div></div><ContentVisual variant={project.category} label="SẢN PHẨM MINH HỌA" className="mt-12 h-[clamp(20rem,48vw,38rem)] rounded-[2.5rem]" />
      <div className="mt-16 grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><aside><p className="font-mono text-xs font-semibold text-vic-blue">CÔNG CỤ / CÔNG NGHỆ</p><div className="mt-4 flex flex-wrap gap-2">{project.tools.map((tool) => <Badge key={tool}>{tool}</Badge>)}</div>{contributors.length > 0 && <div className="mt-10"><p className="font-mono text-xs font-semibold text-vic-blue">NGƯỜI ĐÓNG GÓP</p>{contributors.map((member) => <Link key={member.id} to={`/thanh-vien/${member.slug}`} className="mt-4 flex items-center gap-3 font-semibold"><span className="grid size-10 place-items-center rounded-full bg-vic-blue-soft text-vic-blue"><UserRound size={17} /></span>{member.name}</Link>)}</div>}</aside><article><h2 className="text-3xl font-bold tracking-[-.04em]">Bài toán hoặc mục đích</h2><p className="mt-4 text-[1.05rem] leading-8 text-vic-muted">{project.purpose}</p><h2 className="mt-12 text-3xl font-bold tracking-[-.04em]">Quá trình minh họa</h2><ol className="mt-6 space-y-4">{project.process.map((step, index) => <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-black/10 pb-4"><span className="font-mono text-vic-blue">0{index + 1}</span><span>{step}</span></li>)}</ol><h2 className="mt-12 text-3xl font-bold tracking-[-.04em]">Kết quả</h2><p className="mt-4 text-[1.05rem] leading-8 text-vic-muted">{project.result}</p>{!project.demoUrl && !project.sourceUrl && <p className="mt-8 rounded-2xl bg-vic-surface p-4 text-sm text-vic-muted">Chưa có demo hoặc source thật được cung cấp nên website không hiển thị liên kết giả.</p>}</article></div>
    </div></main>;
}

function CodeBlock({ block }: { block: Extract<ArticleBlock, { type: "code" }> }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(block.code); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  return <div className="my-8 overflow-hidden rounded-[1.4rem] bg-[#111318] text-white"><div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-white/55"><span>{block.language}</span><button type="button" onClick={copy} className="inline-flex min-h-9 items-center gap-2 rounded-full px-3 hover:bg-white/10" aria-label="Sao chép đoạn mã">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Đã sao chép" : "Sao chép"}</button></div><pre className="overflow-x-auto p-5 text-sm leading-7"><code>{block.code}</code></pre></div>;
}

export function ArticleDetailPage() {
  const { slug = "" } = useParams();
  const article = getArticleBySlug(slug);
  if (!article) return <NotFoundPage embedded />;
  const headings = article.content.filter((block): block is Extract<ArticleBlock, { type: "heading" }> => block.type === "heading");
  const related = articles.filter((item) => item.id !== article.id && (item.topic === article.topic || item.departmentIds.some((id) => article.departmentIds.includes(id)))).slice(0, 2);
  return <main id="main" className="pb-24 pt-36"><div className="page-container"><Breadcrumb items={[{ label: "Học thuật", to: "/hoc-thuat" }, { label: article.title }]} /><div className="mx-auto max-w-4xl text-center"><div className="flex justify-center gap-2"><DemoBadge>Bài viết mẫu</DemoBadge><Badge>{article.topic}</Badge></div><h1 className="mt-6 text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[1.08] tracking-[-.055em]">{article.title}</h1><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-vic-muted">{article.summary}</p><p className="mt-5 text-sm text-vic-muted">Chưa cập nhật tác giả · Chưa cập nhật ngày</p></div>
      <div className="mx-auto mt-16 grid max-w-6xl gap-12 lg:grid-cols-[13rem_minmax(0,46rem)]"><aside className="self-start lg:sticky lg:top-32"><p className="font-mono text-xs font-semibold text-vic-blue">MỤC LỤC</p><nav className="mt-4 space-y-3">{headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} className="block text-sm leading-6 text-vic-muted hover:text-vic-blue">{heading.text}</a>)}</nav></aside><article className="article-body min-w-0">{article.content.map((block, index) => { if (block.type === "heading") return <h2 id={block.id} key={block.id} className="scroll-mt-32">{block.text}</h2>; if (block.type === "paragraph") return <p key={`${block.type}-${index}`}>{block.text}</p>; if (block.type === "list") return <ul key={`${block.type}-${index}`}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>; return <CodeBlock key={`${block.type}-${index}`} block={block} />; })}</article></div>
      {related.length > 0 && <section className="mx-auto mt-20 max-w-5xl border-t border-black/10 pt-12"><h2 className="text-3xl font-bold tracking-[-.04em]">Bài liên quan</h2><div className="mt-7 grid gap-5 md:grid-cols-2">{related.map((item) => <ArticleCard key={item.id} article={item} />)}</div></section>}
    </div></main>;
}

export function MemberDetailPage() {
  const { slug = "" } = useParams();
  const member = getMemberBySlug(slug);
  if (!member) return <NotFoundPage embedded />;
  const department = member.departmentId ? departments.find((item) => item.id === member.departmentId) : undefined;
  const memberProjects = projects.filter((item) => member.projectIds.includes(item.id));
  const memberArticles = articles.filter((item) => member.articleIds.includes(item.id));
  return <main id="main" className="pb-24 pt-36"><div className="page-container"><Breadcrumb items={[{ label: "Giới thiệu", to: "/gioi-thieu#doi-ngu" }, { label: member.name }]} /><div className="grid gap-10 lg:grid-cols-[20rem_1fr]"><aside><div className="grid aspect-square place-items-center rounded-[2.5rem] bg-vic-blue-soft text-vic-blue"><UserRound size={82} /></div><div className="mt-5 flex flex-wrap gap-2"><DemoBadge>Hồ sơ minh họa</DemoBadge>{department && <Badge>{department.name}</Badge>}</div></aside><div><h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-extrabold leading-[1.06] tracking-[-.06em]">{member.name}</h1><p className="mt-3 text-lg font-semibold text-vic-blue">{member.role}</p><p className="section-intro">{member.summary}</p><div className="mt-10"><h2 className="text-2xl font-bold">Lĩnh vực quan tâm</h2><div className="mt-4 flex flex-wrap gap-2">{member.interests.map((item) => <Badge key={item}>{item}</Badge>)}</div></div>{member.portfolioUrl && <Button asChild className="mt-8"><a href={member.portfolioUrl} target="_blank" rel="noreferrer">Portfolio cá nhân <ExternalLink size={16} /></a></Button>}</div></div>
      <section className="mt-20 grid gap-12 lg:grid-cols-2"><div><h2 className="text-3xl font-bold">Đóng góp tại VIC</h2><ul className="mt-6 space-y-3">{member.contributions.map((item) => <li key={item} className="border-b border-black/10 pb-3 text-vic-muted">{item}</li>)}</ul></div><div className="rounded-[2rem] bg-vic-surface p-7"><h2 className="text-xl font-bold">Phân biệt hồ sơ và portfolio</h2><p className="mt-3 text-sm leading-7 text-vic-muted">Trang này giới thiệu đóng góp trong phạm vi website VIC. Portfolio cá nhân bên ngoài chỉ xuất hiện khi thành viên cung cấp URL thật.</p></div></section>
      {memberProjects.length > 0 && <section className="mt-20"><h2 className="text-3xl font-bold">Dự án và sản phẩm</h2><div className="mt-7 grid gap-5 md:grid-cols-2">{memberProjects.map((item) => <ProjectCard key={item.id} project={item} />)}</div></section>}
      {memberArticles.length > 0 && <section className="mt-20"><h2 className="text-3xl font-bold">Bài chia sẻ</h2><div className="mt-7 grid gap-5 md:grid-cols-2">{memberArticles.map((item) => <ArticleCard key={item.id} article={item} />)}</div></section>}
    </div></main>;
}
