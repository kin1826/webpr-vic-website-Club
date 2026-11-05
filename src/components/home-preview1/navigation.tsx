import { ArrowDownRight, ArrowUpRight, Menu, Pause, Play, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { VicLogo } from "../shared/vic-logo";
import { useHyperMotion } from "./motion-context";

const links = [
  { label: "Về VIC", href: "#hyper-about" },
  { label: "Hoạt động", href: "#hyper-activities" },
  { label: "Các ban", href: "#hyper-teams" },
  { label: "Cơ cấu", href: "#hyper-organization" },
];

function MotionControl() {
  const { enabled, prefersReduced, toggle } = useHyperMotion();
  const id = useId();
  return (
    <button
      type="button"
      className="hyper-motion-control"
      aria-pressed={enabled}
      aria-describedby={prefersReduced ? id : undefined}
      disabled={prefersReduced}
      onClick={toggle}
    >
      {enabled ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
      <span>{prefersReduced ? "Theo cài đặt giảm chuyển động" : enabled ? "Tạm dừng chuyển động" : "Bật chuyển động"}</span>
      {prefersReduced && <span id={id} className="hyper-sr-only">Thiết bị đang ưu tiên giảm chuyển động.</span>}
    </button>
  );
}

export function HyperNavigation() {
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
        <a className="hyper-brand" href="#hyper-top" aria-label="VIC — về đầu trang">
          <VicLogo className="hyper-brand-logo" />
          <span><strong>VKU IT CLUB</strong><small>Học · Làm · Chia sẻ</small></span>
        </a>
        <nav className="hyper-desktop-nav" aria-label="Điều hướng chính">
          {links.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          <MotionControl />
        </nav>
        <Link className="hyper-nav-cta" to="/tham-gia">Tham gia VIC <ArrowUpRight size={16} aria-hidden="true" /></Link>
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
        <MotionControl />
        <Link className="hyper-mobile-cta" to="/tham-gia" onClick={close}>Tìm hiểu cách tham gia <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </nav>
    </header>
  );
}
