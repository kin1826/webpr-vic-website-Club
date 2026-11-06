import { ArrowDown, ArrowUpRight, MoveDownLeft } from "lucide-react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useHyperMotion } from "./motion-context";
import { CreationScene } from "./creation-scene";

export function HyperHero() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.08, margin: "100px 0px" });
  const { enabled } = useHyperMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 92]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);

  return (
    <section ref={ref} id="hyper-top" className="hyper-hero" aria-labelledby="hyper-hero-title">
      <div className="hyper-hero-noise" aria-hidden="true" />
      <div className="hyper-hero-grid" aria-hidden="true" />
      <motion.div className="hyper-hero-scene" style={{ y: enabled ? sceneY : 0, scale: enabled ? sceneScale : 1 }}>
        <CreationScene active={enabled && visible} />
      </motion.div>
      <div className="hyper-hero-vignette" aria-hidden="true" />
      <div className="hyper-container hyper-hero-content">
        <p className="hyper-kicker"><span /> VIC · Câu lạc bộ Lập trình VKU</p>
        <h1 id="hyper-hero-title"><span>We dream it.</span><span>We <em>make</em> it.</span></h1>
        <div className="hyper-hero-lower">
          <p>Những ý tưởng công nghệ được bắt đầu, thử nghiệm và hoàn thiện cùng nhau.</p>
          <div className="hyper-hero-actions">
            <Link className="hyper-button hyper-button--white" to="/tuyen-thanh-vien">Tìm hiểu cách tham gia <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <a className="hyper-link" href="#hyper-about">Khám phá VIC <ArrowDown size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="hyper-hero-scroll" aria-hidden="true"><MoveDownLeft size={16} /><span>Cuộn để khám phá</span><i /></div>
        <span className="hyper-hero-coordinate" aria-hidden="true">VIC / LAB—01</span>
      </div>
      <div className="hyper-hero-edge" aria-hidden="true" />
    </section>
  );
}
