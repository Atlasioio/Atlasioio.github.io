"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export type Chapter = {
  years: string;
  title: string;
  body: string;
  artifact?: { label: string; items: string[] };
  current?: boolean;
};

type Props = {
  chapters: Chapter[];
};

export function PathRoadmap({ chapters }: Props) {
  return (
    <ol className="relative">
      {chapters.map((c, i) => {
        const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
        const isLast = i === chapters.length - 1;
        return (
          <li key={c.years} className="relative pb-10 md:pb-0">
            <ChapterRow chapter={c} side={side} />
            {!isLast && <ConnectorRow fromSide={side} />}
          </li>
        );
      })}
    </ol>
  );
}

function ChapterRow({
  chapter,
  side,
}: {
  chapter: Chapter;
  side: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });

  const cardOpacity = useTransform(progress, [0, 0.5], [0, 1]);
  const cardY = useTransform(progress, [0, 0.5], [24, 0]);
  const dotScale = useTransform(progress, [0.3, 0.7], [0, 1]);
  const artifactOpacity = useTransform(progress, [0.35, 0.9], [0, 1]);
  const artifactY = useTransform(progress, [0.35, 0.9], [16, 0]);

  const cardCol =
    side === "left" ? "md:col-start-1" : "md:col-start-8";
  const artifactCol =
    side === "left" ? "md:col-start-8" : "md:col-start-1";

  return (
    <div
      ref={ref}
      className="group grid grid-cols-12 gap-x-6 relative"
    >
      <motion.div
        className={`col-span-12 md:col-span-5 md:row-start-1 ${cardCol} relative rounded-3xl border border-hairline bg-bg-elevated p-6 md:p-8`}
        style={{ opacity: cardOpacity, y: cardY }}
      >
        <motion.span
          className="absolute -top-[5px] left-1/2 -translate-x-1/2 inline-flex z-10"
          style={{ scale: dotScale }}
          aria-hidden
        >
          {chapter.current ? (
            <span className="relative inline-flex">
              <span
                className="absolute inset-0 rounded-full bg-accent animate-ping opacity-60"
                aria-hidden
              />
              <span
                className="relative size-[11px] rounded-full bg-accent"
                aria-hidden
              />
            </span>
          ) : (
            <span
              className="size-[11px] rounded-full bg-bg border border-[var(--border)]"
              aria-hidden
            />
          )}
        </motion.span>

        <p className="font-mono text-[13px] uppercase tracking-[0.16em] text-fg-muted mb-3">
          {chapter.years}
        </p>
        <h3 className="display-tight text-2xl md:text-3xl leading-[1.05] mb-3">
          {chapter.title}
          {chapter.current ? (
            <span className="text-accent">.</span>
          ) : (
            <span className="inline-block overflow-hidden align-baseline text-accent transition-all duration-300 ease-out max-w-0 opacity-0 group-hover:max-w-[1em] group-hover:opacity-100 pr-[0.08em]">
              .
            </span>
          )}
        </h3>
        <p className="text-[15px] md:text-base text-fg-muted leading-relaxed">
          {chapter.body}
        </p>
      </motion.div>

      {chapter.artifact && (
        <motion.aside
          className={`hidden md:flex md:flex-col md:col-span-5 md:row-start-1 ${artifactCol} md:pt-10 md:px-2`}
          style={{ opacity: artifactOpacity, y: artifactY }}
        >
          <p className="display-tight text-xl md:text-2xl text-fg mb-5 leading-[1.05]">
            {chapter.artifact.label}
          </p>
          <ul className="flex flex-col gap-2.5">
            {chapter.artifact.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[14px] md:text-[15px] text-fg leading-snug"
              >
                <span
                  className="mt-[0.5em] size-1.5 rounded-full bg-accent shrink-0"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.aside>
      )}
    </div>
  );
}

function ConnectorRow({ fromSide }: { fromSide: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });
  const pathLength = useTransform(progress, [0, 0.7], [0, 1]);

  const startX = fromSide === "left" ? 200 : 800;
  const endX = fromSide === "left" ? 800 : 200;
  const dir = endX > startX ? 1 : -1;
  const r = 14;
  const midY = 40;

  const path = [
    `M ${startX} 0`,
    `L ${startX} ${midY - r}`,
    `Q ${startX} ${midY} ${startX + r * dir} ${midY}`,
    `L ${endX - r * dir} ${midY}`,
    `Q ${endX} ${midY} ${endX} ${midY + r}`,
    `L ${endX} 80`,
  ].join(" ");

  return (
    <div
      ref={ref}
      className="relative h-20 md:h-24 hidden md:block w-full"
    >
      <svg
        className="absolute inset-0 w-full h-full overflow-visible"
        viewBox="0 0 1000 80"
        preserveAspectRatio="none"
      >
        <motion.path
          d={path}
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
}
