"use client";

import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react";
import { Asterisk } from "@phosphor-icons/react/dist/ssr";

type Props = {
  items: string[];
  className?: string;
  /** Seconds for one cycle at base (1×) speed. Default 40s. */
  baseDuration?: number;
};

const SPEED_TIME_CONSTANT_MS = 220;
const EDGE_ZONE = 0.1;
const HOVER_MULTIPLIER = 3;

const cursorFor = (svg: string, hotspot = "16 16", fallback = "default") =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") ${hotspot}, ${fallback}`;

const PAUSE_CURSOR = cursorFor(
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><rect x="6.5" y="5" width="2.8" height="12" rx="1.2" fill="#0a0a0a"/><rect x="12.7" y="5" width="2.8" height="12" rx="1.2" fill="#0a0a0a"/></svg>`,
  "11 11"
);

const FORWARD_CURSOR = cursorFor(
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path d="M4 5 L10 11 L4 17" stroke="#0a0a0a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M11 5 L17 11 L11 17" stroke="#0a0a0a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
  "11 11",
  "e-resize"
);

const REVERSE_CURSOR = cursorFor(
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path d="M18 5 L12 11 L18 17" stroke="#0a0a0a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M11 5 L5 11 L11 17" stroke="#0a0a0a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
  "11 11",
  "w-resize"
);

export function Marquee({ items, className = "", baseDuration = 40 }: Props) {
  const track = [...items, ...items];
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const speedRef = useRef(0);
  const targetSpeedRef = useRef(0);
  const baseSpeedRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      const half = (trackRef.current?.scrollWidth ?? 0) / 2;
      baseSpeedRef.current = -half / baseDuration;
      if (speedRef.current === 0) {
        speedRef.current = baseSpeedRef.current;
        targetSpeedRef.current = baseSpeedRef.current;
      }
    };
    measure();
    window.addEventListener("resize", measure);

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      const k = 1 - Math.exp(-(dt * 1000) / SPEED_TIME_CONSTANT_MS);
      speedRef.current += (targetSpeedRef.current - speedRef.current) * k;

      offsetRef.current += speedRef.current * dt;

      const half = (trackRef.current?.scrollWidth ?? 0) / 2;
      if (half > 0) {
        if (offsetRef.current <= -half) offsetRef.current += half;
        else if (offsetRef.current > 0) offsetRef.current -= half;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [baseDuration]);

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const base = baseSpeedRef.current;
    let cursor = "default";

    if (x < EDGE_ZONE) {
      targetSpeedRef.current = -base * HOVER_MULTIPLIER;
      cursor = REVERSE_CURSOR;
    } else if (x > 1 - EDGE_ZONE) {
      targetSpeedRef.current = base * HOVER_MULTIPLIER;
      cursor = FORWARD_CURSOR;
    } else {
      targetSpeedRef.current = 0;
      cursor = PAUSE_CURSOR;
    }

    if (containerRef.current) containerRef.current.style.cursor = cursor;
  };

  const handleLeave = () => {
    targetSpeedRef.current = baseSpeedRef.current;
    if (containerRef.current) containerRef.current.style.cursor = "default";
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative overflow-hidden border-y border-hairline bg-bg ${className}`}
      aria-hidden
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap py-4 will-change-transform"
      >
        {track.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-6 px-6 font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted"
          >
            <span className="flex items-center gap-2">
              <Asterisk weight="bold" className="size-3 text-accent" />
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
