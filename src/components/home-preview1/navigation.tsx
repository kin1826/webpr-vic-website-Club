import { ArrowDownRight, ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { VicLogo } from "../shared/vic-logo";
import type { HeroTheme } from "./theme-types";

const links = [
  { label: "Về VIC", href: "#hyper-about" },
  { label: "Hoạt động", href: "#hyper-activities" },
  { label: "Các ban", href: "#hyper-teams" },
  { label: "Cơ cấu", href: "#hyper-organization" },
];

export function HyperNavigation({ theme, onThemeToggle }: { theme: HeroTheme; onThemeToggle: (button: HTMLButtonElement) => void }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="hyper-header">
      <div className="hyper-nav-inner">
        <a className="hyper-brand" href="#top" aria-label="VIC — về đầu trang">
          <VicLogo className="hyper-brand-logo" />
          <span><strong>VKU IT CLUB</strong><small>Học · Làm · Chia sẻ</small></span>
        </a>
        <nav className="hyper-desktop-nav" aria-label="Điều hướng chính">
          {links.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <button
          type="button"
          className="hyper-theme-toggle"
          aria-label={theme === "dark" ? "Chuyển hero sang giao diện sáng" : "Chuyển hero sang giao diện tối"}
          aria-pressed={theme === "dark"}
          onClick={(event) => onThemeToggle(event.currentTarget)}
        >
          {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          <span className="hyper-sr-only">Giao diện {theme === "dark" ? "tối" : "sáng"}</span>
        </button>
        <Link className="hyper-nav-cta" to="/tuyen-thanh-vien-preview">Tham gia VIC <ArrowUpRight size={16} aria-hidden="true" /></Link>
        <button
          ref={triggerRef}
          type="button"
          className="hyper-menu-trigger"
          aria-expanded={open}
          aria-controls="hyper-mobile-nav"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <nav id="hyper-mobile-nav" className="hyper-mobile-nav" aria-label="Điều hướng di động" hidden={!open}>
        {links.map((item) => <a key={item.href} href={item.href} onClick={close}>{item.label}<ArrowDownRight size={16} aria-hidden="true" /></a>)}
        <Link className="hyper-mobile-cta" to="/tuyen-thanh-vien-preview" onClick={close}>Tìm hiểu cách tham gia <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </nav>
    </header>
  );
}
