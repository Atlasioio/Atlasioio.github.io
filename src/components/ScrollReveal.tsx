"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode, useState } from "react";

/**
 * Fades + lifts a block into place as it scrolls into view. Fires once and
 * respects prefers-reduced-motion. Renders a <section> by default; pass
 * `as="div"` when nesting inside an existing <section> to keep HTML valid.
 *
 * After the entry animation completes, the transform + will-change are
 * stripped — otherwise Framer Motion leaves a permanent composite layer that
 * forces every nested image/video to rasterize at logical pixels (causing
 * blur on HiDPI displays).
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
  const [done, setDone] = useState(reduceMotion ?? false);

  // After the entry animation, remove the transform so children render at
  // native device-pixel resolution. Without this, every image/video below a
  // ScrollReveal sits inside a permanent Framer-Motion composite layer.
  const restingStyle = done
    ? { transform: "none", willChange: "auto" as const }
    : undefined;

  const sharedProps = {
    id,
    className,
    initial: reduceMotion ? (false as const) : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.08 },
    transition: {
      duration: 1.0,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
    onAnimationComplete: () => setDone(true),
    style: restingStyle,
  };

  if (as === "div") {
    return <motion.div {...sharedProps}>{children}</motion.div>;
  }
  return <motion.section {...sharedProps}>{children}</motion.section>;
}
