/* ============================================================================
   LUKAS AHLSE — content model
   All site copy lives here as typed data so sections render from a single
   source. The image fields (`src`) point at assets under /public.
   ========================================================================== */

export const studio = {
  name: 'Lukas Ahlse',
  email: 'ahlselukas@gmail.com',
  location: 'Stockholm, Sweden',
  locationShort: 'Stockholm',
  worldwide: 'Open to work — EU & remote',
} as const

/* ---- Navigation ---------------------------------------------------------- */
export interface NavLink {
  label: string
  href: string
}

/** Top-bar links (the slim editorial nav). */
export const topNavLinks: NavLink[] = [
  { label: 'Work', href: '/work' },
  { label: 'Skills', href: '#services' },
  { label: 'About', href: '#studio' },
  { label: 'Contact', href: '#contact' },
]

/** Fullscreen-menu links (numbered). */
export interface MenuLink extends NavLink {
  no: string
}
export const menuLinks: MenuLink[] = [
  { no: '01', label: 'Work', href: '/work' },
  { no: '02', label: 'Skills', href: '#services' },
  { no: '03', label: 'About', href: '#studio' },
  { no: '04', label: 'How I work', href: '#process' },
  { no: '05', label: 'Contact', href: '#contact' },
]

export interface SocialLink {
  label: string
  href: string
}
export const socials: SocialLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lukas-ahlse-a66a5414a/' },
  { label: 'Instagram', href: 'https://www.instagram.com/lukasahlse/' },
]

/* ---- Marquee ------------------------------------------------------------- */
export const marqueeItems: string[] = [
  'Product design',
  'UX/UI',
  'Interaction',
  'Motion design',
  'Brand identity',
  'Framer',
  'Figma',
  'React',
  'AI',
  'Design systems',
]

/* ---- Services (02) ------------------------------------------------------- */
export interface Service {
  id: string
  index: string
  name: string
  description: string
  tags: string[]
  image: { src: string; alt: string }
  /** Categories pre-ticked in the inquiry form when a project starts from here. */
  category: string[]
  /** Expanded detail shown in the service modal. */
  detail: {
    lead: string
    includes: string[]
    approach: string
  }
}

export const services: Service[] = [
  {
    id: 'svc-ux',
    index: 'S/01',
    name: 'UX/UI design',
    description:
      'Product thinking from flows to pixels — research, interface design, and prototypes for apps and tools that hold up under real use.',
    tags: ['Research', 'Interfaces', 'Prototyping'],
    image: { src: '/images/service-ux.svg', alt: 'UX/UI design work for apps and products' },
    category: ['Web app', 'Mobile app'],
    detail: {
      lead: 'Product thinking from the first flow to the final pixel — interfaces that hold up under real, daily use.',
      includes: [
        'Discovery & user research',
        'Information architecture & user flows',
        'Wireframes & interface design',
        'Interactive prototypes',
        'A design system & component library',
        'Build-ready hand-off',
      ],
      approach:
        'I map how the thing actually works, then tackle what matters most to users first — the make-or-break flows down to the small details that make it feel right. I prototype the riskier parts early to test them, and keep the interface consistent as it grows.',
    },
  },
  {
    id: 'svc-brand',
    index: 'S/02',
    name: 'Brand identity',
    description:
      'Logo, type, and visual systems that tie it all together — one consistent language across every surface and screen.',
    tags: ['Identity', 'Type', 'Design systems'],
    image: { src: '/images/service-brand.svg', alt: 'Brand identity system work' },
    category: ['Brand identity'],
    detail: {
      lead: 'A visual language that ties everything together — one voice across every surface and screen.',
      includes: [
        'Logo & wordmark',
        'Type & colour system',
        'Visual language & art direction',
        'Brand guidelines',
        'Templates & core assets',
        'Rollout across digital surfaces',
      ],
      approach:
        'Identity built as a system, not a single logo — defined clearly enough to apply itself, and flexible enough to live everywhere from a business card to a six-metre wall.',
    },
  },
  {
    id: 'svc-tinker',
    index: 'S/03',
    name: 'Tinkering',
    description:
      'The hands-on, curious side — I tinker in code and with AI to prototype ideas, explore what’s possible, and turn a concept into something you can actually click and try.',
    tags: ['Code', 'AI', 'Prototyping'],
    image: { src: '/images/service-web.svg', alt: 'Tinkering — prototyping in code and with AI' },
    category: ['Prototype', 'Experiment'],
    detail: {
      lead: 'The hands-on, curious side of the work — where an idea becomes something you can click, poke at, and actually try.',
      includes: [
        'Functional prototypes & demos',
        'Tinkering in code — React & Framer',
        'AI tools for fast, working builds',
        'Proof-of-concepts & experiments',
        'Exploring ideas before committing',
        'Learning what actually works',
      ],
      approach:
        'Less production engineering, more curiosity. I tinker in code and with AI to push an idea from sketch to something clickable — exploring and testing what works before anyone commits to building it. For me, building is a way to think, not just to ship.',
    },
  },
]

