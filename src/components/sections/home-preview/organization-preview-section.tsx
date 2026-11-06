import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { LeadershipGallery } from "../../organization/leadership-gallery";
import { PreviewReveal } from "./preview-reveal";
import { usePreviewVisibility } from "./use-preview-visibility";

export function OrganizationPreviewSection() {
  const { ref, isVisible } = usePreviewVisibility<HTMLElement>();

  return (
    <section ref={ref} data-preview-visible={isVisible} className="home-preview-organization section-space overflow-hidden bg-vic-surface" aria-labelledby="preview-organization-title">
      <div className="page-container">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5 sm:mb-12">
          <PreviewReveal className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold text-vic-blue">Những người cùng giữ nhịp</p>
            <h2 id="preview-organization-title" className="text-[clamp(2.5rem,5.4vw,4.8rem)] font-bold leading-[.98] tracking-[-.07em]">Một CLB.<br />Nhiều điểm tựa.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-vic-muted">Gặp những người đứng sau các hoạt động của VIC, từ Ban Chủ nhiệm đến các ban Học tập, Truyền thông và Sự kiện.</p>
          </PreviewReveal>
          <PreviewReveal delay={0.14} offset={18}><Link to="/gioi-thieu#doi-ngu" className="inline-flex min-h-11 items-center gap-2 border-b-2 border-vic-blue px-1 text-sm font-semibold text-vic-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vic-blue/25">Khám phá đội ngũ <ArrowUpRight size={17} /></Link></PreviewReveal>
        </div>
        <div className="relative isolate">
          <div className="pointer-events-none absolute -right-20 top-12 -z-10 size-72 rounded-full border border-vic-blue/10" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-8 top-20 -z-10 size-48 rounded-full border border-vic-blue/10" aria-hidden="true" />
          <LeadershipGallery />
        </div>
      </div>
    </section>
  );
}
