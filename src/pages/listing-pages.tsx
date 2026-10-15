import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ActivityCard, ArticleCard, EmptyState, ProjectCard } from "../components/content/content-cards";
import { FilterChips, PageHeader } from "../components/content/page-elements";
import { Button } from "../components/ui/button";
import { activities, articles, projects } from "../data/site-data";
import type { ActivityCategory, ArticleTopic, ProjectCategory } from "../types/content-model";

const activityFilters = ["Tất cả", "Học tập", "Truyền thông", "Giao lưu"] as const;
const projectFilters = ["Tất cả", "Web/App", "Game", "Thiết kế", "Media"] as const;
const articleFilters = ["Tất cả", "Lập trình", "Công cụ", "Dự án", "Thiết kế & Media", "Kinh nghiệm học tập"] as const;

export function ActivitiesPage() {
  const [filter, setFilter] = useState<(typeof activityFilters)[number]>("Tất cả");
  const filtered = filter === "Tất cả" ? activities : activities.filter((item) => item.category === filter as ActivityCategory);
  return <main id="main"><PageHeader eyebrow="HOẠT ĐỘNG" title="Học qua việc cùng nhau trải nghiệm." description="Các hoạt động dưới đây là dữ liệu minh họa để Ban Chủ nhiệm đánh giá bố cục danh sách và trang chi tiết. Chưa có lịch hoặc sự kiện thật được công bố." />
    <section className="section-space"><div className="page-container"><div className="mb-9 flex flex-wrap items-center justify-between gap-5"><FilterChips values={activityFilters} active={filter} onChange={setFilter} /><span className="text-sm text-vic-muted">{filtered.length} nội dung</span></div>{filtered.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => <ActivityCard key={item.id} activity={item} />)}</div> : <EmptyState description="Chưa có hoạt động minh họa trong nhóm này." />}</div></section>
  </main>;
}

export function ProjectsPage() {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]>("Tất cả");
  const filtered = filter === "Tất cả" ? projects : projects.filter((item) => item.category === filter as ProjectCategory);
  return <main id="main"><PageHeader eyebrow="SẢN PHẨM" title="Từ ý tưởng đến thứ có thể trải nghiệm." description="Khu vực sản phẩm đang được hoàn thiện. Các nội dung hiện tại dùng để minh họa giao diện và cấu trúc dữ liệu." />
    <section className="section-space"><div className="page-container"><div className="mb-9 flex flex-wrap items-center justify-between gap-5"><FilterChips values={projectFilters} active={filter} onChange={setFilter} /><span className="text-sm text-vic-muted">{filtered.length} sản phẩm</span></div>{filtered.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => <ProjectCard key={item.id} project={item} />)}</div> : <EmptyState description="Chưa có sản phẩm minh họa trong nhóm này." />}</div></section>
  </main>;
}

const normalizeVietnamese = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();

export function AcademicsPage() {
  const [filter, setFilter] = useState<(typeof articleFilters)[number]>("Tất cả");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalizedQuery = normalizeVietnamese(query.trim());
    return articles.filter((article) => {
      const matchesTopic = filter === "Tất cả" || article.topic === filter as ArticleTopic;
      const haystack = normalizeVietnamese([article.title, article.summary, ...article.tags].join(" "));
      return matchesTopic && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [filter, query]);
  const clear = () => { setFilter("Tất cả"); setQuery(""); };
  return <main id="main"><PageHeader eyebrow="GÓC HỌC THUẬT" title="Ghi lại để hiểu sâu hơn và chia sẻ xa hơn." description="Nơi tập hợp bài hướng dẫn, kiến thức nền tảng, kinh nghiệm thực hành và những ghi chú có thể dùng lại. Hiện tại các bài đều là nội dung mẫu." />
    <section className="section-space"><div className="page-container"><div className="glass-surface mb-9 rounded-[2rem] p-5"><label htmlFor="article-search" className="mb-2 block text-sm font-semibold">Tìm bài viết</label><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vic-muted" size={18} /><input id="article-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tiêu đề, mô tả hoặc tag…" className="min-h-12 w-full rounded-2xl border border-black/10 bg-white pl-11 pr-11 text-sm outline-none focus:border-vic-blue focus:ring-4 focus:ring-vic-blue/10" />{query && <button type="button" aria-label="Xóa tìm kiếm" onClick={() => setQuery("")} className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full hover:bg-vic-surface"><X size={16} /></button>}</div><div className="mt-4"><FilterChips values={articleFilters} active={filter} onChange={setFilter} label="Chủ đề bài viết" /></div></div>
      {articles[0] && filter === "Tất cả" && !query && <div className="mb-12 grid overflow-hidden rounded-[2rem] bg-vic-ink text-white lg:grid-cols-[.8fr_1.2fr]"><div className="gradient-orb min-h-64 opacity-85" /><div className="p-8 md:p-12"><p className="font-mono text-xs font-semibold text-[#8ea8ff]">BÀI NỔI BẬT / MẪU</p><h2 className="mt-6 text-3xl font-bold tracking-[-.04em]">{articles[0].title}</h2><p className="mt-4 leading-7 text-white/65">{articles[0].summary}</p><Link to={`/hoc-thuat/${articles[0].slug}`} className="mt-7 inline-flex font-semibold">Đọc bài mẫu ↗</Link></div></div>}
      {filtered.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => <ArticleCard key={item.id} article={item} />)}</div> : <EmptyState description="Không có bài viết phù hợp với từ khóa và chủ đề đang chọn." action={<Button onClick={clear}>Xóa bộ lọc</Button>} />}
    </div></section>
  </main>;
}
