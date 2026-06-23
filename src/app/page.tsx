import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  Briefcase,
  Envelope,
} from "@phosphor-icons/react/dist/ssr";
import { LinkedInIcon } from "@/components/BrandIcons";
import { HeroBackground } from "@/components/HeroBackground";
import { IntroSwitcher } from "@/components/IntroSwitcher";
import { Magnetic } from "@/components/Magnetic";
import { Marquee } from "@/components/Marquee";
import { MockupFrame } from "@/components/MockupFrame";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getCaseStudy } from "@/lib/case-studies";
import { experiments } from "@/lib/experiments";
import { projects as allProjects, getProject } from "@/lib/projects";
import { site } from "@/lib/site";

// Experimental bento layout for selected work. Compared against the existing
// vertical stack below — keep whichever feels right after looking at both.
const bentoProjects: {
  slug: string;
  span: string;
  aspect: string;
  hero?: boolean;
  /** Optional overlay rendered above the image (CSS background value).
   * Useful to lift very dark imagery (e.g. Sony's black logo plate). */
  imageMask?: string;
}[] = [
  {
    slug: "jobquest",
    span: "col-span-12 md:col-span-8",
    aspect: "aspect-[4/3] md:aspect-[3/2]",
    hero: true,
  },
  {
    slug: "sony",
    span: "col-span-12 md:col-span-4",
    aspect: "aspect-[4/3] md:aspect-[14/19]",
    imageMask:
      "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))",
  },
  {
    slug: "ecotrip",
    span: "col-span-12 md:col-span-4",
    aspect: "aspect-[4/3]",
  },
  {
    slug: "goodreads",
    span: "col-span-12 md:col-span-4",
    aspect: "aspect-[4/3]",
  },
  {
    slug: "reel",
    span: "col-span-12 md:col-span-4",
    aspect: "aspect-[4/3]",
  },
];

const featuredProjects = [
  {
    slug: "sherry",
    name: "Sherry",
    year: "2024",
    context: "Course project, Malmö University",
    tagline:
      "Tool sharing that turns neighbours into a small, working circular economy.",
    color: "#5DB075",
  },
  {
    slug: "goodreads",
    name: "Goodreads Redesign",
    year: "2024",
    context: "Self-initiated redesign",
    tagline:
      "Rethinking how readers track and discover books — a focused redesign exercise.",
    color: "#8B6F47",
  },
  {
    slug: "jobquest",
    name: "Jobquest",
    year: "2026",
    context: "Self-initiated · personal tool",
    tagline:
      "A personal job-search tracker. One user. Designed for my workflow, shipped to use daily.",
    color: "#3D7A8A",
  },
  {
    slug: "reel",
    name: "Reel",
    year: "2025",
    context: "Self-initiated concept",
    tagline:
      "An architecture studio site that lets the work do the talking — clean, image-forward, no fluff.",
    color: "#3B4A6B",
  },
];

const ticker = [
  "Available for new opportunities",
  "Product designer · interaction · motion",
  "Based in Malmö and Stockholm — open to EU, remote",
  "Previously UX at Sony",
  "Curious about AI × design craft",
];

