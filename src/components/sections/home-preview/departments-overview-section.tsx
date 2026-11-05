import { ArrowUpRight, Code2, Megaphone, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { departments } from "../../../data/site-data";
import { PreviewReveal } from "./preview-reveal";
import { usePreviewVisibility } from "./use-preview-visibility";

const departmentIcons = { learning: Code2, media: Megaphone } as const;

export function DepartmentsOverviewSection() {
  const reduce = useReducedMotion();
  const { ref, isVisible } = usePreviewVisibility<HTMLElement>();
  return (
    <section ref={ref} data-preview-visible={isVisible} className="home-preview-departments relative isolate overflow-hidden bg-vic-ink py-20 text-white sm:py-28 lg:py-36" aria-labelledby="preview-departments-title">
      <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-70" viewBox="0 0 1200 740" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <motion.path d="M-40 520C170 510 220 252 430 270S685 480 870 350 1080 170 1240 210" stroke="var(--vic-blue)" strokeWidth="2" initial={reduce ? false : { pathLength: 0 }} whileInView={reduce ? undefined : { pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }} />
        <motion.path d="M-20 585C170 580 270 340 430 350S665 530 860 415 1080 250 1230 285" stroke="white" strokeOpacity=".3" strokeWidth="1" strokeDasharray="5 12" initial={reduce ? false : { pathLength: 0 }} whileInView={reduce ? undefined : { pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.1, delay: 0.15 }} />
      </svg>
      <span className="home-preview-department-atmosphere home-preview-department-atmosphere-b pointer-events-none absolute left-0 top-0" aria-hidden="true" />
      <span className="home-preview-department-atmosphere home-preview-department-atmosphere-a pointer-events-none absolute left-0 top-0" aria-hidden="true" />
      <div className="page-container">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end lg:gap-16">
          <PreviewReveal offset={32}>
            <p className="mb-4 text-sm font-semibold text-vic-blue-soft">Hai nhịp làm nên VIC</p>
            <h2 id="preview-departments-title" className="max-w-2xl text-[clamp(2.7rem,6vw,5.5rem)] font-bold leading-[.95] tracking-[-.075em]">Học cho sâu.<br />Kể cho chạm.</h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-white/65">Hai ban, hai thế mạnh. Một cộng đồng cùng đưa ý tưởng từ trang giấy vào đời sống.</p>
            <div className="mt-8 inline-flex items-center gap-3 text-sm text-white/55"><Sparkles size={16} className="text-vic-blue-soft" />Chọn một lối bắt đầu của riêng bạn</div>
          </PreviewReveal>

          <div className="relative space-y-5 sm:space-y-7">
            {departments.map((department, index) => {
              const Icon = departmentIcons[department.id];
              const learning = department.id === "learning";
              return (
                <motion.div key={department.id} initial={reduce ? false : { opacity: 0, x: learning ? -55 : 55, rotate: learning ? -2 : 2 }} whileInView={reduce ? undefined : { opacity: 1, x: 0, rotate: 0 }} viewport={{ once: true, amount: 0.28 }} transition={{ duration: 0.85, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }} whileHover={reduce ? undefined : { x: learning ? -8 : 8 }} whileFocus={reduce ? undefined : { x: learning ? -8 : 8 }}>
                  <Link to={`/${department.slug}`} className={`group relative block overflow-hidden border p-6 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/35 sm:p-8 ${learning ? "border-vic-blue/45 bg-vic-blue/10" : "border-white/20 bg-white/[.06] backdrop-blur-sm"}`}>
                    <motion.span className={`home-preview-department-orbit absolute -right-8 -top-10 size-44 rounded-full border ${learning ? "border-vic-blue/35" : "border-white/15"}`} whileHover={reduce ? undefined : { scale: 1.35, rotate: 28 }} transition={{ duration: 0.55 }} aria-hidden="true" />
                    <div className="relative grid gap-6 md:grid-cols-[.85fr_1.15fr] md:items-center">
                      <div>
                        <div className="flex items-center gap-3"><span className={`grid size-11 place-items-center ${learning ? "bg-vic-blue text-white" : "bg-white text-vic-ink"}`}><Icon size={20} aria-hidden="true" /></span><span className="text-sm font-semibold text-white/65">{learning ? "Nơi ý tưởng được làm" : "Nơi hành trình được kể"}</span></div>
                        <h3 className="mt-6 text-3xl font-bold tracking-[-.05em] sm:text-4xl">{department.name}</h3>
                        <p className="mt-3 max-w-sm text-sm leading-7 text-white/65">{department.summary}</p>
                      </div>
                      <ul className="grid gap-x-5 gap-y-3 border-t border-white/15 pt-5 text-sm text-white/85 sm:grid-cols-2 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                        {department.directions.slice(0, 4).map((direction, itemIndex) => <motion.li key={direction.title} className="flex items-center gap-2" initial={reduce ? false : { opacity: 0, x: 12 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + itemIndex * 0.08, duration: 0.4 }}><span className={`size-1.5 rounded-full ${learning ? "bg-vic-blue" : "bg-white/70"}`} aria-hidden="true" />{direction.title}</motion.li>)}
                      </ul>
                    </div>
                    <span className="relative mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold">Khám phá {department.shortName}<ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
