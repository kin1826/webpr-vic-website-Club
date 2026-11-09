import { motion, useReducedMotion } from "motion/react";
import { homePreviewContent } from "../../../data/home-preview-content";
import { aboutPageContent } from "../../../data/about-content";
import { PreviewReveal } from "../home-preview/preview-reveal";

export function AboutDirectionSection() {
  const reduceMotion = useReducedMotion();
  const { shortTerm, longTerm } = homePreviewContent;

  return (
    <section id="dinh-huong" className="about-direction scroll-mt-28" aria-labelledby="about-direction-title">
      <div className="page-container">
        <div className="about-direction-heading">
          <PreviewReveal>
            <p className="about-section-kicker">ĐANG LÀM · MUỐN TIẾP NỐI</p>
            <h2 id="about-direction-title">Điều đang làm.<br /><span>Điều muốn để lại.</span></h2>
          </PreviewReveal>
          <PreviewReveal delay={0.12} className="about-direction-intro">
            <p>{aboutPageContent.directionIntroduction}</p>
          </PreviewReveal>
        </div>

        <div className="about-direction-spread">
          <motion.svg className="about-direction-thread" viewBox="0 0 1080 360" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <motion.path
              d="M18 290C190 310 222 95 408 154S675 307 817 181 987 46 1062 82"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="8 10"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.65, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.svg>

          <PreviewReveal className="about-direction-sheet about-direction-sheet--short" offset={22} rotate={-1.2}>
            <span className="about-direction-label">{shortTerm.timeframe}</span>
            <h3>{shortTerm.title}</h3>
            <p>{shortTerm.description}</p>
            <span className="about-direction-stamp">BẮT ĐẦU TỪ ĐÂY</span>
          </PreviewReveal>

          <PreviewReveal className="about-direction-sheet about-direction-sheet--long" delay={0.13} offset={24} rotate={1.3}>
            <span className="about-direction-label">{longTerm.timeframe}</span>
            <h3>{longTerm.title}</h3>
            <p>{longTerm.description}</p>
            <span className="about-direction-orbit" aria-hidden="true"><i /><i /></span>
          </PreviewReveal>
        </div>
        <p className="about-editorial-note"><span aria-hidden="true" />Phần định hướng là nội dung đề xuất, chờ CLB xác nhận.</p>
      </div>
    </section>
  );
}
