import { ArrowUpRight, Code2, Megaphone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { departments } from "../../../data/site-data";
import { aboutPageContent } from "../../../data/about-content";
import { PreviewReveal } from "../home-preview/preview-reveal";

const departmentVisuals = {
  learning: { icon: Code2, phrase: "Nơi ý tưởng được làm." },
  media: { icon: Megaphone, phrase: "Nơi hành trình được kể." },
} as const;

export function AboutDepartmentsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="hai-ban" className="about-departments scroll-mt-28" aria-labelledby="about-departments-title">
      <svg className="about-departments-line" viewBox="0 0 1200 700" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <motion.path
          d="M-20 490C183 490 236 220 432 244S711 475 883 341 1077 164 1225 186"
          stroke="var(--vic-blue)"
          strokeWidth="1.5"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="page-container">
        <div className="about-departments-heading">
          <PreviewReveal>
            <p className="about-section-kicker about-section-kicker--light">CÙNG MỘT CỘNG ĐỒNG</p>
            <h2 id="about-departments-title">{aboutPageContent.departments.title}</h2>
          </PreviewReveal>
          <PreviewReveal delay={0.12} className="about-departments-intro">
            <p>{aboutPageContent.departments.introduction}</p>
          </PreviewReveal>
        </div>

        <div className="about-department-list">
          {departments.map((department, index) => {
            const visual = departmentVisuals[department.id];
            const Icon = visual.icon;

            return (
              <PreviewReveal key={department.id} delay={index * 0.12} offset={22}>
                <Link
                  to={`/${department.slug}`}
                  className={`about-department-row about-department-row--${department.id}`}
                  aria-label={`Khám phá ${department.name}`}
                >
                  <span className="about-department-identity">
                    <span className="about-department-icon"><Icon size={22} aria-hidden="true" /></span>
                    <span className="about-department-phrase">{visual.phrase}</span>
                    <strong>{department.name}</strong>
                    <small>{department.summary}</small>
                  </span>
                  <span className="about-department-directions">
                    {department.directions.slice(0, 4).map((direction) => <span key={direction.title}>{direction.title}</span>)}
                  </span>
                  <span className="about-department-arrow" aria-hidden="true"><ArrowUpRight size={21} /></span>
                </Link>
              </PreviewReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
