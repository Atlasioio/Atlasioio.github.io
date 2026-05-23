export type Shot =
  | string
  | {
      caption: string;
      image?: string;
      // Override the auto-laid-out aspect (e.g. "aspect-[3/4]" for portrait).
      aspect?: string;
      // Override the auto-laid-out column span (e.g. "col-span-12" for full-width).
      span?: string;
      // "contain" letterboxes the image instead of cropping — use when the screenshot
      // aspect ratio doesn't match the frame aspect (e.g. tall pages in 16/9 frames).
      objectFit?: "cover" | "contain";
    };

export type CaseStudy = {
  variant?: "default" | "restricted";

  // Whether media (hero, highlights, approach artefacts, solution shots) should
  // use a browser-chrome frame ("browser") or a plain frame ("none").
  // Defaults to "browser" (web/UI projects). Use "none" for graphic design / print pieces.
  mediaChrome?: "browser" | "none" | "phone" | "bleed";

  // Optional override for highlights + solution shots only (hero stays on mediaChrome).
  // Useful when the hero is a designed composition but individual shots are mobile screens.
  shotChrome?: "browser" | "none" | "phone";

  // One-sentence summary that sits above the snapshot grid.
  summary: string;

  // Optional hero image (path under /public). Falls back to a colored placeholder if absent.
  heroImage?: string;
  // Optional mobile companion shown floating in the hero card.
  heroImageMobile?: string;
  // Optional override for the hero frame aspect (e.g. "aspect-[4/3]"). Defaults to 16/9.
  heroAspect?: string;
  // "contain" letterboxes the hero image instead of cropping — use when the
  // screenshot aspect doesn't match the frame aspect. Defaults to "cover".
  heroObjectFit?: "cover" | "contain";

  // Optional live-site URL. When set, renders a CTA below the tagline and
  // populates the browser-chrome URL bar on the hero.
  liveUrl?: string;

  // Optional display-only URL for browser-chrome URL bars. Falls back to
  // `liveUrl` (protocol stripped). Use when you want a friendly domain shown
  // rather than the actual live URL (e.g. "reel.com" instead of a staging URL).
  displayUrl?: string;

  // Snapshot — visible in 5 seconds, no reading required.
  snapshot: {
    problem: string;
    role: string;
    outcome: string;
  };

  // Optional metadata strip extras (Year/Type/Context already on Project).
  meta?: {
    role?: string;
    timeline?: string;
    tools?: string;
  };

  // The problem. Pass an array to render as multiple paragraphs.
  problem: {
    body: string | string[];
  };

  // The approach — broken into sub-blocks, each with optional artefact image or stylized note.
  approach?: {
    pullQuote?: string;
    blocks: {
      heading: string;
      hook?: string;
      body: string;
      image?: string;
      // Alternative to `image`: a stylized paper note rendered with proper typography.
      note?: {
        title: string;
        items: (string | { text: string; sub?: string[] })[];
      };
    }[];
  };

  // Highlights — small preview reel above the deep narrative.
  // Defaults to the first 4 solution shots if not provided.
  highlights?: Shot[];

  // The solution — array of caption strings or { caption, image } objects.
  solutionShots?: Shot[];

  // Outcome.
  outcome?: {
    body: string;
    stats?: { label: string; value: string }[];
    reflection?: string;
  };

  // Restricted (Sony) variant fields.
  surfaces?: string[];
  callToAction?: string;
};

