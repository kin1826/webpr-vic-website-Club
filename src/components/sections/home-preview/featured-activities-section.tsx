import { Camera, Code2, Compass, Presentation, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { homeActivityGroups } from "../../../data/home-activity-groups";
import type { HomeActivityGroup } from "../../../types/home-preview";
import { PreviewReveal } from "./preview-reveal";
import { usePreviewVisibility } from "./use-preview-visibility";

const activityIcons: Record<HomeActivityGroup["icon"], LucideIcon> = {
  presentation: Presentation,
  code: Code2,
  camera: Camera,
  compass: Compass,
};

const imageTints: Record<HomeActivityGroup["id"], string> = {
  "tech-sharing": "from-[#071c3d]/65 via-[#0b3672]/15 to-transparent",
  "mini-hackathon": "from-[#15113c]/65 via-[#273eb0]/18 to-transparent",
  "creative-studio": "from-[#3a123c]/60 via-[#b52e71]/15 to-transparent",
  extracurricular: "from-[#132e34]/60 via-[#2c786f]/15 to-transparent",
};

function ActivityGroupCard({ group, index, coordinatedHover }: { group: HomeActivityGroup; index: number; coordinatedHover: boolean }) {
  const reduce = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const Icon = activityIcons[group.icon];

  return (
    <motion.article
      className="home-preview-activity-card group overflow-hidden rounded-[1.65rem] border border-black/10 bg-white/90 shadow-[0_16px_48px_rgba(22,22,22,.055)] backdrop-blur-sm"
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.7, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { y: -5 }}
      onHoverStart={coordinatedHover ? () => setIsHovered(true) : undefined}
      onHoverEnd={coordinatedHover ? () => setIsHovered(false) : undefined}
    >
      <div className="home-preview-activity-cover relative aspect-[16/9] overflow-hidden bg-vic-ink">
        <motion.img
          src={group.cover}
          alt={group.coverAlt}
          loading="lazy"
          decoding="async"
          className="home-preview-activity-image size-full object-cover"
          style={{ objectPosition: group.imagePosition }}
          animate={coordinatedHover ? reduce ? undefined : { scale: isHovered ? 1.045 : 1 } : undefined}
          whileHover={!coordinatedHover && !reduce ? { scale: 1.045 } : undefined}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        />
        <span className={`absolute inset-0 bg-gradient-to-br ${imageTints[group.id]}`} aria-hidden="true" />
        <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/35 bg-[#091326]/45 px-3.5 py-2 font-mono text-[.65rem] font-semibold tracking-[.12em] text-white backdrop-blur-md">
            {group.number} <span className="mx-1 text-white/50">/</span> VIC ACTIVITY
          </span>
          <motion.span
            className="grid size-11 shrink-0 place-items-center rounded-full border border-white/45 bg-white/85 text-vic-ink shadow-lg backdrop-blur"
            animate={coordinatedHover ? reduce ? undefined : { rotate: isHovered ? 8 : 0, scale: isHovered ? 1.06 : 1 } : undefined}
            whileHover={!coordinatedHover && !reduce ? { rotate: 8, scale: 1.06 } : undefined}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          >
            <Icon size={19} strokeWidth={1.8} />
          </motion.span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[.67rem] font-bold tracking-[.13em] text-vic-blue">{group.eyebrow}</p>
          <span className="font-mono text-xs text-vic-muted/70">{group.number} / 04</span>
        </div>
        <h3 className="mt-3 text-[1.4rem] font-semibold leading-tight tracking-[-.045em] text-vic-ink sm:text-[1.65rem]">{group.title}</h3>
        <p className="mt-3 min-h-[4.5rem] text-sm leading-7 text-vic-muted">{group.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Nội dung của ${group.title}`}>
          {group.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-black/[.07] bg-vic-surface/80 px-3 py-1.5 text-xs font-medium text-vic-muted">{tag}</li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export function FeaturedActivitiesSection({ coordinatedHover = false }: { coordinatedHover?: boolean }) {
  const { ref, isVisible } = usePreviewVisibility<HTMLElement>();

  return (
    <section
      ref={ref}
      data-preview-visible={isVisible}
      id="hoat-dong"
      className="home-preview-activities section-space bg-vic-surface"
      aria-labelledby="preview-activities-title"
    >
      <div className="home-preview-activity-grid-window" aria-hidden="true">
        <span className="home-preview-activity-grid home-preview-activity-grid-horizontal" />
        <span className="home-preview-activity-grid home-preview-activity-grid-vertical" />
      </div>

      <div className="page-container">
        <div className="mb-10 grid gap-7 lg:mb-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <PreviewReveal>
            <p className="mb-3 text-sm font-semibold text-vic-blue">04 NHÓM HOẠT ĐỘNG</p>
            <h2 id="preview-activities-title" className="max-w-3xl text-[clamp(2.5rem,5.6vw,5rem)] font-bold leading-[.98] tracking-[-.07em] text-balance">
              Cùng học, cùng làm,<br className="max-sm:hidden" /> cùng tạo kỷ niệm.
            </h2>
          </PreviewReveal>
          <PreviewReveal delay={0.12} offset={18}>
            <p className="max-w-md text-sm leading-7 text-vic-muted">
              Từ chia sẻ công nghệ, thử sức Hackathon đến sáng tạo nội dung và những buổi ngoại khóa hằng tháng.
            </p>
          </PreviewReveal>
        </div>

        <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:gap-6">
          {homeActivityGroups.map((group, index) => (
            <ActivityGroupCard key={group.id} group={group} index={index} coordinatedHover={coordinatedHover} />
          ))}
        </div>
      </div>
    </section>
  );
}
