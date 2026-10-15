import { AboutSection } from "../components/sections/about-section";
import { ActivitiesSection } from "../components/sections/activities-section";
import { FaqSection } from "../components/sections/faq-section";
import { HeroSection } from "../components/sections/hero-section";
import { JoinSection } from "../components/sections/join-section";
import { ProjectsSection } from "../components/sections/projects-section";
import { SpiritStrip } from "../components/sections/spirit-strip";
import { TeamsSection } from "../components/sections/teams-section";

export function HomePage() {
  return <main id="main"><HeroSection /><SpiritStrip /><AboutSection /><TeamsSection /><ActivitiesSection /><ProjectsSection /><JoinSection /><FaqSection /></main>;
}
