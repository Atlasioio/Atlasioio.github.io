"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

/**
 * Fades + lifts a block into place as it scrolls into view. Fires once and
 * respects prefers-reduced-motion. Renders a <section> by default; pass
 * `as="div"` when nesting inside an existing <section> to keep HTML valid.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 36,
  as = "section",
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "section" | "div";
  id?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (as === "div") {
    return (
      <motion.div
        id={id}
        className={className}
        initial={reduceMotion ? false : { opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.7,
          delay,
          ease: [0.22, 1, 0.36, 1] as const,
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.section
      id={id}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
    >
      {children}
    </motion.section>
  );
}
