import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { faqs } from "../../data/site-data";
import { useHyperMotion } from "./motion-context";
import { Reveal } from "./reveal";

export function HyperInvitation() {
  const { enabled } = useHyperMotion();
  return (
    <>
      <section className="hyper-section hyper-invitation" aria-labelledby="hyper-invitation-title">
        <div className="hyper-invitation-signal" aria-hidden="true"><span /><i /><b /></div>
        <div className="hyper-container hyper-invitation-inner">
          <Reveal direction="left" className="hyper-invitation-copy">
            <p className="hyper-kicker"><span /> Còn một vị trí trong cụm</p>
            <h2 id="hyper-invitation-title">Điều tiếp theo,<br /><em>cùng làm với VIC.</em></h2>
            <p>Bạn có thể bắt đầu từ một câu hỏi, một ý tưởng hoặc mong muốn tìm người cùng học.</p>
            <motion.div whileHover={enabled ? { x: 5 } : undefined} whileTap={enabled ? { scale: 0.98 } : undefined} transition={{ type: "spring", stiffness: 230, damping: 20 }}>
              <Link className="hyper-button hyper-button--white" to="/tuyen-thanh-vien">Tìm hiểu cách tham gia <ArrowRight size={17} aria-hidden="true" /></Link>
            </motion.div>
          </Reveal>
          <div className="hyper-invitation-model" aria-hidden="true">
            <div className="hyper-outro-plate hyper-outro-plate--one" />
            <div className="hyper-outro-plate hyper-outro-plate--two" />
            <div className="hyper-outro-core" />
            <span className="hyper-outro-ray" />
          </div>
          <span className="hyper-invitation-index" aria-hidden="true">VIC / CONTINUE</span>
        </div>
      </section>
      <section className="hyper-section hyper-faq" aria-labelledby="hyper-faq-title">
        <div className="hyper-container hyper-faq-layout">
          <Reveal><p className="hyper-kicker hyper-kicker--dark"><span /> Trước khi bắt đầu</p><h2 id="hyper-faq-title">Một vài câu hỏi.</h2></Reveal>
          <div className="hyper-faq-list">
            {faqs.slice(0, 3).map((faq, index) => (
              <Reveal key={faq.id} delay={index * 0.05}>
                <details className="hyper-faq-item"><summary>{faq.question}<span><Plus size={17} aria-hidden="true" /></span></summary><p>{faq.answer}</p></details>
              </Reveal>
            ))}
            <Link className="hyper-faq-more" to="/tuyen-thanh-vien">Tìm hiểu cách tham gia <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
