"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  ArrowsIn,
  ArrowsOut,
  Pause,
  Play,
  SpeakerHigh,
  SpeakerSlash,
} from "@phosphor-icons/react";

type Props = {
  src: string;
  poster?: string;
  caption?: string;
  /** Tailwind aspect class. Default 16/9. */
  aspect?: string;
  /** Tailwind rounded class. Default rounded-2xl. */
  rounded?: string;
};

/**
 * Autoplaying muted video with a quiet custom control overlay.
 * - Plays muted on mount (required for browser autoplay)
 * - Loops by default
 * - Controls (progress bar + mute toggle) fade in on hover
 * - Click anywhere on the video toggles play/pause
 * - When paused, a centred play affordance appears
 * - Respects prefers-reduced-motion (no autoplay)
 */
export function CaseStudyVideo({
  src,
  poster,
  caption,
  aspect = "aspect-[16/9]",
  rounded = "rounded-2xl",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Honour prefers-reduced-motion: don't autoplay if the user has opted out.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  // Track progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => {
      if (!video.duration || seeking) return;
      setProgress((video.currentTime / video.duration) * 100);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [seeking]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  const toggleMute = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const video = videoRef.current;
      if (!video) return;
      video.muted = !video.muted;
      setIsMuted(video.muted);
    },
    [],
  );

  // Track fullscreen state so the icon can flip and so we re-render when the
  // user exits via ESC.
  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement !== null);
    document.addEventListener("fullscreenchange", onChange);
    return () =>
      document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    try {
      if (!document.fullscreenElement) {
        await video.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Some browsers reject silently — no-op
    }
  }, []);

  const seekToClientX = useCallback((clientX: number) => {
    const video = videoRef.current;
    const bar = progressRef.current;
    if (!video || !bar || !video.duration) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.min(
      Math.max((clientX - rect.left) / rect.width, 0),
      1,
    );
    video.currentTime = video.duration * pct;
    setProgress(pct * 100);
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setSeeking(true);
    seekToClientX(e.clientX);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!seeking) return;
    seekToClientX(e.clientX);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!seeking) return;
    setSeeking(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const controlsVisible = hovered || !isPlaying || seeking;

  const videoBlock = (
    <div
      className={`relative ${aspect} ${rounded} overflow-hidden border border-hairline bg-bg-elevated group cursor-pointer`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={togglePlay}
    >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="block w-full h-full object-cover"
        />

        {/* Gradient veil — only when controls are visible */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent transition-opacity duration-300 ${
            controlsVisible ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Top-right: fullscreen toggle */}
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          className={`absolute top-3 right-3 md:top-4 md:right-4 z-10 flex size-8 items-center justify-center rounded-full bg-white/95 text-fg shadow-[0_2px_10px_rgba(0,0,0,0.45)] ring-1 ring-black/10 hover:scale-105 transition-all duration-300 ${
            controlsVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {isFullscreen ? (
            <ArrowsIn weight="bold" className="size-3.5" />
          ) : (
            <ArrowsOut weight="bold" className="size-3.5" />
          )}
        </button>

        {/* Centred play affordance when paused */}
        {!isPlaying && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex size-14 md:size-16 items-center justify-center rounded-full bg-white/95 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)]">
              <Play weight="fill" className="size-5 md:size-6 text-fg ml-[2px]" />
            </div>
          </div>
        )}

        {/* Bottom control row */}
        <div
          className={`absolute bottom-0 left-0 right-0 px-4 pb-3 md:px-5 md:pb-4 flex items-center gap-3 transition-opacity duration-300 ${
            controlsVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Progress bar */}
          <div
            ref={progressRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 h-1 rounded-full bg-white/25 hover:h-1.5 transition-[height] cursor-pointer overflow-hidden touch-none"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="Video progress"
          >
            <div
              className="h-full bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Play / pause toggle (also click video) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="flex size-7 items-center justify-center rounded-full bg-white/95 text-fg shadow-[0_2px_10px_rgba(0,0,0,0.45)] ring-1 ring-black/10 hover:scale-105 transition-transform"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause weight="fill" className="size-3" />
            ) : (
              <Play weight="fill" className="size-3 ml-[1px]" />
            )}
          </button>

          {/* Mute toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className="flex size-7 items-center justify-center rounded-full bg-white/95 text-fg shadow-[0_2px_10px_rgba(0,0,0,0.45)] ring-1 ring-black/10 hover:scale-105 transition-transform"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <SpeakerSlash weight="fill" className="size-3" />
            ) : (
              <SpeakerHigh weight="fill" className="size-3" />
            )}
          </button>
        </div>
    </div>
  );

  if (!caption) return videoBlock;

  return (
    <figure className="flex flex-col gap-3">
      {videoBlock}
      <figcaption className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
