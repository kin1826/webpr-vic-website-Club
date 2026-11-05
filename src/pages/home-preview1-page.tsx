import { useEffect } from "react";
import { HyperNavigation } from "../components/home-preview1/navigation";
import { MotionProvider, useHyperMotion } from "../components/home-preview1/motion-context";
import { HyperHero } from "../components/home-preview1/hero-section";
import { HyperAbout } from "../components/home-preview1/about-section";
import { HyperActivities } from "../components/home-preview1/activities-section";
import { HyperTeams } from "../components/home-preview1/teams-section";
import { HyperOrganization } from "../components/home-preview1/organization-section";
import { HyperInvitation } from "../components/home-preview1/invitation-section";
import { HyperFooter } from "../components/home-preview1/footer";
import "../styles/home-preview1.css";

function HyperlabPageContent() {
  const { enabled } = useHyperMotion();

  useEffect(() => {
    const previousTitle = document.title;
    const theme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const previousTheme = theme?.content;
    document.title = "VIC / Hyperlab — VKU IT Club";
    if (theme) theme.content = "#04070D";
    return () => {
      document.title = previousTitle;
      if (theme && previousTheme) theme.content = previousTheme;
    };
  }, []);

  return (
    <div className="hyperlab" data-motion={enabled ? "on" : "off"}>
      <div className="hyper-ambient" aria-hidden="true"><i /><i /><i /></div>
      <HyperNavigation />
      <main id="main" className="hyper-main">
        <HyperHero />
        <HyperAbout />
        <HyperActivities />
        <HyperTeams />
        <HyperOrganization />
        <HyperInvitation />
      </main>
      <HyperFooter />
    </div>
  );
}

export function HomePreview1Page() {
  return <MotionProvider><HyperlabPageContent /></MotionProvider>;
}
