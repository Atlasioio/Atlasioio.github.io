"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Generic mobile-only horizontal scroll-snap carousel with a dot indicator.
 * Wraps arbitrary children — each becomes one snap card at 85vw width.
 * Renders nothing at `md:` and up; pair with a separate desktop layout.
 */
export function SwipeCarousel({
  children,
  dotColors,
  className,
}: {
  children: ReactNode;
  /** Optional per-card active-dot color; defaults to var(--fg). */
  dotColors?: string[];
  className?: string;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const childArray = Children.toArray(children);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const observer = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        entries.forEach((entry) => {
          const idx = cardRefs.current.findIndex((el) => el === entry.target);
          if (idx < 0) return;
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { idx, ratio: entry.intersectionRatio };
          }
        });
        if (best && best.ratio > 0.55) setActiveIdx(best.idx);
      },
      { root: scroller, threshold: [0.55, 0.75, 1] },
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [childArray.length]);

  return (
    <div className={`md:hidden ${className ?? ""}`}>
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-5 px-5 pb-2 carousel-scroller"
      >
        {childArray.map((child, i) => (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="snap-center shrink-0 w-[85vw] flex"
          >
            {child}
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-2 mt-5">
        {childArray.map((_, i) => (
          <span
            key={i}
            aria-hidden
            className="rounded-full transition-all duration-300 ease-out"
            style={{
              width: activeIdx === i ? "18px" : "6px",
              height: "6px",
              background:
                activeIdx === i
                  ? dotColors?.[i] ?? "var(--fg)"
                  : "color-mix(in oklab, var(--fg) 18%, transparent)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
