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
  { label: 'Work', href: '#work' },
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
    id: 'svc-web',
    index: 'S/01',
    name: 'Web & app development',
    description:
      'I design and build websites and apps, across web and mobile — fast, accessible, and responsive, so they feel right on every screen.',
    tags: ['Web & mobile', 'Responsive', 'Framer'],
    image: { src: '/images/service-web.svg', alt: 'A responsive website and web app shown on a browser and a phone' },
    category: ['Website', 'Web app'],
    detail: {
      lead: 'Websites and apps that earn their keep — quick to load, easy to run, and built to look right on every screen.',
      includes: [
        'Marketing sites & apps',
        'Front-end build — React or Framer',
        'Responsive, desktop to mobile',
        'A CMS you can edit yourself',
        'Performance, accessibility & SEO',
        'Launch & handover',
      ],
      approach:
        'I start with the goal and the content, not a template — and the same hands design and build it, so nothing gets lost in a hand-off. You end up with something fast that you can actually maintain.',
    },
  },
  {
    id: 'svc-ux',
    index: 'S/02',
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
        'Systems before screens. I map how the thing actually works, prototype the parts that carry risk, and settle a component set that stays coherent as the product grows.',
    },
  },
  {
    id: 'svc-brand',
    index: 'S/03',
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
]

