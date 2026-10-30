import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { VicLogo } from "../shared/vic-logo";

const primaryLinks = [{ label: "Về VIC", to: "/gioi-thieu" }, { label: "Hoạt động", to: "/hoat-dong" }, { label: "Học thuật", to: "/hoc-thuat" }];
const departmentLinks = [{ label: "Ban Học tập", to: "/hoctap" }, { label: "Ban Truyền thông", to: "/truyenthong" }];
const navClass = ({ isActive }: { isActive: boolean }) => cn("rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-vic-blue-soft hover:text-vic-blue", isActive && "bg-vic-blue-soft text-vic-blue");

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const departmentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const departmentActive = departmentLinks.some((item) => location.pathname === item.to);

  useEffect(() => { const onScroll = () => setScrolled(scrollY > 20); onScroll(); addEventListener("scroll", onScroll, { passive: true }); return () => removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { setMobileOpen(false); setDepartmentOpen(false); }, [location.pathname]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setMobileOpen(false); setDepartmentOpen(false); } };
    const onOutside = (event: PointerEvent) => { if (departmentRef.current && !departmentRef.current.contains(event.target as Node)) setDepartmentOpen(false); };
    addEventListener("keydown", onKey); addEventListener("pointerdown", onOutside);
    return () => { removeEventListener("keydown", onKey); removeEventListener("pointerdown", onOutside); };
  }, []);
  useEffect(() => { document.body.toggleAttribute("data-scroll-locked", mobileOpen); return () => document.body.removeAttribute("data-scroll-locked"); }, [mobileOpen]);

  return <>
    <header className={cn("glass-surface fixed left-1/2 top-4 z-50 flex h-[4.65rem] w-[min(calc(100%-2.5rem),72.5rem)] -translate-x-1/2 items-center rounded-full px-3 pl-5 transition-all md:top-[1.1rem]", scrolled && "bg-white/88 shadow-[0_14px_44px_rgba(22,22,22,.13)]")}>
      <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="VIC — Trang chủ"><VicLogo className="w-[4.9rem]" /><span className="hidden leading-tight sm:grid"><strong className="text-xs tracking-wide">VKU IT CLUB</strong><span className="font-mono text-[.6rem] text-vic-muted">WE MAKE IT.</span></span></Link>
      <nav className="mx-auto hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">
        <NavLink to="/gioi-thieu" className={navClass}>Về VIC</NavLink>
        <div className="relative" ref={departmentRef}><button type="button" onClick={() => setDepartmentOpen((value) => !value)} aria-expanded={departmentOpen} aria-controls="department-menu" className={cn("flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-vic-blue-soft hover:text-vic-blue", departmentActive && "bg-vic-blue-soft text-vic-blue")}>Các ban <ChevronDown size={14} className={cn("transition-transform", departmentOpen && "rotate-180")} /></button>
          <AnimatePresence>{departmentOpen && <motion.div id="department-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="glass-surface absolute left-1/2 top-[calc(100%+.8rem)] w-60 -translate-x-1/2 rounded-[1.35rem] bg-white/92 p-2"><NavLink to="/hoctap" className={({ isActive }) => cn("block rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-vic-blue-soft", isActive && "bg-vic-blue-soft text-vic-blue")}>Ban Học tập<span className="mt-1 block text-xs font-normal text-vic-muted">Công nghệ & sản phẩm</span></NavLink><NavLink to="/truyenthong" className={({ isActive }) => cn("mt-1 block rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-vic-blue-soft", isActive && "bg-vic-blue-soft text-vic-blue")}>Ban Truyền thông<span className="mt-1 block text-xs font-normal text-vic-muted">Nội dung & media</span></NavLink></motion.div>}</AnimatePresence>
        </div>
        {primaryLinks.slice(1).map((item) => <NavLink key={item.to} to={item.to} className={navClass}>{item.label}</NavLink>)}
      </nav>
      <Button asChild size="sm" className="ml-auto hidden lg:inline-flex"><Link to="/tham-gia">Tham gia VIC</Link></Button>
      <Button size="icon" className="ml-auto lg:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label={mobileOpen ? "Đóng menu" : "Mở menu"} aria-expanded={mobileOpen} aria-controls="mobile-menu">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</Button>
    </header>
    <AnimatePresence>{mobileOpen && <motion.nav id="mobile-menu" className="glass-surface fixed bottom-4 left-4 right-4 top-[6.2rem] z-40 overflow-y-auto rounded-[1.75rem] bg-white/94 p-4 lg:hidden" aria-label="Điều hướng di động" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <NavLink to="/gioi-thieu" className="flex min-h-13 items-center justify-between border-b border-black/10 px-3 font-semibold">Về VIC <span>↘</span></NavLink>
      <p className="px-3 pb-2 pt-5 font-mono text-[.66rem] font-semibold text-vic-muted">CÁC BAN</p>{departmentLinks.map((item) => <NavLink key={item.to} to={item.to} className="flex min-h-12 items-center justify-between rounded-2xl px-4 text-sm font-semibold hover:bg-vic-blue-soft">{item.label}<span>↗</span></NavLink>)}
      <p className="px-3 pb-2 pt-5 font-mono text-[.66rem] font-semibold text-vic-muted">KHÁM PHÁ</p>{[{ label: "Hoạt động", to: "/hoat-dong" }, { label: "Sản phẩm", to: "/san-pham" }, { label: "Học thuật", to: "/hoc-thuat" }].map((item) => <NavLink key={item.to} to={item.to} className="flex min-h-12 items-center justify-between rounded-2xl px-4 text-sm font-semibold hover:bg-vic-blue-soft">{item.label}<span>↗</span></NavLink>)}
      <Button asChild className="mt-5 w-full"><Link to="/tham-gia">Tham gia VIC</Link></Button>
    </motion.nav>}</AnimatePresence>
  </>;
}