export const caseStudies: Record<string, CaseStudy> = {
  portfolio: {
    summary:
      "The very site you're reading — designed and vibe-coded end-to-end as a working showcase of how I want to make things now.",
    heroImage: "/case-studies/portfolio/hero.png",
    meta: {
      role: "Solo, end-to-end",
      timeline: "Started 2026, still iterating",
      tools: "Next.js · Tailwind · Framer Motion · Figma · Cursor + Claude Code",
    },
    snapshot: {
      problem:
        "Designer portfolios usually compromise on design or build quality. I wanted both.",
      role: "Solo end-to-end — concept, identity, every component.",
      outcome:
        "Live and self-iterating — the case study and the artefact are the same thing.",
    },
    problem: {
      body: "Designer portfolios sit on a tradeoff: tool-perfect mockups that feel sterile, or developer-built sites that compromise on craft. I wanted to test if a vibe-coding workflow could collapse the gap — designing and building at the same speed.",
    },
    approach: {
      pullQuote: "Design and build collapsed into one motion.",
      blocks: [
        {
          heading: "Identity first.",
          hook: "Build the system before any page existed.",
          body: "Display font, accent color, blob shapes, dot motif — locked in before a single component shipped.",
        },
        {
          heading: "Vibe-coded pipeline.",
          hook: "Designed in Figma, built in Cursor with Claude Code as the pair.",
          body: "Next.js + Tailwind + Framer Motion. The same idea moved from sketch to live in minutes, not days.",
        },
        {
          heading: "Real-time feedback.",
          hook: "No more handoff gap.",
          body: "Changes happened during design itself. The loop ran tight enough to test five variations of the same component without losing a day.",
        },
      ],
    },
    solutionShots: [
      "Home — selected work and personality at a glance",
      "About — the longer-form context",
      "Work index — all case studies, filterable",
      "AI assistant — context-aware project chat",
    ],
    outcome: {
      body: "The site you're standing on. Built from scratch with a mid-design feedback loop I'd never had before. The biggest result: the gap between idea and working prototype is essentially gone.",
      stats: [
        { value: "8", label: "Case studies in scope" },
        { value: "Live", label: "Current state" },
      ],
      reflection:
        "I'd love to A/B test individual choices — dot motif, blob shapes, typography — against more conventional alternatives, to see which decisions actually carry weight.",
    },
  },

  sherry: {
    mediaChrome: "none",
    shotChrome: "phone",
    heroImage: "/case-studies/sherry/hero.png",
    summary:
      "A tool-sharing app designed during a service design course at Malmö University, built around a real client brief.",
    meta: {
      role: "Solo design",
      timeline: "8 weeks",
      tools: "Figma · FigJam · Framer",
    },
    snapshot: {
      problem:
        "Tools sit unused in most homes; sharing fails on trust, not technology.",
      role: "Solo — research, IA, all the high-fi flows.",
      outcome:
        "Selected by faculty as one of two pieces demoed to the cohort.",
    },
    problem: {
      body: "Most households own tools they use a few times a year. The opportunity to share is obvious — but the trust layer isn't. Accountability, returning items, what to do when something breaks. I designed for those first.",
    },
    approach: {
      pullQuote: "I optimised for trust before speed.",
      blocks: [
        {
          heading: "Picking the model.",
          hook: "Where could circular live in Malmö?",
          body: "Mapped different shapes a circular economy could take here — peer-to-peer between neighbours, library-as-intermediary, library-to-library lending. Each had a different trust profile. I committed to the intermediary library model: legible accountability, fewer awkward stranger interactions.",
          image: "/case-studies/sherry/process-research.png",
        },
        {
          heading: "Contributor's journey.",
          hook: "Drop-off sets every expectation that follows.",
          body: "Walked the contributor's arc — sign-up, listing, the trip to the library, the hand-off. The drop-off moment turned out to carry the whole emotional weight: this is when someone decides whether their thing is in safe hands.",
          image: "/case-studies/sherry/process-blueprint.png",
        },
        {
          heading: "Lender's journey.",
          hook: "The library mediates, so strangers don't have to.",
          body: "Mirrored the path from the lender's side — need, browse, request, pick-up, return, renew. The library sits in the middle: it absorbs the awkward bits of peer-to-peer (vetting, accountability, the handover) so neither side has to perform trust at a stranger.",
          image: "/case-studies/sherry/process-blueprint2.png",
        },
      ],
    },
    highlights: [
      {
        caption: "Onboarding — agreeing to the social contract upfront",
        image: "/case-studies/sherry/onboarding.png",
      },
      {
        caption: "Listing a tool — title, condition, insured price, location",
        image: "/case-studies/sherry/listing.png",
      },
      {
        caption: "Borrow request — the lender, the item, the trust signals",
        image: "/case-studies/sherry/request.png",
      },
      {
        caption: "Badges — visible reward for circular behaviour",
        image: "/case-studies/sherry/badges.png",
      },
    ],
    solutionShots: [
      {
        caption: "Onboarding — terms made explicit before any account exists",
        image: "/case-studies/sherry/onboarding.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "New listing — set the item, the condition, the insured price",
        image: "/case-studies/sherry/listing.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "Borrow request — vetted profile, item details, send",
        image: "/case-studies/sherry/request.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "Lender accepts — contract terms surface before pickup",
        image: "/case-studies/sherry/accept-request.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "Drop-off chat — coordinate the handover, contract one tap away",
        image: "/case-studies/sherry/chat.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "Badges — circular impact made tangible for both sides",
        image: "/case-studies/sherry/badges.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
    ],
    outcome: {
      body: "The flows were selected by faculty as one of two presented to the cohort. Peer feedback specifically called out the trust-first onboarding as feeling 'inviting rather than annoying' — the deliberate friction worked.",
      stats: [
        { value: "8 weeks", label: "Concept to high-fi" },
        { value: "6", label: "User interviews" },
        { value: "1 of 2", label: "Selected for demo" },
      ],
      reflection:
        "Most testing focused on borrowers — I'd run more tests on the lending side. The first listing experience deserves the same care as the first borrow.",
    },
  },

  ecotrip: {
    mediaChrome: "none",
    shotChrome: "phone",
    heroImage: "/case-studies/ecotrip/hero.png",
    summary:
      "A bee-themed travel companion that nudges sustainable choices through collective behaviour cues, not guilt.",
    meta: {
      role: "Solo design",
      timeline: "6 weeks",
      tools: "Figma · FigJam · paper",
    },
    snapshot: {
      problem:
        "Sustainable travel apps either guilt-trip or feel performative.",
      role: "Solo — concept, IA, screens.",
      outcome:
        "Course critique selected the rewards model as the standout.",
    },
    problem: {
      body: "Travel apps that push 'green' choices either moralise or feel like a sticker. I wanted a different tone — collective progress over individual sacrifice. Bees became the metaphor: a hive working together, small contributions visible at scale. This was a concept piece — the brief was a credible model, two personas, and an identity that didn't fall into the eco-green or SaaS-clean defaults. Production UI fidelity was deliberately out of scope.",
    },
    approach: {
      pullQuote: "Reward without moralising.",
      blocks: [
        {
          heading: "Designing for the activist.",
          hook: "Jane optimises every choice for footprint.",
          body: "Jane — Edinburgh, lower budget, climate activist. Her mindset: reduce carbon at every step, even at the expense of comfort or the trip itself. Her journey told me where friction needed to live (on the unsustainable options) and where it had to disappear (on the sustainable ones).",
          image: "/case-studies/ecotrip/process-user-journey1.png",
        },
        {
          heading: "Designing for the casual.",
          hook: "John wants peripheral awareness, not a lecture.",
          body: "John — 43, bigger trips abroad, integrated payments, minimal customisation. He'll reduce his footprint where it doesn't take too much from the journey, and is willing to pay more rather than sacrifice convenience. His journey set the ceiling on friction: surface the green option, never block the path.",
          image: "/case-studies/ecotrip/process-user-journey2.png",
        },
        {
          heading: "Neither SaaS-plain nor eco-green.",
          hook: "The visual category was a trap.",
          body: "Travel apps default to SaaS-clean white and blue. Environmental apps default to green — virtue signalled at the palette level. Both felt off. The bees came out of that: warm, collective, focused on the hive's progress rather than any one person's halo. Honey gold and earthy tones replaced the predictable green; a rounded display family replaced corporate sans.",
          image: "/case-studies/ecotrip/components.png",
        },
      ],
    },
    solutionShots: [
      {
        caption: "Onboarding — setting the posture before the first trip",
        image: "/case-studies/ecotrip/onboarding.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "Start — explore others' trips or build your own",
        image: "/case-studies/ecotrip/explore.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "Explore — filter trips by preference and sustainability",
        image: "/case-studies/ecotrip/explore-trips.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "Community — see what others did, and how it scored",
        image: "/case-studies/ecotrip/community.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "Create — destination, transport, stay, activities",
        image: "/case-studies/ecotrip/create.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "Profile — impact surfaced ahead of stats",
        image: "/case-studies/ecotrip/profile.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
    ],
    outcome: {
      body: "The course critique selected EcoTrip's rewards model as its standout. Peers noted it managed to motivate without feeling preachy — the tonal goal worked.",
      stats: [
        { value: "6 weeks", label: "Concept to high-fi" },
        { value: "3", label: "Concept directions tested" },
      ],
      reflection:
        "The bee theme is strong but might alienate users who don't connect with it — I'd test a more neutral identity in parallel to compare adoption. The screens stop at concept fidelity too: a next pass would tighten interaction states, motion, and the visual hierarchy on the denser flows like Create and Profile.",
    },
  },

  reel: {
    summary:
      "A self-initiated concept site for a fictional architecture studio, designed around restraint and image-forward storytelling.",
    heroImage: "/case-studies/reel/projects.png",
    liveUrl: "https://goodness-jargon-613166.framer.app/",
    displayUrl: "reel.com",
    meta: {
      role: "Solo, end-to-end",
      timeline: "A couple of weeks of evenings",
      tools: "Figma · Framer",
    },
    snapshot: {
      problem:
        "Most studio sites talk too much; the work doesn't get to breathe.",
      role: "Solo end-to-end — concept, art direction, all design.",
      outcome:
        "Sharpened my web typography and image-led layout instincts.",
    },
    problem: {
      body: "Studio websites tend to overload — long hero copy, multi-level navigation, promotional language. I wanted to test the opposite: a site where the work does the talking and the design's job is to get out of its way.",
    },
    approach: {
      pullQuote: "Every UI decision had to earn its place.",
      blocks: [
        {
          heading: "Reference research.",
          body: "Studied real architecture studio sites — what worked, what felt overdone. Patterns kept repeating: oversized hero copy, dense navigation, promotional language that fought the photography. The reference set told me what to leave out, not what to add.",
        },
        {
          heading: "Type system.",
          body: "Built a tight system around one display family and one body sans. Restraint, not variety. Mono captions for metadata, so the prose voice never competes with the work itself.",
        },
        {
          heading: "Asymmetric grid.",
          body: "Designed a grid that lets project images breathe. Captions sit small and mono — secondary to the work. The asymmetry keeps the eye moving through the page without ever centering the studio over the projects.",
        },
      ],
    },
    solutionShots: [
      {
        caption: "Project index — the work, frontloaded",
        image: "/case-studies/reel/projects.png",
        aspect: "aspect-[6/5]",
        span: "col-span-12",
        objectFit: "contain",
      },
      {
        caption: "Approach — words doing only what photos can't",
        image: "/case-studies/reel/our-approach.png",
        aspect: "aspect-[6/5]",
        span: "col-span-12",
        objectFit: "contain",
      },
      {
        caption: "Who — the team, the practice, plainly",
        image: "/case-studies/reel/who.png",
        aspect: "aspect-[6/5]",
        span: "col-span-12",
        objectFit: "contain",
      },
    ],
    outcome: {
      body: "Shipped a live concept site that does what it set out to: the work leads, the words follow. The constraint of fictional content actually sharpened the brief — without a real client's promotional pressure, I could keep cutting until only the necessary remained.",
      reflection:
        "Without a real client the brief was easier than reality. I'd push harder on edge cases — slow connections, image-heavy pages, real content variability — and pressure-test the type system at scale before calling it done.",
    },
  },

  "artist-website": {
    mediaChrome: "browser",
    heroImage: "/case-studies/artist/hero.png",
    heroAspect: "aspect-[7/5]",
    liveUrl: "https://cultural-try-908675.framer.app/",
    displayUrl: "jlorin.com",
    summary:
      "An immersive artist showcase — large imagery, soft typography, motion that guides. The work and the artist, side by side.",
    meta: {
      role: "Solo, end-to-end",
      timeline: "A couple of weeks",
      tools: "Figma · Framer",
    },
    snapshot: {
      problem:
        "Artist sites either bury the work in chrome or strip it bare.",
      role: "Solo end-to-end — concept, identity, web flows, build.",
      outcome: "Live: an image-led site that lets the work breathe.",
    },
    problem: {
      body: [
        "Many artist websites struggle to balance aesthetics with usability — either feeling cluttered or so minimal they fail to communicate identity. The brief: design an experience that highlights the artist's visual work while keeping the navigation clear and the emotional register intact.",
        "Built a calm, image-led experience in Framer — oversized visuals, subtle motion, generous white space. A responsive, scroll-first flow guides visitors naturally. Soft typography and a restrained monochrome palette, with modern animation and cursor details, add character without noise.",
      ],
    },
    outcome: {
      body: "Shipped a live concept site where the artwork is the loudest thing on every page. The interface is the picture frame, not the picture — exactly the brief.",
      reflection:
        "Fictional content made every taste call easier than reality. I'd love to test the same process with a real artist's actual work and voice — a real identity brief sharpens the trade-offs.",
    },
  },

  teem: {
    mediaChrome: "none",
    heroImage: "/case-studies/teem/hero.png",
    summary:
      "Brand identity, packaging, and a 4-page leaflet for a cold-brew matcha latte concept — bridging Japanese matcha tradition with modern Western beverage culture.",
    meta: {
      role: "Solo — full brand system",
      timeline: "4–5 weeks",
      tools: "Illustrator · InDesign · Smartmockups · Chalkduster + Georgia",
    },
    snapshot: {
      problem:
        "Matcha sits between coffee and tea — most concept brands stop at color and miss the story.",
      role: "Solo — name, logo, can packaging, full leaflet system.",
      outcome:
        "A layered identity carried by Japanese imagery, type, and palette — not just hue.",
    },
    problem: {
      body: "Matcha is going mainstream in the West. Most concept brands stop at color — a green palette, a minimal mark, done. The brief was a cold-brew matcha latte. The design problem: how does the brand carry both the tradition of Japanese matcha and the modernity of cold-brew café culture without flattening either?",
    },
    approach: {
      pullQuote: "Tradition meets modernity in every sip.",
      blocks: [
        {
          heading: "Name and concept.",
          hook: "Teeming with matcha, teeming with zen.",
          body: "'Teem' suggests abundance and energy — a phonetic match for the drink's intent. Short, memorable, works in headlines and on a can.",
          image: "/case-studies/teem/process-name.png",
        },
        {
          heading: "Logo and mark.",
          hook: "Chalkduster on a green stroke — modern street meets matcha craft.",
          body: "A green brushstroke evokes matcha powder texture. Chalkduster's hand-drawn type adds a contemporary feel. Inspired by Nike's restraint: one mark, instantly recognised.",
          image: "/case-studies/teem/process-logo.png",
        },
        {
          heading: "Can packaging.",
          hook: "Curved cans break flat layouts.",
          body: "Traditional Japanese imagery does the heavy lifting — jade mountains, a white river for the latte, the kanji for matcha (抹茶). Greens dominate but layered with blues and warm latte tones for depth. Multiple iterations to make it land on the curve, not just on a flat artboard.",
          image: "/case-studies/teem/process-packaging.png",
        },
        {
          heading: "Leaflet system.",
          hook: "Four A4 pages, doubling as a newsletter.",
          body: "Two-column grid for legibility, Chalkduster for catchy titles, Georgia for body. Carried the can's palette through with leaves added as a nature motif. Front cover, two interior article spreads, full-page back advert.",
          image: "/case-studies/teem/process-leaflet.png",
        },
      ],
    },
    highlights: [
      {
        caption: "Logo on its green brushstroke — the brand mark in isolation",
        image: "/case-studies/teem/logo.png",
      },
      {
        caption: "Can packaging — jade mountains and a white river",
        image: "/case-studies/teem/packaging.png",
      },
      {
        caption: "Leaflet article spread — two-column grid",
        image: "/case-studies/teem/leaflet-spread.png",
      },
      {
        caption: "Leaflet front cover — matcha meets latte",
        image: "/case-studies/teem/leaflet-cover-mockup.png",
      },
    ],
    solutionShots: [
      {
        caption: "Logo on its green brushstroke — the brand mark in isolation",
        image: "/case-studies/teem/logo.png",
        aspect: "aspect-[4/3]",
        span: "col-span-12",
      },
      {
        caption: "Can packaging — jade mountains and a white river",
        image: "/case-studies/teem/packaging.png",
        aspect: "aspect-[4/3]",
        span: "col-span-12 md:col-span-6",
      },
      {
        caption: "Leaflet article spread — two-column grid",
        image: "/case-studies/teem/leaflet-spread.png",
        aspect: "aspect-[3304/2337]",
        span: "col-span-12 md:col-span-6",
      },
      {
        caption: "Leaflet front cover — matcha meets latte",
        image: "/case-studies/teem/leaflet-cover.png",
        aspect: "aspect-[1650/2339]",
        span: "col-span-12 md:col-span-6",
      },
      {
        caption: "Leaflet back — full-page product advert",
        image: "/case-studies/teem/leaflet-back.png",
        aspect: "aspect-[1650/2339]",
        span: "col-span-12 md:col-span-6",
      },
    ],
    outcome: {
      body: "A complete brand system that stays unmistakably matcha — greens dominate — but carries a layered visual story rather than a flat color identity. Jade mountains, kanji, blue and warm latte accents all do work alongside the green. The leaflet's restrained 2-column hierarchy landed cleaner than my first draft, which packed too much in.",
      stats: [
        { value: "4–5 wks", label: "End-to-end" },
        { value: "1 brand", label: "Name to leaflet" },
        { value: "4 pages", label: "Editorial leaflet" },
      ],
      reflection:
        "I'd prototype a physical can earlier. The first time I held the curve, I learned more in five minutes than two weeks of flat sketching had told me. For the leaflet, I'd push hierarchy harder — the iteration is cleaner but could be tighter still.",
    },
  },

  goodreads: {
    mediaChrome: "none",
    shotChrome: "phone",
    heroImage: "/case-studies/goodreads/mockups.png",
    heroAspect: "aspect-[4/3]",
    heroObjectFit: "contain",
    summary:
      "A focused redesign exercise — rethinking how readers track and discover books, while respecting what makes Goodreads loved.",
    meta: {
      role: "Solo redesign",
      timeline: "3 weeks",
      tools: "Figma",
    },
    snapshot: {
      problem:
        "Goodreads is loved for community but cluttered for everyday flows.",
      role: "Solo — picked the brief, audited the app, designed new flows.",
      outcome: "Practiced restraint — knowing what NOT to change.",
    },
    problem: {
      body: "Goodreads is a beloved product because of its community — reviews, ratings, friend activity. But the core 'add a book, track progress, discover next' flows feel buried under a decade of feature accretion. The brief: respect what makes it loved, but make the everyday flows easier.",
    },
    approach: {
      pullQuote: "The hardest part of a redesign is what NOT to change.",
      blocks: [
        {
          heading: "Listening to long-time users.",
          hook: "Goodreads is loved, but tolerated.",
          body: "Pulled real reviews and forum threads to map what current users love and what they put up with. The community kept surfacing as the thing people stay for; the everyday flows kept surfacing as the thing they tolerate.",
          note: {
            title: "Users find that",
            items: [
              "Weird navigation",
              "Not enough customizability — custom lists",
              "Important tags are missing or not highlighted",
              "Not enough insight into your reading habits",
              "Things like quotes are not displayed well",
              "Only discrete 1–5 ratings — no half stars",
              "Home screen too cluttered with irrelevant content",
            ],
          },
        },
        {
          heading: "What people are trying to do.",
          hook: "Track, discover, review — the unglamorous core.",
          body: "Mapped what users were trying to do and where they stalled. Tracking books, discovering new ones, and writing reviews dominated the list. Those flows became the targets.",
          note: {
            title: "As a user I want to",
            items: [
              "Track the books that I have read",
              "Review and rate the books that I have read",
              {
                text: "Read reviews from other people",
                sub: ["Prioritize reviews from friends"],
              },
              {
                text: "Discover new books I might want to read",
                sub: ["Add and manage a want-to-read list"],
              },
            ],
          },
        },
        {
          heading: "Where to focus, where to leave alone.",
          hook: "Constraint, not reinvention.",
          body: "Community surfaces stay mostly intact. My Books, Social, Explore, and Review get rebuilt from the user's task — not the existing IA. Half-star ratings, a FAB to add a book, the current read promoted, inline social interactions, and notes-with-quotes on reviews — each tied to a specific pain. I also experimented with the nav itself: the most-used pages live on the right of the bar instead of the left, so the thumb has the shortest path to the things people actually do.",
        },
      ],
    },
    highlights: [
      {
        caption: "My Books — current read leads, FAB to add",
        image: "/case-studies/goodreads/my-books.png",
      },
      {
        caption: "Social — like and comment inline",
        image: "/case-studies/goodreads/social.png",
      },
      {
        caption: "Explore — recommendations and categories",
        image: "/case-studies/goodreads/explore.png",
      },
      {
        caption: "Review — half stars, quotes, notes",
        image: "/case-studies/goodreads/review.png",
      },
    ],
    solutionShots: [
      {
        caption: "Before — My Books, current",
        image: "/case-studies/goodreads/old-my-books.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-6",
      },
      {
        caption: "After — current read leads, FAB to add, TBR and recent one tap away",
        image: "/case-studies/goodreads/my-books.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-6",
      },
      {
        caption: "Before — Social, current",
        image: "/case-studies/goodreads/social-old.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-6",
      },
      {
        caption: "After — inline like + comment, add the book straight from the feed",
        image: "/case-studies/goodreads/social.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-6",
      },
      {
        caption: "Home — what you're reading, who you follow",
        image: "/case-studies/goodreads/home.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-6",
      },
      {
        caption: "Review — half stars, plus quotes and notes",
        image: "/case-studies/goodreads/review.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-6",
      },
      {
        caption: "Explore — by recommendation",
        image: "/case-studies/goodreads/explore.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-6",
      },
      {
        caption: "Explore — by category",
        image: "/case-studies/goodreads/explore2.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-6",
      },
    ],
    outcome: {
      body: "An exercise in designing within constraints rather than against them. Goodreads' community is its real product — design choices that ignored that got rejected by my own gut before they were worth testing. The everyday flows, by contrast, had room to move: every change tied back to a specific pain point users had already articulated.",
      reflection:
        "I'd run real-user tests with longtime Goodreads users to validate that the IA shifts didn't disorient them — and pressure-test the half-star rating decision, since some readers may have built a personal scoring rhythm around the existing five whole stars.",
    },
  },

  sony: {
    variant: "restricted",
    mediaChrome: "bleed",
    heroImage: "/case-studies/sony/hero.png",
    heroAspect: "aspect-[8/5]",
    summary:
      "Smart-office surfaces for Sony's Nimway platform — meeting room panels, TouchPlan kiosks, wayfinding screens, and the booking app. Real client work, ships under NDA.",
    meta: {
      role: "UX Designer",
      timeline: "2025 — 2026",
      tools: "Figma · real-device testing · Sony design system",
    },
    snapshot: {
      problem:
        "A smart-office platform across many surfaces — different contexts, one product feel.",
      role: "UX Designer on the team.",
      outcome:
        "Flows that ship in upcoming Nimway releases across panels, kiosks, wayfinding, and the booking app.",
    },
    problem: {
      body: [
        "Nimway is Sony's smart-office platform. Thousands of users across many countries — from small teams to enterprises with thousands of seats — depend on it daily to find rooms, navigate floors, book resources, and run their day. The product is a constellation of surfaces: physical panels mounted next to meeting rooms, no-login TouchPlan kiosks in lobbies, wayfinding screens on each floor, and a booking app on every employee's phone.",
        "Each surface lives in a different context. A panel sits at eye level next to a door — its job is glance-readability and a single tap. A TouchPlan kiosk gets walked up to by a visitor with no account and no time to learn it. A floor-plan screen has to be parseable from across a room. The booking app has to do everything, on a phone, while someone is walking. The design challenge is keeping these surfaces feeling like one product without flattening them into the same screen.",
        "I worked across the panels, TouchPlan, wayfinding screens, and the booking app — pushing patterns to be consistent where consistency helps the user, and to diverge where the context demands it. The flows I designed are landing in upcoming Nimway releases; everything visual is under NDA, so this page sits without screens for now.",
      ],
    },
    surfaces: [
      "Meeting room panels — booking, status, and at-a-glance occupancy at every door",
      "TouchPlan kiosks — no-login navigation and resource booking for visitors and quick employees",
      "Wayfinding screens — floor-plan displays that surface available rooms and resources at lobby and floor level",
      "Booking app — find a room, manage your day, book on the move",
    ],
    callToAction:
      "Nimway serves thousands of users across many countries — from small teams to large enterprises. The flows I designed are rolling into upcoming releases, but the visuals themselves are NDA. Happy to walk through specific decisions and trade-offs on a call — drop me a line.",
  },
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}
