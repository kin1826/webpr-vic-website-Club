import { useInView } from "motion/react";
import { useRef } from "react";

/** Tracks a section boundary so its continuous CSS motion can pause offscreen. */
export function usePreviewVisibility<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const isVisible = useInView(ref, { amount: 0.01, margin: "96px 0px" });

  return { ref, isVisible };
}
