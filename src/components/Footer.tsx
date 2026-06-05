"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLineUp,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Briefcase,
  Envelope,
  FileArrowDown,
  Flask,
  MapPin,
  User,
} from "@phosphor-icons/react/dist/ssr";
import type { ComponentType, SVGProps } from "react";
import { projects } from "@/lib/projects";
import { Magnetic } from "@/components/Magnetic";
import { ScrollReveal } from "@/components/ScrollReveal";

type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { weight?: string }
>;

type TileKey = "work" | "about" | "contact" | "playground";

type TileConfig = {
  href: string;
  Icon: IconComponent;
  title: string;
  subtitle: string;
};

const TILES: Record<TileKey, TileConfig> = {
  work: {
    href: "/work",
    Icon: Briefcase,
    title: "All work",
    subtitle: `${projects.length} projects`,
  },
  about: {
    href: "/about",
    Icon: User,
    title: "About me",
    subtitle: "Story · climbing · food",
  },
  contact: {
    href: "/contact",
    Icon: Envelope,
    title: "Say hello",
    subtitle: "Email · LinkedIn · phone",
  },
  playground: {
    href: "/playground",
    Icon: Flask,
    title: "Lab",
    subtitle: "Experiments & notes",
  },
};

const ALL_KEYS: TileKey[] = ["work", "about", "contact", "playground"];

// Which section the visitor is currently inside (null = home or anywhere not
// matching a tile section, e.g. /cv).
function currentSection(pathname: string): TileKey | null {
  if (pathname === "/work" || pathname.startsWith("/work/")) return "work";
  if (pathname === "/about" || pathname.startsWith("/about/")) return "about";
  if (pathname === "/contact" || pathname.startsWith("/contact/")) return "contact";
  if (pathname === "/playground" || pathname.startsWith("/playground/"))
    return "playground";
  return null;
}

// Best "next destination" given where you are. After someone reads the work,
// the strongest next move is to reach out. From anywhere else, the work is
// the main act.
const PRIMARY_PICK: Record<TileKey, TileKey> = {
  work: "contact",
  about: "work",
  contact: "work",
  playground: "work",
};

export function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const section = currentSection(pathname);
  const primary: TileKey = section ? PRIMARY_PICK[section] : "work";
  const outlines = section
    ? ALL_KEYS.filter((k) => k !== primary && k !== section)
    : ALL_KEYS.filter((k) => k !== primary);

  return (
    <footer className="mt-16">
      <ScrollReveal as="div" className="mx-auto max-w-full md:max-w-[min(75vw,1400px)] px-5 md:px-8 py-12 md:py-16">
        <h2 className="display-tight text-5xl md:text-7xl leading-[0.92] mb-10 md:mb-14">
          Let&rsquo;s build
          <br />
          something good<span className="text-accent">.</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <PrimaryTile config={TILES[primary]} />
          {outlines.map((key) => (
            <OutlineTile key={key} config={TILES[key]} />
          ))}
          {section && <BackToTopTile />}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-12 md:mt-14 text-[11px] font-mono uppercase tracking-[0.18em] text-fg-subtle">
          <span>© {year} Lukas Ahlse</span>
          <span className="flex items-center gap-2">
            <span className="relative flex size-1.5">
              <span
                className="absolute inset-0 rounded-full bg-[var(--status-available)] animate-ping opacity-70"
                aria-hidden
              />
              <span
                className="relative size-1.5 rounded-full bg-[var(--status-available)]"
                aria-hidden
              />
            </span>
            Available for new opportunities
          </span>
          <Link
            href="/cv"
            className="flex items-center gap-1.5 hover:text-fg transition-colors"
            aria-label="View CV"
          >
            <FileArrowDown weight="fill" className="size-3.5" />
            View CV
          </Link>
          <span className="flex items-center gap-1.5">
            <MapPin weight="fill" className="size-3.5" />
            Malmö, Sweden
          </span>
        </div>
      </ScrollReveal>
    </footer>
  );
}

function PrimaryTile({ config }: { config: TileConfig }) {
  const { href, Icon, title, subtitle } = config;
  return (
    <Magnetic strength={0.06} className="w-full">
    <Link
      href={href}
      className="group flex flex-col w-full rounded-2xl bg-[var(--fg)] text-[var(--bg)] p-5 md:p-6 min-h-[120px] md:min-h-[160px] hover:bg-accent transition-colors duration-300 ease-out"
    >
      <div className="flex items-start justify-between">
        <Icon weight="fill" className="row-icon size-5" />
        <ArrowRight
          weight="bold"
          className="row-icon size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
      <div className="mt-8 md:mt-12">
        <p className="display-tight text-[18px] md:text-[20px] leading-[1] mb-1">
          {title}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">
          {subtitle}
        </p>
      </div>
    </Link>
    </Magnetic>
  );
}

function OutlineTile({ config }: { config: TileConfig }) {
  const { href, Icon, title, subtitle } = config;
  return (
    <Magnetic strength={0.06} className="w-full">
    <Link
      href={href}
      className="group flex flex-col w-full rounded-2xl border border-hairline bg-bg-elevated p-5 md:p-6 min-h-[120px] md:min-h-[160px] hover:border-accent transition-colors duration-300 ease-out"
    >
      <div className="flex items-start justify-between">
        <Icon weight="fill" className="row-icon size-5 text-fg" />
        <ArrowUpRight
          weight="bold"
          className="row-icon size-4 text-fg-subtle group-hover:text-accent transition-colors duration-300 ease-out"
        />
      </div>
      <div className="mt-8 md:mt-12">
        <p className="display-tight text-[18px] md:text-[20px] leading-[1] mb-1">
          {title}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
          {subtitle}
        </p>
      </div>
    </Link>
    </Magnetic>
  );
}

function BackToTopTile() {
  const handleClick = () => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };
  return (
    <Magnetic strength={0.06} className="w-full">
    <button
      type="button"
      onClick={handleClick}
      className="group flex flex-col w-full rounded-2xl border border-hairline bg-bg-elevated p-5 md:p-6 min-h-[120px] md:min-h-[160px] hover:border-accent transition-colors duration-300 ease-out text-left"
    >
      <div className="flex items-start justify-between">
        <ArrowLineUp weight="fill" className="row-icon size-5 text-fg" />
        <ArrowUp
          weight="bold"
          className="row-icon size-4 text-fg-subtle group-hover:text-accent transition-colors duration-300 ease-out"
        />
      </div>
      <div className="mt-8 md:mt-12">
        <p className="display-tight text-[18px] md:text-[20px] leading-[1] mb-1">
          Back to top
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
          Re-read from the start
        </p>
      </div>
    </button>
    </Magnetic>
  );
}
