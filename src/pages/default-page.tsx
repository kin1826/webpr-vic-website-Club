import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, MoveUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { VicLogo } from "../components/shared/vic-logo";
import "../styles/default.css";

export function DefaultPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main id="main" className="default-page">
      <div className="default-page__grain" aria-hidden="true" />
      <div className="default-page__topline">
        <span>VIC / VKU IT CLUB</span>
        <span className="default-page__signal"><i /> Không gian đang được dựng</span>
      </div>

      <section className="default-page__stage" aria-labelledby="default-title">
        <div className="default-page__copy">
          <motion.div
            className="default-page__brand"
            initial={reduceMotion ? false : { opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <VicLogo className="w-[5.25rem] sm:w-24" />
            <span>VKU IT CLUB</span>
          </motion.div>

          <motion.h1
            id="default-title"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            Trang chưa<br /><em>sẵn sàng.</em>
          </motion.h1>

          <motion.p
            className="default-page__description"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            Tụi mình đang chuẩn bị thêm điều thú vị. Trong lúc chờ, ghé qua những không gian khác của VIC nhé.
          </motion.p>

          <motion.nav
            className="default-page__links"
            aria-label="Gợi ý trang tiếp theo"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
          >
            <Link to="/" className="default-page__link default-page__link--home">
              Về trang chủ <MoveUpRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/tuyen-thanh-vien" className="default-page__link default-page__link--recruitment">
              Khám phá tuyển sinh <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </motion.nav>
        </div>

        <motion.div
          className="default-page__visual"
          role="img"
          aria-label="Logo VIC lơ lửng trong một quỹ đạo xanh ba chiều"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.86, rotateY: -16 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="default-page__halo default-page__halo--back" />
          <div className="default-page__orbit default-page__orbit--one"><span /></div>
          <div className="default-page__orbit default-page__orbit--two"><span /></div>
          <div className="default-page__orbit default-page__orbit--three" />
          <div className="default-page__planet default-page__planet--blue" />
          <div className="default-page__planet default-page__planet--light" />
          <div className="default-page__planet default-page__planet--violet" />
          <div className="default-page__core">
            <div className="default-page__core-glow" />
            <VicLogo className="default-page__core-logo" />
          </div>
          <div className="default-page__visual-caption"><ArrowDownRight size={15} /> Đang hoàn thiện</div>
          <div className="default-page__visual-index" aria-hidden="true">V / 01</div>
        </motion.div>
      </section>

      <footer className="default-page__footer">
        <span>WE DREAM IT. WE MAKE IT.</span>
        <span className="default-page__footer-note"><i aria-hidden="true" /> Hẹn bạn ở đây sớm thôi</span>
      </footer>
    </main>
  );
}
