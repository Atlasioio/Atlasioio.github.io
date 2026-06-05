"use client";

import { useState, type ReactNode } from "react";

type Props = {
  src?: string;
  alt: string;
  children: ReactNode;
  /** Don't wrap on small screens (touch devices). Default true. */
  desktopOnly?: boolean;
};

/**
 * Wraps a thumbnail with a "follows-the-cursor" enlarged preview that
 * appears on hover. The preview is positioned at the cursor and flips to
 * the opposite side when the cursor approaches the viewport edge.
 *
 * Pointer-events on the preview are disabled so the cursor stays on the
 * thumbnail (and we keep receiving mousemove events on it).
 */
export function ImageZoomHover({ src, alt, children, desktopOnly = true }: Props) {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Bail entirely if no src — just render children unchanged.
  if (!src) return <>{children}</>;

  const flipX = typeof window !== "undefined" && pos.x > window.innerWidth / 2;
  const flipY = typeof window !== "undefined" && pos.y > window.innerHeight / 2;

  const left = flipX ? pos.x - 24 : pos.x + 24;
  const top = flipY ? pos.y - 24 : pos.y + 24;
  const transform = `translate(${flipX ? "-100%" : "0"}, ${flipY ? "-100%" : "0"})`;

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
        className={`cursor-zoom-in ${desktopOnly ? "" : ""}`}
      >
        {children}
      </div>
      {hovered && (
        <div
          className="fixed pointer-events-none z-[60] hidden md:block"
          style={{ left, top, transform }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="block rounded-xl border border-hairline shadow-[0_30px_60px_-10px_rgba(0,0,0,0.5)]"
            style={{
              maxWidth: "min(60vw, 1100px)",
              maxHeight: "70vh",
              width: "auto",
              height: "auto",
            }}
          />
        </div>
      )}
    </>
  );
}
