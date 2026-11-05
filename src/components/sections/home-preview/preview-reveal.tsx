import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type PreviewRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  offset?: number;
  rotate?: number;
};

export function PreviewReveal({ children, className, delay = 0, offset = 28, rotate = 0 }: PreviewRevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: offset, rotate }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
