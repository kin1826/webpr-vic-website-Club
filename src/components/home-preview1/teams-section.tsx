import { ArrowUpRight, Braces, Clapperboard } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { departments } from "../../data/site-data";
import { Reveal } from "./reveal";
import { useHyperMotion } from "./motion-context";

const teamVisuals = [
  { Icon: Braces, line: "STRUCTURE / 01", verb: "Thiết kế → Thử nghiệm → Hoàn thiện" },
  { Icon: Clapperboard, line: "STORY / 02", verb: "Quan sát → Kể chuyện → Kết nối" },
];

export function HyperTeams() {
  const { enabled } = useHyperMotion();
  return (
    <section id="hyper-teams" className="hyper-section hyper-teams" aria-labelledby="hyper-teams-title">
      <div className="hyper-container">
        <Reveal className="hyper-section-heading hyper-team-heading">
          <div><p className="hyper-kicker"><span /> Hai hướng làm việc, cùng một mục tiêu</p><h2 id="hyper-teams-title">Ý tưởng cần<br /><em>nhiều góc nhìn.</em></h2></div>
          <p>Có người biến câu hỏi thành bản thử. Có người giúp hành trình ấy được nhìn thấy và lan tỏa.</p>
        </Reveal>
        <div className="hyper-team-grid">
          {departments.map((department, index) => {
            const visual = teamVisuals[index] ?? teamVisuals[0];
            const Icon = visual.Icon;
            return (
              <Reveal key={department.id} delay={index * 0.1} className="hyper-team-wrap">
                <motion.article className={"hyper-team hyper-team--" + department.id} whileHover={enabled ? { y: -4 } : undefined} transition={{ duration: 0.28 }}>
                  <div className="hyper-team-stage" aria-hidden="true">
                    <span className="hyper-team-data">{visual.line}</span>
                    <div className="hyper-team-architecture">
                      <i /><i /><i /><i /><b><Icon size={27} strokeWidth={1.4} /></b>
                    </div>
                    <span className="hyper-team-axis">{visual.verb}</span>
                  </div>
                  <div className="hyper-team-copy">
                    <p className="hyper-team-name">{department.shortName}</p>
                    <h3>{department.name}</h3>
                    <p>{department.summary}</p>
                    <div className="hyper-team-tags">{department.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <Link to={"/" + department.slug}>Khám phá ban <ArrowUpRight size={17} aria-hidden="true" /></Link>
                  </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
        <div className="hyper-team-connector" aria-hidden="true"><span /><i /><span /></div>
      </div>
    </section>
  );
}
