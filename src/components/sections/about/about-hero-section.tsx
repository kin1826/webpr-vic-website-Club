import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import aboutImage from "../../../../image/vic-gioithieu.jpg";
import { aboutPageContent } from "../../../data/about-content";

export function AboutHeroSection() {
  const reduceMotion = useReducedMotion();
  const { hero } = aboutPageContent;

  return (
    <section className="about-hero" aria-labelledby="about-hero-title">
      <div className="page-container">
        <div className="about-hero-copy">
          <motion.div
            className="about-hero-heading"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="about-kicker"><span aria-hidden="true" /> VIC · VKU IT CLUB</p>
            <h1 id="about-hero-title">Chúng mình<br />là <span>VIC.</span></h1>
          </motion.div>

          <motion.div
            className="about-hero-intro"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13, duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>{hero.introduction}</p>
            <nav className="about-hero-links" aria-label="Khám phá trang Về VIC">
              <a href="#cau-chuyen">{hero.primaryLinkLabel}<ArrowDownRight size={17} aria-hidden="true" /></a>
              <a href="#doi-ngu">{hero.secondaryLinkLabel}<ArrowUpRight size={16} aria-hidden="true" /></a>
            </nav>
          </motion.div>
        </div>

        <motion.figure
          className="about-hero-photo-wrap"
          initial={reduceMotion ? false : { opacity: 0, y: 26, rotate: -1.2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.26, duration: 0.86, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="about-hero-photo-backing" aria-hidden="true" />
          <div className="about-hero-photo-frame">
            <img
              src={aboutImage}
              alt="Thành viên VIC cùng tham gia một sự kiện tại VKU"
              width={2048}
              height={1152}
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <figcaption className="about-hero-note">
            <span className="about-note-mark" aria-hidden="true">✳</span>
            <span>Một cộng đồng.<br /><strong>Nhiều cách cùng lớn lên.</strong></span>
          </figcaption>
          <span className="about-hero-coordinate" aria-hidden="true">VKU / CÙNG NHAU</span>
        </motion.figure>
      </div>
    </section>
  );
}
