import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { InteractiveGrid } from "../shared/interactive-grid";

export function HeroSection() {
  const reduce = useReducedMotion();
  const [motionEnabled, setMotionEnabled] = useState(!reduce);
  return <section id="top" className="relative grid min-h-[55rem] items-center overflow-hidden pb-24 pt-40 max-sm:min-h-0 max-sm:pb-28 max-sm:pt-36" aria-labelledby="hero-title">
    <InteractiveGrid enabled={motionEnabled} />
    <div className="page-container relative z-10">
      <motion.p initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-7 flex items-center gap-3 font-mono text-xs font-semibold tracking-[.08em]"><span className="size-2.5 rounded-full bg-vic-blue shadow-[0_0_0_7px_rgba(36,87,245,.1)]" />VIC / VKU IT CLUB</motion.p>
      <motion.h1 id="hero-title" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .72, ease: [.22,1,.36,1] }} className="max-w-[66rem] text-[clamp(3.2rem,8.3vw,7rem)] font-extrabold leading-[1.06] tracking-[-.065em]">
        <span className="block">We dream it.</span><span className="block md:ml-[8vw]">We <span className="text-vic-blue">make</span> it.</span>
      </motion.h1>
      <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16, duration: .6 }} className="mt-[clamp(2.5rem,5.8vw,4.5rem)] grid items-end gap-8 md:grid-cols-[minmax(17rem,38rem)_auto]">
        <div><p className="mb-7 max-w-[38rem] text-[clamp(1rem,1.45vw,1.15rem)] leading-8 text-vic-muted">Một ý tưởng. Những người đồng hành.<br className="max-sm:hidden" /> Cùng VIC học hỏi, kết nối và biến những dòng code thành điều bạn có thể tự hào.</p><div className="flex flex-wrap gap-3 max-sm:grid"><Button asChild><a href="#about">Khám phá VIC <ArrowDown size={17} /></a></Button><Button asChild variant="secondary"><Link to="/tham-gia">Tham gia VIC</Link></Button></div></div>
        <button type="button" aria-pressed={motionEnabled} onClick={() => setMotionEnabled(value => !value)} className="glass-surface flex min-h-11 w-fit items-center gap-2 rounded-full px-4 text-xs font-semibold"><span className={`relative h-[1.1rem] w-7 rounded-full transition-colors ${motionEnabled ? "bg-vic-blue" : "bg-neutral-400"}`}><span className={`absolute top-0.5 size-3.5 rounded-full bg-white transition-transform ${motionEnabled ? "translate-x-3" : "translate-x-0.5"}`} /></span><Sparkles size={15} />Chuyển động {motionEnabled ? "bật" : "tắt"}</button>
      </motion.div>
    </div>
  </section>;
}
