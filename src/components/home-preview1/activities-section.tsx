import { ArrowUpRight, CalendarDays, Cpu, Layers3, Radio, ScanLine } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import { activities } from "../../data/site-data";
import type { Activity } from "../../types/content-model";
import { Reveal } from "./reveal";
import { useHyperMotion } from "./motion-context";

const statusLabels: Record<Activity["status"], string> = {
  upcoming: "Sắp diễn ra",
  recap: "Đã diễn ra",
  undated: "Chưa có lịch",
};

const modelData: Record<string, { title: string; caption: string; className: string; Icon: typeof Radio }> = {
  "activity-sharing": { title: "SIGNAL / 01", caption: "Trao đổi qua lại", className: "sharing", Icon: Radio },
  "activity-challenge": { title: "ASSEMBLY / 02", caption: "Tìm đúng cấu trúc", className: "challenge", Icon: Cpu },
  "activity-show": { title: "DISPLAY / 03", caption: "Đưa bản dựng ra ánh sáng", className: "show", Icon: ScanLine },
  "activity-open-lab": { title: "PROTOTYPE / 04", caption: "Mở một hướng thử mới", className: "open", Icon: Layers3 },
};

function ModelViewport({ activity, index }: { activity: Activity; index: number }) {
  const model = modelData[activity.id] ?? modelData["activity-sharing"];
  const Icon = model.Icon;
  return (
    <div className={"hyper-model-viewport hyper-model-viewport--" + model.className} aria-hidden="true">
      <div className="hyper-model-stage">
        <div className="hyper-model-platform" />
        {model.className === "sharing" && <><div className="hyper-chip hyper-chip--a"><i /><i /><i /></div><div className="hyper-chip hyper-chip--b"><i /><i /><i /></div><div className="hyper-packet" /><div className="hyper-link-beam" /></>}
        {model.className === "challenge" && <><div className="hyper-puzzle hyper-puzzle--a" /><div className="hyper-puzzle hyper-puzzle--b" /><div className="hyper-puzzle hyper-puzzle--c" /><div className="hyper-puzzle-socket" /></>}
        {model.className === "show" && <><div className="hyper-display-frame"><div className="hyper-display-object" /><div className="hyper-display-edge" /></div><div className="hyper-light-sweep" /></>}
        {model.className === "open" && <><div className="hyper-explode hyper-explode--a" /><div className="hyper-explode hyper-explode--b" /><div className="hyper-explode hyper-explode--c" /><div className="hyper-explode-core" /></>}
      </div>
      <div className="hyper-model-index"><span>{model.title}</span><Icon size={16} strokeWidth={1.5} /></div>
      <div className="hyper-model-caption"><span>{model.caption}</span><span>{String(index + 1).padStart(2, "0")}</span></div>
    </div>
  );
}

function ActivityCard({ activity, index }: { activity: Activity; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { margin: "160px 0px", amount: 0.12 });
  const modelClass = modelData[activity.id]?.className ?? "sharing";
  const rotateX = useSpring(useMotionValue(0), { stiffness: 230, damping: 22, mass: 0.45 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 230, damping: 22, mass: 0.45 });
  const { enabled } = useHyperMotion();

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!enabled || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateX.set(-y * 5);
    rotateY.set(x * 5);
  };
  const resetTilt = () => { rotateX.set(0); rotateY.set(0); };

  return (
    <Reveal delay={index * 0.09} className="hyper-card-reveal">
      <motion.article
        ref={ref}
        className={"hyper-activity-card hyper-activity-card--" + (visible ? "visible" : "quiet") + " hyper-activity-card--" + modelClass}
        style={{ rotateX, rotateY, transformPerspective: 1100 }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        onBlur={resetTilt}
      >
        <Link to={"/hoat-dong/" + activity.slug} className="hyper-activity-link">
          <ModelViewport activity={activity} index={index} />
          <div className="hyper-activity-copy">
            <div className="hyper-activity-meta">
              <span>{activity.type}</span><span>{statusLabels[activity.status]}</span>
              {activity.isDemo && <span className="hyper-sample-tag">Hoạt động mẫu</span>}
            </div>
            <h3>{activity.title}</h3>
            <p>{activity.summary}</p>
            <div className="hyper-card-foot">
              <span><CalendarDays size={15} aria-hidden="true" />{activity.date ?? "Ngày sẽ được cập nhật"}</span>
              <span className="hyper-card-cta">Khám phá <ArrowUpRight size={16} aria-hidden="true" /></span>
            </div>
          </div>
        </Link>
      </motion.article>
    </Reveal>
  );
}

export function HyperActivities() {
  const items = activities.filter((activity) => activity.featured).slice(0, 4);
  return (
    <section id="hyper-activities" className="hyper-section hyper-activities" aria-labelledby="hyper-activities-title">
      <div className="hyper-activities-light" aria-hidden="true" />
      <div className="hyper-container">
        <Reveal className="hyper-section-heading">
          <div><p className="hyper-kicker"><span /> Thử một cách mới để học</p><h2 id="hyper-activities-title">Học một điều.<br /><em>Làm ra điều khác.</em></h2></div>
          <div><p>Bốn hoạt động mẫu, bốn cách để thử sức, kết nối và chia sẻ cùng cộng đồng.</p><Link className="hyper-inline-link hyper-inline-link--light" to="/hoat-dong">Khám phá tất cả hoạt động <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        </Reveal>
        {items.length ? <div className="hyper-activity-grid">{items.map((activity, index) => <ActivityCard key={activity.id} activity={activity} index={index} />)}</div> : <p className="hyper-empty">Hoạt động tiêu biểu sẽ được cập nhật tại đây.</p>}
      </div>
    </section>
  );
}
