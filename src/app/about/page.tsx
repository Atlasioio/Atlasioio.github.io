import Image from "next/image";
import {
  ArrowDownRight,
  BookOpen,
  Briefcase,
  CookingPot,
  Envelope,
  Flask,
  House,
  MapPin,
  Mountains,
  MusicNote,
  Sparkle,
  User,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";
import {
  ClaudeIcon,
  CursorIcon,
  FigmaIcon,
  MidjourneyIcon,
  V0Icon,
} from "@/components/BrandIcons";
import { PathRoadmap, type Chapter } from "@/components/PathRoadmap";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { SwipeCarousel } from "@/components/SwipeCarousel";

const aiBrands = [
  { Icon: ClaudeIcon, name: "Claude" },
  { Icon: FigmaIcon, name: "Figma" },
  { Icon: V0Icon, name: "v0" },
  { Icon: CursorIcon, name: "Cursor" },
  { Icon: MidjourneyIcon, name: "Midjourney" },
];

const places: { label: string; src: string; radius: string; size: string; offset: string }[] = [
  {
    label: "Malmö",
    src: "https://picsum.photos/seed/malmo-city/600/600",
    radius: "70% 30% 56% 44% / 40% 64% 50% 60%",
    size: "size-32 md:size-36",
    offset: "",
  },
  {
    label: "Copenhagen",
    src: "https://picsum.photos/seed/copenhagen-harbour/600/600",
    radius: "82% 32% 52% 66% / 56% 72% 38% 60%",
    size: "size-36 md:size-44",
    offset: "md:mt-10",
  },
  {
    label: "Stockholm",
    src: "https://picsum.photos/seed/stockholm-old/600/600",
    radius: "30% 70% 44% 56% / 64% 40% 60% 50%",
    size: "size-28 md:size-32",
    offset: "md:mt-2",
  },
  {
    label: "Beyond",
    src: "https://picsum.photos/seed/world-map/600/600",
    radius: "42% 58% 38% 62% / 56% 44% 60% 40%",
    size: "size-32 md:size-40",
    offset: "md:mt-16",
  },
];

export const metadata = { title: "About" };

const path: Chapter[] = [
  {
    years: "2018 — 2020",
    title: "Linköping & Scotland",
    body: "None of them quite fit — but the breadth still pays off.",
    artifact: {
      label: "Studied",
      items: ["Business", "Economics", "Software engineering"],
    },
  },
  {
    years: "2021 — 2024",
    title: "Malmö University — BSc",
    body: "Where I found my footing.",
    artifact: {
      label: "Studied",
      items: [
        "UX & UI",
        "User research",
        "Creative coding",
        "Service design",
        "Spring '24 — Malta exchange",
      ],
    },
  },
  {
    years: "2024 — 2025",
    title: "ITU Copenhagen",
    body: "Closing the gap between what I design and what gets built.",
    artifact: {
      label: "Studied",
      items: ["Java OOP", "Agile development", "Discrete math"],
    },
  },
  {
    years: "2025 — 2026",
    title: "Sony / Nimway",
    body: "First time designing for a real shipping product.",
    artifact: {
      label: "Shipped",
      items: [
        "Meeting room panels",
        "Booking app & website",
        "Wayfinding maps",
      ],
    },
  },
  {
    years: "2026 — now",
    title: "Looking ahead",
    body: "Two months in Asia, then looking ahead to an exciting future back to the dynamic world of UX design.",
    current: true,
    artifact: {
      label: "Open to",
      items: [
        "Product design roles",
        "Open to new adventures",
        "Open to on-site and remote",
      ],
    },
  },
];

const skillGroups: { title: string; items: string[] }[] = [
  {
    title: "Design",
    items: ["Figma", "Framer", "Adobe Suite", "Photo & video editing"],
  },
  {
    title: "Code",
    items: ["HTML", "CSS", "JavaScript"],
  },
  {
    title: "AI",
    items: ["Claude Code", "Lovable", "Midjourney", "Cursor", "v0"],
  },
  {
    title: "Workflow",
    items: ["Notion", "Miro", "FigJam", "Slack", "Microsoft Suite"],
  },
];

const tracks: { title: string; artist: string; trackId: string }[] = [
  { title: "Self Aware", artist: "Temper City", trackId: "4qW3BbQAwZsrnu8a3ZRdyT" },
  { title: "Texas Sun", artist: "Khruangbin & Leon Bridges", trackId: "24ntSW3QVJzR79lHAAOTaY" },
  { title: "Oysters in My Pocket", artist: "Royel Otis", trackId: "2B664ulJSVBd6B8SAY3Wux" },
];

type Book = {
  title: string;
  author: string;
  isbn: string;
  status: string;
  coverUrl?: string;
};

const books: Book[] = [
  {
    title: "Golden Son",
    author: "Pierce Brown",
    isbn: "9780345539816",
    status: "Reading",
  },
  {
    title: "Discourses",
    author: "Epictetus",
    isbn: "9780241764060",
    status: "Alongside",
    coverUrl: "https://images.penguinrandomhouse.com/cover/9780241764060",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "9780735211292",
    status: "Up next",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-full md:max-w-[min(75vw,1400px)] w-full px-5 md:px-8 pt-14 md:pt-20">
      {/* Hero */}
      <ScrollReveal as="div" className="grid grid-cols-12 gap-x-3 md:gap-x-6 gap-y-8 items-center md:items-start">
        <div className="col-span-8 md:col-span-9 order-1">
          <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-4 md:mb-6 flex items-center gap-2">
            <User weight="fill" className="size-3.5" /> About
          </p>
          <h1 className="display-tight text-[2.5rem] md:text-display-lg leading-[0.92]">
            Designer
            <br />
            who tinkers<span className="text-accent">.</span>
          </h1>
        </div>
        <div className="col-span-4 md:col-span-3 order-2 flex justify-end md:justify-center md:pt-10">
          <div className="relative isolate shrink-0">
            <span
              aria-hidden
              className="absolute -inset-2 md:-inset-3 bg-bg-elevated blob-morph-about -z-10"
            />
            <div
              className="relative size-24 md:size-40 overflow-hidden border border-hairline"
              style={{
                borderRadius: "70% 30% 56% 44% / 40% 64% 50% 60%",
              }}
            >
              <Image
                src="/photo.jpg"
                alt="Lukas Ahlse"
                fill
                sizes="(min-width: 768px) 160px, 96px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="div" className="mt-8 md:mt-10 grid grid-cols-12 gap-x-6 md:gap-x-20 gap-y-6 md:gap-y-8">
        <p className="col-span-12 md:col-span-5 text-base md:text-xl text-fg-muted leading-relaxed">
          <span className="text-fg display-tight text-[1.15em]">Curious</span>{" "}by default,
          drawn to making things, happiest where craft, psychology, and
          problem-solving overlap.
        </p>
        <p className="col-span-12 md:col-span-5 md:col-start-8 text-base md:text-xl text-fg-muted leading-relaxed">
          <span className="text-fg display-tight text-[1.15em]">My path</span>{" "}wasn&rsquo;t
          a straight line, and gave me a unique lens. Business, economics and
          software prior to a BSc in design.
        </p>
      </ScrollReveal>

      {/* Path */}
      <ScrollReveal as="div" className="mt-20 md:mt-28">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-10 md:mb-12 flex items-center gap-2">
          <ArrowDownRight weight="bold" className="size-4 text-accent" /> The path
        </p>
        <PathRoadmap chapters={path} />
      </ScrollReveal>

      {/* Skills */}
      <ScrollReveal as="div" className="mt-16 md:mt-28">
        <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-6 md:mb-8 flex items-center gap-2">
          <Wrench weight="fill" className="size-3.5" /> Toolbox
        </p>

        {/* Mobile: horizontal-swipe carousel */}
        <SwipeCarousel
          dotColors={skillGroups.map(() => "var(--accent)")}
        >
          {skillGroups.map((g) => (
            <article
              key={g.title}
              className="rounded-3xl border border-hairline bg-bg-elevated p-5 w-full flex flex-col gap-4 h-full"
            >
              <div className="flex flex-col gap-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
                  Toolbox · {g.title}
                </p>
                <h3 className="display-tight text-3xl leading-[0.95]">
                  {g.title}
                  <span className="text-accent">.</span>
                </h3>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {g.items.map((tool) => (
                  <li
                    key={tool}
                    className="px-2.5 py-1 rounded-full border border-hairline text-[11px] text-fg-muted"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
              <p className="mt-auto font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                {g.items.length} in the kit
              </p>
            </article>
          ))}
        </SwipeCarousel>

        {/* Desktop: 4-column grid */}
        <div className="hidden md:grid grid-cols-12 gap-10">
          {skillGroups.map((g) => (
            <div key={g.title} className="col-span-12 sm:col-span-6 md:col-span-3 flex flex-col">
              <h3 className="text-[15px] font-medium mb-4 flex items-center gap-2">
                {g.title}
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                  · {g.items.length}
                </span>
              </h3>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((tool) => (
                  <li
                    key={tool}
                    className="px-3 py-1.5 rounded-full border border-hairline bg-bg-elevated text-[12px] text-fg-muted"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ScrollReveal>

      </section>

      {/* Currently — wider */}
      <section className="mx-auto max-w-full md:max-w-[min(86vw,1500px)] w-full px-5 md:px-8">
      <ScrollReveal as="div" className="mt-20 md:mt-28" id="currently">
        <div className="flex items-baseline justify-between gap-4 mb-8">
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted flex items-center gap-2">
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
            Currently
          </p>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
            Outside the work
          </span>
        </div>

        {/* Mobile: horizontal-swipe carousel */}
        <SwipeCarousel
          dotColors={[
            "var(--accent)",
            "var(--accent)",
            "var(--accent)",
            "var(--accent)",
            "var(--accent)",
          ]}
        >
          {/* Listening — mobile */}
          <article className="rounded-3xl border border-hairline bg-bg-elevated p-5 w-full flex flex-col gap-4 h-full">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted flex items-center gap-2">
                <MusicNote weight="fill" className="size-3.5 text-accent" />
                Listening
              </p>
              <h3 className="display-tight text-2xl leading-[0.95]">
                On rotation<span className="text-accent">.</span>
              </h3>
            </div>
            <ul className="flex flex-col gap-3 mt-1">
              {tracks.slice(0, 2).map((t) => (
                <li key={t.title}>
                  <SpotifyEmbed trackId={t.trackId} compact />
                </li>
              ))}
            </ul>
            <a
              href="https://open.spotify.com/user/lukasahlse"
              target="_blank"
              rel="noreferrer"
              className="mt-auto inline-flex items-center gap-1.5 self-start font-mono text-[10px] uppercase tracking-[0.18em] text-fg-muted hover:text-fg transition-colors"
            >
              <span
                className="size-1.5 rounded-full bg-accent"
                aria-hidden
              />
              More on Spotify
            </a>
          </article>

          {/* Reading — mobile */}
          <article className="rounded-3xl border border-hairline bg-bg-elevated p-5 w-full flex flex-col gap-4 h-full">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted flex items-center gap-2">
                <BookOpen weight="fill" className="size-3.5 text-accent" />
                Reading
              </p>
              <h3 className="display-tight text-2xl leading-[0.95]">
                On the nightstand<span className="text-accent">.</span>
              </h3>
            </div>
            <ul className="flex flex-col gap-3 mt-1">
              {books.map((b) => (
                <li key={b.title}>
                  <a
                    href={`https://www.goodreads.com/search?q=${b.isbn}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 active:bg-[var(--chip)] rounded-xl p-1 -m-1 transition-colors"
                  >
                    <div className="relative w-12 h-[72px] rounded-md overflow-hidden border border-hairline bg-[var(--chip)] shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          b.coverUrl ??
                          `https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg`
                        }
                        alt={`${b.title} cover`}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle mb-1">
                        {b.status}
                      </p>
                      <p className="text-[14px] font-medium leading-tight truncate">
                        {b.title}
                      </p>
                      <p className="text-[12px] text-fg-muted leading-tight mt-0.5 truncate">
                        {b.author}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </article>

          {/* Climbing — mobile */}
          <article className="rounded-3xl border border-hairline bg-bg-elevated p-5 w-full flex flex-col gap-4 h-full">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted flex items-center gap-2">
                <Mountains weight="fill" className="size-3.5 text-accent" />
                Climbing
              </p>
              <h3 className="display-tight text-2xl leading-[0.95]">
                Chasing glory<span className="text-accent">.</span>
              </h3>
            </div>
            <div className="mt-auto">
              <p className="display-tight text-[7rem] leading-[0.8] mb-3">
                7A
                <span className="text-accent">.</span>
              </p>
              <p className="text-[13px] text-fg-muted leading-snug">
                Bouldering grade I&rsquo;m working toward — sent a few, chasing
                the rest.
              </p>
            </div>
          </article>

          {/* Cooking — mobile */}
          <article className="rounded-3xl border border-hairline bg-bg-elevated p-5 w-full flex flex-col gap-4 h-full">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted flex items-center gap-2">
                <CookingPot weight="fill" className="size-3.5 text-accent" />
                Cooking
              </p>
              <h3 className="display-tight text-2xl leading-[0.95]">
                In the kitchen<span className="text-accent">.</span>
              </h3>
            </div>
            <ul className="flex flex-col gap-2 mt-1">
              <li className="flex items-center gap-3 py-2">
                <div className="relative size-12 rounded-full overflow-hidden border border-hairline bg-[var(--chip)] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/about/vongole.jpg"
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] truncate">Spaghetti alle Vongole</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle mt-0.5">
                    Perfecting
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3 py-2">
                <div className="relative size-12 rounded-full overflow-hidden border border-hairline bg-[var(--chip)] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/about/mapo.jpg"
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] truncate">Mapo tofu</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle mt-0.5">
                    Post-China trip
                  </p>
                </div>
              </li>
            </ul>
          </article>

          {/* Researching — mobile */}
          <article className="rounded-3xl border border-hairline bg-bg-elevated p-5 w-full flex flex-col gap-4 h-full">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted flex items-center gap-2">
                <Sparkle weight="fill" className="size-3.5 text-accent" />
                Researching
              </p>
              <h3 className="display-tight text-2xl leading-[0.95]">
                Watching the shift<span className="text-accent">.</span>
              </h3>
            </div>
            <p className="text-[13px] text-fg-muted leading-relaxed">
              Following how AI folds into design work — more curious about
              where it earns a place than about the hype.
            </p>
            <div className="mt-auto">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle mb-3">
                On the desk
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {aiBrands.map(({ Icon, name }) => (
                  <li
                    key={name}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-hairline text-[11px] text-fg-muted"
                  >
                    <Icon className="size-3" />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </SwipeCarousel>

        {/* Desktop: vertical grid */}
        <div className="hidden md:grid grid-cols-12 gap-5 md:gap-6">
          {/* Listening */}
          <div className="col-span-12 md:col-span-6 rounded-3xl border border-hairline bg-bg-elevated p-6 md:p-8">
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-5 flex items-center gap-2">
              <MusicNote weight="fill" className="size-3.5 text-accent" />
              Listening
            </p>
            <h3 className="display-tight text-2xl md:text-3xl leading-[0.95] mb-5">
              On rotation<span className="text-accent">.</span>
            </h3>
            <ul className="flex flex-col gap-5">
              {tracks.map((t) => (
                <li key={t.title}>
                  {t.trackId ? (
                    <SpotifyEmbed trackId={t.trackId} compact />
                  ) : (
                    <div className="flex items-center justify-between rounded-xl border border-hairline px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium truncate">{t.title}</p>
                        <p className="text-[12px] text-fg-muted truncate">{t.artist}</p>
                      </div>
                      <a
                        href={`https://open.spotify.com/search/${encodeURIComponent(`${t.title} ${t.artist}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle hover:text-fg transition-colors"
                      >
                        Spotify ↗
                      </a>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Reading */}
          <div className="col-span-12 md:col-span-6 rounded-3xl border border-hairline bg-bg-elevated p-6 md:p-8">
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-5 flex items-center gap-2">
              <BookOpen weight="fill" className="size-3.5 text-accent" />
              Reading
            </p>
            <h3 className="display-tight text-2xl md:text-3xl leading-[0.95] mb-6">
              On the nightstand<span className="text-accent">.</span>
            </h3>
            <ul className="grid grid-cols-3 gap-4">
              {books.map((b) => (
                <li key={b.title} className="flex flex-col gap-3">
                  <a
                    href={`https://www.goodreads.com/search?q=${b.isbn}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${b.title} on Goodreads`}
                    className="relative aspect-[2/3] rounded-md overflow-hidden border border-hairline bg-[var(--chip)] transition-opacity hover:opacity-85"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        b.coverUrl ??
                        `https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg`
                      }
                      alt={`${b.title} cover`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </a>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle mb-1">
                      {b.status}
                    </p>
                    <p className="text-[13px] font-medium leading-tight">{b.title}</p>
                    <p className="text-[12px] text-fg-muted leading-tight mt-0.5">
                      {b.author}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Climbing */}
          <div className="col-span-12 md:col-span-6 rounded-3xl border border-hairline bg-bg-elevated p-6 md:p-8">
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-5 flex items-center gap-2">
              <Mountains weight="fill" className="size-3.5 text-accent" />
              Climbing
            </p>
            <h3 className="display-tight text-2xl md:text-3xl leading-[0.95] mb-6">
              Chasing glory<span className="text-accent">.</span>
            </h3>
            <div className="flex items-end gap-5">
              <span className="display-tight text-7xl md:text-8xl leading-[0.85]">
                7A
              </span>
              <p className="text-[13px] text-fg-muted leading-snug pb-2 max-w-[28ch]">
                Bouldering grade I&rsquo;m working toward — sent a few, chasing
                the rest.
              </p>
            </div>
          </div>

          {/* Cooking */}
          <div className="col-span-12 md:col-span-6 rounded-3xl border border-hairline bg-bg-elevated p-6 md:p-8">
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-5 flex items-center gap-2">
              <CookingPot weight="fill" className="size-3.5 text-accent" />
              Cooking
            </p>
            <h3 className="display-tight text-2xl md:text-3xl leading-[0.95] mb-6">
              In the kitchen<span className="text-accent">.</span>
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative size-9 rounded-full overflow-hidden border border-hairline bg-[var(--chip)] shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/about/vongole.jpg"
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[15px] truncate">
                    Spaghetti alle Vongole
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle shrink-0">
                  perfecting
                </span>
              </li>
              <li className="flex items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative size-9 rounded-full overflow-hidden border border-hairline bg-[var(--chip)] shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/about/mapo.jpg"
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[15px] truncate">Mapo tofu</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle shrink-0">
                  post-China trip
                </span>
              </li>
            </ul>
          </div>

          {/* Researching */}
          <div className="col-span-12 rounded-3xl border border-hairline bg-bg-elevated p-6 md:p-8">
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-6 flex items-center gap-2">
              <Sparkle weight="fill" className="size-3.5 text-accent" />
              Researching
            </p>
            <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
              <div className="col-span-12 md:col-span-5">
                <h3 className="display-tight text-2xl md:text-3xl leading-[0.95]">
                  Watching the shift<span className="text-accent">.</span>
                </h3>
                <div className="mt-8 md:mt-10">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle mb-4">
                    On the desk
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {aiBrands.map(({ Icon, name }) => (
                      <li
                        key={name}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline text-[12px] text-fg-muted"
                      >
                        <Icon className="size-3.5" />
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-span-12 md:col-span-7 flex flex-col gap-4 text-base md:text-lg text-fg-muted leading-relaxed">
                <p>
                  Following how AI is folding into design work — more curious
                  about where it earns a place in the process than about the
                  hype around it. Both ends interest me: the quiet efficiency
                  wins on one side, the bolder generative directions on the
                  other.
                </p>
                <p>
                  On a personal level, it also closes the gap between design
                  and code — letting me push an idea from sketch to a working
                  prototype I can click through, feel, and refine, instead of
                  just describing it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      </section>

      {/* Footer location strip */}
      <section className="mx-auto max-w-full md:max-w-[min(75vw,1400px)] w-full px-5 md:px-8 pb-14 md:pb-20">
      <ScrollReveal as="div" className="mt-20 md:mt-28">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-6 flex items-center gap-2">
          <MapPin weight="fill" className="size-3.5" /> Location
        </p>
        <p className="max-w-[100ch] text-base md:text-lg text-fg-muted leading-relaxed">
          Based in Malmö, with Copenhagen a short commute away — and happy
          to relocate for the right team. I went to international schools
          growing up and have lived for stretches in Scotland and China,
          so a new city isn&rsquo;t a hurdle. Swedish is my first language,
          and most of my studying and working has been in English.
        </p>
        <ul className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-x-3 md:gap-x-6 gap-y-6 md:gap-y-8 items-start justify-items-center md:justify-items-start">
          {places.map((p) => (
            <li
              key={p.label}
              className={`group flex flex-col items-start ${p.offset}`}
            >
              <div
                className={`relative ${p.size} overflow-hidden border border-hairline bg-[var(--chip)] transition-all duration-500 ease-out md:group-hover:scale-[1.3] md:group-hover:z-10 md:group-hover:shadow-[0_18px_36px_-18px_rgba(0,0,0,0.45)] active:scale-95 md:active:scale-100`}
                style={{ borderRadius: p.radius, transformOrigin: "bottom center" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.label}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out md:group-hover:scale-110"
                />
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle md:group-hover:text-fg transition-colors duration-300 ease-out flex items-center gap-1.5">
                <span
                  className="size-1 rounded-full bg-accent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ease-out"
                  aria-hidden
                />
                {p.label}
              </p>
            </li>
          ))}
        </ul>
      </ScrollReveal>
      </section>

    </>
  );
}
