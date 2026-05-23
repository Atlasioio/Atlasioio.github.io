"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Variant = "a" | "b" | "c";
type Scheme = "recruiters" | "designers" | "developers";

type Shape = { rx: string; rotate: number; skewX: number; skewY: number };

// Each tab uses a distinct family of shapes so the three audiences read as
// visually different. Designers + developers are intentionally less slanted.
const SHAPES: Record<Scheme, Record<Variant, Shape>> = {
  recruiters: {
    a: {
      rx: "32% 6% 26% 8% / 6% 30% 8% 26%",
      rotate: -0.9,
      skewX: -1.8,
      skewY: -0.3,
    },
    b: {
      rx: "8% 28% 4% 32% / 26% 4% 32% 6%",
      rotate: 0.7,
      skewX: -1.2,
      skewY: 0.2,
    },
    c: {
      rx: "20% 10% 30% 8% / 10% 22% 6% 30%",
      rotate: -0.5,
      skewX: 1.2,
      skewY: -0.4,
    },
  },
  designers: {
    a: {
      rx: "44% 12% 38% 14% / 14% 38% 16% 32%",
      rotate: -0.4,
      skewX: -0.4,
      skewY: -0.15,
    },
    b: {
      rx: "16% 38% 12% 42% / 36% 12% 38% 14%",
      rotate: 0.35,
      skewX: 0.35,
      skewY: 0.1,
    },
    c: {
      rx: "30% 14% 32% 10% / 14% 32% 12% 30%",
      rotate: -0.25,
      skewX: -0.3,
      skewY: 0.2,
    },
  },
  developers: {
    a: {
      rx: "12% 16% 14% 12% / 14% 18% 14% 16%",
      rotate: 0.2,
      skewX: 0,
      skewY: -0.1,
    },
    b: {
      rx: "22% 14% 18% 12% / 16% 20% 14% 18%",
      rotate: -0.3,
      skewX: 0.4,
      skewY: 0,
    },
    c: {
      rx: "14% 10% 20% 16% / 14% 16% 12% 18%",
      rotate: 0.15,
      skewX: -0.25,
      skewY: 0.2,
    },
  },
};

export function Highlight({
  children,
  variant = "a",
  scheme = "recruiters",
  animate = false,
  delay = 0,
}: {
  children: ReactNode;
  variant?: Variant;
  scheme?: Scheme;
  animate?: boolean;
  delay?: number;
}) {
  const v = SHAPES[scheme][variant];
  return (
    <span className="relative inline-block">
      <motion.span
        aria-hidden
        className="absolute pointer-events-none"
        initial={animate ? { scaleX: 0, opacity: 0 } : false}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={
          animate
            ? { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0 }
        }
        style={{
          inset: "-0.12em -0.18em",
          background: "var(--accent)",
          borderRadius: v.rx,
          rotate: `${v.rotate}deg`,
          skewX: `${v.skewX}deg`,
          skewY: `${v.skewY}deg`,
          transformOrigin: "left center",
          zIndex: 0,
        }}
      />
      <span
        className="relative font-semibold text-white"
        style={{ zIndex: 1 }}
      >
        {children}
      </span>
    </span>
  );
}
