"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Highlight } from "./Highlight";

type AudienceKey = "recruiters" | "designers" | "developers";
type Variant = "a" | "b" | "c";

type Segment =
  | { type: "text"; content: string }
  | { type: "highlight"; variant: Variant; content: string };

type Atom =
  | { type: "word"; content: string }
  | { type: "highlight"; variant: Variant; content: string };

const tabs: { key: AudienceKey; label: string; shortLabel: string }[] = [
  { key: "recruiters", label: "For recruiters", shortLabel: "Recruiters" },
  { key: "designers", label: "For designers", shortLabel: "Designers" },
  { key: "developers", label: "For developers", shortLabel: "Devs" },
];

const VARIANTS: Record<AudienceKey, Segment[]> = {
  recruiters: [
    { type: "highlight", variant: "a", content: "Product designer" },
    { type: "text", content: " at " },
    { type: "highlight", variant: "b", content: "Sony Nimway" },
    {
      type: "text",
      content:
        " — smart office tech used across many countries. Based in Malmö. ",
    },
    { type: "highlight", variant: "c", content: "Available from June 2026" },
    {
      type: "text",
      content: " for full-time, freelance, or a chat — open to relocate.",
    },
  ],
  designers: [
    { type: "text", content: "Plugged into " },
    { type: "highlight", variant: "a", content: "where UX/UI is moving" },
    {
      type: "text",
      content:
        ", selective about what's worth bringing along. I sweat the ",
    },
    { type: "highlight", variant: "b", content: "small details" },
    { type: "text", content: " and take projects " },
    { type: "highlight", variant: "c", content: "from first sketch to ship" },
    { type: "text", content: "." },
  ],
  developers: [
    { type: "text", content: "Designer " },
    {
      type: "highlight",
      variant: "a",
      content: "drawn to the tech behind every product",
    },
    {
      type: "text",
      content: ". Foundations in HTML, CSS, JS — I ",
    },
    { type: "highlight", variant: "b", content: "code and use AI" },
    {
      type: "text",
      content: " to go from sketch to working prototype fast. The right design ",
    },
    { type: "highlight", variant: "c", content: "lets the tech underneath shine" },
    { type: "text", content: "." },
  ],
};

// Split text segments into word atoms (each word carries its trailing space).
// Highlight segments stay as single atoms so they reveal as one unit.
function tokenize(segments: Segment[]): Atom[] {
  const out: Atom[] = [];
  for (const seg of segments) {
    if (seg.type === "highlight") {
      out.push({ type: "highlight", variant: seg.variant, content: seg.content });
      continue;
    }
    // Split on whitespace but keep the whitespace attached to the previous word.
    // Regex captures whitespace so we can re-stitch.
    const parts = seg.content.match(/\S+\s*|\s+/g) ?? [];
    for (const p of parts) {
      if (p.length === 0) continue;
      out.push({ type: "word", content: p });
    }
  }
  return out;
}

const STAGGER_PER_ATOM_MS = 42;
const ATOM_DURATION_S = 0.5;
const INITIAL_LOAD_DELAY_MS = 700;
const SWITCH_DELAY_MS = 80;
const AUTO_CYCLE_MS = 6500;

export function IntroSwitcher() {
  const [active, setActive] = useState<AudienceKey>("recruiters");
  const [hasInteracted, setHasInteracted] = useState(false);
  const isInitialMountRef = useRef(true);

  // Animate on initial mount, manual clicks, and auto-cycles. The original
  // logic skipped animation on manual clicks — but with auto-cycling, the
  // word-by-word reveal is the showcase, so we keep it for every switch.
  const shouldAnimate = true;
  const startDelayMs = isInitialMountRef.current
    ? INITIAL_LOAD_DELAY_MS
    : SWITCH_DELAY_MS;

  useEffect(() => {
    isInitialMountRef.current = false;
  }, []);

  // Auto-cycle through variants until the visitor manually picks one.
  useEffect(() => {
    if (hasInteracted) return;
    const id = setInterval(() => {
      setActive((curr) => {
        const idx = tabs.findIndex((t) => t.key === curr);
        return tabs[(idx + 1) % tabs.length].key;
      });
    }, AUTO_CYCLE_MS);
    return () => clearInterval(id);
  }, [hasInteracted]);

  const handleTabClick = (key: AudienceKey) => {
    setActive(key);
    setHasInteracted(true);
  };

  return (
    <>
      {/* Row 1: tabs */}
      <div
        role="tablist"
        aria-label="About me, by audience"
        className="col-span-12 md:col-span-8 md:row-start-1 flex flex-wrap gap-1.5 hero-fade-up"
        style={{ animationDelay: "0.45s" }}
      >
        {tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => handleTabClick(t.key)}
              className={`relative cursor-pointer px-3 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ease-out ${
                isActive ? "text-fg" : "text-fg-muted hover:text-fg"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-tab-pill"
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded-full bg-[var(--chip-hover)]"
                  transition={{
                    type: "spring",
                    stiffness: 360,
                    damping: 30,
                    mass: 0.6,
                  }}
                />
              )}
              <span className="relative z-10 md:hidden">{t.shortLabel}</span>
              <span className="relative z-10 hidden md:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Row 2: paragraph */}
      <div
        className="col-span-12 md:col-span-8 md:row-start-2 relative hero-fade-up"
        style={{ animationDelay: "0.6s" }}
      >
        <AnimatePresence mode="wait">
          <AnimatedParagraph
            key={active}
            segments={VARIANTS[active]}
            shouldAnimate={shouldAnimate}
            startDelayMs={startDelayMs}
            scheme={active}
          />
        </AnimatePresence>
      </div>
    </>
  );
}

function AnimatedParagraph({
  segments,
  shouldAnimate,
  startDelayMs,
  scheme,
}: {
  segments: Segment[];
  shouldAnimate: boolean;
  startDelayMs: number;
  scheme: AudienceKey;
}) {
  const atoms = tokenize(segments);
  const baseDelay = startDelayMs / 1000;

  return (
    <motion.p
      initial={false}
      exit={{ opacity: 0, transition: { duration: 0.18, ease: "easeOut" } }}
      className="text-lg md:text-2xl text-fg leading-[1.35] tracking-[-0.01em]"
    >
      {atoms.map((atom, i) => {
        const atomDelay = baseDelay + (i * STAGGER_PER_ATOM_MS) / 1000;
        const animation = shouldAnimate
          ? {
              initial: { opacity: 0, y: 6, filter: "blur(4px)" },
              animate: { opacity: 1, y: 0, filter: "blur(0px)" },
              transition: {
                duration: ATOM_DURATION_S,
                delay: atomDelay,
                ease: [0.22, 1, 0.36, 1] as const,
              },
            }
          : {
              initial: false as const,
              animate: { opacity: 1, y: 0, filter: "blur(0px)" },
              transition: { duration: 0 },
            };

        if (atom.type === "highlight") {
          return (
            <motion.span
              key={i}
              {...animation}
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              <Highlight
                variant={atom.variant}
                scheme={scheme}
                animate={shouldAnimate}
                delay={shouldAnimate ? atomDelay : 0}
              >
                {atom.content}
              </Highlight>
            </motion.span>
          );
        }
        return (
          <motion.span
            key={i}
            {...animation}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {atom.content}
          </motion.span>
        );
      })}
    </motion.p>
  );
}
