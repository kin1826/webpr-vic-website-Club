import { ArrowUpRight, CalendarDays, FileText, MoveUpRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { activities } from "../../../data/site-data";
import type { Activity } from "../../../types/content-model";
import { PreviewReveal } from "./preview-reveal";
import { usePreviewVisibility } from "./use-preview-visibility";

const statusLabels: Record<Activity["status"], string> = {
  upcoming: "Sắp diễn ra",
  recap: "Đã diễn ra",
  undated: "Chưa có lịch",
};

const artworkCopy: Record<string, { eyebrow: string; title: string; mark: string }> = {
  "activity-sharing": { eyebrow: "Tìm hiểu cùng nhau", title: "Tech\nSharing", mark: "Hỏi" },
  "activity-challenge": { eyebrow: "Thử sức cùng nhau", title: "Mini\nChallenge", mark: "Thử" },
  "activity-show": { eyebrow: "Chia sẻ điều đã làm", title: "Build\n& Show", mark: "Kể" },
  "activity-open-lab": { eyebrow: "Biến tò mò thành thử nghiệm", title: "Open\nLab", mark: "Làm" },
};

function ActivityArtwork({ activity, index }: { activity: Activity; index: number }) {
  const copy = artworkCopy[activity.id] ?? { eyebrow: activity.category, title: activity.type, mark: "VIC" };
  const reduce = useReducedMotion();

  return (
    <div className={`home-preview-activity-art relative isolate flex aspect-[16/10] items-end overflow-hidden p-6 sm:p-8 ${index % 3 === 1 ? "bg-vic-blue text-white" : index % 3 === 2 ? "bg-vic-ink text-white" : "bg-vic-blue-soft text-vic-ink"}`} aria-hidden="true">
      <motion.span className="home-preview-art-orbit absolute right-[10%] top-[12%] grid aspect-square w-[42%] place-items-center rounded-full border border-current/20" initial={reduce ? false : { scale: 0.7, rotate: -25, opacity: 0 }} whileInView={reduce ? undefined : { scale: 1, rotate: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}>
        <motion.span className="home-preview-art-core grid aspect-square w-[68%] place-items-center rounded-full border border-current/30" whileHover={reduce ? undefined : { rotate: 18, scale: 1.06 }} transition={{ duration: 0.45 }}><FileText className="size-8 sm:size-11" strokeWidth={1.15} /></motion.span>
      </motion.span>
      <motion.span className="home-preview-art-frame absolute right-[18%] top-[20%] h-[58%] w-[34%] border border-current/20" initial={reduce ? false : { rotate: 12, x: 24 }} whileInView={reduce ? undefined : { rotate: index === 1 ? -12 : 6, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.12 }} />
      <div className="relative z-10 max-w-[60%]">
        <p className="text-[.65rem] font-semibold tracking-[.08em] opacity-70">{copy.eyebrow}</p>
        <p className="mt-3 whitespace-pre-line text-[clamp(2rem,4vw,3.4rem)] font-bold leading-[.9] tracking-[-.065em]">{copy.title}</p>
      </div>
      <span className="absolute left-5 top-5 font-mono text-xs opacity-55">{copy.mark}</span>
      <span className={`absolute bottom-5 right-5 rounded-full px-3 py-1 text-[.65rem] font-semibold ${index % 3 === 2 ? "bg-white/10 text-white/80" : index % 3 === 1 ? "bg-white/15 text-white" : "bg-white/70 text-vic-muted"}`}>Hình minh họa</span>
      <motion.span className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-current/70" initial={reduce ? false : { scaleX: 0 }} whileInView={reduce ? undefined : { scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, delay: 0.25 }} />
    </div>
  );
}

function ActivityCardPreview({ activity, index }: { activity: Activity; index: number }) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const geometryRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const latestPointerRef = useRef({ x: 50, y: 50 });
  const pointerFrameRef = useRef(0);
  const { ref: visibilityRef, isVisible } = usePreviewVisibility<HTMLElement>();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerY, { stiffness: 170, damping: 22, mass: 0.6 });
  const rotateY = useSpring(pointerX, { stiffness: 170, damping: 22, mass: 0.6 });

  useEffect(() => {
    const invalidateBounds = () => { boundsRef.current = null; };
    window.addEventListener("resize", invalidateBounds, { passive: true });
    window.addEventListener("scroll", invalidateBounds, { passive: true });
    return () => {
      window.removeEventListener("resize", invalidateBounds);
      window.removeEventListener("scroll", invalidateBounds);
      cancelAnimationFrame(pointerFrameRef.current);
    };
  }, []);

  const refreshBounds = () => {
    const geometry = geometryRef.current;
    if (geometry) boundsRef.current = geometry.getBoundingClientRect();
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const bounds = boundsRef.current;
    if (!bounds) {
      refreshBounds();
    }
    const currentBounds = boundsRef.current;
    if (!currentBounds || currentBounds.width === 0 || currentBounds.height === 0) return;
    const x = (event.clientX - currentBounds.left) / currentBounds.width;
    const y = (event.clientY - currentBounds.top) / currentBounds.height;
    latestPointerRef.current = { x: x * 100, y: y * 100 };
    pointerX.set((x - 0.5) * 5);
    pointerY.set((0.5 - y) * 5);
    if (!pointerFrameRef.current) {
      pointerFrameRef.current = requestAnimationFrame(() => {
        pointerFrameRef.current = 0;
        const card = cardRef.current;
        if (!card) return;
        card.style.setProperty("--preview-pointer-x", `${latestPointerRef.current.x}%`);
        card.style.setProperty("--preview-pointer-y", `${latestPointerRef.current.y}%`);
      });
    }
  };
  const resetPointer = (element?: HTMLElement) => {
    cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = 0;
    boundsRef.current = null;
    latestPointerRef.current = { x: 50, y: 50 };
    pointerX.set(0);
    pointerY.set(0);
    element?.style.setProperty("--preview-pointer-x", "50%");
    element?.style.setProperty("--preview-pointer-y", "50%");
  };

  return (
    <div ref={geometryRef} className="h-full" onPointerEnter={refreshBounds} onPointerMove={handlePointerMove} onPointerLeave={(event) => resetPointer(cardRef.current ?? event.currentTarget)}>
      <motion.article ref={(node) => { cardRef.current = node; visibilityRef.current = node; }} data-preview-visible={isVisible} className="home-preview-activity-card h-full" style={{ rotateX, rotateY, transformPerspective: 1000 }} onFocus={(event) => resetPointer(event.currentTarget)} initial={reduce ? false : { opacity: 0, y: 46, rotate: index === 1 ? 2 : -2 }} whileInView={reduce ? undefined : { opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] }} whileHover={reduce ? undefined : { y: -8, rotate: index === 1 ? -0.7 : 0.7 }}>
        <Link to={`/hoat-dong/${activity.slug}`} className="group flex h-full flex-col overflow-hidden border border-black/10 bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vic-blue/25">
          <div className="relative overflow-hidden"><ActivityArtwork activity={activity} index={index} /><motion.span className="home-preview-activity-arrow absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white/85 text-vic-ink shadow-lg backdrop-blur" initial={reduce ? false : { scale: 0, rotate: -50 }} whileInView={reduce ? undefined : { scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.4 + index * 0.1 }}><MoveUpRight size={18} aria-hidden="true" /></motion.span></div>
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              {activity.isDemo && <span className="bg-vic-blue-soft px-3 py-1.5 text-vic-blue">Nội dung minh họa</span>}
              <span className="bg-vic-surface px-3 py-1.5 text-vic-muted">{statusLabels[activity.status]}</span>
            </div>
            <p className="mt-5 text-xs font-semibold text-vic-blue">{activity.type} thuộc nhóm {activity.category}</p>
            <h3 className="mt-2 text-xl font-semibold leading-snug tracking-[-.03em] group-hover:text-vic-blue">{activity.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-7 text-vic-muted">{activity.summary}</p>
            <span className="mt-6 inline-flex min-h-11 items-center gap-2 border-t border-black/10 pt-4 text-sm font-semibold">
              <CalendarDays size={16} className="text-vic-blue" /><span>{activity.date ?? "Ngày sẽ được cập nhật"}</span>
              <ArrowUpRight size={16} className="ml-auto transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <span className="sr-only">: Xem {activity.title}</span>
            </span>
          </div>
        </Link>
      </motion.article>
    </div>
  );
}

