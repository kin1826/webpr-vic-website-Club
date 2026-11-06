import { ArrowRight, MoveUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { faqs } from "../../../data/site-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import { Button } from "../../ui/button";
import { PreviewReveal } from "./preview-reveal";
import { usePreviewVisibility } from "./use-preview-visibility";

export function HomePreviewJoinSection() {
  const reduce = useReducedMotion();
  const { ref: joinRef, isVisible: joinVisible } = usePreviewVisibility<HTMLDivElement>();
  return (
    <section className="home-preview-join section-space overflow-hidden" aria-labelledby="preview-join-title">
      <div className="page-container">
        <div ref={joinRef} data-preview-visible={joinVisible} className="home-preview-final-note relative isolate overflow-hidden bg-vic-blue p-7 text-white sm:p-10 lg:p-14">
          <motion.svg className="home-preview-join-orbit pointer-events-none absolute -right-16 -top-20 -z-10 h-[130%] w-[58%] text-white/25" viewBox="0 0 520 440" fill="none" aria-hidden="true" initial={reduce ? false : { rotate: -16, scale: 0.82, opacity: 0 }} whileInView={reduce ? undefined : { rotate: 0, scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
            <motion.path d="M260 20C390 20 495 110 495 220S390 420 260 420 25 330 25 220 130 20 260 20Z" stroke="currentColor" strokeWidth="1.5" initial={reduce ? false : { pathLength: 0 }} whileInView={reduce ? undefined : { pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, delay: 0.2 }} />
            <motion.path d="M260 75C350 75 425 140 425 220S350 365 260 365 95 300 95 220 170 75 260 75Z" stroke="currentColor" strokeWidth="1" strokeDasharray="2 9" initial={reduce ? false : { pathLength: 0 }} whileInView={reduce ? undefined : { pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.35 }} />
          </motion.svg>
          <div className="relative max-w-4xl">
            <PreviewReveal offset={24}>
              <p className="text-sm font-semibold text-white/75">Một trang giấy vẫn còn chỗ trống</p>
              <h2 id="preview-join-title" className="mt-5 max-w-4xl text-[clamp(2.8rem,7vw,6.2rem)] font-bold leading-[.92] tracking-[-.075em]">Ý tưởng tiếp theo<br />có thể bắt đầu từ bạn.</h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/80">Khám phá các ban và hoạt động, rồi chọn bước tiếp theo phù hợp với mình.</p>
              <motion.div className="mt-8 inline-block" whileHover={reduce ? undefined : { x: 8, scale: 1.035 }} whileTap={reduce ? undefined : { scale: 0.97 }} transition={{ type: "spring", stiffness: 240, damping: 18 }}>
                <Button asChild variant="light"><Link to="/tuyen-thanh-vien">Đăng ký tham gia VIC <ArrowRight size={17} /></Link></Button>
              </motion.div>
            </PreviewReveal>
          </div>
          <motion.span className="absolute bottom-7 right-7 hidden text-white/80 md:block" initial={reduce ? false : { opacity: 0, rotate: -35, scale: 0.3 }} whileInView={reduce ? undefined : { opacity: 1, rotate: 0, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 170, damping: 14, delay: 0.55 }}><MoveUpRight size={44} strokeWidth={1} aria-hidden="true" /></motion.span>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
          <PreviewReveal>
            <p className="mb-3 text-sm font-semibold text-vic-blue">Câu hỏi thường gặp</p>
            <h2 className="text-[clamp(1.8rem,3.6vw,2.6rem)] font-bold leading-tight tracking-[-.04em]">Trước khi bạn bắt đầu.</h2>
          </PreviewReveal>
          <PreviewReveal delay={0.12}>
            <Accordion type="single" collapsible className="border-t border-black/10">
            {faqs.slice(0, 3).map((item) => <AccordionItem key={item.id} value={item.id}><AccordionTrigger>{item.question}</AccordionTrigger><AccordionContent>{item.answer}</AccordionContent></AccordionItem>)}
            </Accordion>
          </PreviewReveal>
        </div>
      </div>
    </section>
  );
}
