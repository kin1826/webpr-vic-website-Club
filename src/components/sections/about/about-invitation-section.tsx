import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { aboutPageContent } from "../../../data/about-content";
import { PreviewReveal } from "../home-preview/preview-reveal";

export function AboutInvitationSection() {
  const reduceMotion = useReducedMotion();
  const { invitation } = aboutPageContent;

  return (
    <section className="about-invitation section-space" aria-labelledby="about-invitation-title">
      <div className="page-container">
        <div className="about-invitation-panel">
          <motion.svg className="about-invitation-orbit" viewBox="0 0 520 440" fill="none" aria-hidden="true">
            <motion.path
              d="M260 20C390 20 495 110 495 220S390 420 260 420 25 330 25 220 130 20 260 20Z"
              stroke="currentColor"
              strokeWidth="1.5"
              initial={reduceMotion ? false : { pathLength: 0, rotate: -8, opacity: 0 }}
              whileInView={reduceMotion ? undefined : { pathLength: 1, rotate: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M260 75C350 75 425 140 425 220S350 365 260 365 95 300 95 220 170 75 260 75Z"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 9"
              initial={reduceMotion ? false : { pathLength: 0 }}
              whileInView={reduceMotion ? undefined : { pathLength: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.8, delay: 0.15 }}
            />
          </motion.svg>

          <PreviewReveal className="about-invitation-copy" offset={20}>
            <p className="about-section-kicker about-section-kicker--light">MỘT BƯỚC TIẾP THEO</p>
            <h2 id="about-invitation-title">{invitation.title}</h2>
            <p>{invitation.description}</p>
            <motion.div whileHover={reduceMotion ? undefined : { x: 5 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} transition={{ type: "spring", stiffness: 240, damping: 20 }}>
              <Link to="/tuyen-thanh-vien" className="about-invitation-link">
                {invitation.buttonLabel}<ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </motion.div>
          </PreviewReveal>
          <span className="about-invitation-mark" aria-hidden="true">VIC<br />→</span>
        </div>
      </div>
    </section>
  );
}
