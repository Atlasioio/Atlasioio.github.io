"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "@phosphor-icons/react";

export type GalleryItem = { src: string; alt: string };

type Props = {
  src: string;
  alt: string;
  onClose: () => void;
  /** Optional gallery — when provided with 2+ items, enables prev/next nav. */
  gallery?: GalleryItem[];
  /** Starting index when gallery is provided. */
  index?: number;
};

export function Lightbox({
  src,
  alt,
  onClose,
  gallery,
  index: initialIndex = 0,
}: Props) {
  const [index, setIndex] = useState(initialIndex);
  const hasGallery = gallery !== undefined && gallery.length > 1;

  const next = useCallback(() => {
    if (!gallery) return;
    setIndex((i) => (i + 1) % gallery.length);
  }, [gallery]);

  const prev = useCallback(() => {
    if (!gallery) return;
    setIndex((i) => (i - 1 + gallery.length) % gallery.length);
  }, [gallery]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    // Intercept mouse back/forward side buttons so they navigate gallery
    // instead of going back in browser history.
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 3) {
        e.preventDefault();
        prev();
      } else if (e.button === 4) {
        e.preventDefault();
        next();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onMouseDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onMouseDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, next, prev]);

  const current = gallery ? gallery[index] : { src, alt };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label={current.alt}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
      style={{
        background: "color-mix(in oklab, var(--fg) 78%, transparent)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {/* Close (top-right) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="absolute top-4 right-4 md:top-6 md:right-6 z-10 flex size-10 items-center justify-center rounded-full bg-[var(--bg)] text-fg hover:bg-accent hover:text-[var(--bg)] transition-colors"
      >
        <X weight="bold" className="size-4" />
      </button>

      {/* Counter (top-centre) — only when navigable */}
      {hasGallery && (
        <div
          className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-[var(--bg)] text-fg font-mono text-[11px] uppercase tracking-[0.16em] shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
          onClick={(e) => e.stopPropagation()}
        >
          {index + 1} / {gallery!.length}
        </div>
      )}

      {/* Prev / next arrows (only when navigable) */}
      {hasGallery && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 flex size-11 md:size-12 items-center justify-center rounded-full bg-[var(--bg)] text-fg hover:bg-accent hover:text-[var(--bg)] transition-colors shadow-[0_4px_14px_rgba(0,0,0,0.3)]"
          >
            <ArrowLeft weight="bold" className="size-4 md:size-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 flex size-11 md:size-12 items-center justify-center rounded-full bg-[var(--bg)] text-fg hover:bg-accent hover:text-[var(--bg)] transition-colors shadow-[0_4px_14px_rgba(0,0,0,0.3)]"
          >
            <ArrowRight weight="bold" className="size-4 md:size-5" />
          </button>
        </>
      )}

      <motion.div
        key={current.src}
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-full max-h-full"
        style={{ cursor: "default" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.alt}
          className="block max-w-[92vw] max-h-[88vh] w-auto h-auto object-contain rounded-lg shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        />
      </motion.div>
    </motion.div>
  );
}
