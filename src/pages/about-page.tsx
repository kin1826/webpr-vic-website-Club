import { AboutDepartmentsSection } from "../components/sections/about/about-departments-section";
import { AboutDirectionSection } from "../components/sections/about/about-direction-section";
import { AboutHeroSection } from "../components/sections/about/about-hero-section";
import { AboutInvitationSection } from "../components/sections/about/about-invitation-section";
import { AboutStorySection } from "../components/sections/about/about-story-section";
import { AboutTeamSection } from "../components/sections/about/about-team-section";
import "../styles/about.css";

export function AboutPage() {
  return (
    <main id="main" className="about-page">
      <AboutHeroSection />
      <AboutStorySection />
      <AboutDirectionSection />
      <AboutDepartmentsSection />
      <AboutTeamSection />
      <AboutInvitationSection />
    </main>
  );
}
