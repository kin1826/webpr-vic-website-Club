import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { VicLogo } from "../shared/vic-logo";

export function HyperFooter() {
  return (
    <footer className="hyper-footer">
      <div className="hyper-container">
        <div className="hyper-footer-main">
          <a href="#hyper-top" className="hyper-footer-brand" aria-label="VIC — về đầu trang">
            <VicLogo dark className="hyper-footer-logo" />
            <span><strong>VKU IT CLUB</strong><small>We dream it. We make it.</small></span>
          </a>
          <nav aria-label="Liên kết cuối trang">
            <Link to="/gioi-thieu">Về VIC <ArrowUpRight size={14} /></Link>
            <Link to="/hoat-dong">Hoạt động <ArrowUpRight size={14} /></Link>
            <Link to="/hoctap">Ban Học tập <ArrowUpRight size={14} /></Link>
            <Link to="/truyenthong">Ban Truyền thông <ArrowUpRight size={14} /></Link>
            <Link to="/tuyen-thanh-vien">Tham gia <ArrowUpRight size={14} /></Link>
          </nav>
        </div>
        <div className="hyper-footer-meta"><span>© {new Date().getFullYear()} VIC · VKU IT Club</span><span>Hyperlab / Home preview 01</span></div>
      </div>
    </footer>
  );
}
