import { Reveal } from "../shared/reveal";

export function SpiritStrip() {
  return <Reveal className="page-container relative z-10 -mt-9"><div className="glass-surface glass-highlight grid min-h-28 grid-cols-[1fr_auto_1fr] items-center justify-center gap-3 rounded-[2rem] px-6 text-center sm:flex sm:gap-7"><strong>Học hỏi</strong><span className="font-mono text-vic-blue">+</span><strong>Kết nối</strong><span className="hidden font-mono text-vic-blue sm:block">+</span><strong>Thử nghiệm</strong><span className="font-mono text-vic-blue">+</span><strong>Cùng phát triển</strong></div></Reveal>;
}
