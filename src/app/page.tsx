import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CalendarCheck,
  Compass,
  Envelope,
  Flask,
  MapTrifold,
  User,
} from "@phosphor-icons/react/dist/ssr";
import { LinkedInIcon } from "@/components/BrandIcons";
import { HeroBackground } from "@/components/HeroBackground";
import { IntroSwitcher } from "@/components/IntroSwitcher";
import { Magnetic } from "@/components/Magnetic";
import { Marquee } from "@/components/Marquee";
import { MockupFrame } from "@/components/MockupFrame";
import { getCaseStudy } from "@/lib/case-studies";
import { site } from "@/lib/site";

const intro = [
  {
    Icon: MapTrifold,
    HoverIcon: ArrowUpRight,
    label: "Based in",
    value: "Malmö, Sweden. Open to relocate for exciting new opportunities.",
    href: "https://www.google.com/maps/place/Malm%C3%B6,+Sweden",
    external: true,
  },
  {
    Icon: CalendarCheck,
    HoverIcon: Envelope,
    label: "Available from",
    value: "June 2026 — full-time, freelance, and quick chats.",
    href: "/contact",
    external: false,
  },
  {
    Icon: Compass,
    HoverIcon: Briefcase,
    label: "Curious about",
    value: "AI in design tools, motion as language, products that disappear into use.",
    href: "/work",
    external: false,
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
    slug: "ecotrip",
    name: "EcoTrip",
    year: "2024",
    context: "Course project, Malmö University",
    tagline:
      "A bee-led travel companion that nudges greener trips and rewards better choices.",
    color: "#F5B400",
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
  {
    slug: "artist-website",
    name: "Artist Website",
    year: "2025",
    context: "Client project, Stockholm",
    tagline:
      "A modern portfolio for a Stockholm painter — as expressive as the canvas.",
    color: "#C9A36B",
  },
];

const ticker = [
  "Available for new opportunities",
  "Product designer · interaction · motion",
  "Based in Malmö — open to Stockholm, EU, remote",
  "Previously UX at Sony",
  "Curious about AI × design craft",
];

export default function HomePage() {
  return (
    <>
      <div className="relative isolate overflow-hidden">
        <HeroBackground />
      <section className="relative mx-auto max-w-[min(75vw,1400px)] w-full px-5 md:px-8 pt-12 md:pt-20 pb-10 md:pb-16">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6">
          <div
            className="col-span-12 md:col-span-3 md:order-2 flex flex-col items-center md:items-end md:pt-[20px] hero-fade-up"
            style={{ animationDelay: "0.35s" }}
          >
            <div className="relative isolate shrink-0 md:translate-x-3">
              <span
                aria-hidden
                className="absolute -inset-3 md:-inset-5 bg-bg-elevated blob-morph -z-10"
              />
              <div
                className="relative size-32 md:size-72 overflow-hidden border border-hairline"
                style={{
                  borderRadius: "82% 32% 52% 66% / 56% 72% 38% 60%",
                }}
              >
                <Image
                  src="/photo.jpg"
                  alt="Lukas Ahlse"
                  fill
                  sizes="(min-width: 768px) 288px, 128px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-9 md:order-1">
            <p
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle mb-6 flex items-center gap-2 hero-fade-up"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="size-1.5 rounded-full bg-accent" /> Portfolio · 2026
            </p>
            <h1
              className="display-tight text-display-xl leading-[0.86] hero-fade-up"
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

          <div className="col-span-12 md:col-span-3 md:col-start-10 md:row-start-1 md:row-span-2 grid grid-cols-2 gap-2.5 md:gap-3 content-start">
            {/* Primary tile — full width, hero CTA */}
            <div
              className="col-span-2 hero-tile-in"
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
                  className="group w-full flex flex-col gap-4 md:gap-5 rounded-2xl bg-[var(--fg)] text-[var(--bg)] hover:bg-accent transition-colors duration-300 ease-out px-5 py-4 md:px-6 md:py-5"
                >
                  <div className="flex items-start justify-between">
                    <Briefcase
                      weight="fill"
                      className="row-icon size-4 translate-y-[1px]"
                    />
                    <ArrowRight
                      weight="bold"
                      className="row-icon size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                  <span className="text-[15px] md:text-base font-medium leading-snug">
                    See selected work
                  </span>
                </Link>
              </Magnetic>
            </div>

            {/* Secondary tile — get in touch, icon only */}
            <div
              className="hero-tile-in"
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
                  className="group w-full flex items-center justify-center rounded-2xl bg-[var(--chip)] hover:bg-[color-mix(in_oklab,var(--fg)_22%,transparent)] transition-colors duration-300 ease-out h-14 md:h-16 text-fg-muted hover:text-fg"
                >
                  <Envelope
                    weight="fill"
                    className="row-icon size-[20px] md:size-[22px] opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </Link>
              </Magnetic>
            </div>

            {/* Secondary tile — LinkedIn, icon only */}
            <div
              className="hero-tile-in"
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
                  className="group w-full flex items-center justify-center rounded-2xl bg-[var(--chip)] hover:bg-[color-mix(in_oklab,var(--fg)_22%,transparent)] transition-colors duration-300 ease-out h-14 md:h-16 text-fg-muted hover:text-fg"
                >
                  <LinkedInIcon className="row-icon size-4 md:size-[18px] opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={ticker} className="mt-16 md:mt-24" />
      </div>

      <section className="mx-auto max-w-[min(75vw,1400px)] w-full px-5 md:px-8 pt-16 md:pt-24">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {intro.map(({ Icon, HoverIcon, label, value, href, external }) => {
            const cardClass =
              "group flex flex-col gap-5 rounded-3xl border border-hairline bg-bg-elevated p-6 md:p-7 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-16px_rgba(193,66,28,0.22)] hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
            const inner = (
              <>
                <div className="flex items-start justify-between">
                  <Icon
                    weight="duotone"
                    className="size-9 md:size-10 text-accent transition-transform duration-300 ease-out group-hover:scale-110"
                  />
                  <HoverIcon
                    weight="regular"
                    className="size-4 text-fg-muted mt-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out"
                  />
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle mb-2">
                    {label}
                  </p>
                  <p className="text-[15px] text-fg leading-relaxed">{value}</p>
                </div>
              </>
            );
            return (
              <li key={label}>
                {external ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className={cardClass}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link href={href} className={cardClass}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto max-w-[min(86vw,1500px)] w-full px-5 md:px-8 pt-20 md:pt-24 pb-20 md:pb-28">
        <div className="flex items-center gap-3 mb-10 md:mb-14">
          <ArrowDownRight weight="bold" className="size-4 text-accent" />
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">
            Selected work · 2024–2025
          </p>
        </div>

        <ul className="flex flex-col gap-6 md:gap-8">
          {featuredProjects.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/work/${p.slug}`}
                className="project-card group relative block overflow-hidden rounded-3xl border border-hairline"
                style={{ ["--card-accent" as string]: p.color }}
              >
                <span
                  aria-hidden
                  className="project-card-fill absolute inset-0"
                />
                <span
                  aria-hidden
                  className="project-card-tint absolute inset-0"
                />

                <div className="relative p-8 md:p-12">
                  <div className="flex items-start justify-between gap-6 mb-12 md:mb-16">
                    <div className="min-w-0 max-w-2xl">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>0{i + 1} / 0{featuredProjects.length}</span>
                        <span>·</span>
                        <span>{p.year}</span>
                        <span>·</span>
                        <span>{p.context}</span>
                      </p>
                      <h3 className="display-tight text-3xl md:text-5xl leading-[0.95] mb-3">
                        {p.name}
                        <span
                          className="inline-block overflow-hidden align-baseline transition-all duration-300 ease-out max-w-0 opacity-0 group-hover:max-w-[1em] group-hover:opacity-100 pr-[0.08em]"
                          style={{ color: p.color }}
                        >
                          .
                        </span>
                      </h3>
                      <p className="text-base md:text-lg text-fg-muted leading-snug">
                        {p.tagline}
                      </p>
                    </div>
                    <span className="flex size-11 md:size-12 items-center justify-center rounded-full bg-[var(--chip)] group-hover:bg-[var(--chip-hover)] text-fg-muted group-hover:text-fg transition-colors duration-500 ease-out shrink-0">
                      <ArrowRight
                        weight="bold"
                        className="size-4 md:size-5 group-hover:animate-arrow-nudge"
                      />
                    </span>
                  </div>

                  {(() => {
                    const study = getCaseStudy(p.slug);
                    const heroImage = study?.heroImage;
                    const useBrowserChrome =
                      heroImage && (study?.mediaChrome ?? "browser") === "browser";
                    if (useBrowserChrome) {
                      return (
                        <div className="project-card-mock mx-2 md:mx-4">
                          <MockupFrame
                            image={heroImage}
                            alt={`${p.name} — hero`}
                            aspect="aspect-[16/9]"
                            tint={p.color}
                            chrome="browser"
                            intensity="strong"
                            rounded="rounded-2xl"
                            innerPadding="inset-6 md:inset-8"
                            sizes="(min-width: 1400px) 1340px, 100vw"
                          />
                        </div>
                      );
                    }
                    return (
                      <div
                        className="project-card-mock relative aspect-[16/9] mx-2 md:mx-4 rounded-2xl overflow-hidden border border-hairline flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, color-mix(in oklab, ${p.color} 42%, var(--bg)), color-mix(in oklab, ${p.color} 65%, var(--bg)))`,
                        }}
                      >
                        {heroImage ? (
                          <Image
                            src={heroImage}
                            alt={`${p.name} — hero`}
                            fill
                            sizes="(min-width: 1400px) 1340px, 100vw"
                            className={
                              study?.heroObjectFit === "contain"
                                ? "object-contain"
                                : "object-cover object-center"
                            }
                          />
                        ) : (
                          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">
                            Mockup placeholder · {p.name}
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[min(75vw,1400px)] w-full px-5 md:px-8 pb-20 md:pb-28">
        <div className="flex items-center gap-3 mb-8 md:mb-10">
          <ArrowDownRight weight="bold" className="size-4 text-accent" />
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted">
            Where to next
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2.5 pl-5 pr-4 py-3 rounded-full bg-[var(--fg)] text-[var(--bg)] hover:bg-accent hover:text-[var(--bg)] transition-colors duration-300 ease-out text-[14px]"
          >
            <Briefcase weight="fill" className="row-icon size-4 translate-y-[1px]" />
            See all case studies
          </Link>
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 px-4 py-3 rounded-full border border-hairline text-[13px] text-fg-muted hover:bg-[var(--chip)] hover:text-fg hover:border-[var(--chip)] transition-colors duration-300 ease-out"
          >
            <User weight="fill" className="row-icon size-3.5" />
            Get to know me
          </Link>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-4 py-3 rounded-full border border-hairline text-[13px] text-fg-muted hover:bg-[var(--chip)] hover:text-fg hover:border-[var(--chip)] transition-colors duration-300 ease-out"
          >
            <Envelope weight="fill" className="row-icon size-3.5" />
            Get in touch
          </Link>
          <Link
            href="/playground"
            className="group inline-flex items-center gap-2 px-4 py-3 rounded-full border border-hairline text-[13px] text-fg-muted hover:bg-[var(--chip)] hover:text-fg hover:border-[var(--chip)] transition-colors duration-300 ease-out"
          >
            <Flask weight="fill" className="row-icon size-3.5" />
            Laboratory
          </Link>
        </div>
      </section>
    </>
  );
}
