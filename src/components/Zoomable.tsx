"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { Lightbox, type GalleryItem } from "./Lightbox";

export function Zoomable({
  src,
  alt,
  className,
  children,
  gallery,
  index,
  accentColor,
}: {
  src?: string;
  alt: string;
  className?: string;
  children: ReactNode;
  /** Optional gallery for prev/next navigation in the lightbox. */
  gallery?: GalleryItem[];
  /** This image's position in the gallery (0-indexed). */
  index?: number;
  /** Per-project tint for the cursor pill. Defaults to var(--accent). */
  accentColor?: string;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  // Portals need document, which is only available after hydration on the
  // client. Without this gate we'd hit a hydration mismatch on first render.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // No-op wrapper when there's no image to enlarge (e.g. placeholder mockup).
  if (!src) return <>{children}</>;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onMouseEnter={(e) => {
          setPos({ x: e.clientX, y: e.clientY });
          setHovered(true);
        }}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
        className={`group relative block w-full text-left md:cursor-none cursor-zoom-in ${className ?? ""}`}
        aria-label={`Open larger: ${alt}`}
      >
        {children}
      </button>

      {/* Custom floating cursor — a small accent pill labelled "View"
        * follows the mouse while hovering the image. Rendered via a portal
        * to document.body so position:fixed works against the viewport
        * rather than a transformed ScrollReveal ancestor. */}
      {mounted &&
        hovered &&
        createPortal(
          <div
            aria-hidden
            className="fixed pointer-events-none z-[100] hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-[var(--bg)] font-mono text-[10px] uppercase tracking-[0.16em] shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
            style={{
              left: pos.x,
              top: pos.y,
              transform: "translate(-50%, -50%)",
              background: accentColor ?? "var(--accent)",
            }}
          >
            View
          </div>,
          document.body,
        )}

      <AnimatePresence>
        {open && (
          <Lightbox
            src={src}
            alt={alt}
            gallery={gallery}
            index={index}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
