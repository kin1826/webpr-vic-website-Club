import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "../../data/content";
import type { Project } from "../../types/content";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Reveal } from "../shared/reveal";
import { SectionHeading } from "../shared/section-heading";

function ProjectVisual({ category }: Pick<Project, "category">) {
  if (category === "Web") return <div className="grid h-60 place-items-center bg-[#e9ebf0]" aria-hidden="true"><div className="project-browser h-36 w-[78%] rounded-2xl bg-white p-4 shadow-[0_20px_40px_rgba(22,22,22,.14)]"><div className="mb-4 flex gap-1.5"><i className="size-1.5 rounded-full bg-neutral-300" /><i className="size-1.5 rounded-full bg-neutral-300" /><i className="size-1.5 rounded-full bg-neutral-300" /></div><div className="grid h-[calc(100%-1.4rem)] grid-cols-[.7fr_1.3fr] gap-2.5"><span className="rounded-lg bg-vic-blue-soft" /><span className="rounded-lg bg-vic-blue" /></div></div></div>;
  if (category === "Game") return <div className="relative h-60 overflow-hidden bg-vic-ink" aria-hidden="true"><i className="absolute left-[16%] top-[26%] size-12 rotate-45 border border-white/35" /><i className="absolute right-[18%] top-[18%] size-20 rotate-45 bg-vic-blue shadow-[0_0_55px_rgba(36,87,245,.5)]" /><i className="absolute bottom-[8%] left-[43%] size-24 rotate-45 border border-white/35" /></div>;
  return <div className="grid h-60 place-items-center bg-vic-blue-soft" aria-hidden="true"><div className="project-tool grid w-[76%] grid-cols-[.38fr_1fr] gap-2.5 rounded-2xl bg-white p-4 shadow-[0_20px_40px_rgba(36,87,245,.16)]"><span className="h-24 rounded-lg bg-vic-surface" /><span className="h-24 rounded-lg bg-vic-blue" /></div></div>;
}

export function ProjectsSection() {
  const reduce = useReducedMotion();
  return <section id="projects" className="section-space bg-vic-surface" aria-labelledby="projects-title"><div className="page-container"><Reveal><SectionHeading label="04 / MADE BY MEMBERS" id="projects-title" title={<>Từ ý tưởng đến thứ<br />có thể trải nghiệm.</>} description="Một góc dành cho những sản phẩm và thử nghiệm của thành viên VIC." /></Reveal><div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{projects.map((project, index) => <Dialog key={project.id}><DialogTrigger asChild><motion.button type="button" initial={reduce ? false : { opacity: 0, y: 18 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .07 }} whileHover={reduce ? undefined : { y: -4 }} className="glass-surface group overflow-hidden rounded-[2rem] text-left"><ProjectVisual category={project.category} /><div className="p-6"><div className="flex justify-between font-mono text-[.68rem] font-medium text-vic-blue"><span>DỰ ÁN MINH HỌA</span><span>{project.category}</span></div><h3 className="mt-3 flex items-center justify-between text-xl font-semibold tracking-[-.03em]">{project.name}<ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></h3><p className="mb-5 mt-2 text-sm leading-7 text-vic-muted">{project.description}</p><Badge>{project.category}</Badge></div></motion.button></DialogTrigger><DialogContent title={project.name} description={`${project.description} Phần giới thiệu này cho thấy cách nội dung dự án có thể xuất hiện khi VIC cung cấp dữ liệu thật.`}><p className="mt-6 rounded-2xl bg-vic-blue-soft p-4 text-sm leading-6 text-[#193baf]">Đây là nội dung minh họa bố cục cho prototype, chưa phải sản phẩm thật của VIC.</p></DialogContent></Dialog>)}</div></div></section>;
}
