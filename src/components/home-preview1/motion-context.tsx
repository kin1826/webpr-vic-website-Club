import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

type MotionState = {
  enabled: boolean;
  prefersReduced: boolean;
  toggle: () => void;
};

const MotionContext = createContext<MotionState | null>(null);

export function MotionProvider({ children }: { children: ReactNode }) {
  const systemPreference = useReducedMotion();
  const [manualEnabled, setManualEnabled] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const prefersReduced = Boolean(systemPreference);
  const enabled = manualEnabled && !prefersReduced && pageVisible;

  useEffect(() => {
    const syncVisibility = () => setPageVisible(document.visibilityState === "visible");
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.hyperMotion = enabled ? "on" : "off";
    return () => { delete document.documentElement.dataset.hyperMotion; };
  }, [enabled]);

  const value = useMemo(() => ({
    enabled,
    prefersReduced,
    toggle: () => setManualEnabled((enabled) => !enabled),
  }), [enabled, manualEnabled, prefersReduced]);

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useHyperMotion() {
  const value = useContext(MotionContext);
  if (!value) throw new Error("useHyperMotion must be used inside MotionProvider");
  return value;
}
