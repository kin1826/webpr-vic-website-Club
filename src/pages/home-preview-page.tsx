import { ClubOverviewSection } from "../components/sections/home-preview/club-overview-section";
import { DepartmentsOverviewSection } from "../components/sections/home-preview/departments-overview-section";
import { FeaturedActivitiesSection } from "../components/sections/home-preview/featured-activities-section";
import { HomePreviewJoinSection } from "../components/sections/home-preview/home-preview-join-section";
import { OrganizationPreviewSection } from "../components/sections/home-preview/organization-preview-section";
import { TransitionRibbon } from "../components/sections/home-preview/transition-ribbon";
import { HeroSection } from "../components/sections/hero-section";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import "../styles/home-preview.css";

export function HomePreviewPage() {
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === "visible");
  const reduce = useReducedMotion();
  const [motionEnabled, setMotionEnabled] = useState(!reduce);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return (
    <main id="main" data-page-visible={pageVisible} className="home-preview-motion">
      <HeroSection motionEnabled={motionEnabled} onToggleMotion={() => setMotionEnabled((value) => !value)} />
      <TransitionRibbon motionEnabled={motionEnabled} />
      <ClubOverviewSection />
      <FeaturedActivitiesSection />
      <DepartmentsOverviewSection />
      <OrganizationPreviewSection />
      <HomePreviewJoinSection />
    </main>
  );
}
