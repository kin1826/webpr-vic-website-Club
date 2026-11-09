import { OrganizationChart } from "../../organization/organization-chart";
import { aboutPageContent } from "../../../data/about-content";
import { PreviewReveal } from "../home-preview/preview-reveal";

export function AboutTeamSection() {
  return (
    <section id="doi-ngu" className="about-team section-space scroll-mt-28" aria-labelledby="about-team-title">
      <div className="page-container">
        <PreviewReveal className="about-team-heading">
          <p className="about-section-kicker">NHỮNG NGƯỜI ĐỒNG HÀNH</p>
          <h2 id="about-team-title">{aboutPageContent.team.title}</h2>
          <p>{aboutPageContent.team.introduction} Chọn một poster để xem hồ sơ.</p>
        </PreviewReveal>
        <OrganizationChart />
      </div>
    </section>
  );
}
