import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";
import type { HeroTheme } from "../components/home-preview1/theme-types";
import type { InteractiveGridHandle, InteractiveGridPalette } from "../components/shared/interactive-grid";
import { HomePreviewPage } from "./home-preview-page";
import "../styles/color-preview-theme.css";
import "../styles/home-color-preview.css";
import "../styles/home-preview-lucian.css";
import "../styles/home-preview1-theme.css";

const THEME_STORAGE_KEY = "vic.home-preview1.theme";
const LIGHT_RECRUITMENT_PATH = "/tuyen-thanh-vien";
const DARK_RECRUITMENT_PATH = "/tuyen-thanh-vien-preview";
const DARK_GRID_PALETTE = {
  line: [215, 225, 245],
  fill: [21, 88, 201],
  stroke: [212, 255, 36],
} as const satisfies InteractiveGridPalette;
const LIGHT_GRID_PALETTE = {
  line: [20, 20, 20],
  fill: [36, 87, 245],
  stroke: [20, 20, 20],
} as const satisfies InteractiveGridPalette;

function readThemePreference(): { theme: HeroTheme; manual: boolean } {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") return { theme: saved, manual: true };
  } catch {
    // Use the system preference when browser storage is unavailable.
  }

  return { theme: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light", manual: false };
}

function saveThemePreference(theme: HeroTheme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Keep the selected theme active for this visit if storage is blocked.
  }
}

function HomePreview1Content() {
  const prefersReducedMotion = useReducedMotion();
  const transitionInProgress = useRef(false);
  const softTransitionTimer = useRef<number | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<InteractiveGridHandle>(null);
  const [initialPreference] = useState(readThemePreference);
  const [theme, setTheme] = useState<HeroTheme>(initialPreference.theme);
  const [hasManualTheme, setHasManualTheme] = useState(initialPreference.manual);

  useEffect(() => {
    if (hasManualTheme) return;
    const systemPreference = matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setTheme(systemPreference.matches ? "dark" : "light");
    systemPreference.addEventListener("change", updateTheme);
    return () => systemPreference.removeEventListener("change", updateTheme);
  }, [hasManualTheme]);

  useEffect(() => {
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!themeColor) return;
    const previousThemeColor = themeColor.content;
    themeColor.content = theme === "dark" ? "#030407" : "#f6f8fc";
    return () => { themeColor.content = previousThemeColor; };
  }, [theme]);

  useEffect(() => () => {
    if (softTransitionTimer.current !== null) window.clearTimeout(softTransitionTimer.current);
  }, []);

  const clearSoftTransition = () => {
    if (softTransitionTimer.current !== null) window.clearTimeout(softTransitionTimer.current);
    softTransitionTimer.current = null;
    delete pageRef.current?.dataset.themeTransition;
  };

  const startSoftTransition = () => {
    clearSoftTransition();
    if (prefersReducedMotion) return;
    const page = pageRef.current;
    if (!page) return;
    page.dataset.themeTransition = "soft";
    softTransitionTimer.current = window.setTimeout(() => {
      delete page.dataset.themeTransition;
      softTransitionTimer.current = null;
    }, 280);
  };

  const startFlipTransition = () => {
    clearSoftTransition();
    const page = pageRef.current;
    if (!page) return;
    page.dataset.themeTransition = "flip";
    softTransitionTimer.current = window.setTimeout(() => {
      delete page.dataset.themeTransition;
      softTransitionTimer.current = null;
    }, 1080);
  };

  const toggleTheme = (button: HTMLButtonElement) => {
    if (transitionInProgress.current) return;

    const nextTheme: HeroTheme = theme === "dark" ? "light" : "dark";
    setHasManualTheme(true);
    const hero = heroRef.current;
    const heroRect = hero?.getBoundingClientRect();
    const heroIsVisible = Boolean(heroRect && heroRect.top < window.innerHeight && heroRect.bottom > 0);
    if (!prefersReducedMotion && heroRect && heroIsVisible) {
      const buttonRect = button.getBoundingClientRect();
      const nextGridPalette = nextTheme === "dark" ? DARK_GRID_PALETTE : LIGHT_GRID_PALETTE;
      const started = gridRef.current?.flipToTheme(
        nextGridPalette,
        buttonRect.left + buttonRect.width / 2 - heroRect.left,
        buttonRect.top + buttonRect.height / 2 - heroRect.top,
        () => {
          transitionInProgress.current = false;
          clearSoftTransition();
        },
      ) ?? false;
      transitionInProgress.current = started;
      if (started) startFlipTransition();
      else startSoftTransition();
    } else {
      startSoftTransition();
    }

    saveThemePreference(nextTheme);
    setTheme(nextTheme);
  };

  const isDark = theme === "dark";
  const recruitmentPath = isDark ? DARK_RECRUITMENT_PATH : LIGHT_RECRUITMENT_PATH;

  return (
    <div
      ref={pageRef}
      className={`vic-home-preview1${isDark ? " vic-color-preview" : ""}`}
      data-theme={theme}
      data-vic-theme={isDark ? "home-demo01" : undefined}
      data-vic-details="lucian"
    >
      <Header
        homePath="/home-preview1"
        recruitmentPath={recruitmentPath}
        lucianCta
        theme={theme}
        onThemeToggle={toggleTheme}
      />
      <HomePreviewPage
        recruitmentPath={recruitmentPath}
        gridPalette={isDark ? DARK_GRID_PALETTE : undefined}
        colorPreview={isDark}
        lucianInteractions
        magneticCtas
        heroRef={heroRef}
        gridRef={gridRef}
      />
      <Footer recruitmentPath={recruitmentPath} />
    </div>
  );
}

export function HomePreview1Page() {
  return <HomePreview1Content />;
}
