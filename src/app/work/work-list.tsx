"use client";

import { useState, type ComponentType, type SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  Browser,
  DeviceMobile,
  Palette,
} from "@phosphor-icons/react";
import { projects, type ProjectTag } from "@/lib/projects";
import { getCaseStudy } from "@/lib/case-studies";
import { MockupFrame } from "@/components/MockupFrame";

type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { weight?: string }
>;

const TAG_OPTIONS: { id: ProjectTag; label: string; Icon: IconComponent }[] = [
  { id: "app", label: "App", Icon: DeviceMobile },
  { id: "webdesign", label: "Web design", Icon: Browser },
  { id: "graphic-design", label: "Graphic design", Icon: Palette },
];

export function WorkList() {
  const [selectedTag, setSelectedTag] = useState<ProjectTag | null>(null);

  const filteredProjects =
    selectedTag === null
      ? projects
      : projects.filter((p) => p.tags.includes(selectedTag));

  const toggleTag = (tag: ProjectTag) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
  };

  return (
    <section className="mx-auto max-w-full md:max-w-[min(86vw,1500px)] w-full px-5 md:px-8 pb-20 md:pb-28">
      <div className="mx-auto max-w-full md:max-w-[min(75vw,1400px)] w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <ArrowDownRight weight="bold" className="size-4 text-accent" />
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted">
              Case studies · {filteredProjects.length}
            </p>
          </div>
        </div>

        <ul className="flex flex-wrap gap-2 mb-8 md:mb-10">
        {TAG_OPTIONS.map(({ id, label, Icon }) => {
          const selected = selectedTag === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => toggleTag(id)}
                aria-pressed={selected}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[12px] transition-colors duration-200 ease-out cursor-pointer ${
                  selected
                    ? "bg-fg text-[var(--bg)] border-fg"
                    : "border-hairline text-fg-muted hover:text-fg hover:bg-[var(--chip)]"
                }`}
              >
                <Icon weight="regular" className="size-3.5" />
                {label}
              </button>
            </li>
          );
        })}
        </ul>
      </div>

      <motion.ul layout className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((p, i) => {
            const study = getCaseStudy(p.slug);
            const heroImage = study?.heroImage;
            const useBrowserChrome =
              !!heroImage && (study?.mediaChrome ?? "browser") === "browser";
            return (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              viewport={{ once: true, margin: "-80px 0px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/work/${p.slug}`}
                className="project-card group relative block overflow-hidden rounded-3xl border border-hairline h-full"
                style={{ ["--card-accent" as string]: p.color }}
              >
                <span aria-hidden className="project-card-fill absolute inset-0" />
                <span aria-hidden className="project-card-tint absolute inset-0" />

                <div className="relative p-6 md:p-8 flex flex-col gap-8">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>0{i + 1}</span>
                      <span>·</span>
                      <span>{p.year}</span>
                      <span>·</span>
                      <span>{p.category}</span>
                    </p>
                    <span className="flex size-9 items-center justify-center rounded-full bg-[var(--chip)] group-hover:bg-[var(--chip-hover)] text-fg-muted group-hover:text-fg transition-colors duration-500 ease-out shrink-0">
                      <ArrowRight
                        weight="bold"
                        className="size-3.5 group-hover:animate-arrow-nudge"
                      />
                    </span>
                  </div>

                  {useBrowserChrome && heroImage ? (
                    <MockupFrame
                      image={heroImage}
                      alt={`${p.name} — hero`}
                      aspect="aspect-[16/10]"
                      tint={p.color}
                      chrome="browser"
                      intensity="strong"
                      rounded="rounded-2xl"
                      innerPadding="inset-5 md:inset-7"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  ) : (
                    <div
                      className="project-card-mock relative aspect-[16/10] rounded-2xl overflow-hidden border border-hairline flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, color-mix(in oklab, ${p.color} 42%, var(--bg)), color-mix(in oklab, ${p.color} 65%, var(--bg)))`,
                      }}
                    >
                      {heroImage ? (
                        <Image
                          src={heroImage}
                          alt={`${p.name} — hero`}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className={
                            study?.heroObjectFit === "contain"
                              ? "object-contain"
                              : "object-cover object-center"
                          }
                        />
                      ) : (
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
                          Mockup placeholder · {p.name}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <h3 className="display-tight text-2xl md:text-3xl leading-[0.95] mb-2">
                      {p.name}
                      <span
                        className="inline-block overflow-hidden align-baseline transition-all duration-300 ease-out max-w-0 opacity-0 group-hover:max-w-[0.7em] group-hover:opacity-100 pr-[0.08em]"
                        style={{ color: p.color }}
                      >
                        .
                      </span>
                    </h3>
                    <p className="text-[13px] text-fg-subtle mb-3">{p.context}</p>
                    <p className="text-base text-fg-muted leading-snug max-w-[52ch]">
                      {p.tagline}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
}
