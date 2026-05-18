"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { motion } from "framer-motion";
import {
  ArrowsOut,
  SpeakerHigh,
  SpeakerSlash,
  X,
} from "@phosphor-icons/react/dist/ssr";

// ─── Hook: experiment takeover state ──────────────────────────────────────
export function useExperimentTakeover(opts?: { glitch?: boolean }) {
  const glitchEnabled = opts?.glitch ?? false;
  const [takenOver, setTakenOver] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const triggeredOnceRef = useRef(false);

  const enter = useCallback(() => {
    triggeredOnceRef.current = true;
    if (glitchEnabled) {
      setGlitching(true);
      window.setTimeout(() => setTakenOver(true), 380);
      window.setTimeout(() => setGlitching(false), 800);
    } else {
      setTakenOver(true);
    }
  }, [glitchEnabled]);

  const exit = useCallback(() => {
    triggeredOnceRef.current = true;
    if (glitchEnabled) {
      setGlitching(true);
      window.setTimeout(() => setTakenOver(false), 240);
      window.setTimeout(() => setGlitching(false), 500);
    } else {
      setTakenOver(false);
    }
  }, [glitchEnabled]);

  useEffect(() => {
    if (!takenOver) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("experiment-takeover");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exit();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove("experiment-takeover");
      window.removeEventListener("keydown", onKey);
    };
  }, [takenOver, exit]);

  return { takenOver, glitching, enter, exit, triggeredOnceRef };
}

// ─── Glitch overlay ───────────────────────────────────────────────────────
export function GlitchOverlay() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[200] pointer-events-none"
      style={{
        animation: "lt-glitch-fade 800ms ease-out forwards",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(45deg, rgba(255,77,200,0.35), rgba(0,221,255,0.35))",
          mixBlendMode: "difference",
          animation: "lt-glitch-slide 800ms steps(8) forwards",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent 0, transparent 4px, rgba(0,0,0,0.55) 4px, rgba(0,0,0,0.55) 5px)",
          animation: "lt-glitch-bars 800ms steps(20) forwards",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(255,255,255,0.7)",
          animation: "lt-glitch-flash 800ms ease-out forwards",
        }}
      />
      <style>{`
        @keyframes lt-glitch-fade {
          0% { opacity: 0; }
          10% { opacity: 1; }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes lt-glitch-slide {
          0% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(6px); }
          45% { transform: translateX(-12px); }
          60% { transform: translateX(4px); }
          80% { transform: translateX(-3px); }
          100% { transform: translateX(0); }
        }
        @keyframes lt-glitch-bars {
          0% { transform: translateY(0) scaleY(1); opacity: 0.6; }
          50% { transform: translateY(-12px) scaleY(0.9); opacity: 0.85; }
          100% { transform: translateY(0) scaleY(1); opacity: 0; }
        }
        @keyframes lt-glitch-flash {
          0% { opacity: 0; }
          12% { opacity: 0.85; }
          18% { opacity: 0; }
          26% { opacity: 0.55; }
          32% { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Fullscreen button (top-right) ────────────────────────────────────────
export function FullscreenButton({
  takenOver,
  onEnter,
  onExit,
  fg,
  accent,
  bg,
  className = "",
}: {
  takenOver: boolean;
  onEnter: () => void;
  onExit: () => void;
  fg: string;
  accent: string;
  bg: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={takenOver ? onExit : onEnter}
      aria-label={takenOver ? "Exit fullscreen" : "Enter fullscreen"}
      className={`absolute top-4 right-4 md:top-5 md:right-5 z-30 inline-flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 font-mono text-[11px] uppercase tracking-[0.18em] ${className}`}
      style={{
        background: takenOver
          ? `color-mix(in oklab, ${bg} 55%, transparent)`
          : `color-mix(in oklab, ${accent} 35%, transparent)`,
        color: fg,
        border: `1px solid color-mix(in oklab, ${
          takenOver ? fg : accent
        } ${takenOver ? 30 : 70}%, transparent)`,
        boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
      }}
    >
      {takenOver ? (
        <>
          <X weight="bold" className="size-3.5" />
          exit · esc
        </>
      ) : (
        <>
          <ArrowsOut weight="regular" className="size-3.5" />
          fullscreen
        </>
      )}
    </button>
  );
}

// ─── Volume slider (compact horizontal) ───────────────────────────────────
function VolumeSlider({
  value,
  onChange,
  accent,
  fg,
  muted,
}: {
  value: number;
  onChange: (v: number) => void;
  accent: string;
  fg: string;
  muted: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const setFromPointer = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    onChange(Math.round((x / rect.width) * 100));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setFromPointer(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setFromPointer(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const fill = muted ? 0 : value;

  return (
    <div
      ref={trackRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      role="slider"
      aria-label="Volume"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="relative w-20 md:w-24 h-5 cursor-pointer touch-none flex items-center select-none"
    >
      <div
        className="absolute inset-x-0 h-[3px] rounded-full"
        style={{
          background: `color-mix(in oklab, ${fg} 22%, transparent)`,
        }}
      />
      <motion.div
        className="absolute h-[3px] rounded-full"
        style={{ background: accent, left: 0 }}
        animate={{ width: `${fill}%` }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
      />
      <motion.div
        className="absolute size-3 rounded-full"
        style={{
          background: accent,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          x: "-50%",
          opacity: muted ? 0.5 : 1,
        }}
        animate={{
          left: `${fill}%`,
          scale: dragging ? 1.25 : 1,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      />
    </div>
  );
}

// ─── Audio panel (top-left) ───────────────────────────────────────────────
export function AudioPanel({
  muted,
  volume,
  onMuteToggle,
  onVolumeChange,
  fg,
  accent,
  bg,
  className = "",
}: {
  muted: boolean;
  volume: number;
  onMuteToggle: () => void;
  onVolumeChange: (v: number) => void;
  fg: string;
  accent: string;
  bg: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute top-4 left-4 md:top-5 md:left-5 z-30 inline-flex items-center gap-2.5 pl-2.5 pr-3.5 py-2 rounded-full backdrop-blur-md transition-colors duration-500 ${className}`}
      style={{
        background: `color-mix(in oklab, ${bg} 55%, transparent)`,
        border: `1px solid color-mix(in oklab, ${fg} 22%, transparent)`,
        boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
      }}
    >
      <button
        type="button"
        onClick={onMuteToggle}
        aria-label={muted ? "Unmute audio" : "Mute audio"}
        className="flex size-7 items-center justify-center rounded-full transition-colors duration-200 hover:scale-110"
        style={{
          color: fg,
          background: muted
            ? "transparent"
            : `color-mix(in oklab, ${accent} 30%, transparent)`,
        }}
      >
        {muted ? (
          <SpeakerSlash weight="regular" className="size-3.5" />
        ) : (
          <SpeakerHigh weight="regular" className="size-3.5" />
        )}
      </button>
      <VolumeSlider
        value={volume}
        onChange={(v) => {
          onVolumeChange(v);
          if (v > 0 && muted) onMuteToggle();
        }}
        accent={accent}
        fg={fg}
        muted={muted}
      />
    </div>
  );
}

// ─── Helper: full-viewport portal wrapper for takeover content ────────────
export function takeoverWrapperStyle(
  vars: Record<`--${string}`, string>,
): CSSProperties {
  return {
    ...(vars as CSSProperties),
  };
}