/* ---- Selected work (03) -------------------------------------------------- */
export interface CaseSection {
  heading: string
  body: string
  /** Process artifacts for this stage (audit, IA, flows, explorations). Rendered
   *  full-width beneath the stage's text so wide diagrams stay legible. */
  media?: CaseScreen[]
}
export interface CaseResult {
  value: string
  label: string
}
export interface CaseScreen {
  src: string
  caption: string
  /** Optional longer explanation, shown beside the screen in the scroll-through.
   *  Only the screens that carry an argument need one; the rest just show. */
  note?: string
}
export interface CasePalette {
  name: string
  hex: string
  note: string
}
export interface CaseDesignSystem {
  intro: string
  palette: CasePalette[]
  typefaces: { name: string; role: string }[]
  principles: string[]
  /** Optional full design-system sheet image. */
  sheet?: string
}
export interface Project {
  id: string
  index: string
  name: string
  tag: string
  role: string
  outcome: string
  description: string
  /** Real case imagery (4:3). `fill` keeps the abstract placeholder until set. */
  image?: { src: string; alt: string }
  fill: 'a' | 'b' | 'c'
  grid?: boolean
  /** Shown in the curated home "Selected work" strip. All projects appear on /work. */
  featured?: boolean
  /** Wrap phone screens (cover band + gallery) in a device mockup bezel. */
  phoneFrame?: boolean
  /** CSS background for the home/work card media band (defaults to the warm mocha). */
  coverBg?: string
  /** Looping demo videos shown on the case study. */
  videos?: CaseScreen[]
  /** How videos are framed: 'browser' (desktop, default) or 'bare' (mobile clips
   *  that already include their own device frame). */
  videoFrame?: 'browser' | 'bare'
  /* ---- Case-study detail (route /work/:id) ---- */
  year: string
  client: string
  services: string[]
  /* ---- Deep-dive extras (optional; shown only when set) ---- */
  /** e.g. "Solo" — who was on it. */
  team?: string
  /** e.g. ['Figma', 'Claude Code'] — what it was made with. */
  tools?: string[]
  /** Closing reflection: what the work taught, and what comes next. */
  reflection?: { heading: string; body: string }[]
  /** Hero subhead on the case-study page. */
  tagline: string
  overview: string
  sections: CaseSection[]
  /** "At a glance" figures. Omit entirely to hide the row — better empty than
   *  padded with scope dressed up as outcomes. */
  results?: CaseResult[]
  /** Signature colour — replaces the brand blue within this project's case study
   *  and its homepage work row (left unset → stays brand blue). */
  accent?: string
  /** Live site URL — shows a "Visit live site" button in the case-study hero. */
  liveUrl?: string
  /* ---- Optional rich media (real projects) ---- */
  /** Phone screens for the cover device-band (warm gradient behind them). */
  coverScreens?: string[]
  /** Full screen gallery (carousel + see-all lightbox). */
  screens?: CaseScreen[]
  /** Design-system strip (palette · type · principles). */
  designSystem?: CaseDesignSystem
  /** Text shown in the browser-frame address chip of the web showcase. */
  browserLabel?: string
  /** Responsive web showcase — desktop shots (browser frame) + mobile (phone). */
  desktop?: CaseScreen[]
  mobile?: CaseScreen[]
  /** Brand/print asset gallery (masonry + fullscreen viewer). */
  brand?: CaseScreen[]
}

/** The primary hero/cover image URL for a project (mirrors the cover the
 *  case-study page renders), or undefined for placeholder-only projects. Used to
 *  preload the hero so the route transition can hold until it's decoded. */
export function coverSrc(p: Project): string | undefined {
  if (p.desktop?.length) return p.desktop[0].src
  if (p.coverScreens?.length) return p.coverScreens[1] ?? p.coverScreens[0]
  if (p.image) return p.image.src
  return undefined
}

/** Warm the browser cache with a project's hero (call on hover/focus of a link
 *  into it) so navigating in is seamless. Idempotent. */
const _preloaded = new Set<string>()
export function preloadCover(p: Project): void {
  const src = coverSrc(p)
  if (!src || _preloaded.has(src) || typeof Image === 'undefined') return
  _preloaded.add(src)
  new Image().src = src
}

