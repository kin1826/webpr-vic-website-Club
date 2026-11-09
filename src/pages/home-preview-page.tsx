import { ClubOverviewSection } from "../components/sections/home-preview/club-overview-section";
import { DepartmentsOverviewSection } from "../components/sections/home-preview/departments-overview-section";
import { FeaturedActivitiesSection } from "../components/sections/home-preview/featured-activities-section";
import { HomePreviewJoinSection } from "../components/sections/home-preview/home-preview-join-section";
import { OrganizationPreviewSection } from "../components/sections/home-preview/organization-preview-section";
import { TransitionRibbon } from "../components/sections/home-preview/transition-ribbon";
import { HeroSection } from "../components/sections/hero-section";
import { useEffect, useState } from "react";
import type { RefObject } from "react";
import "../styles/home-preview.css";
import type { InteractiveGridHandle, InteractiveGridPalette } from "../components/shared/interactive-grid";

export function HomePreviewPage({ recruitmentPath = "/tuyen-thanh-vien", gridPalette, colorPreview = false, lucianInteractions = false, magneticCtas = false, heroRef, gridRef }: { recruitmentPath?: string; gridPalette?: InteractiveGridPalette; colorPreview?: boolean; lucianInteractions?: boolean; magneticCtas?: boolean; heroRef?: RefObject<HTMLElement | null>; gridRef?: RefObject<InteractiveGridHandle | null> }) {
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === "visible");

  useEffect(() => {
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return (
    <main id="main" data-page-visible={pageVisible} className="home-preview-motion">
      <HeroSection recruitmentPath={recruitmentPath} gridPalette={gridPalette} magneticCta={magneticCtas} heroRef={heroRef} gridRef={gridRef} />
      <TransitionRibbon />
      <ClubOverviewSection recruitmentPath={recruitmentPath} magneticCta={magneticCtas} />
      <FeaturedActivitiesSection coordinatedHover={lucianInteractions} />
      <DepartmentsOverviewSection />
      <OrganizationPreviewSection colorPreview={colorPreview} />
      <HomePreviewJoinSection recruitmentPath={recruitmentPath} lucianInteractions={lucianInteractions} />
    </main>
  );
}
