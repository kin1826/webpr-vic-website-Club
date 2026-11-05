import { ArrowUpRight, UserRound } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { departments, members, organizationPositions } from "../../../data/site-data";
import type { OrganizationPosition } from "../../../types/content-model";
import { PreviewReveal } from "./preview-reveal";
import { usePreviewVisibility } from "./use-preview-visibility";

function PositionLabel({ position }: { position: OrganizationPosition }) {
  const member = position.memberId ? members.find((item) => item.id === position.memberId) : undefined;
  const content = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-vic-blue-soft text-vic-blue"><UserRound size={17} aria-hidden="true" /></span>
      <span className="min-w-0"><strong className="block text-sm">{member?.name ?? position.title}</strong><small className="mt-1 block text-xs leading-5 text-vic-muted">{member ? position.title : position.note}</small></span>
    </>
  );

  const className = "flex min-h-16 items-center gap-3 border border-black/10 bg-white p-3";
  return member ? <Link to={`/thanh-vien/${member.slug}`} className={`${className} hover:border-vic-blue/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vic-blue/20`}>{content}</Link> : <div className={className}>{content}</div>;
}

export function OrganizationPreviewSection() {
  const leaders = organizationPositions.filter((position) => position.departmentId === null);
  const reduce = useReducedMotion();
  const { ref, isVisible } = usePreviewVisibility<HTMLElement>();

  return (
    <section ref={ref} data-preview-visible={isVisible} className="home-preview-organization section-space overflow-hidden bg-vic-surface" aria-labelledby="preview-organization-title">
      <div className="page-container">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5 sm:mb-12">
          <PreviewReveal className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold text-vic-blue">Những người cùng giữ nhịp</p>
            <h2 id="preview-organization-title" className="text-[clamp(2.5rem,5.4vw,4.8rem)] font-bold leading-[.98] tracking-[-.07em]">Một CLB.<br />Nhiều điểm tựa.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-vic-muted">Ban Chủ nhiệm kết nối các ban Học tập và Truyền thông. Sơ đồ dùng chức danh hiện có; thông tin nhân sự sẽ được bổ sung khi xác nhận.</p>
          </PreviewReveal>
          <PreviewReveal delay={0.14} offset={18}><Link to="/gioi-thieu#doi-ngu" className="inline-flex min-h-11 items-center gap-2 border-b-2 border-vic-blue px-1 text-sm font-semibold text-vic-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vic-blue/25">Xem đội ngũ đầy đủ <ArrowUpRight size={17} /></Link></PreviewReveal>
        </div>

        <div className="home-preview-org-map relative isolate mx-auto max-w-6xl" role="group" aria-label="Sơ đồ tổ chức VIC">
          <svg className="pointer-events-none absolute inset-x-0 top-24 -z-10 hidden h-[26rem] w-full overflow-visible md:block" viewBox="0 0 1000 420" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <motion.path d="M500 0V95C500 135 275 135 275 210V385M500 95C500 135 725 135 725 210V385" stroke="rgba(36,87,245,.55)" strokeWidth="2" initial={reduce ? false : { pathLength: 0 }} whileInView={reduce ? undefined : { pathLength: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.7, ease: [0.22, 1, 0.36, 1] }} />
            <motion.path d="M500 0V95C500 135 275 135 275 210V385M500 95C500 135 725 135 725 210V385" stroke="white" strokeOpacity=".75" strokeWidth="5" strokeDasharray="1 24" strokeLinecap="round" initial={reduce ? false : { pathLength: 0 }} whileInView={reduce ? undefined : { pathLength: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 2.1, delay: 0.15 }} />
            <path className="home-preview-org-current" d="M500 0V95C500 135 275 135 275 210V385M500 95C500 135 725 135 725 210V385" />
          </svg>

          <PreviewReveal className="relative mx-auto grid max-w-md gap-3 border border-black/10 bg-white p-5 shadow-[0_18px_55px_rgba(22,22,22,.08)]" rotate={-1.5}>
            <h3 className="text-center text-sm font-semibold">Ban Chủ nhiệm</h3>
            {leaders.map((position, index) => <motion.div key={position.id} initial={reduce ? false : { opacity: 0, scale: 0.88 }} whileInView={reduce ? undefined : { opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 190, damping: 18, delay: 0.2 + index * 0.13 }}><PositionLabel position={position} /></motion.div>)}
          </PreviewReveal>

          <div className="relative mt-10 grid gap-5 md:mt-16 md:grid-cols-2 md:gap-20">
            {departments.map((department) => {
              const positions = organizationPositions.filter((position) => position.departmentId === department.id);
              return (
                <motion.section key={department.id} className="relative border-t-2 border-vic-blue/35 bg-white/65 p-4 pt-6 backdrop-blur-sm sm:p-6 sm:pt-7" aria-labelledby={`preview-${department.id}-title`} initial={reduce ? false : { opacity: 0, y: 38, scale: 0.97 }} whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.75, delay: department.id === "learning" ? 0.2 : 0.36, ease: [0.22, 1, 0.36, 1] }}>
                  <h3 id={`preview-${department.id}-title`} className="mb-4 text-center text-lg font-semibold text-vic-ink">{department.name}</h3>
                  <ul className="grid gap-3">
                    {positions.map((position, index) => <motion.li key={position.id} initial={reduce ? false : { opacity: 0, x: department.id === "learning" ? -16 : 16 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.3 + index * 0.12 }}><PositionLabel position={position} /></motion.li>)}
                    <motion.li initial={reduce ? false : { opacity: 0 }} whileInView={reduce ? undefined : { opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.55 }} className="border border-dashed border-black/15 bg-vic-surface/70 p-3 text-center text-sm text-vic-muted">Các nhóm thành viên</motion.li>
                  </ul>
                </motion.section>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
