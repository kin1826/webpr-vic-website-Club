import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useHyperMotion } from "./motion-context";

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}) {
  const { enabled } = useHyperMotion();
  const offset = direction === "left" ? { x: 34, y: 0 } : direction === "right" ? { x: -34, y: 0 } : { x: 0, y: 36 };
  return (
    <motion.div
      className={className}
      initial={enabled ? { opacity: 0, ...offset } : false}
      whileInView={enabled ? { opacity: 1, x: 0, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.78, delay, ease: [0.18, 0.82, 0.22, 1] }}
    >
      {children}
    </motion.div>
  );
}
