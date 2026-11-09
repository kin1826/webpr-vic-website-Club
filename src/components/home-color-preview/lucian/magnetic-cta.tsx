// Lucian UX/UI Prompt #002 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#002
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export function MagneticCta({ to, label = "Đăng ký tham gia VIC", compact = false }: { to: string; label?: string; compact?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const button = root?.querySelector<HTMLAnchorElement>(".u002-btn");
    const mag = root?.querySelector<HTMLDivElement>(".u002-mag");
    const text = root?.querySelector<HTMLSpanElement>(".u002-txt");
    const orb = root?.querySelector<HTMLSpanElement>(".u002-orb");
    if (!root || !button || !mag || !text || !orb) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let resetTimer: number | undefined;

    const onPointerMove = (event: PointerEvent) => {
      if (motionPreference.matches || event.pointerType === "touch") return;
      const rect = button.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const proximity = Math.max(0, 1 - Math.hypot(dx, dy) / 240);
      mag.style.translate = `${(dx * 0.12 * proximity).toFixed(1)}px ${(dy * 0.22 * proximity).toFixed(1)}px`;
      text.style.translate = `${(dx * 0.05 * proximity).toFixed(1)}px ${(dy * 0.08 * proximity).toFixed(1)}px`;
      orb.style.translate = `${(dx * 0.1 * proximity).toFixed(1)}px ${(dy * 0.14 * proximity).toFixed(1)}px`;
    };

    const onPointerLeave = () => {
      mag.style.translate = "0px 0px";
      text.style.translate = "0px 0px";
      orb.style.translate = "0px 0px";
    };

    const onClick = () => {
      window.clearTimeout(resetTimer);
      root.dataset.state = "idle";
      void button.offsetWidth;
      root.dataset.state = "go";
      resetTimer = window.setTimeout(() => {
        if (root.isConnected) root.dataset.state = "idle";
      }, motionPreference.matches ? 900 : 1900);
    };

    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);
    button.addEventListener("click", onClick);
    return () => {
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      button.removeEventListener("click", onClick);
      window.clearTimeout(resetTimer);
      onPointerLeave();
    };
  }, []);

  return (
    <div ref={rootRef} className={`ux u002${compact ? " u002--compact" : ""}`} data-state="idle">
      <span className="u002-glow" aria-hidden="true" />
      <div className="u002-mag">
        <Link className="u002-btn" to={to}>
          <span className="u002-fill" aria-hidden="true" />
          <span className="u002-txt">
            <span>{label}</span>
            <span aria-hidden="true">Đang mở trang tuyển sinh</span>
          </span>
          <span className="u002-orb" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
