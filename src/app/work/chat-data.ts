import { projects } from "@/lib/projects";

type KickerVariant = { text: string; isQuestion: boolean };

const GENERAL_KICKERS: KickerVariant[] = [
  { text: "Ask about my work", isQuestion: false },
  { text: "Curious about the projects", isQuestion: true },
  { text: "Got questions", isQuestion: true },
  { text: "Want a tour", isQuestion: true },
];

const PROJECT_KICKERS: KickerVariant[] = [
  { text: "Ask about {name}", isQuestion: false },
  { text: "Curious about {name}", isQuestion: true },
  { text: "More on {name}", isQuestion: true },
  { text: "What can I tell you about {name}", isQuestion: true },
];

export type Kicker = { text: string; isQuestion: boolean };

export function getKicker(projectName: string | null, seed: number): Kicker {
  const list = projectName ? PROJECT_KICKERS : GENERAL_KICKERS;
  const variant = list[seed % list.length];
  return {
    text: projectName
      ? variant.text.replace("{name}", projectName)
      : variant.text,
    isQuestion: variant.isQuestion,
  };
}

const GENERAL_CHIPS = [
  "Which one should I look at first?",
  "Real client work?",
  "Show me your apps",
  "What's most recent?",
  "Anything non-digital?",
];

const PROJECT_CHIPS = [
  "What was your role?",
  "How long did it take?",
  "What did you learn?",
  "Tools you used?",
  "Show me a similar one",
];

export function getChips(projectSlug: string | null): string[] {
  return projectSlug ? PROJECT_CHIPS : GENERAL_CHIPS;
}

export type MockResponse = {
  text: string;
  references?: { name: string; slug: string }[];
};

const PROJECT_CANNED: Record<
  string,
  { role?: string; timeline?: string; lesson?: string; tools?: string; similar?: string[] }
> = {
  sherry: {
    role: "Solo design across the project — research interviews, IA, all the high-fidelity flows.",
    timeline: "About 8 weeks during my BSc at Malmö University.",
    lesson: "How even a 'simple' sharing flow hides hard trust questions — accountability, returning items, what to do when things break.",
    tools: "Figma for design, FigJam for the early mapping work, light Framer prototyping.",
    similar: ["ecotrip", "goodreads"],
  },
  ecotrip: {
    role: "Solo design — research, concept, IA, screens. The bee theme was a deliberate metaphor for collective behavior.",
    timeline: "Roughly 6 weeks alongside other coursework.",
    lesson: "How rewards systems flip from motivating to gamified-feeling fast — small design choices change the whole tone.",
    tools: "Figma, paper sketching for early ideation, FigJam for journey mapping.",
    similar: ["sherry", "goodreads"],
  },
  reel: {
    role: "Self-initiated end-to-end — concept, art direction, all the design work.",
    timeline: "Spread over a couple of weeks of evenings.",
    lesson: "Restraint. The brief was 'let the work do the talking' — every UI decision had to earn its place.",
    tools: "Figma, with reference research from real architecture studio sites.",
    similar: ["artist-website"],
  },
  "artist-website": {
    role: "Solo concept piece — invented the brief, designed the identity, and built out the web flows for an imagined Stockholm painter.",
    timeline: "About 4 weeks of design and iteration.",
    lesson: "Designing for someone else's voice is a different muscle from designing your own — restraint, listening, mirroring even when the client is imagined.",
    tools: "Figma for design, with reference research from real artist portfolios.",
    similar: ["reel"],
  },
  teem: {
    role: "Solo design across the full system — name, logo, can packaging, and a 4-page leaflet that doubles as a newsletter.",
    timeline: "Around 4–5 weeks during my BSc.",
    lesson: "Packaging is a 3D problem from the first sketch. The first time I held the curved can in mockup, I learned more in five minutes than two weeks of flat sketching had told me.",
    tools: "Illustrator for the logo and packaging, InDesign for the leaflet, Smartmockups for the can render. Chalkduster + Georgia as the type pair.",
    similar: [],
  },
  goodreads: {
    role: "Solo redesign exercise — picked the brief, audited the existing app, designed the new flows.",
    timeline: "About 3 weeks of focused work.",
    lesson: "The hardest part of a redesign is knowing what NOT to change. Goodreads' community is its real product.",
    tools: "Figma, with original Goodreads screens as reference.",
    similar: ["sherry", "ecotrip"],
  },
  sony: {
    role: "UX Designer on the smart-office product line — meeting room panels, booking app and website, large-format wayfinding maps. Most of the work is NDA-restricted, so the case study is light on visuals.",
    timeline: "Around a year on the team, 2025–2026.",
    lesson: "What shipping into a real product context demands beyond design — coordination, build constraints, and real users with real workflows.",
    tools: "Mostly Figma, plus testing on the actual hardware (panels, devices) in real office spaces.",
    similar: ["artist-website"],
  },
  portfolio: {
    role: "Solo end-to-end — concept, identity, copy, every component designed and built. Yes, you're standing in it.",
    timeline: "Started early 2026, still iterating in real time.",
    lesson: "How much friction sits between a Figma mockup and a working prototype — and how a vibe-coding workflow closes that gap fast.",
    tools: "Next.js, Tailwind, Framer Motion. Designed in Figma, built in Cursor with Claude Code as the pair.",
    similar: ["reel", "artist-website"],
  },
};

function lookupProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

function refsFor(slugs: string[]) {
  return slugs
    .map(lookupProject)
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ name: p.name, slug: p.slug }));
}

export function getMockResponse(input: string, projectSlug: string | null): MockResponse {
  const lower = input.toLowerCase();

  // General mode
  if (!projectSlug) {
    if (/\b(first|start|begin|where to)\b/.test(lower)) {
      return {
        text: "Start with Reel — it's my most recent self-initiated piece and shows where my taste is heading. Then Sherry if you want to see deeper process work.",
        references: refsFor(["reel", "sherry"]),
      };
    }
    if (/\b(client|paid|real)\b/.test(lower)) {
      return {
        text: "Real client involvement shows up in two places: Sony (NDA-restricted — happy to walk through it on a call) and Sherry, which was a service design course built around a real client brief in Malmö. The rest is self-initiated or pure coursework.",
        references: refsFor(["sony", "sherry"]),
      };
    }
    if (/\b(app|mobile|phone)\b/.test(lower)) {
      return {
        text: "Three to look at: Sherry (tool sharing for circular economy), EcoTrip (sustainable travel), and a Goodreads redesign exercise. Each explores a different interaction pattern.",
        references: refsFor(["sherry", "ecotrip", "goodreads"]),
      };
    }
    if (/\b(recent|new|latest)\b/.test(lower)) {
      return {
        text: "Most recent: this very portfolio (2026, ongoing), Sony (2025–2026, smart-office product line — NDA-restricted), then Reel and the Artist Website (both 2025, concept pieces).",
        references: refsFor(["portfolio", "sony", "reel", "artist-website"]),
      };
    }
    if (/\b(web|website|site)\b/.test(lower)) {
      return {
        text: "Three web pieces: this very portfolio (designed and vibe-coded end-to-end), Reel (a fictional architecture studio site), and the Artist Website (a portfolio concept for a Stockholm painter).",
        references: refsFor(["portfolio", "reel", "artist-website"]),
      };
    }
    if (/\b(graphic|brand|packaging|print|non-digital)\b/.test(lower)) {
      return {
        text: "Teem is the only non-digital piece — brand identity, packaging, and a leaflet for a cold-brew matcha latte concept.",
        references: refsFor(["teem"]),
      };
    }
    if (/\b(school|study|university|education|bsc)\b/.test(lower)) {
      return {
        text: "Five of the six are coursework from my BSc at Malmö University. The Artist Website is the one paid client piece. Reel is the only self-initiated one.",
      };
    }
    return {
      text: "Still learning the answer to that one — my notes don't go that deep yet. Try one of the suggestions, or browse the case studies directly.",
    };
  }

  // Project mode
  const project = lookupProject(projectSlug);
  if (!project) {
    return {
      text: "Hmm, I don't recognise that project. Try heading back to the work index.",
    };
  }
  const canned = PROJECT_CANNED[projectSlug] ?? {};

  if (/\b(role|did you do|do you|responsibilit|owner)\b/.test(lower)) {
    return {
      text: canned.role ?? `I led the design across ${project.name}.`,
    };
  }
  if (/\b(long|time|how long|duration|weeks|months)\b/.test(lower)) {
    return {
      text: canned.timeline ?? `Roughly a few weeks of focused work.`,
    };
  }
  if (/\b(learn|takeaway|lesson|insight|grew)\b/.test(lower)) {
    return {
      text: canned.lesson ?? `The case study has the full reflection — coming soon.`,
    };
  }
  if (/\b(tool|software|figma|stack|app|software)\b/.test(lower)) {
    return {
      text: canned.tools ?? `Mostly Figma for design.`,
    };
  }
  if (/\b(similar|other|like this|related|another|else)\b/.test(lower)) {
    const slugs = canned.similar ?? [];
    if (slugs.length === 0) {
      return {
        text: `Nothing else quite like ${project.name} in the portfolio — it's the odd one out.`,
      };
    }
    return {
      text: `If you liked ${project.name}, take a look at these:`,
      references: refsFor(slugs),
    };
  }

  return {
    text: `Still learning specifics about ${project.name} — the full case study isn't written up yet. Try one of the suggested prompts, or feel free to ask about a different project.`,
  };
}
