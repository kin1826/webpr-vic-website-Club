import { useState } from "react";
import { ArrowUpRight, ExternalLink, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { departments, members } from "../../data/site-data";
import type { DepartmentId, Member } from "../../types/content-model";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

type LeadershipGalleryProps = {
  departmentId?: DepartmentId;
  id?: string;
  colorPreview?: boolean;
};

function LeaderCard({ member, index, onOpen, colorPreview = false }: { member: Member; index: number; onOpen: () => void; colorPreview?: boolean }) {
  const reduceMotion = useReducedMotion();
  const replayWhenVisible = colorPreview && member.departmentId === null;
  const accent = member.accentColor ?? "#2457f5";
  const textAccent = member.accentTextColor ?? accent;

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: !replayWhenVisible, amount: 0.12 }}
      whileHover={reduceMotion ? undefined : { y: -4, scale: 1.012 }}
      whileFocus={colorPreview && !reduceMotion ? { y: -4, scale: 1.012 } : undefined}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.52, delay: index * 0.065, ease: [0.22, 1, 0.36, 1] }}
      style={{ borderColor: `${accent}35` }}
      className="group block w-full overflow-hidden border bg-white text-left shadow-[0_16px_44px_rgba(22,22,22,.07)] transition-[box-shadow,border-color] hover:shadow-[0_24px_58px_rgba(22,22,22,.13)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vic-blue/25"
      aria-label={`Xem giới thiệu ${member.name}, ${member.role}`}
    >
      <span className="relative block aspect-square overflow-hidden" style={{ backgroundColor: `${accent}0d` }}>
        {member.poster && <img src={member.poster} alt={`Poster giới thiệu ${member.name}`} loading="lazy" decoding="async" width={960} height={960} className="size-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.025]" />}
        <span className="pointer-events-none absolute inset-2 border opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ borderColor: `${accent}85` }} aria-hidden="true" />
      </span>
      <span className="flex min-h-28 items-center justify-between gap-3 px-5 py-4 sm:px-6">
        <span className="min-w-0">
          <span className="block font-mono text-[10px] font-semibold uppercase tracking-[.16em]" style={{ color: textAccent }}>{member.role}</span>
          <span className="mt-2 block text-lg font-bold leading-tight tracking-[-.035em] text-vic-ink sm:text-xl">{member.name}</span>
        </span>
        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-black/10 transition-colors group-hover:border-transparent group-hover:bg-vic-ink group-hover:text-white" aria-hidden="true"><ArrowUpRight size={19} /></span>
      </span>
    </motion.button>
  );
}

function InformationItem({ label, value, wide = false }: { label: string; value?: string; wide?: boolean }) {
  if (!value) return null;
  return <div className={wide ? "sm:col-span-2" : undefined}>
    <dt className="font-mono text-[10px] font-semibold uppercase tracking-[.14em] text-vic-muted">{label}</dt>
    <dd className="mt-1.5 break-words text-sm font-medium leading-6 text-vic-ink">{value}</dd>
  </div>;
}

function MemberPanel({ member }: { member: Member }) {
  const accent = member.accentColor ?? "#2457f5";
  return (
    <>
      <div className="px-6 md:px-8">
        {member.poster && <div className="relative mx-auto aspect-square w-full max-w-[28rem] overflow-hidden" style={{ backgroundColor: `${accent}0d` }}>
          <span className="absolute inset-3 border" style={{ borderColor: `${accent}65` }} aria-hidden="true" />
          <img src={member.poster} alt={`Poster giới thiệu ${member.name}`} width={960} height={960} className="size-full object-contain" />
        </div>}
      </div>
      <div className="space-y-6 px-6 pb-9 pt-6 md:px-8">
        {member.slogan && <blockquote className="border-l-[3px] pl-4 text-lg font-semibold leading-7 tracking-[-.02em] text-vic-ink" style={{ borderColor: accent }}><span className="mb-2 block font-mono text-[10px] uppercase tracking-[.15em]" style={{ color: accent }}>Một câu dành cho mình</span>“{member.slogan}”</blockquote>}
        <dl className="grid gap-x-6 gap-y-5 border-y border-black/10 py-5 sm:grid-cols-2">
          <InformationItem label="Năm học / Khóa" value={member.academicYear} />
          <InformationItem label="Khoa" value={member.faculty} />
          <InformationItem label="Chuyên ngành" value={member.major} wide />
          <InformationItem label="Trường" value={member.school} wide />
        </dl>
        {member.portfolioUrl && <Button asChild className="w-full" style={{ backgroundColor: member.accentTextColor ?? accent }}>
          <a href={member.portfolioUrl} target="_blank" rel="noreferrer noopener">Xem portfolio <ExternalLink size={16} aria-hidden="true" /></a>
        </Button>}
      </div>
    </>
  );
}

export function LeadershipGallery({ departmentId, id = "doi-ngu", colorPreview = false }: LeadershipGalleryProps) {
  const [selected, setSelected] = useState<Member | null>(null);
  const reduceMotion = useReducedMotion();
  const leaders = members.filter((member) => member.poster && member.departmentId === null);
  const visibleDepartments = departments.filter((department) => !departmentId || department.id === departmentId);

  return (
    <div id={id} className="scroll-mt-32">
      {!departmentId && <section aria-labelledby="leadership-board-title">
        <div className="mb-5 flex items-end justify-between gap-4 border-b border-black/10 pb-4">
          <div><p className="section-label">BAN CHỦ NHIỆM</p><h3 id="leadership-board-title" className="mt-2 text-2xl font-bold tracking-[-.045em] sm:text-3xl">Người giữ nhịp chung</h3></div>
          <span className="hidden font-mono text-xs text-vic-muted sm:block">01—02 / VIC</span>
        </div>
        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 sm:gap-6">{leaders.map((member, index) => <LeaderCard key={member.id} member={member} index={index} onOpen={() => setSelected(member)} colorPreview={colorPreview} />)}</div>
      </section>}

      <div className={!departmentId ? "mt-14 grid gap-12 xl:grid-cols-2" : ""}>
        {visibleDepartments.map((department) => {
          const departmentMembers = members.filter((member) => member.poster && member.departmentId === department.id);
          return <section key={department.id} className={!departmentId ? "min-w-0" : undefined} aria-labelledby={`leaders-${department.id}-title`}>
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-black/10 pb-4">
              <div><p className="section-label">{departmentId ? "ĐỘI NGŨ BAN" : "CÙNG VẬN HÀNH"}</p><h3 id={`leaders-${department.id}-title`} className="mt-2 text-2xl font-bold tracking-[-.045em] sm:text-3xl">{department.name}</h3></div>
              <GraduationCap size={21} className="shrink-0 text-vic-blue" aria-hidden="true" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">{departmentMembers.map((member, index) => <LeaderCard key={member.id} member={member} index={index + leaders.length} onOpen={() => setSelected(member)} colorPreview={colorPreview} />)}</div>
          </section>;
        })}
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        {selected && <DialogContent position="right" title={selected.name} description={selected.role} colorTheme={colorPreview ? "home-demo01" : undefined} className="p-0">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, delay: 0.08 }}><MemberPanel member={selected} /></motion.div>
        </DialogContent>}
      </Dialog>
    </div>
  );
}