/* ---- Selected work (03) -------------------------------------------------- */
export interface CaseSection {
  heading: string
  body: string
}
export interface CaseResult {
  value: string
  label: string
}
export interface CaseScreen {
  src: string
  caption: string
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
  /** Hero subhead on the case-study page. */
  tagline: string
  overview: string
  sections: CaseSection[]
  results: CaseResult[]
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
    tagline:
      'A travel app where the greener choice is the shared one — progress measured by the hive, not the halo.',
    overview:
      'EcoTrip is a concept for a travel app that makes the lower-carbon choice the shared one. Instead of guilt-tripping individuals, it frames sustainability as collective progress — a hive you contribute to — and backs the metaphor with real commitment: 5% of every trip funds bee conservation.',
    sections: [
      {
        heading: 'The brief',
        body: 'Environmental apps reach for green by default — virtue signalled at the palette level. EcoTrip had to make the lower-carbon choice the obvious one without ever lecturing, and turn a private act of restraint into something that feels collective.',
      },
      {
        heading: 'Two travellers',
        body: "Two personas set the rules. John takes bigger trips abroad and won't trade much convenience — his journey set the ceiling on friction: surface the green option, never block the path. Jane reduces carbon at every step, comfort be damned — hers showed where friction needed to live (on the unsustainable options) and where it had to disappear (on the sustainable ones).",
      },
      {
        heading: 'The hive, not the halo',
        body: "The bees came out of that: warm and collective, where the focus is the hive's progress rather than any one person's halo. You still track your own trips and see how others are doing — but every score reads as a cell you add to the hive, a win worth celebrating because it lifts the whole, not a rank to beat. And it isn't only metaphor — EcoTrip commits 5% of every trip's revenue to bee conservation, and anything a user tops up goes 100% to the foundation.",
      },
      {
        heading: 'A warmer system',
        body: 'Honey gold and earthy tones replaced the predictable green; a rounded display family replaced the corporate sans. The hexagon recurs quietly across the system — badges, rewards, completion states — tying the identity to the metaphor without lecturing. The result reads as an invitation, not an obligation.',
      },
    ],
    results: [
      { value: '5%', label: 'Of every trip funds bee conservation' },
      { value: '2 personas', label: 'Two very different travellers' },
      { value: '1 system', label: 'Honey-gold palette + hexagon motif' },
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
    id: 'jobquest',
    index: 'W/02',
    name: 'Jobquest',
    tag: 'Web app · Shipped',
    role: 'Design & React build',
    outcome: 'A job-search tracker I designed and built, end to end',
    description:
      'A job-search tracker — board, grid, and map views, a bento dashboard, and colour-coded stages. A real, functional tool I designed and built in React, born out of my own job search.',
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
      'A job-search tracker born out of my own search — built to make the hunt feel calm and clear.',
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
        body: 'Colour-coded stages help the board read at a glance — but so do the company logos and stage icons, so you scan however suits you. And it bends to you: filter, sort, and customise to your heart’s content across a kanban board, dense rows, or a map — all of it still simple to use.',
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
      { value: '~3 weeks', label: 'Idea to shipped' },
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
    index: 'W/03',
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
    id: 'reel',
    index: 'W/04',
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
    id: 'goodreads',
    index: 'W/06',
    name: 'Goodreads Redesign',
    tag: 'Concept · Redesign',
    role: 'Solo redesign',
    outcome: 'Unburying the core flows without breaking the community',
    description:
      'A self-initiated redesign of Goodreads — cutting a decade of feature clutter from the everyday “add, track, discover” flows, while protecting the community that makes it loved.',
    fill: 'a',
    accent: '#6f4e37',
    phoneFrame: true,
    year: '2024',
    client: 'Goodreads — self-initiated redesign',
    services: ['UX/UI', 'Product design', 'Redesign'],
    tagline:
      'Rethinking how readers track and discover books — and knowing what not to touch.',
    overview:
      'Goodreads is beloved for its community — reviews, ratings, friends’ shelves. But the everyday “add a book, track progress, find the next one” flows are buried under a decade of feature accretion. This self-initiated redesign sharpens those core flows while deliberately preserving what people already love.',
    sections: [
      {
        heading: 'The problem',
        body: 'Goodreads earns its loyalty through community, not polish. The cost is that the simple daily jobs — log a book, update progress, decide what’s next — are scattered and slow. The redesign’s hardest constraint was restraint: knowing what not to change.',
      },
      {
        heading: 'The approach',
        body: 'A three-step move: synthesise what readers actually do day to day, separate the loved-and-untouchable (the community) from the cluttered-and-fixable (the core flows), then redesign only the latter. Before-and-afters kept each change honest.',
      },
      {
        heading: 'The solution',
        body: 'A calmer My Books, a clearer home and social feed, a lighter review interface, and an Explore that surfaces the next read instead of burying it — the community left intact, the everyday flows unburied.',
      },
      {
        heading: 'The outcome',
        body: 'A focused exercise in editing a mature product: the discipline was as much in what stayed as in what changed.',
      },
    ],
    results: [
      { value: '3 weeks', label: 'Self-initiated exercise' },
      { value: '7 screens', label: 'Before / after, core flows' },
      { value: 'Restraint', label: 'Knowing what not to change' },
    ],
    coverScreens: [
      '/work/goodreads/home.webp',
      '/work/goodreads/my-books.webp',
      '/work/goodreads/social.webp',
    ],
    screens: [
      { src: '/work/goodreads/my-books.webp', caption: 'My Books — redesigned: progress and shelves up front.' },
      { src: '/work/goodreads/old-my-books.webp', caption: 'My Books — the original, before the edit.' },
      { src: '/work/goodreads/home.webp', caption: 'Home — current read and quick actions, decluttered.' },
      { src: '/work/goodreads/social.webp', caption: 'Social — the community feed, kept and clarified.' },
      { src: '/work/goodreads/social-old.webp', caption: 'Social — the original feed.' },
      { src: '/work/goodreads/explore.webp', caption: 'Explore — surfacing the next read instead of burying it.' },
      { src: '/work/goodreads/review.webp', caption: 'Review — a lighter, faster rating flow.' },
    ],
  },
]

/* ---- Process (04) -------------------------------------------------------- */
export interface Step {
  no: string
  name: string
  description: string
}
export const steps: Step[] = [
  {
    no: '01',
    name: 'Discovery',
    description: 'Understand the people, the problem, and what success actually looks like.',
  },
  {
    no: '02',
    name: 'Design',
    description: 'Systems and screens — type, grid, and components that scale, looping back to discovery as I learn.',
  },
  {
    no: '03',
    name: 'Build',
    description: 'Built in Framer or React — with Claude Code for functional demos, in close collaboration with engineers and PMs.',
  },
  {
    no: '04',
    name: 'Ship',
    description: 'Ship, then learn from real use — measure, refine, and keep improving.',
  },
]

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
