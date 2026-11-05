import { useRef } from "react";
import { ArrowDownRight, ArrowRight, MoveUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { homePreviewContent } from "../../../data/home-preview-content";
import { Button } from "../../ui/button";
import { PreviewReveal } from "./preview-reveal";

export function ClubOverviewSection() {
  const content = homePreviewContent;
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useInView(sectionRef, { amount: 0.01, margin: "96px 0px" });
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const noteX = useSpring(pointerX, { stiffness: 90, damping: 19, mass: 0.7 });
  const noteY = useSpring(pointerY, { stiffness: 90, damping: 19, mass: 0.7 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 0.82", "end 0.22"] });
  const lineProgress = useTransform(scrollYProgress, [0, 0.42, 1], [0.02, 0.72, 1]);

  const moveAnnotation = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left - rect.width / 2) * 0.045);
    pointerY.set((event.clientY - rect.top - rect.height / 2) * 0.035);
  };
  const resetAnnotation = () => { pointerX.set(0); pointerY.set(0); };

  return (
    <section ref={sectionRef} data-preview-visible={isVisible} id="about" className="home-preview-overview section-space scroll-mt-28 overflow-hidden" aria-labelledby="preview-about-title">
      <span className="home-preview-overview-light home-preview-overview-light-b" aria-hidden="true" />
      <span className="home-preview-overview-light home-preview-overview-light-a" aria-hidden="true" />
      <div className="page-container">
        <PreviewReveal className="mb-10 flex max-w-3xl items-start gap-3 sm:mb-14" offset={18}>
          <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-vic-blue shadow-[0_0_0_6px_rgba(36,87,245,.1)]" aria-hidden="true" />
          <p className="text-sm leading-6 text-vic-muted" role="note">{content.editorialNote}</p>
        </PreviewReveal>

        <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_.96fr] lg:gap-8">
          <div className="relative z-10">
            <PreviewReveal offset={24}>
              <p className="mb-5 text-sm font-semibold text-vic-blue">Một cộng đồng công nghệ tại VKU</p>
              <h2 id="preview-about-title" className="max-w-3xl text-[clamp(2.7rem,6.2vw,5.7rem)] font-bold leading-[.98] tracking-[-.075em] text-balance">
                Một ý tưởng<br />
                <span className="relative inline-block">lớn lên
                  <motion.svg className="absolute -bottom-[.16em] left-0 h-[.22em] w-full overflow-visible text-vic-blue" viewBox="0 0 360 30" fill="none" aria-hidden="true">
                    <motion.path d="M4 20C75 4 127 28 194 14S302 7 356 17" stroke="currentColor" strokeWidth="8" strokeLinecap="round" initial={reduce ? false : { pathLength: 0 }} whileInView={reduce ? undefined : { pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.15, delay: 0.45, ease: [0.22, 1, 0.36, 1] }} />
                  </motion.svg>
                </span><br />
                khi có người<br className="max-sm:hidden" /> cùng làm.
              </h2>
            </PreviewReveal>

            <PreviewReveal className="mt-7 max-w-xl" delay={0.16} offset={18}>
              <p className="text-base leading-8 text-vic-muted">{content.description}</p>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold" aria-label="Tinh thần VIC">
                {content.values.map((value, index) => <li className="inline-flex items-center gap-2" key={value}>
                  {index > 0 && <span className="size-1.5 rounded-full bg-vic-blue/50" aria-hidden="true" />}{value}
                </li>)}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild><Link to="/tham-gia">Đăng ký tham gia VIC <ArrowRight size={17} /></Link></Button>
                <Button asChild variant="secondary"><Link to="/gioi-thieu">Tìm hiểu về CLB <ArrowDownRight size={17} /></Link></Button>
              </div>
            </PreviewReveal>
          </div>

          <div className="home-preview-workspace relative mx-auto min-h-[31rem] w-full max-w-[38rem] sm:min-h-[36rem]" onPointerMove={moveAnnotation} onPointerLeave={resetAnnotation}>
            <div className="absolute inset-[6%_2%_4%_7%] rotate-[3deg] rounded-[2rem] bg-vic-blue-soft" aria-hidden="true" />
            <motion.div className="home-preview-paper absolute inset-[4%_8%_7%_3%] overflow-hidden rounded-[1.6rem] border border-black/10 bg-white p-6 shadow-[0_28px_80px_rgba(22,22,22,.13)] sm:p-9" initial={reduce ? false : { opacity: 0, y: 30, rotate: -4 }} whileInView={reduce ? undefined : { opacity: 1, y: 0, rotate: -2 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center justify-between border-b border-black/10 pb-4 text-xs text-vic-muted"><span>Ghi chú đang mở</span><span>VIC tại VKU</span></div>
              <p className="mt-7 max-w-xs text-[clamp(1.65rem,3.7vw,2.8rem)] font-semibold leading-[1.06] tracking-[-.055em]">{content.title}</p>
              <div className="mt-8 space-y-3" aria-hidden="true"><span className="block h-2 w-[86%] rounded-full bg-vic-surface" /><span className="block h-2 w-[74%] rounded-full bg-vic-surface" /><span className="block h-2 w-[81%] rounded-full bg-vic-surface" /></div>
              <div className="absolute bottom-7 left-6 right-6 grid grid-cols-2 gap-3 sm:bottom-9 sm:left-9 sm:right-9">
                {[content.shortTerm, content.longTerm].map((direction, index) => <motion.div key={direction.timeframe} initial={reduce ? false : { opacity: 0, y: 18 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.5 + index * 0.14 }} className={`relative min-h-40 p-4 sm:p-5 ${index === 0 ? "bg-vic-ink text-white" : "bg-vic-blue text-white"}`}>
                  <span className="text-xs font-semibold text-white/65">{direction.timeframe}</span><p className="mt-5 text-sm font-semibold leading-5 sm:text-base">{direction.title}</p><MoveUpRight className="absolute bottom-4 right-4 text-white/70" size={16} aria-hidden="true" />
                </motion.div>)}
              </div>
              <motion.div className="absolute right-[12%] top-[42%] h-px w-[70%] origin-left bg-vic-blue/35" style={{ scaleX: reduce ? 1 : lineProgress }} aria-hidden="true" />
            </motion.div>

            <motion.div style={{ x: noteX, y: noteY }} className="home-preview-note absolute -right-1 top-[12%] z-10 max-w-[10.5rem] rotate-[5deg] border border-white/80 bg-white/80 p-4 shadow-[0_18px_50px_rgba(22,22,22,.15)] backdrop-blur-xl sm:-right-4 sm:max-w-[12rem]">
              <motion.span className="mb-3 block size-2 rounded-full bg-vic-blue" initial={reduce ? false : { scale: 0.2 }} whileInView={reduce ? undefined : { scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 220, damping: 13, delay: 0.65 }} aria-hidden="true" />
              <span className="block text-xs font-semibold leading-5">Thử một điều nhỏ. Chia sẻ điều vừa học.</span><span className="mt-2 block text-[.65rem] text-vic-muted">Ghi chú của VIC</span>
            </motion.div>

            <motion.div className="absolute -bottom-2 left-[3%] z-10 rotate-[-7deg] rounded-full bg-vic-blue px-5 py-3 text-sm font-semibold text-white shadow-lg" initial={reduce ? false : { scale: 0, rotate: -24 }} whileInView={reduce ? undefined : { scale: 1, rotate: -7 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.65 }}>
              Học hỏi · Kết nối · Làm ra
            </motion.div>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between gap-6 border-t border-black/10 pt-5 text-sm text-vic-muted sm:mt-20">
          <span>Một nơi để bắt đầu, thử nghiệm và tiếp tục.</span>
          <motion.span initial={reduce ? false : { opacity: 0, x: -8 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.25 }} aria-hidden="true"><MoveUpRight size={18} className="text-vic-blue" /></motion.span>
        </div>
      </div>
    </section>
  );
}