export const projects: Project[] = [
  {
    id: 'ecotrip',
    index: 'W/01',
    name: 'EcoTrip',
    tag: 'Travel · Concept',
    role: 'End-to-end UX/UI & brand',
    outcome: 'A travel app where the greener choice is the shared one',
    description:
      'A concept travel app that makes the lower-carbon choice collective, not a chore — built on a hive metaphor, with 5% of every trip funding bee conservation.',
    fill: 'b',
    grid: true,
    featured: true,
    year: '2025',
    client: 'EcoTrip — self-initiated concept',
    services: ['UX/UI design', 'Brand identity', 'Design system'],
    team: 'Solo',
    tools: ['Figma'],
    tagline:
      'A travel app where the greener choice is the shared one — progress measured by the hive, not the halo.',
    overview:
      'EcoTrip is a concept for a travel app that makes the lower-carbon choice the shared one. Instead of guilt-tripping individuals, it frames sustainability as collective progress — a hive you contribute to — and backs the metaphor with real commitment: 5% of every trip funds bee conservation.',
    sections: [
      {
        heading: 'Discover',
        body: 'EcoTrip began as an earlier build of my own, so the honest first move was to audit it. The file had grown to 126 frames hanging off four tabs with no route between them, where duplicates and unlinked experiments outnumbered the real paths. There was no onboarding, no way to give back, and no way to compare one trip against another. The interface had its own tells: a single saturated yellow doing every job, leaves scoring the trip, and a bare "132 KgCO2" with nothing to measure it against.',
        media: [
          { src: '/work/ecotrip/process/audit-old-ui.webp', caption: 'Audit of the earlier build. Four findings, each turned into a decision that shaped the redesign.' },
          { src: '/work/ecotrip/process/ia-before.webp', caption: 'The old architecture: 126 frames across four dead-end tabs, with no route between them.' },
        ],
      },
      {
        heading: 'Define',
        body: 'Two travellers set the rules. Jane reduces carbon at every step and wanted friction on the unsustainable option, not on her own path. John takes bigger trips and will not trade much convenience, so he set the ceiling: surface the greener option, never block the route. Between them they produced the principle the whole product rests on. Friction only where it counts. The green path stays frictionless, and a high-carbon pick earns one honest, dismissible question and nothing more.',
        media: [
          { src: '/work/ecotrip/process/flow-plan-trip.webp', caption: 'Plan a trip. Jane set the floor and John the ceiling, so the nudge lives on the high-carbon branch and never on the path itself.' },
        ],
      },
      {
        heading: 'Develop',
        body: "126 frames became nine screens on a single loop: onboarding sets the posture, every trip ends in the Hive, and the Hive feeds the next trip, with giving back as its own branch. The visual direction took three passes. Eco-green read as a virtue sticker, SaaS-clean had no warmth and no sense of the collective, so honey and warm earth won: about the hive’s progress rather than a halo. Scoring went the same way, with leaves too generic and a bar too flat, until honeycomb cells won because they scale from five on a card to a full comb for the whole hive.",
        media: [
          { src: '/work/ecotrip/process/ia-after.webp', caption: 'The redesigned architecture: nine screens on one loop, with giving back as a new branch.' },
          { src: '/work/ecotrip/process/explorations.webp', caption: 'Palette, type and scoring explored in parallel. Eco-green and SaaS-clean were rejected for the reasons noted.' },
        ],
      },
      {
        heading: 'Deliver',
        body: 'Nine screens, a warm rounded system, and a giving branch that commits 5% of every trip to bee conservation, with anything a user tops up going 100% to the foundation. It is a self-initiated concept, so it has not been usability tested and I would not claim it as validated. The next step is the one that matters: put the create flow in front of both traveller types and check the thing the design rests on, that the nudge informs without ever reading as a block.',
      },
    ],
    reflection: [
      {
        heading: 'What I learned',
        body: 'The visual category was the trap. Travel defaults to white and blue, environment defaults to green, and both signal virtue at the palette level before a word is read. Finding a third way through the hive metaphor did more for the concept than any single screen.',
      },
      {
        heading: 'What I would do differently',
        body: 'I would set the success measure before designing the nudge. "Informs without blocking" is the whole thesis and it is testable, but I defined it in language rather than in something I could measure.',
      },
      {
        heading: 'What is next',
        body: 'Put the create flow in front of both traveller types. If Jane finds the green path slower, or John reads the nudge as a block, the principle fails and the flow needs rethinking before anything else does.',
      },
    ],
    accent: '#F5A800',
    videoFrame: 'bare',
    videos: [
      { src: '/work/ecotrip/EcoTrip-Flow-vid.webm', caption: 'A walk through the core flow — exploring and planning a greener trip.' },
      { src: '/work/ecotrip/why-bees.webm', caption: 'Give back to the hive — the pledge page that funds bee conservation.' },
    ],
    coverScreens: [
      '/work/ecotrip/onboarding.webp',
      '/work/ecotrip/explore-trips.webp',
      '/work/ecotrip/profile.webp',
    ],
    screens: [
      { src: '/work/ecotrip/onboarding.webp', caption: 'Onboarding — you join a hive and start adding to it.' },
      { src: '/work/ecotrip/explore.webp', caption: 'Explore — trips the hive loved, filtered by sustainability.' },
      { src: '/work/ecotrip/explore-trips.webp', caption: 'Trip detail — EcoScore, route and itinerary at a glance.' },
      { src: '/work/ecotrip/create.webp', caption: 'Create — friction on the high-carbon choice, never the path.' },
      { src: '/work/ecotrip/community.webp', caption: 'The Hive — shared progress, your trips and everyone’s.' },
      { src: '/work/ecotrip/community-trip.webp', caption: 'A shared trip — the full breakdown, ready to copy.' },
      { src: '/work/ecotrip/profile.webp', caption: 'Profile — impact surfaced ahead of stats.' },
    ],
    designSystem: {
      intro:
        'The hive metaphor, made into a system — collective progress over individual sacrifice, reward without the lecture.',
      palette: [
        { name: 'Honey Gold', hex: '#F5A800', note: 'Primary · actions' },
        { name: 'Amber', hex: '#C7900A', note: 'Warmth · accents' },
        { name: 'Terracotta', hex: '#C26739', note: 'Alerts · high-carbon' },
        { name: 'Olive', hex: '#687A35', note: 'Carbon saved' },
        { name: 'Cream', hex: '#F7EFDD', note: 'Surfaces' },
        { name: 'Espresso', hex: '#2A1E12', note: 'Text · dark cards' },
      ],
      typefaces: [
        { name: 'Fredoka', role: 'Display — rounded, warm' },
        { name: 'Nunito', role: 'Body — quiet, legible' },
      ],
      principles: [
        'The hive, not the halo — collective progress over personal virtue.',
        'Friction on the high-carbon choice, never the path.',
        'Reward without the lecture — a nudge, not a sticker.',
      ],
      sheet: '/work/ecotrip/components.webp',
    },
  },
  {
    id: 'goodreads',
    index: 'W/02',
    name: 'Goodreads Redesign',
    tag: 'Concept · Redesign',
    role: 'Product designer — research, IA, interaction, visual system',
    outcome: 'Making reading native, so everything social becomes a by-product',
    description:
      'A ground-up redesign of the largest book app in the world, on the premise that it forgot what its users are actually doing: reading.',
    fill: 'a',
    featured: true,
    accent: '#A24E1C',
    year: '2026',
    client: 'Goodreads — self-initiated concept',
    services: ['UX/UI', 'Product design', 'Design system'],
    team: 'Solo',
    tools: ['Figma', 'Claude'],
    tagline:
      'Goodreads, rebuilt around reading. The app should hold the book, not just the database entry for it.',
    overview:
      'Goodreads has the data and the community, and has been structurally frozen for over a decade. This is a ground-up redesign built on one premise: the product forgot what its users are actually doing, which is reading. Make reading native, and the social half stops being a wall of events and becomes a by-product of it.',
    sections: [
      {
        heading: 'Discover',
        body: 'Goodreads earns its loyalty through community, not polish. Working from the live app and my own use of it as a reader, four failures kept surfacing. Reading itself is absent, so progress is a number you type in, quotes get screenshotted into camera rolls, and notes end up in other apps. The feed is a wall of events, where a line saying someone rated a book three stars is not something anyone can reply to or wants to read. Discovery has left for short video, and the app answers with bestseller grids. And organisation punishes the organised, with shelves, tags and lists buried under a UI that treats every book as a row in a table.',
      },
      {
        heading: 'Define',
        body: 'One line held the redesign together: make reading native, and everything social becomes a by-product of it. If the app holds the book, it knows your page. Knowing your page means highlights become quotes without any filing work, reviews can start from passages you already saved, spoilers can be hidden by where you are rather than by a stranger’s guess, and a finished book can be a moment rather than a form. One structural decision pays for four features. The constraint alongside it was to stay recognisably Goodreads, because the brand equity is real. What changes is what the surface is for.',
      },
      {
        heading: 'Develop',
        body: 'Before committing I built three whole home screens rather than three mood boards, because the disagreement was structural rather than decorative. The Bookmark treated one book at a time as an object, and hid the library behind reverence for it. The Ledger made reading a tracked practice, which turned a hobby into a KPI dashboard. The Stack won: your books as a stack you reach into, covers doing the visual work, the library present and the current book obvious. The system fell out of that choice. One palette holding no colour outside the paper-to-brown spectrum, because covers are the loudest thing on every screen and any UI hue competes with them, and two typefaces, Literata for anything that is prose and Bricolage Grotesque for structure.',
        media: [
          { src: '/work/goodreads/process/explorations.webp', caption: 'Three whole home screens, built before committing to one. The Bookmark, The Ledger, and The Stack, which became the app.' },
        ],
      },
      {
        heading: 'Deliver',
        body: 'Eighteen screens across four tabs, one design system, and a hero flow that carries the argument: finish a book, rate it, write the review, watch it land on your shelf. The payoff of native reading shows up in that review screen, where the quotes you kept while reading sit under the draft ready to pull in, so what you wrote while reading becomes what you publish. Every flow is leavable, because finishing without rating is a complete act and so is rating without reviewing. It is a self-initiated concept, so it has not been usability tested and I would not call it validated. The next step is an interactive prototype of that flow, so the argument can be felt rather than read.',
        media: [
          { src: '/work/goodreads/process/hero-flow.webp', caption: 'The hero flow, left to right: the last page, the rating, the review with kept quotes ready to pull in, and the book landing on the shelf.' },
        ],
      },
    ],
    results: [
      { value: '4', label: 'Root tabs the whole product folds into' },
      { value: '18', label: 'Screens designed across them' },
      { value: '3', label: 'Home screens built before one was chosen' },
    ],
    reflection: [
      {
        heading: 'What I learned',
        body: 'The palette decision did more work than any single screen. An earlier pass used a green accent and it fought every cover on the page. Cutting every hue outside paper and brown let the books be the colour, and made the one rust action unmistakable.',
      },
      {
        heading: 'What I would do differently',
        body: 'I would set the success measures before drawing anything. "Fewer taps to shelve a book" is testable; "calmer" is not, and I leaned on the second more than the first.',
      },
      {
        heading: 'What is next',
        body: 'An interactive prototype of the finish, rate, review and shelve flow, so the argument can be felt rather than read. After that, onboarding that seeds taste from three books you loved, and a first pass at tablet.',
      },
    ],
    /* Warm paper and terracotta rather than EcoTrip's honey, so each card
       carries its own project's colour. */
    coverBg: 'linear-gradient(150deg, #e0b08a 0%, #f4ebe0 100%)',
    coverScreens: [
      '/work/goodreads/cover-my-books.webp',
      '/work/goodreads/cover-home.webp',
      '/work/goodreads/cover-book-page.webp',
    ],
    screens: [
      {
        src: '/work/goodreads/home.webp',
        caption: 'Reading — the tab opens the book, not a dashboard',
        note: 'The root you land on when you back out of the reader. Your stack, the current book’s progress, and the three things you actually do with a book you are reading: quotes, notes, rate.',
      },
      {
        src: '/work/goodreads/reader.webp',
        caption: 'The reader',
        note: 'Tapping Reading with a book open comes straight here, with no dashboard in between. One serif column at a real reading measure, chapter and page marked, chrome cut back to title and type size.',
      },
      {
        src: '/work/goodreads/highlight.webp',
        caption: 'Highlight to capture',
        note: 'The hinge of the whole redesign: the moment a screenshot becomes structured data. Quote keeps the passage verbatim with its page, Note attaches a thought, Define and Share follow.',
      },
      {
        src: '/work/goodreads/quote-kept.webp',
        caption: 'Quote kept',
        note: 'The confirmation does the filing. Page reference automatic, tags one tap, an optional note riding along, and it lands in a collection that is a real destination rather than a dead-end toast.',
      },
      {
        src: '/work/goodreads/my-books.webp',
        caption: 'My Books — shelves first',
        note: 'Want to read and Read lead, with did-not-finish given a shelf of its own rather than hidden. Reading sits below them, because the Reading tab already owns that job.',
      },
      {
        src: '/work/goodreads/my-books-lists.webp',
        caption: 'Lists, tags, and somewhere for the quotes to live',
        note: 'Lists carry real cover stacks, tags carry counts, and quotes and notes become a destination. The yearly goal is a hairline row rather than a scoreboard.',
      },
      {
        src: '/work/goodreads/discover-browse.webp',
        caption: 'Discover — recommendations that lead with why',
        note: 'Because of the book in your hands, or because someone you trust finished it, rather than a bestseller wall. Search stays pinned at the top of both modes.',
      },
      {
        src: '/work/goodreads/discover-shorts.webp',
        caption: 'Shorts',
        note: 'The half of discovery that left for short video, brought back inside as a mode of Discover rather than a separate app. The difference is the persistent book card: the thing being recommended is one tap from your shelf.',
      },
      {
        src: '/work/goodreads/search.webp',
        caption: 'Search — global, but yours first',
        note: 'Matches already on a shelf group at the top and show which shelf, as a control you can change on the spot. Everything below is one tap from Want to read.',
      },
      {
        src: '/work/goodreads/book-page.webp',
        caption: 'Book page',
        note: 'The cover owns the top: its colour floods the header and fades into paper, so every book page feels like that book. Your relationship with it comes before the crowd’s.',
      },
      {
        src: '/work/goodreads/book-snapshot.webp',
        caption: 'Inline snapshot',
        note: 'What the chevron on the reading root opens: author, rating, series and length, delivered without leaving the screen. Navigation avoided is navigation designed.',
      },
      {
        src: '/work/goodreads/community-feed.webp',
        caption: 'Community — made things only',
        note: 'Bare activity collapses into one line at the bottom instead of being the feed. Reviews are truncated by the page you are on, rather than by a stranger’s guess at what counts as a spoiler.',
      },
    ],
    designSystem: {
      intro:
        'One palette, two typefaces, four component families. The palette deliberately holds no colour outside the paper-to-brown spectrum, because covers are the loudest thing on every screen.',
      palette: [
        { name: 'Paper', hex: '#F7F4ED', note: 'Surfaces' },
        { name: 'Card', hex: '#FFFDF8', note: 'Raised fills' },
        { name: 'Quiet fill', hex: '#EDE7DA', note: 'Rules · inactive' },
        { name: 'Rust', hex: '#A24E1C', note: 'The one primary action' },
        { name: 'Star', hex: '#8A5220', note: 'Ratings · highlights' },
        { name: 'Ink', hex: '#3A2A18', note: 'Text' },
      ],
      typefaces: [
        { name: 'Literata', role: 'Prose — titles, quotes, the reader' },
        { name: 'Bricolage Grotesque', role: 'Structure — headings, UI, labels' },
      ],
      principles: [
        'Rust is reserved for the single most important action on a screen.',
        'No colour outside paper and brown, so the covers are the colour.',
        'Books never appear as text where a cover could appear instead.',
        'Every flow is leavable: the completionist path is offered, never enforced.',
      ],
    },
  },
  {
    id: 'jobquest',
    index: 'W/03',
    name: 'Jobquest',
    tag: 'Web app · Shipped',
    role: 'Design & React build',
    outcome: 'A job-search tracker I designed and built, end to end',
    description:
      'A job-search tracker — board, grid, and map views, a bento dashboard, and colour-coded stages. A real, functional tool I designed and built in React, made for the reality of job-hunting in today’s market.',
    fill: 'b',
    grid: true,
    featured: true,
    accent: '#2f8f57',
    coverBg: 'linear-gradient(150deg, #d3e8da 0%, #eef4ee 100%)',
    browserLabel: 'jobquest — job search',
    year: '2026',
    client: 'Jobquest — self-initiated',
    services: ['Product design', 'UX/UI', 'React build'],
    tagline:
      'A job-search tracker for today’s market — built to make the hunt feel calm and clear.',
    overview:
      'Jobquest is a web app I designed and built — a job-search tracker that came out of running my own search. Three views answer three different questions, status reads as colour rather than noise, and a local-first architecture keeps it quick and frictionless. Built in React/TypeScript, pair-built with Claude Code.',
    sections: [
      {
        heading: 'The problem',
        body: 'A job search is a pipeline, but a spreadsheet flattens it. Going through my own search, I wanted to see status at a glance and switch between “what’s in flight”, “where is everything”, and “what’s nearby” without re-reading rows — not a generic CRM bent into the role.',
      },
      {
        heading: 'The approach',
        body: 'Three views, each answering a different question; a bento dashboard for the morning glance; colour carrying status so the eye does the triage. Designed and built in the same loop — pushing each idea from sketch to a clickable prototype I could feel and refine.',
      },
      {
        heading: 'Easy to scan, yours to shape',
        body: 'Colour-coded stages help the board read at a glance — but so do the company logos and stage icons, so you scan however suits you. It bends to you, too: filter, sort, and customise to your heart’s content across a kanban board, dense rows, or a map. And each application keeps the CV and cover letter you tailored for it, so the whole search lives in one place — not scattered across folders.',
      },
      {
        heading: 'The build',
        body: 'Vite, React, TypeScript, and Zustand for state, on a local-first store — no auth, no backend, nothing between me and the data. Pair-built with Claude Code, which let me move from idea to clickable in hours rather than days, and treat the build itself as part of the design.',
      },
      {
        heading: 'What I’d do differently',
        body: 'Built fast and scratch-my-own-itch first, so a few decisions are narrow. The next pass would broaden the data model and views to fit searches that don’t look like mine — and test the flows with other job-seekers.',
      },
    ],
    results: [
      { value: 'Local-first', label: 'No auth, no backend, nothing in the way' },
      { value: '3 views', label: 'Board · Grid · Map' },
      { value: 'Shipped', label: 'A real, working product' },
    ],
    desktop: [
      { src: '/work/jobquest/welcome.webp', caption: 'Welcome — your whole job search in one place.' },
      { src: '/work/jobquest/bento-home.webp', caption: 'Home — a bento dashboard for the morning glance.' },
      { src: '/work/jobquest/board-final.webp', caption: 'Board — the pipeline by stage, drag to move.' },
      { src: '/work/jobquest/grid-final-sorted.webp', caption: 'Grid — dense and sortable, for the full picture.' },
      { src: '/work/jobquest/map-final.webp', caption: 'Map — roles by city, for the “what’s nearby” question.' },
      { src: '/work/jobquest/job-offer.webp', caption: 'Offer — deciding on an offer, the numbers in one place.' },
    ],
    videos: [
      { src: '/work/jobquest/swapping-between.mp4', caption: 'One search, three views — board, grid, and map, a keystroke apart.' },
      { src: '/work/jobquest/map-recording.mp4', caption: 'Map — roles by city, filtered live.' },
      { src: '/work/jobquest/job-offer.mp4', caption: 'Deciding on an offer — the numbers in one place.' },
    ],
  },
  {
    id: 'sony',
    index: 'W/04',
    name: 'Sony / Nimway',
    tag: 'Smart office · Client',
    role: 'UX design',
    outcome: 'One product across panels, kiosks, wayfinding & app',
    description:
      'Smart-office product line for the Sony group — meeting-room panels, a booking app and website, and large-format wayfinding maps. Real, shipping client work; the visuals are under NDA.',
    fill: 'c',
    image: { src: '/work/sony/cover-nimway.webp', alt: 'Sony / Nimway — smart-office product line' },
    featured: true,
    year: '2025 — 2026',
    client: 'Sony / Nimway (under NDA)',
    services: ['UX design', 'Design systems', 'Cross-surface'],
    tagline:
      'Keeping one product feeling like one product — across a door panel, a lobby kiosk, a floor-plan wall, and a phone.',
    overview:
      'Nimway is Sony’s smart-office platform, used by thousands of people across multiple countries. I designed flows that span four very different surfaces — eye-level meeting-room panels, no-login lobby kiosks, large-format wayfinding screens read from across a room, and the mobile booking app — keeping them coherent without flattening each into the same screen. This is real, shipping client work, so the visuals are under NDA: what follows is the story rather than the screens.',
    sections: [
      {
        heading: 'The brief',
        body: 'A smart-office system lives on hardware as much as in an app. The challenge wasn’t any single screen — it was four contexts at once: a door panel you read at arm’s length, a lobby kiosk a stranger uses with no login, a floor-plan display legible from across the room, and a phone in your pocket. Each has its own distance, attention span, and input.',
      },
      {
        heading: 'One product, four surfaces',
        body: 'The work was holding a single product language across all of them without pretending they’re the same screen. Shared logic and a shared system — but type, density, and interaction tuned to each surface’s distance and context. A panel states; a kiosk guides; a wayfinding screen orients; the app manages.',
      },
      {
        heading: 'What I designed',
        body: 'Meeting-room panels (booking, status, occupancy), TouchPlan lobby kiosks (visitor navigation and resource booking), wayfinding screens (floor-plan availability at a glance), and the booking app (find a room, manage it from your phone) — designed in Figma against Sony’s design system and tested on real devices.',
      },
      {
        heading: 'Shipping',
        body: 'The flows ship in upcoming Nimway releases across panels, kiosks, wayfinding, and the booking app — my first time designing for a real product at this scale, for users I’ll never meet but who’ll touch it every working day.',
      },
    ],
    results: [
      { value: 'Sony', label: 'Real, shipping client work' },
      { value: '4 surfaces', label: 'Panel · kiosk · wayfinding · app' },
      { value: '1 system', label: 'Coherent across all of them' },
    ],
  },
  {
    id: 'teem',
    index: 'W/05',
    name: 'Teem',
    tag: 'Brand · Concept',
    role: 'Brand & packaging design',
    outcome: 'A cold-brew matcha brand — a break from screens',
    description:
      'A brand identity, can, and editorial leaflet for a cold-brew matcha latte — Japanese craft meeting modern café culture, beyond the usual all-green matcha cliché.',
    fill: 'a',
    accent: '#3f8a3c',
    year: '2023',
    client: 'Teem — self-initiated',
    services: ['Brand identity', 'Packaging', 'Editorial'],
    image: { src: '/work/teem/hero.webp', alt: 'Teem cold-brew matcha latte cans' },
    tagline:
      'A cold-brew matcha brand built as a break from screens — Japanese craft, modern café energy.',
    overview:
      "Teem is a self-initiated brand for a cold-brew matcha latte, positioned between coffee and tea culture. The brief I set myself: honour matcha's Japanese roots without the tired all-green clichés, and make something that feels calm and tactile — a break from screens.",
    sections: [
      {
        heading: 'The brief',
        body: 'Matcha branding tends to lean on one move — paint it green and call it zen. Teem had to earn its calm: a name, a mark, a can, and a printed piece that together feel crafted and quietly Japanese, while still sitting happily in a modern cold-brew café.',
      },
      {
        heading: 'The approach',
        body: 'Four moves. A name — “teem,” for abundance and easy energy. A hand-drawn Chalkduster wordmark on a matcha brushstroke, paired with Georgia for the calm of print. Curved-can packaging carrying a jade-mountain-and-white-river landscape, drawn for the round of the can rather than a flat layout. And a four-page editorial leaflet on a two-column grid.',
      },
      {
        heading: 'The outcome',
        body: 'A complete little system — wordmark, can, and leaflet — in layered greens, warm latte tones, and a single periwinkle river. It reads as matcha without shouting it: tradition and café-modern in the same breath.',
      },
    ],
    results: [
      { value: '3', label: 'Deliverables — mark, can, leaflet' },
      { value: '抹茶', label: 'Japanese craft, café-modern' },
      { value: 'Solo', label: 'Named, designed & mocked up' },
    ],
    brand: [
      { src: '/work/teem/process-name.webp', caption: 'Naming — “teem,” for abundance and easy energy.' },
      { src: '/work/teem/process-logo.webp', caption: 'The mark — hand-drawn on a matcha brushstroke.' },
      { src: '/work/teem/process-packaging.webp', caption: 'Packaging — drawn for the curve, not the flat.' },
      { src: '/work/teem/packaging.webp', caption: 'Cold-brew matcha latte — the can.' },
      { src: '/work/teem/process-leaflet.webp', caption: 'A four-page leaflet on a two-column grid.' },
      { src: '/work/teem/leaflet-cover.webp', caption: 'Leaflet — front cover.' },
      { src: '/work/teem/leaflet-spread.webp', caption: 'Leaflet — interior spread.' },
      { src: '/work/teem/leaflet-back.webp', caption: 'Leaflet — back cover.' },
    ],
    designSystem: {
      intro:
        'Matcha without the cliché — layered greens grounded by warm latte tones and a single periwinkle river.',
      palette: [
        { name: 'Matcha', hex: '#3f8a3c', note: 'Wordmark · accents' },
        { name: 'Pine', hex: '#2e6b4f', note: 'Depth · type' },
        { name: 'Lime', hex: '#8ab84a', note: 'Hills · highlights' },
        { name: 'Latte', hex: '#efe7c4', note: 'Warmth · surfaces' },
        { name: 'Periwinkle', hex: '#5d6bb0', note: 'The river · accent' },
        { name: 'Sage', hex: '#a9c79c', note: 'Calm · backgrounds' },
      ],
      typefaces: [
        { name: 'Chalkduster', role: 'Display — hand-drawn, the wordmark' },
        { name: 'Georgia', role: 'Body — the calm of print' },
      ],
      principles: [
        'Matcha without the cliché — earn the calm, don’t just colour it green.',
        'Designed for the curve, not the flat layout.',
        'A break from screens — tactile, printed, quietly Japanese.',
      ],
    },
  },
  {
    id: 'reel',
    index: 'W/06',
    name: 'Reel',
    tag: 'Web · Concept',
    role: 'Design & Framer build',
    outcome: 'A calm, photography-led site for a design studio',
    description:
      'A self-initiated concept for a contemporary architecture & interior studio — restrained, typographic, and fully responsive, designed and built in Framer.',
    fill: 'a',
    accent: 'var(--ink)',
    liveUrl: 'https://goodness-jargon-613166.framer.app/',
    browserLabel: 'reel — architecture',
    year: '2025',
    client: 'Reel — self-initiated concept',
    services: ['Web design', 'Art direction', 'Framer build'],
    tagline:
      'A concept site for a contemporary architecture studio — where the work is the loudest thing on the page.',
    overview:
      "Reel is a self-initiated concept for a contemporary architecture and interior design studio. The brief I set myself: make a portfolio site that gets out of the way of the photography — confident type, generous space, and a structure that reads as cleanly on a phone as on a wide display.",
    sections: [
      {
        heading: 'The idea',
        body: 'Architecture sites tend toward one of two failures — sterile grids that flatten the work, or over-designed layouts that fight it. Reel aims for the narrow middle: a typographic, near-monochrome system that frames the photography and never competes with it.',
      },
      {
        heading: 'The system',
        body: 'A single display face does the heavy lifting — set large and tight — and everything else stays quiet. Black, white, and the warmth of the architectural photography are the whole palette. Sections breathe, one idea per screen: vision, studio, services, work.',
      },
      {
        heading: 'Responsive by design',
        body: 'It was built mobile-up in Framer, so the same restraint holds from a wide hero to a phone. Type rescales, the services list stacks, and the project grid reflows — the composition stays calm at every width.',
      },
    ],
    results: [
      { value: 'Mobile-up', label: 'Responsive at every width' },
      { value: '1 face', label: 'Type carries the design' },
      { value: 'Framer', label: 'Designed & built, no hand-off' },
    ],
    desktop: [
      { src: '/work/reel/d-hero.webp', caption: 'Home — “Vision. Structure. Impact.”' },
      { src: '/work/reel/d-about.webp', caption: 'About — the studio, on bold colour blocks.' },
      { src: '/work/reel/d-services.webp', caption: 'Services — residential, commercial, innovative.' },
      { src: '/work/reel/d-projects.webp', caption: 'Projects — stats beside a selected-work grid.' },
    ],
    mobile: [
      { src: '/work/reel/m-hero.webp', caption: 'Home' },
      { src: '/work/reel/m-about.webp', caption: 'About' },
      { src: '/work/reel/m-services.webp', caption: 'Services' },
      { src: '/work/reel/m-projects.webp', caption: 'Projects' },
      { src: '/work/reel/m-contact.webp', caption: 'Contact' },
    ],
  },
]