export default function HomePage() {
  return (
    <>
      <div className="relative isolate overflow-hidden">
        <HeroBackground />
      <section className="relative mx-auto max-w-full md:max-w-[min(75vw,1400px)] w-full px-5 md:px-8 pt-14 md:pt-20 pb-8 md:pb-16">
        <div className="grid grid-cols-12 gap-x-3 md:gap-x-6 gap-y-5 md:gap-y-6 items-center md:items-stretch">
          <div
            className="col-span-4 md:col-span-3 order-2 flex flex-col items-end justify-center md:pt-[20px] hero-fade-up"
            style={{ animationDelay: "0.35s" }}
          >
            <div className="relative isolate shrink-0 md:translate-x-3">
              <span
                aria-hidden
                className="absolute -inset-3 md:-inset-5 bg-bg-elevated blob-morph -z-10"
              />
              <div
                className="relative size-28 md:size-72 overflow-hidden border border-hairline"
                style={{
                  borderRadius: "82% 32% 52% 66% / 56% 72% 38% 60%",
                }}
              >
                <Image
                  src="/photo.jpg"
                  alt="Lukas Ahlse"
                  fill
                  sizes="(min-width: 768px) 288px, 112px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="col-span-8 md:col-span-9 order-1">
            <p
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle mb-4 md:mb-6 flex items-center gap-2 hero-fade-up"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="size-1.5 rounded-full bg-accent" /> Portfolio · 2026
            </p>
            <h1
              className="display-tight text-[3rem] md:text-display-xl leading-[0.86] hero-fade-up"
              style={{ animationDelay: "0.18s" }}
            >
              Lukas
              <br />
              Ahlse<span className="text-accent">.</span>
            </h1>
          </div>
        </div>

        <div className="mt-14 md:mt-24 grid grid-cols-12 gap-x-6 gap-y-4 md:gap-y-5 items-start">
          <IntroSwitcher />

          <div className="hidden md:grid md:col-span-3 md:col-start-10 md:row-start-1 md:row-span-2 md:grid-cols-2 md:gap-3 content-start">
            {/* Primary tile — full width on desktop, rightmost wide pill on mobile */}
            <div
              className="flex-1 md:flex-none md:col-span-2 order-3 md:order-none hero-tile-in"
              style={
                {
                  animationDelay: "0.7s",
                  animationDuration: "0.9s",
                  "--tile-from-x": "-10px",
                  "--tile-from-y": "22px",
                } as React.CSSProperties
              }
            >
              <Magnetic strength={0.12} className="w-full">
                <Link
                  href="/work"
                  className="group block w-full rounded-2xl bg-[var(--fg)] text-[var(--bg)] hover:bg-accent transition-colors duration-300 ease-out"
                >
                  {/* Mobile: inline row, matches icon-tile height */}
                  <span className="md:hidden h-11 flex items-center justify-between gap-2 px-3">
                    <Briefcase
                      weight="fill"
                      className="row-icon size-[14px] shrink-0"
                    />
                    <span className="text-[13px] font-medium leading-snug flex-1 text-center">
                      See selected work
                    </span>
                    <ArrowRight
                      weight="bold"
                      className="row-icon size-[14px] shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                    />
                  </span>

                  {/* Desktop: stacked layout (icon row on top, label below) */}
                  <span className="hidden md:flex md:flex-col md:gap-5 md:px-6 md:py-5">
                    <span className="flex items-start justify-between">
                      <Briefcase
                        weight="fill"
                        className="row-icon size-4 translate-y-[1px]"
                      />
                      <ArrowRight
                        weight="bold"
                        className="row-icon size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                    <span className="text-base font-medium leading-snug">
                      See selected work
                    </span>
                  </span>
                </Link>
              </Magnetic>
            </div>

            {/* Secondary tile — email, icon only */}
            <div
              className="w-11 md:w-auto order-1 md:order-none hero-tile-in"
              style={
                {
                  animationDelay: "1.04s",
                  animationDuration: "0.9s",
                  "--tile-from-x": "-8px",
                  "--tile-from-y": "20px",
                } as React.CSSProperties
              }
            >
              <Magnetic strength={0.15} className="w-full">
                <Link
                  href="/contact#message"
                  aria-label="Send a message"
                  className="group w-full flex items-center justify-center rounded-2xl bg-[var(--chip)] hover:bg-[color-mix(in_oklab,var(--fg)_22%,transparent)] transition-colors duration-300 ease-out h-11 md:h-16 text-fg-muted hover:text-fg"
                >
                  <Envelope
                    weight="fill"
                    className="row-icon size-[18px] md:size-[22px] opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </Link>
              </Magnetic>
            </div>

            {/* Secondary tile — LinkedIn, icon only */}
            <div
              className="w-11 md:w-auto order-2 md:order-none hero-tile-in"
              style={
                {
                  animationDelay: "0.88s",
                  animationDuration: "0.9s",
                  "--tile-from-x": "12px",
                  "--tile-from-y": "20px",
                } as React.CSSProperties
              }
            >
              <Magnetic strength={0.15} className="w-full">
                <a
                  href={site.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="group w-full flex items-center justify-center rounded-2xl bg-[var(--chip)] hover:bg-[color-mix(in_oklab,var(--fg)_22%,transparent)] transition-colors duration-300 ease-out h-11 md:h-16 text-fg-muted hover:text-fg"
                >
                  <LinkedInIcon className="row-icon size-[15px] md:size-[18px] opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={ticker} className="mt-16 md:mt-24" />
      </div>

      <section className="mx-auto max-w-full md:max-w-[min(75vw,1400px)] w-full px-5 md:px-8 pt-14 md:pt-20 pb-0">
        <ScrollReveal as="div">
          <div className="flex items-end justify-between gap-4 mb-8 md:mb-12 flex-wrap">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle mb-2 md:mb-3 flex items-center gap-2">
                <ArrowDownRight weight="bold" className="size-3.5 text-accent" />
                2024 — 2026
              </p>
              <h2 className="display-tight text-3xl md:text-5xl leading-[0.95]">
                Selected work<span className="text-accent">.</span>
              </h2>
            </div>
            <Link
              href="/work"
              className="group inline-flex items-center gap-2.5 pl-5 pr-4 py-3 rounded-full bg-fg text-bg hover:bg-accent transition-colors text-[14px] font-medium"
            >
              See all projects
              <ArrowRight
                weight="bold"
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-12 gap-3 md:gap-4">
          {bentoProjects.map((b) => {
            const project = getProject(b.slug);
            const study = getCaseStudy(b.slug);
            if (!project) return null;
            const heroImage = study?.heroImage;
            const objectClass =
              study?.heroObjectFit === "contain"
                ? "object-contain"
                : "object-cover object-top";
            return (
              <ScrollReveal as="div" key={b.slug} className={b.span}>
                <Link
                  href={`/work/${b.slug}`}
                  className="bento-card group flex flex-col h-full rounded-3xl border border-hairline bg-bg-elevated overflow-hidden"
                  style={{ ["--card-accent" as string]: project.color }}
                >
                  {study?.mediaChrome === "laptop" && heroImage ? (
                    <MockupFrame
                      image={heroImage}
                      alt={project.name}
                      aspect={b.aspect}
                      tint={project.color}
                      chrome="laptop"
                      intensity="subtle"
                      rounded="rounded-none"
                      objectFit={study?.heroObjectFit}
                      screenAspect={study?.laptopScreenAspect}
                      screenBg={study?.laptopScreenBg}
                      priority
                      sizes={
                        b.hero
                          ? "(min-width: 1400px) 1340px, 100vw"
                          : "(min-width: 1400px) 700px, 50vw"
                      }
                    />
                  ) : b.slug === "ecotrip" && heroImage ? (
                    <div
                      className={`relative ${b.aspect} overflow-hidden flex items-center justify-center`}
                      style={{
                        background: `linear-gradient(135deg, color-mix(in oklab, ${project.color} 18%, var(--bg-elevated)), color-mix(in oklab, ${project.color} 42%, var(--bg-elevated)))`,
                      }}
                    >
                      <div
                        className="relative h-[86%] aspect-[1020/1928] drop-shadow-[0_18px_36px_rgba(0,0,0,0.18)]"
                        style={{ transform: "rotate(-3deg)" }}
                      >
                        <div className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
                          <Image
                            src={heroImage}
                            alt={project.name}
                            fill
                            sizes="(min-width: 1400px) 1020px, 50vw"
                            quality={100}
                            className="object-contain"
                            style={{
                              maskImage:
                                "linear-gradient(to bottom, black 0%, black 98%, transparent 100%)",
                              WebkitMaskImage:
                                "linear-gradient(to bottom, black 0%, black 98%, transparent 100%)",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`relative ${b.aspect} overflow-hidden`}
                      style={{
                        background: `linear-gradient(135deg, color-mix(in oklab, ${project.color} 18%, var(--bg-elevated)), color-mix(in oklab, ${project.color} 42%, var(--bg-elevated)))`,
                      }}
                    >
                      {heroImage ? (
                        <Image
                          src={heroImage}
                          alt={project.name}
                          fill
                          sizes={
                            b.hero
                              ? "(min-width: 1400px) 900px, 67vw"
                              : "(min-width: 1400px) 450px, 33vw"
                          }
                          className={`${objectClass} transition-transform duration-500 ease-out group-hover:scale-[1.015]`}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                            {project.name}
                          </p>
                        </div>
                      )}
                      {b.imageMask && (
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0"
                          style={{ background: b.imageMask }}
                        />
                      )}
                    </div>
                  )}
                  <div className="p-5 md:p-6 flex-1">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span>{project.year}</span>
                      <span aria-hidden>·</span>
                      <span>{project.category}</span>
                    </p>
                    <h3
                      className={`display-tight leading-[0.95] ${
                        b.hero
                          ? "text-2xl md:text-3xl"
                          : "text-lg md:text-xl"
                      }`}
                    >
                      {project.name}
                      <span style={{ color: project.color }}>.</span>
                    </h3>
                    <p className="text-[13px] md:text-[14px] text-fg-muted mt-2 leading-snug line-clamp-2">
                      {project.tagline}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

    </>
  );
}

