"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { experiments } from "@/lib/experiments";
import { KineticTypePreview } from "@/components/experiments/KineticType";
import { ClickSymphonyPreview } from "@/components/experiments/ClickSymphony";
import { WalkHomePreview } from "@/components/experiments/WalkHome";
import { LiveTimePreview } from "@/components/experiments/LiveTime";

const PREVIEWS: Record<string, () => React.ReactElement> = {
  "kinetic-type": KineticTypePreview,
  "click-symphony": ClickSymphonyPreview,
  "walk-home": WalkHomePreview,
  "live-time": LiveTimePreview,
};

export function PlaygroundList() {
  return (
    <section className="mx-auto max-w-full md:max-w-[min(86vw,1500px)] w-full px-5 md:px-8 pb-20 md:pb-28">
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {experiments.map((e, i) => {
          const Preview = PREVIEWS[e.slug];
          return (
            <motion.li
              key={e.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px 0px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={`/playground/${e.slug}`}
                className="project-card group relative block overflow-hidden rounded-3xl border border-hairline h-full"
                style={{ ["--card-accent" as string]: e.color }}
              >
                <span aria-hidden className="project-card-fill absolute inset-0" />
                <span aria-hidden className="project-card-tint absolute inset-0" />

                <div className="relative p-6 md:p-8 flex flex-col gap-8">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>0{i + 1}</span>
                      <span>·</span>
                      <span>{e.category}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="size-1.5 rounded-full"
                          style={{
                            background: e.status === "live" ? e.color : "var(--fg-subtle)",
                          }}
                        />
                        {e.status === "live" ? "Live" : "WIP"}
                      </span>
                    </p>
                    <span className="flex size-9 items-center justify-center rounded-full bg-[var(--chip)] group-hover:bg-[var(--chip-hover)] text-fg-muted group-hover:text-fg transition-colors duration-500 ease-out shrink-0">
                      <ArrowRight
                        weight="bold"
                        className="size-3.5 group-hover:animate-arrow-nudge"
                      />
                    </span>
                  </div>

                  <div
                    className="project-card-mock relative aspect-[16/10] rounded-2xl overflow-hidden border border-hairline"
                    style={{
                      background: `linear-gradient(135deg, color-mix(in oklab, ${e.color} 18%, var(--bg-elevated)), color-mix(in oklab, ${e.color} 38%, var(--bg-elevated)))`,
                    }}
                  >
                    {Preview ? <Preview /> : null}
                  </div>

                  <div>
                    <h3 className="display-tight text-2xl md:text-3xl leading-[0.95] mb-2">
                      {e.name}
                      <span
                        className="inline-block overflow-hidden align-baseline transition-all duration-300 ease-out max-w-0 opacity-0 group-hover:max-w-[0.7em] group-hover:opacity-100 pr-[0.08em]"
                        style={{ color: e.color }}
                      >
                        .
                      </span>
                    </h3>
                    <p className="text-base text-fg-muted leading-snug max-w-[52ch]">
                      {e.tagline}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
