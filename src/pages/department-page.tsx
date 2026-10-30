import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ActivityCard, ArticleCard, EmptyState, ProjectCard } from "../components/content/content-cards";
import { PageHeader } from "../components/content/page-elements";
import { Button } from "../components/ui/button";
import { activities, articles, departments, members, projects } from "../data/site-data";
import type { DepartmentId } from "../types/content-model";

export function DepartmentPage({ departmentId }: { departmentId: DepartmentId }) {
  const department = departments.find((item) => item.id === departmentId)!;
  const relatedActivities = activities.filter((item) => item.departmentIds.includes(departmentId));
  const relatedProjects = projects.filter((item) => item.departmentIds.includes(departmentId));
  const relatedArticles = articles.filter((item) => item.departmentIds.includes(departmentId));
  const relatedMembers = members.filter((item) => item.departmentId === departmentId);
  return <main id="main"><PageHeader eyebrow={`KHÔNG GIAN / ${department.shortName.toUpperCase()}`} title={department.name} description={department.description}><Button asChild><Link to="/tham-gia">Tìm hiểu cách tham gia <ArrowRight size={17} /></Link></Button></PageHeader>
    <section className="section-space"><div className="page-container"><div className="mb-10"><p className="section-label">01 / HƯỚNG PHÁT TRIỂN</p><h2 className="section-title">Những cách để học và đóng góp.</h2></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{department.directions.map((direction, index) => <article key={direction.title} className="rounded-[1.75rem] border border-black/10 bg-white p-6"><span className="font-mono text-xs font-semibold text-vic-blue">0{index + 1}</span><h3 className="mt-8 text-lg font-semibold">{direction.title}</h3><p className="mt-3 text-sm leading-7 text-vic-muted">{direction.description}</p></article>)}</div></div></section>
    <section className="section-space bg-vic-surface"><div className="page-container"><div className="mb-9 flex flex-wrap items-end justify-between gap-5"><div><p className="section-label">02 / HOẠT ĐỘNG LIÊN QUAN</p><h2 className="section-title">Học qua trải nghiệm.</h2></div><Link to="/hoat-dong" className="font-semibold text-vic-blue">Xem tất cả ↗</Link></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{relatedActivities.slice(0, 3).map((item) => <ActivityCard key={item.id} activity={item} />)}</div></div></section>
    <section className="section-space"><div className="page-container grid gap-16 lg:grid-cols-2"><div><div className="mb-7"><p className="section-label">03 / NỘI DUNG</p><h2 className="text-3xl font-bold tracking-[-.04em]">Góc chia sẻ liên quan.</h2></div><div>{relatedArticles.slice(0, 3).map((item) => <ArticleCard compact key={item.id} article={item} />)}</div></div><div><div className="mb-7"><p className="section-label">04 / SẢN PHẨM</p><h2 className="text-3xl font-bold tracking-[-.04em]">Ý tưởng thành hình.</h2></div><div className="grid gap-5">{relatedProjects.slice(0, 2).map((item) => <ProjectCard key={item.id} project={item} />)}</div></div></div></section>
    <section className="section-space bg-vic-surface"><div className="page-container"><div className="mb-8"><p className="section-label">05 / THÀNH VIÊN</p><h2 className="section-title">Những người trong ban.</h2></div>{relatedMembers.length ? <div /> : <EmptyState title="Nhân sự sẽ được cập nhật" description={`VIC chưa cung cấp danh sách thành viên chính thức của ${department.name}. Khu vực này sẽ tự hiển thị hồ sơ khi dữ liệu được bổ sung.`} />}</div></section>
  </main>;
}
