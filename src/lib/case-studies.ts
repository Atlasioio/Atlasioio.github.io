export type Shot =
  | string
  | {
      caption: string;
      image?: string;
      // Optional video clip (mp4). When set, renders as an autoplaying muted
      // looping video with custom controls instead of a static image.
      video?: string;
      // Override the auto-laid-out aspect (e.g. "aspect-[3/4]" for portrait).
      aspect?: string;
      // Override the auto-laid-out column span (e.g. "col-span-12" for full-width).
      span?: string;
      // "contain" letterboxes the image instead of cropping — use when the screenshot
      // aspect ratio doesn't match the frame aspect (e.g. tall pages in 16/9 frames).
      objectFit?: "cover" | "contain";
      // Override the shot container background (CSS color). For videos: replaces
      // the bg-bg-elevated fallback that shows during load and around any
      // aspect-mismatch letterbox.
      bg?: string;
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

  // Override for the laptop chrome's inner screen aspect (defaults to 16/10).
  // Set when the screenshot is wider (e.g. "aspect-[16/9]") to eliminate
  // top/bottom letterboxing inside the laptop screen.
  laptopScreenAspect?: string;

  // Override for the laptop chrome's inner screen background colour (defaults
  // to var(--bg)). Set to the screenshot's own bg colour so any letterbox
  // strips blend with the image instead of showing the page sage.
  laptopScreenBg?: string;

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
      // Alternative to `image`: an autoplaying muted video.
      video?: string;
      // Override the artefact aspect ratio (default aspect-[4/3] for images,
      // aspect-[16/9] for videos).
      mediaAspect?: string;
      // For chrome="paper" images: override the inner paper bg colour to match
      // the screenshot's own background so they blend instead of seam.
      paperInnerBg?: string;
      // Override the paper-chrome tilt (default cycles -1.4 / 0.9 / -0.6 by
      // index). Set 0 for images with fine detail (small text, 1px borders)
      // where the rotation-induced anti-aliasing softens the pixels.
      tilt?: number;
      // Alternative to `image`: a stylized paper note rendered with proper typography.
      note?: {
        title: string;
        items: (string | { text: string; sub?: string[] })[];
      };
      // When true, render this block at the wider section width with a
      // larger heading. Use sparingly — for a "why this big decision" block
      // that earns extra weight.
      prominent?: boolean;
    }[];
  };

  // Highlights — small preview reel above the deep narrative.
  // Defaults to the first 4 solution shots if not provided.
  highlights?: Shot[];

  // Override number of columns for the Highlights grid. Default 4. Use 2 for
  // case studies where each highlight benefits from more screen real estate
  // (wider screenshots, fewer items).
  highlightsCols?: 2 | 3 | 4;

  // When true, the Highlights grid drops the tinted background card entirely
  // and renders each image bare on the page. Use this when the screenshots
  // are pre-rendered phone mockups with transparent backgrounds — the chrome
  // becomes redundant and steals display area from the phone itself.
  highlightsBare?: boolean;

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
  jobquest: {
    mediaChrome: "laptop",
    shotChrome: "bleed",
    laptopScreenAspect: "aspect-[16/10]",
    laptopScreenBg: "#ffffff",
    summary:
      "A personal job-search tracker — bento dashboard, three list views, daily driver. Single user, local persistence, designed for one workflow.",
    heroImage: "/case-studies/jobquest/bento-home.png",
    heroAspect: "aspect-[16/10]",
    heroObjectFit: "contain",
    meta: {
      role: "Solo — designed, directed, shipped",
      timeline: "Built across ~3 weeks · in daily use since",
      tools: "Vite · React · TypeScript · Zustand · pair-built with Claude Code",
    },
    snapshot: {
      problem:
        "Tracking a job search in a spreadsheet means typing the same fields five different ways and never seeing the shape of the pipeline. Tracking it in a SaaS tracker means using someone else's defaults.",
      role: "Solo end-to-end — design direction, decisions, daily user.",
      outcome:
        "A personal web app, used daily. Bento dashboard with five tiles. Three list views (Board · Grid · Map). Shipped local-first, single-user — the radical scope cut is the point.",
    },
    problem: {
      body: [
        "Job-tracking is the kind of task that ends up in either a spreadsheet or a SaaS tool I outgrow in a week. I'd looked at both — and had specific opinions about what to do differently.",
        "Huntr uses color for individual jobs; I wanted color for status, so a glance at the Board tells me how the pipeline is shaped, not whose listing is whose. Notion's grid is close to what I wanted but felt dense, dated, and visually noisy. No tool I tried offered a Map view, which I didn't realise I wanted until I built one.",
        "So I built it. Single user. Local persistence. No auth. No multi-tenancy. The scope cuts are the point.",
      ],
    },
    approach: {
      pullQuote: "Status is the color, not the noise.",
      blocks: [
        {
          heading: "Multiple views, each answering a different question.",
          hook: "Board for daily check-in. Grid for compare-and-edit. Map for the geographic question I didn't know I had.",
          body: "None of these is 'the right view.' Each earns its place by being the best answer to a specific question — what's moving today, how does this offer compare to the others, where am I actually applying. Board became the daily driver inside a week.",
          image: "/case-studies/jobquest/sketch-board.png",
        },
        {
          heading: "Bento dashboard over a giant table.",
          hook: "Each tile owns one question.",
          body: "What needs me today. What's my pipeline shape. Am I keeping rhythm. Where am I applying. The bento gives different questions different volume, and the eye knows where to look. A table puts everything at the same priority.",
          image: "/case-studies/jobquest/design-notes.png",
        },
        {
          heading: "Earn before polish.",
          body: "First pass shipped without animations, without a theme system. Earned those later, once daily use proved the underlying decisions held up. Premature polish on a feature that gets cut is just wasted craft.",
        },
        {
          heading: "What didn't survive.",
          hook: "Most of the work in a personal tool is the work you throw away.",
          body: "The bento went through five configurations before the layout settled. The Salary tile alone cycled through four visual treatments. Add Job started as a modal, became a full-page route once auto-fill needed real screen room — the route swap broke React Router's useBlocker, I bailed and used beforeunload. The Board uses a custom drag because the HTML5 API's cursor inconsistencies broke the feel. One feature is diagnosed but not removed: Daily Goals duplicates Habits — they're due for a merge in v2, fixing it standalone would be doing the same work twice. Built with Claude Code as the implementer; I directed and designed. The iteration speed is mostly the dividend of that pairing.",
          image: "/case-studies/jobquest/sketch-grid.png",
        },
      ],
    },
    highlightsCols: 2,
    highlights: [
      {
        caption: "Board — the daily driver",
        image: "/case-studies/jobquest/board-final.png",
        aspect: "aspect-[19/10]",
      },
      {
        caption: "Grid — compare & bulk-edit",
        image: "/case-studies/jobquest/grid-final.png",
        aspect: "aspect-[19/10]",
      },
      {
        caption: "Map — the question I didn't know I had",
        image: "/case-studies/jobquest/map-final.png",
        aspect: "aspect-[19/10]",
      },
      {
        caption: "Offer — the late-stage workflow",
        image: "/case-studies/jobquest/job-offer.png",
        aspect: "aspect-[19/10]",
      },
    ],
    solutionShots: [
      {
        caption:
          "Home — hover to dig, tick dailies, watch the streak. Pipeline and what's next, in one view.",
        video: "/case-studies/jobquest/home-recording.mp4",
        span: "col-span-12",
        aspect: "aspect-[19/10]",
      },
      {
        caption: "Board — status is the color, not the noise",
        image: "/case-studies/jobquest/board-final.png",
        span: "col-span-12",
        aspect: "aspect-[19/10]",
      },
      {
        caption: "Swapping between views at speed",
        video: "/case-studies/jobquest/swapping-between.mp4",
        span: "col-span-12",
        aspect: "aspect-[19/10]",
        bg: "#ffffff",
      },
      {
        caption: "Grid — sortable, bulk-selectable",
        image: "/case-studies/jobquest/grid-final.png",
        span: "col-span-12",
        aspect: "aspect-[19/10]",
      },
      {
        caption: "Grid — sorted by salary",
        image: "/case-studies/jobquest/grid-final-sorted.png",
        span: "col-span-12",
        aspect: "aspect-[19/10]",
      },
      {
        caption: "Map — cities rail expanded",
        image: "/case-studies/jobquest/map-final.png",
        span: "col-span-12",
        aspect: "aspect-[19/10]",
      },
      {
        caption: "Map — fly-to per job",
        video: "/case-studies/jobquest/map-recording.mp4",
        span: "col-span-12",
        aspect: "aspect-[19/10]",
      },
      {
        caption: "Offer — the negotiate view",
        image: "/case-studies/jobquest/job-offer.png",
        span: "col-span-12",
        aspect: "aspect-[19/10]",
      },
      {
        caption: "Offer flow in action",
        video: "/case-studies/jobquest/job-offer.mp4",
        span: "col-span-12",
        aspect: "aspect-[19/10]",
      },
    ],
    outcome: {
      body: "Three claims held up after weeks of daily use. Variable density beats one big table — the bento gives different questions different volume, and the eye knows where to look. Three views with distinct jobs beat one view that does everything — Board for the daily check-in, Grid for compare-and-edit, Map for the geographic question I didn't know I had. Local-first lets the scope cuts stand — no auth, no sync, no defensive code for users who don't exist.",
      reflection:
        "If I were to generalise this for other people — multi-user accounts, real persistence (not localStorage), a sharing model. The bento and multi-view philosophy would transfer; the radical defaults (one opinion, no preferences pane) would have to soften. What I'd undo: Daily Goals in a Habits merge, the HTML5 drag detour, and the equivalent-polish-on-Grid before knowing Board would be the daily driver.",
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
    shotChrome: "none",
    highlightsBare: true,
    heroImage: "/case-studies/ecotrip/explore.png",
    heroObjectFit: "contain",
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
      blocks: [
        {
          heading: "Designing for the activist.",
          hook: "Jane optimises every choice for footprint.",
          body: "Jane — Edinburgh, lower budget, climate activist. Her mindset: reduce carbon at every step, even at the expense of comfort or the trip itself. Her journey told me where friction needed to live (on the unsustainable options) and where it had to disappear (on the sustainable ones).",
          image: "/case-studies/ecotrip/process-user-journey1.png",
          paperInnerBg: "#FDF9ED",
        },
        {
          heading: "Designing for the casual.",
          hook: "John wants peripheral awareness, not a lecture.",
          body: "John — 43, bigger trips abroad, integrated payments, minimal customisation. He'll reduce his footprint where it doesn't take too much from the journey, and is willing to pay more rather than sacrifice convenience. His journey set the ceiling on friction: surface the green option, never block the path.",
          image: "/case-studies/ecotrip/process-user-journey2.png",
          paperInnerBg: "#FDF9ED",
        },
        {
          heading: "A system that earns the metaphor.",
          hook: "Off-the-shelf eco-green wasn't an option.",
          body: "Travel apps default to SaaS-clean white and blue. Environmental apps default to green — virtue signalled at the palette level. Both felt off. Honey gold and earthy tones replaced the predictable green; a rounded display family replaced corporate sans. The hexagon shows up subtly across the system — badges, rewards, completion states — a quiet repeating motif that ties the identity to the metaphor without ever lecturing.",
          image: "/case-studies/ecotrip/components.png",
          paperInnerBg: "#E7E1D3",
          mediaAspect: "aspect-[17/10]",
          tilt: 0,
        },
        {
          heading: "Why bees.",
          hook: "Collective progress, backed by a 5% pledge.",
          body: "The bees came out of all of the above: warm, collective, focused on the hive's progress rather than any one person's halo. Onboarding sets the posture — you join a hive, not a leaderboard; impact is shared, not scored. And it isn't just metaphor: EcoTrip commits 5% of every trip's revenue to bee conservation, and users can top that up — anything they add goes 100% to the foundation. The metaphor pays back the species it borrows from.",
          video: "/case-studies/ecotrip/why-bees.webm",
          mediaAspect: "aspect-[1148/1456]",
          prominent: true,
        },
      ],
    },
    solutionShots: [
      {
        caption: "Onboarding — setting the posture before the first trip",
        image: "/case-studies/ecotrip/onboarding.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-6",
      },
      {
        caption: "Start — explore others' trips or build your own",
        image: "/case-studies/ecotrip/explore.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-6",
      },
      {
        caption: "Explore — filter trips by preference and sustainability",
        image: "/case-studies/ecotrip/explore-trips.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-6",
      },
      {
        caption: "Community — see what others did, and how it scored",
        image: "/case-studies/ecotrip/community.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-6",
      },
      {
        caption: "Community trip — tap into a posted trip to see the full breakdown",
        image: "/case-studies/ecotrip/community-trip.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-6",
      },
      {
        caption: "Create — destination, transport, stay, activities",
        image: "/case-studies/ecotrip/create.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-6",
      },
      {
        caption: "Profile — impact surfaced ahead of stats",
        image: "/case-studies/ecotrip/profile.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-6",
      },
    ],
    outcome: {
      body: "The course critique selected EcoTrip's rewards model as its standout. Peers noted it managed to motivate without feeling preachy — the tonal goal worked.",
      stats: [
        { value: "6 weeks", label: "Concept to high-fi" },
        { value: "3", label: "Concept directions tested" },
      ],
      reflection:
        "The screens stop at concept fidelity — a next pass would tighten interaction states, motion, and the visual hierarchy on the denser flows like Create and Profile. The 5% pledge mechanic deserves a real working prototype too — testing how prominent to surface it during checkout without making the contribution feel transactional.",
    },
  },

  reel: {
    mediaChrome: "laptop",
    shotChrome: "browser",
    laptopScreenAspect: "aspect-[16/10]",
    laptopScreenBg: "#ffffff",
    summary:
      "A self-initiated concept site for a fictional architecture studio, designed around restraint and image-forward storytelling.",
    heroImage: "/case-studies/reel/projects.png",
    heroObjectFit: "contain",
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
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "After — current read leads, FAB to add, TBR and recent one tap away",
        image: "/case-studies/goodreads/my-books.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "Before — Social, current",
        image: "/case-studies/goodreads/social-old.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "After — inline like + comment, add the book straight from the feed",
        image: "/case-studies/goodreads/social.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "Home — what you're reading, who you follow",
        image: "/case-studies/goodreads/home.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "Review — half stars, plus quotes and notes",
        image: "/case-studies/goodreads/review.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "Explore — by recommendation",
        image: "/case-studies/goodreads/explore.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
      },
      {
        caption: "Explore — by category",
        image: "/case-studies/goodreads/explore2.png",
        aspect: "aspect-[3/4]",
        span: "col-span-12 md:col-span-4",
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
