import { motion, useReducedMotion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";

export function Reveal({ children, transition, ...props }: HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .14 }}
      transition={{ duration: .55, ease: [.22, 1, .36, 1], ...transition }}
      {...props}
    >{children}</motion.div>
  );
}
