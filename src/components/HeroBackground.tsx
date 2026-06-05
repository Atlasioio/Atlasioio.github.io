"use client";

import { motion } from "framer-motion";

const NOISE_URL = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
)}")`;

const MASK =
  "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 10%, rgba(0,0,0,1) 26%, rgba(0,0,0,1) 78%, rgba(0,0,0,0) 94%)";

const NOISE_MASK =
  "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 14%, rgba(0,0,0,1) 32%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 92%)";

type RayKey = {
  x: number;
  y: number;
  sx: number;
  sy: number;
  rot: number;
  opacity: number;
};

type RayProps = {
  color: string;
  left: string;
  top: string;
  size: string;
  blur: string;
  duration: number;
  delay?: number;
  path: RayKey[];
};

function Ray({ color, left, top, size, blur, duration, delay = 0, path }: RayProps) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left,
        top,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
        filter: `blur(${blur})`,
        translate: "-50% -50%",
        willChange: "transform, opacity",
      }}
      animate={{
        x: path.map((p) => `${p.x}%`),
        y: path.map((p) => `${p.y}%`),
        scaleX: path.map((p) => p.sx),
        scaleY: path.map((p) => p.sy),
        rotate: path.map((p) => p.rot),
        opacity: path.map((p) => p.opacity),
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

export function HeroBackground() {
  return (
    <>
      {/* Concentrated glow — clustered in the lower-left, drifts gently without spreading across the hero */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
        style={{
          opacity: 0.55,
          WebkitMaskImage: MASK,
          maskImage: MASK,
        }}
      >
        {/* Primary warm core */}
        <Ray
          color="#0d5d5d"
          left="72%"
          top="68%"
          size="30vw"
          blur="80px"
          duration={32}
          path={[
            { x: -18, y: -20, sx: 1.0, sy: 0.9, rot: 0, opacity: 0.5 },
            { x: 10, y: 6, sx: 1.15, sy: 0.8, rot: 4, opacity: 0.6 },
            { x: -22, y: 14, sx: 0.9, sy: 1.0, rot: -4, opacity: 0.4 },
            { x: 4, y: -10, sx: 1.05, sy: 0.95, rot: 2, opacity: 0.55 },
            { x: -18, y: -20, sx: 1.0, sy: 0.9, rot: 0, opacity: 0.5 },
          ]}
        />

        {/* Amber halo — slightly offset, slower */}
        <Ray
          color="#3aa8a3"
          left="78%"
          top="74%"
          size="24vw"
          blur="90px"
          duration={26}
          delay={3}
          path={[
            { x: 6, y: 8, sx: 1.1, sy: 0.85, rot: 3, opacity: 0.45 },
            { x: -20, y: -14, sx: 0.9, sy: 1.0, rot: -5, opacity: 0.3 },
            { x: 8, y: 12, sx: 1.2, sy: 0.75, rot: 5, opacity: 0.5 },
            { x: -14, y: -6, sx: 1.0, sy: 0.9, rot: -2, opacity: 0.4 },
            { x: 6, y: 8, sx: 1.1, sy: 0.85, rot: 3, opacity: 0.45 },
          ]}
        />

        {/* Bright spark — small, slightly faster */}
        <Ray
          color="#5dc4be"
          left="74%"
          top="70%"
          size="14vw"
          blur="55px"
          duration={18}
          delay={1}
          path={[
            { x: 4, y: 6, sx: 1.0, sy: 0.9, rot: 4, opacity: 0.35 },
            { x: -22, y: -18, sx: 1.2, sy: 0.7, rot: -8, opacity: 0.5 },
            { x: 6, y: 12, sx: 0.8, sy: 1.1, rot: 6, opacity: 0.25 },
            { x: -8, y: -10, sx: 1.05, sy: 0.85, rot: -3, opacity: 0.4 },
            { x: 4, y: 6, sx: 1.0, sy: 0.9, rot: 4, opacity: 0.35 },
          ]}
        />
      </div>

      {/* Noise overlay — masked vertically so it doesn't shift body bg at top/bottom */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none noise-drift"
        style={{
          backgroundImage: NOISE_URL,
          backgroundSize: "180px 180px",
          backgroundRepeat: "repeat",
          opacity: 0.12,
          mixBlendMode: "soft-light",
          WebkitMaskImage: NOISE_MASK,
          maskImage: NOISE_MASK,
        }}
      />
    </>
  );
}
