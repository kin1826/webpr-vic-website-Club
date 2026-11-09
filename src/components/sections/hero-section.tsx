import { motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import type { RefObject } from "react";
import { MagneticCta } from "../home-color-preview/lucian/magnetic-cta";
import { Button } from "../ui/button";
import { InteractiveGrid } from "../shared/interactive-grid";
import type { InteractiveGridHandle, InteractiveGridPalette } from "../shared/interactive-grid";

export function HeroSection({ recruitmentPath = "/tuyen-thanh-vien", gridPalette, magneticCta = false, heroRef, gridRef }: { recruitmentPath?: string; gridPalette?: InteractiveGridPalette; magneticCta?: boolean; heroRef?: RefObject<HTMLElement | null>; gridRef?: RefObject<InteractiveGridHandle | null> }) {
  const reduce = useReducedMotion();
  return <section ref={heroRef} id="top" className="relative grid min-h-[52rem] items-center overflow-hidden pb-24 pt-40 max-sm:min-h-0 max-sm:pb-28 max-sm:pt-36" aria-labelledby="hero-title">
    <InteractiveGrid ref={gridRef} enabled palette={gridPalette} />
    <div className="page-container relative z-10">
      <motion.p initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-7 flex items-center gap-3 font-mono text-xs font-semibold tracking-[.08em]"><span className="size-2.5 rounded-full bg-vic-blue shadow-[0_0_0_7px_rgba(36,87,245,.1)]" />VIC / VKU IT CLUB</motion.p>
      <motion.h1 id="hero-title" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .72, ease: [.22,1,.36,1] }} className="max-w-[66rem] text-[clamp(3.2rem,8.3vw,7rem)] font-extrabold leading-[1.06] tracking-[-.065em]">
        <span className="block">We dream it.</span><span className="block md:ml-[8vw]">We <span className="text-vic-blue">make</span> it.</span>
      </motion.h1>
      <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16, duration: .6 }} className="mt-[clamp(2.5rem,5.8vw,4.5rem)] grid items-end gap-8 md:grid-cols-[minmax(17rem,38rem)_auto]">
        <div><p className="mb-7 max-w-[38rem] text-[clamp(1rem,1.45vw,1.15rem)] leading-8 text-vic-muted">Một ý tưởng. Những người đồng hành.<br className="max-sm:hidden" /> Cùng VIC học hỏi, kết nối và biến những dòng code thành điều bạn có thể tự hào.</p><div className="flex flex-wrap items-center gap-3 max-sm:grid"><Button asChild><a href="#about">Khám phá VIC <ArrowDown size={17} /></a></Button>{magneticCta ? <MagneticCta to={recruitmentPath} label="Tham gia VIC" compact /> : <Button asChild variant="secondary"><Link to={recruitmentPath}>Tham gia VIC</Link></Button>}</div></div>
      </motion.div>
    </div>
  </section>;
}