export function FeaturedActivitiesSection() {
  const featured = activities.filter((activity) => activity.featured).slice(0, 4);
  const { ref, isVisible } = usePreviewVisibility<HTMLElement>();

  return (
    <section ref={ref} data-preview-visible={isVisible} className="home-preview-activities section-space bg-vic-surface" aria-labelledby="preview-activities-title">
      <div className="home-preview-activity-grid-window" aria-hidden="true">
        <span className="home-preview-activity-grid home-preview-activity-grid-horizontal" />
        <span className="home-preview-activity-grid home-preview-activity-grid-vertical" />
      </div>
      <div className="page-container">
        <div className="mb-10 grid gap-7 lg:mb-16 lg:grid-cols-[1fr_auto] lg:items-end">
          <PreviewReveal>
            <p className="mb-3 text-sm font-semibold text-vic-blue">Bốn cách để cùng bắt đầu</p>
            <h2 id="preview-activities-title" className="max-w-3xl text-[clamp(2.5rem,5.6vw,5rem)] font-bold leading-[.98] tracking-[-.07em]">Điều VIC làm,<br className="max-sm:hidden" /> cùng bạn.</h2>
          </PreviewReveal>
          <PreviewReveal delay={0.16} offset={18}>
            <p className="mb-4 max-w-md text-sm leading-7 text-vic-muted">Từ buổi chia sẻ đến lúc giới thiệu điều mình đã làm, mỗi hoạt động mở ra một cách để thử sức.</p>
            <Link to="/hoat-dong" className="inline-flex min-h-11 items-center gap-2 border-b-2 border-vic-blue px-1 text-sm font-semibold text-vic-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vic-blue/25">Mở kho hoạt động <ArrowUpRight size={17} /></Link>
          </PreviewReveal>
        </div>

        {featured.length > 0 ? (
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:gap-7">
            {featured.map((activity, index) => <div className="min-w-0" key={activity.id}><ActivityCardPreview activity={activity} index={index} /></div>)}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-black/15 bg-white/70 p-8 text-sm text-vic-muted">Hoạt động tiêu biểu sẽ được cập nhật tại đây.</p>
        )}
      </div>
    </section>
  );
}
