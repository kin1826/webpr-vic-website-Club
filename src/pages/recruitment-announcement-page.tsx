import { ArrowUpRight, CalendarDays, MousePointer2, Sparkles, UsersRound } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import workshopImage from "../../image/vic-workshop-2526.webp";
import { recruitmentAnnouncement } from "../data/recruitment-announcement";
import { VicLogo } from "../components/shared/vic-logo";
import "../styles/recruitment-announcement.css";

export function RecruitmentAnnouncementPage() {
  const reduceMotion = useReducedMotion();
  const { generation, audience, introduction, departments, deadline, applicationUrl } = recruitmentAnnouncement;
  const generationLabel = String(generation).padStart(2, "0");

  return (
    <main id="main" className="recruitment-page">
      <div className="recruitment-page-glow recruitment-page-glow--one" aria-hidden="true" />
      <div className="recruitment-page-glow recruitment-page-glow--two" aria-hidden="true" />

      <div className="recruitment-shell">
        <motion.header
          className="recruitment-topbar"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link to="/" className="recruitment-brand" aria-label="VIC — về trang chủ">
            <VicLogo className="w-[4.5rem]" />
            <span><strong>VKU IT CLUB</strong><small>WE DREAM IT. WE MAKE IT.</small></span>
          </Link>
          <Link className="recruitment-home-link" to="/"><span>Về trang chủ</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
        </motion.header>

        <motion.section
          className="recruitment-poster"
          aria-labelledby="recruitment-title"
          initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="recruitment-copy">
            <motion.p
              className="recruitment-kicker"
              initial={reduceMotion ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.24, duration: 0.5 }}
            >
              <span className="recruitment-live-dot" aria-hidden="true" />
              <span>THÔNG BÁO TUYỂN THÀNH VIÊN</span>
              <span className="recruitment-kicker-generation">GEN {generationLabel}</span>
            </motion.p>

            <motion.h1
              id="recruitment-title"
              className="recruitment-title"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.66, ease: [0.22, 1, 0.36, 1] }}
            >
              Gen {generation},<br />
              <span>còn chỗ</span><br />
              <span className="recruitment-title-blue">cho bạn.</span>
            </motion.h1>

            <motion.p
              className="recruitment-intro"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.58 }}
            >
              {introduction}
            </motion.p>

            <motion.div
              className="recruitment-details"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.55 }}
            >
              <div className="recruitment-audience">
                <span className="recruitment-audience-icon"><UsersRound size={18} aria-hidden="true" /></span>
                <span><small>DÀNH CHO</small><strong>{audience}</strong></span>
              </div>
              <div className="recruitment-departments" aria-label="Các ban tuyển thành viên">
                {departments.map((department) => <span key={department}>{department}</span>)}
              </div>
              {deadline && <p className="recruitment-deadline"><CalendarDays size={15} aria-hidden="true" /><span>Nhận đăng ký đến <strong>{deadline}</strong></span></p>}
            </motion.div>

            <motion.div
              className="recruitment-cta-area"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.55 }}
            >
              <span className="recruitment-click-note"><MousePointer2 size={17} aria-hidden="true" />Click vào tôi đi <span aria-hidden="true">👀</span></span>
              <a className="recruitment-form-cta" href={applicationUrl} target="_blank" rel="noreferrer">
                <span>Form đăng kí tham gia VIC</span>
                <span className="recruitment-cta-icon"><ArrowUpRight size={22} aria-hidden="true" /></span>
              </a>
              <p className="recruitment-cta-caption"><Sparkles size={16} aria-hidden="true" /> Đăng kí bằng tài khoản Gmail VKU</p>
            </motion.div>
          </div>

          <aside className="recruitment-scene" aria-label="Không khí cộng đồng VIC">
            <div className="recruitment-scene-grid" aria-hidden="true" />
            <div className="recruitment-orbit recruitment-orbit--outer" aria-hidden="true" />
            <div className="recruitment-orbit recruitment-orbit--inner" aria-hidden="true" />
            <div className="recruitment-photo-frame">
              <img src={workshopImage} alt="Các thành viên VIC cùng tham gia một sự kiện tại VKU" />
            </div>
            <motion.div
              className="recruitment-gen-sticker"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.65, rotate: 14 }}
              animate={{ opacity: 1, scale: 1, rotate: 8 }}
              transition={{ type: "spring", stiffness: 190, damping: 15, delay: 0.48 }}
            >
              <span>THẾ HỆ</span><strong>{generationLabel}</strong><small>ĐANG TÌM BẠN!</small>
            </motion.div>
            <motion.div
              className="recruitment-side-note"
              initial={reduceMotion ? false : { opacity: 0, x: 16, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 5 }}
              transition={{ delay: 0.64, duration: 0.55 }}
            >
              <span aria-hidden="true">✳</span> Không cần biết hết.<br />Chỉ cần muốn bắt đầu.
            </motion.div>
          </aside>
        </motion.section>
      </div>
    </main>
  );
}
