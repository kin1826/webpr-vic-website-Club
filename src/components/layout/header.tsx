import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navigation } from "../../config/site";
import { Button } from "../ui/button";
import { VicLogo } from "../shared/vic-logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(scrollY > 20); onScroll(); addEventListener("scroll", onScroll, { passive: true }); return () => removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; addEventListener("keydown", onKey); return () => removeEventListener("keydown", onKey); }, []);
  useEffect(() => { document.body.toggleAttribute("data-scroll-locked", open); return () => document.body.removeAttribute("data-scroll-locked"); }, [open]);

  return <>
    <header className={`glass-surface fixed left-1/2 top-4 z-50 flex h-[4.65rem] w-[min(calc(100%-2.5rem),72.5rem)] -translate-x-1/2 items-center rounded-full px-3 pl-5 transition-all md:top-[1.1rem] ${scrolled ? "bg-white/88 shadow-[0_14px_44px_rgba(22,22,22,.13)]" : ""}`}>
      <a href="/#top" className="flex shrink-0 items-center gap-3" aria-label="VIC — Trang chủ"><VicLogo className="w-[4.9rem]" /><span className="hidden leading-tight sm:grid"><strong className="text-xs tracking-wide">VKU IT CLUB</strong><span className="font-mono text-[.6rem] text-vic-muted">WE MAKE IT.</span></span></a>
      <nav className="mx-auto hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">{navigation.map(item => <a key={item.href} href={`/${item.href}`} className="rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-vic-blue-soft hover:text-vic-blue">{item.label}</a>)}</nav>
      <Button asChild size="sm" className="ml-auto hidden lg:inline-flex"><a href="/#join">Tham gia VIC</a></Button>
      <Button size="icon" className="ml-auto lg:hidden" onClick={() => setOpen(value => !value)} aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} aria-controls="mobile-menu">{open ? <X size={20} /> : <Menu size={20} />}</Button>
    </header>
    <AnimatePresence>
      {open && <motion.nav id="mobile-menu" className="glass-surface fixed left-5 right-5 top-[6.4rem] z-40 rounded-[1.75rem] bg-white/90 p-4 lg:hidden" aria-label="Điều hướng di động" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
        {[...navigation, { label: "Tham gia VIC", href: "#join" }].map(item => <a key={item.href} href={`/${item.href}`} onClick={() => setOpen(false)} className="flex min-h-13 items-center justify-between border-b border-black/10 px-3 text-sm font-semibold last:border-0 last:text-vic-blue">{item.label}<span aria-hidden="true">↘</span></a>)}
      </motion.nav>}
    </AnimatePresence>
  </>;
}