/* ---- Process (04) -------------------------------------------------------- */
export interface Step {
  no: string
  name: string
  description: string
}
// A double-diamond rhythm: diverge to explore, converge to decide — twice.
export const steps: Step[] = [
  {
    no: '01',
    name: 'Discover',
    description: 'Research the people, the context, and the goals, going broad to understand the real problem behind the brief.',
  },
  {
    no: '02',
    name: 'Define',
    description: 'Synthesise it into a sharp focus: the problem worth solving, and what success actually looks like.',
  },
  {
    no: '03',
    name: 'Develop',
    description: 'Explore solutions in flows, wireframes, and interface systems, made tangible fast as prototypes and mockups in Figma and Claude Code.',
  },
  {
    no: '04',
    name: 'Deliver',
    description: 'Test with real users, refine, and ship, then learn from real use and keep improving.',
  },
]

/* ---- Beyond the work (05) — the personal bento --------------------------- */
export const aboutMe = {
  blurb:
    "I split my time between Malmö and Stockholm, at home (and open to work) in both. I like keeping up with design and AI, and off the clock you'll usually find me with a book, cooking something, or grabbing a matcha.",
  tags: ['Malmö & Stockholm', 'Curious by default'],
  /** Self-hosted 30-sec previews + cover art (no Spotify iframe → no third-party
   *  cookies or tracking). `url` opens the full track on Spotify on click only. */
  tracks: [
    {
      title: 'White Keys',
      artist: 'Dominic Fike',
      cover: '/images/tracks/white-keys.jpg',
      preview: '/audio/white-keys.mp3',
      url: 'https://open.spotify.com/track/5ViLKrbyL3HD6wsq3AB9eI',
    },
    {
      title: 'Self Aware',
      artist: 'Temper City',
      cover: '/images/tracks/self-aware.jpg',
      preview: '/audio/self-aware.mp3',
      url: 'https://open.spotify.com/track/4qW3BbQAwZsrnu8a3ZRdyT',
    },
    {
      title: 'Mariella',
      artist: 'Khruangbin, Leon Bridges',
      cover: '/images/tracks/mariella.jpg',
      preview: '/audio/mariella.mp3',
      url: 'https://open.spotify.com/track/3dvXRk7TZ929m21p49RR5P',
    },
  ],
  books: [
    { title: 'Brave New World', author: 'Aldous Huxley', cover: '/images/books/brave-new-world.jpg' },
    { title: "Aesop's Fables", author: 'Aesop', cover: '/images/books/aesop-fables.jpg' },
  ],
  interests: ['Cooking', 'Matcha', 'Design & AI', 'Exploring Stockholm'],
}

/* ---- Footer -------------------------------------------------------------- */
export const footerColumns = [
  {
    heading: 'Menu',
    links: [
      { label: 'Work', href: '#work' },
      { label: 'Skills', href: '#services' },
      { label: 'About', href: '#studio' },
      { label: 'How I work', href: '#process' },
    ],
  },
  {
    heading: 'Contact',
    links: [
      { label: studio.email, href: `mailto:${studio.email}` },
      { label: 'WhatsApp', href: 'https://wa.me/46706179898' },
    ],
    notes: [studio.location, studio.worldwide],
  },
  {
    heading: 'Elsewhere',
    links: [...socials, { label: 'Download CV', href: '/Lukas-Ahlse-CV.pdf' }],
  },
] as const
