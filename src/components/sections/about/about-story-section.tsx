import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { homeActivityGroups } from "../../../data/home-activity-groups";
import { aboutPageContent } from "../../../data/about-content";
import { PreviewReveal } from "../home-preview/preview-reveal";

export function AboutStorySection() {
  const { story } = aboutPageContent;

  return (
    <section id="cau-chuyen" className="about-story scroll-mt-28" aria-labelledby="about-story-title">
      <div className="page-container">
        <div className="about-story-grid">
          <PreviewReveal className="about-story-lead">
            <p className="about-section-kicker">MỘT ĐIỂM BẮT ĐẦU CHUNG</p>
            <h2 id="about-story-title">{story.title}</h2>
            <span className="about-story-scribble" aria-hidden="true">
              <svg viewBox="0 0 340 24" fill="none"><path d="M4 16C67 3 111 22 176 12S276 5 336 14" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /></svg>
            </span>
          </PreviewReveal>

          <PreviewReveal className="about-story-body" delay={0.1}>
            {story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="about-activity-intro">Chúng mình gặp nhau qua những hoạt động như:</p>
            <ul className="about-activity-list" aria-label="Các nhóm hoạt động của VIC">
              {homeActivityGroups.map((activity) => <li key={activity.id}>{activity.title}</li>)}
            </ul>
            <Link className="about-text-link" to="/hoat-dong">Xem các hoạt động <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </PreviewReveal>
        </div>

        <div className="about-principles" aria-label="Tinh thần hoạt động tại VIC">
          {story.principles.map((principle, index) => (
            <PreviewReveal key={principle.title} className="about-principle" delay={index * 0.055} offset={14}>
              <span className="about-principle-mark" aria-hidden="true" />
              <span><strong>{principle.title}</strong><small>{principle.description}</small></span>
            </PreviewReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
