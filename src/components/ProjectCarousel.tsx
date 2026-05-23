"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export type CarouselProject = {
  slug: string;
  name: string;
  year: string;
  context: string;
  tagline: string;
  color: string;
  heroImage?: string;
  heroObjectFit?: "cover" | "contain";
};

export type CarouselThumb = {
  color: string;
  heroImage?: string;
};

export type CarouselTail = {
  key: string;
  href: string;
  accentColor: string;
  kickerLabel: string;
  heading: string;
  headingSuffix?: string;
  tagline: string;
  thumbs: CarouselThumb[];
  thumbCols: number;
  ctaLabel: string;
};

export function ProjectCarousel({
  projects,
  tails,
}: {
  projects: CarouselProject[];
  tails: CarouselTail[];
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const totalCards = projects.length + tails.length;

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
  }, [totalCards]);

  return (
    <div className="md:hidden">
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-5 px-5 pb-2 carousel-scroller"
      >
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            href={`/work/${p.slug}`}
            className="project-card group snap-center shrink-0 w-[85vw] relative overflow-hidden rounded-3xl border border-hairline"
            style={{ ["--card-accent" as string]: p.color }}
          >
            <span aria-hidden className="project-card-fill absolute inset-0" />
            <span aria-hidden className="project-card-tint absolute inset-0" />

            <div className="relative p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3 min-h-[140px]">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>
                      0{i + 1} / 0{totalCards}
                    </span>
                    <span>·</span>
                    <span>{p.year}</span>
                  </p>
                  <h3 className="display-tight text-[28px] leading-[0.95] mb-2">
                    {p.name}
                    <span style={{ color: p.color }}>.</span>
                  </h3>
                  <p className="text-[13px] text-fg-muted leading-snug line-clamp-2">
                    {p.tagline}
                  </p>
                </div>
                <span className="flex size-9 items-center justify-center rounded-full bg-[var(--chip)] text-fg-muted shrink-0">
                  <ArrowRight weight="bold" className="size-3.5" />
                </span>
              </div>

              {p.heroImage && (
                <div
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-hairline mt-1"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in oklab, ${p.color} 42%, var(--bg)), color-mix(in oklab, ${p.color} 65%, var(--bg)))`,
                  }}
                >
                  <Image
                    src={p.heroImage}
                    alt={`${p.name} — hero`}
                    fill
                    sizes="85vw"
                    className={
                      p.heroObjectFit === "contain"
                        ? "object-contain"
                        : "object-cover object-center"
                    }
                  />
                </div>
              )}
            </div>
          </Link>
        ))}

        {tails.map((tail, ti) => {
          const idx = projects.length + ti;
          return (
            <Link
              key={tail.key}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              href={tail.href}
              className="project-card group snap-center shrink-0 w-[85vw] relative overflow-hidden rounded-3xl border border-hairline"
              style={{ ["--card-accent" as string]: tail.accentColor }}
            >
              <span
                aria-hidden
                className="project-card-fill absolute inset-0"
              />
              <span
                aria-hidden
                className="project-card-tint absolute inset-0"
              />

              <div className="relative p-5 flex flex-col gap-4 h-full">
                <div className="flex items-start justify-between gap-3 min-h-[140px]">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>
                        0{idx + 1} / 0{totalCards}
                      </span>
                      <span>·</span>
                      <span>{tail.kickerLabel}</span>
                    </p>
                    <h3 className="display-tight text-[28px] leading-[0.95] mb-2">
                      {tail.heading}
                      {tail.headingSuffix && <span> {tail.headingSuffix}</span>}
                      <span style={{ color: tail.accentColor }}>.</span>
                    </h3>
                    <p className="text-[13px] text-fg-muted leading-snug line-clamp-2">
                      {tail.tagline}
                    </p>
                  </div>
                  <span className="flex size-9 items-center justify-center rounded-full bg-[var(--chip)] text-fg-muted shrink-0">
                    <ArrowRight weight="bold" className="size-3.5" />
                  </span>
                </div>

                <ul
                  className="grid gap-1.5 mt-1"
                  style={{
                    gridTemplateColumns: `repeat(${tail.thumbCols}, minmax(0, 1fr))`,
                  }}
                >
                  {tail.thumbs.map((t, i) => (
                    <li
                      key={i}
                      className="relative aspect-square rounded-md overflow-hidden border border-hairline"
                      style={{
                        background: `linear-gradient(135deg, color-mix(in oklab, ${t.color} 42%, var(--bg)), color-mix(in oklab, ${t.color} 65%, var(--bg)))`,
                      }}
                    >
                      {t.heroImage && (
                        <Image
                          src={t.heroImage}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </li>
                  ))}
                </ul>

                <span className="mt-auto inline-flex items-center gap-1.5 self-start font-mono text-[10px] uppercase tracking-[0.18em] text-fg-muted">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: tail.accentColor }}
                    aria-hidden
                  />
                  {tail.ctaLabel}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Dot progress */}
      <div className="flex justify-center items-center gap-2 mt-5">
        {projects.map((p, i) => (
          <span
            key={p.slug}
            aria-hidden
            className="rounded-full transition-all duration-300 ease-out"
            style={{
              width: activeIdx === i ? "18px" : "6px",
              height: "6px",
              background:
                activeIdx === i
                  ? p.color
                  : "color-mix(in oklab, var(--fg) 18%, transparent)",
            }}
          />
        ))}
        {tails.map((tail, ti) => {
          const idx = projects.length + ti;
          return (
            <span
              key={tail.key}
              aria-hidden
              className="rounded-full transition-all duration-300 ease-out"
              style={{
                width: activeIdx === idx ? "18px" : "6px",
                height: "6px",
                background:
                  activeIdx === idx
                    ? tail.accentColor
                    : "color-mix(in oklab, var(--fg) 18%, transparent)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
