# Lukas Ahlse — Portfolio (handoff)

This project is a **duplicate of the "Tau Studio" site**, to be rebranded into
**Lukas Ahlse — UX Designer portfolio** (the site used to apply to jobs). The
*design system, components, and animations are the starting point*; the
*identity and content* get swapped. The original Tau agency project lives
separately at `../Tau` and should stay untouched.

> If you're a fresh Claude session: read this whole file first. The codebase is
> polished and intentional — reuse its patterns, don't rebuild. Most of the work
> here is **content + identity**, not new engineering.

---

## 1. Stack & commands

- **Vite 5 + React 18 + TypeScript**, **CSS Modules** + CSS-variable design tokens.
- **react-router-dom v6** (`BrowserRouter`, routes `/` and `/work/:slug`).
- **Lenis** smooth scroll (exposed as `window.__lenis`).
- No CSS framework, no component library — everything is hand-built.

```bash
npm install
npm run dev      # Vite dev server (launch.json uses port 5173; has run on 5180 here)
npm run build    # tsc -b && vite build  → dist/
npm run preview  # serve the production build
```

`devDependencies` include **puppeteer** + **sharp** (used only for the
screenshot/asset-capture scripts in `scripts/`). The portfolio doesn't need them
— safe to remove `scripts/`, `puppeteer`, and `sharp` once you don't need asset
capture.

---

## 2. Brand system (Tau's — the starting point; change to taste)

All tokens live in **`src/styles/tokens.css`** (light + `[data-theme='dark']`).
Theme is toggled and saved to `localStorage` under the key **`tau-theme`**
(applied before paint by an inline script in `index.html` — rename the key if you
like).

**Colour — light**
| token | value | use |
|---|---|---|
| `--bg` | `#f6f4f1` | warm off-white page |
| `--bg-deep` | `#efece6` | recessed surface (card media) |
| `--ink` | `#0e0e0c` | near-black text |
| `--accent` | `#2a4bff` | electric-blue accent (**the brand colour**) |
| `--gray` | `#8c887f` | secondary text |
| `--gray-strong` | `#67645c` | metadata |

**Colour — dark** (`[data-theme='dark']`): `--bg #14120f`, `--bg-deep #1e1c18`,
`--ink #f3f0ea`, `--gray #8e8a81`, `--gray-strong #b2aea4`.

**Type families**
- `--font-display` **Archivo** (headlines, wordmark — heavy weights 680–860)
- `--font-body` **Inter**
- `--font-mono` **Geist Mono** (labels, timecodes, eyebrows)
- `--font-hand` **Caveat** (the handwritten hero note)
- Loaded via Google Fonts `<link>` in `index.html`.

**The wordmark / brand dot.** The mark is `tau` + a **rounded-square (squircle)
accent dot** — a styled box, not a period: `width/height: 0.17em; border-radius:
0.05em; background: var(--accent)`. It appears in Nav, Footer, Loader,
RouteTransition, the showreel film (cold-open + resolve), and the Studio hub
core. **Rebrand = change `tau` → your name/mark everywhere (see checklist).**

**Design language.** Scandinavian/editorial: restraint over decoration, clear
systems, cream+ink base with a single electric-blue accent, big Archivo display
type, mono labels. Light/dark aware throughout. Generous radii (`--card-radius`),
hairline borders (`--hairline`, `--hairline-2`), eased motion (`--ease-out`,
`--ease`). Per-project **accent overrides** on case studies (inline
`--accent` + `data-accent`, read by the custom cursor).

---

## 3. Architecture / where things live

- **`src/data/content.ts`** — SINGLE SOURCE OF TRUTH for all copy: `studio`
  (name/email/location), nav links, services, **projects** (+ case-study detail),
  marquee, etc. **Most of your rebrand happens here.**
- `src/styles/` — `tokens.css` (design tokens), `global.css` (reset, reveal
  primitive, `.wrap`/`.section`).
- `src/pages/` — `Home.tsx`, `CaseStudy.tsx` (`/work/:slug`).
- `src/components/sections/` — `Hero`, `Studio` (01, the cursor-following
  hub-and-spoke axis + hover cards `StudioArt`), `Services` (02, cards +
  `ServiceArt` + `ServiceModal`), `Work`/`CaseRow` (03), `Process`, `Footer`,
  `Showreel` + **`ShowreelFilm`** (the bespoke reel), galleries (`ScreenGallery`,
  `WebShowcase`, `BrandGallery`).
- `src/components/` — `Loader` (page-load `tau.` + counter), `RouteTransition`
  (slides right into a project), `CustomCursor`, `StartProjectModal`,
  `nav/` (`Nav`, `Menu`, `FixedControls`).
- `src/hooks/` — `useLenis`, `useReveal` (IntersectionObserver + scroll
  fallback), `useCustomCursor`, `useAmbientPad` (procedural Web-Audio pad for the
  showreel), `usePrefersReducedMotion`.
- `src/context/` — `StartModalContext`, `ServiceModalContext`, `MenuContext`,
  theme.
- `public/work/<slug>/` — case-study imagery (currently ecotrip / reel / teem).
  `public/videos/hero-bg.mp4` — hero background.

---

## 4. What's already built (reuse it)

- **Page loader** → `tau.` mark + 00→100 counter + bar, wipes up.
- **Hero** — blue accent "card", clip-reveal headline, bg video tinted by accent,
  the floating **showreel** tile, a **hand-scribbled note** ("apps, websites &
  brands") that writes itself on, scroll cue.
- **Showreel** (`ShowreelFilm.tsx`) — a bespoke ~28s looping composition built
  from real case-study assets, driven by the **Web Animations API** (one infinite
  animation per element over a shared 28s clock; play/pause toggles all). 3 acts,
  each graded to its project, stitched by the blue-dot wipe; **procedural ambient
  audio** (`useAmbientPad`) that unmutes on hover. Replaced an old YouTube embed.
- **Studio axis** (`Studio.tsx`) — hub-and-spoke that tracks the cursor: the
  nearest **existing spoke + node + label light up**, a pulse runs outward along
  it, and a small **hover card** (mini animated `StudioArt` motif) appears just
  outside the ring on that node's radial angle. The node's own label hides while
  its card is up. Disabled under reduced-motion.
- **Services** — 3 image cards with animated SVG illustrations, open a detail
  **ServiceModal**; CTA preselects that category in the Start-a-project modal.
- **Selected work** — `CaseRow` cards → `/work/:slug` case studies (EcoTrip,
  Reel, Teem) with per-project accent colours, image galleries, and a route
  transition gated on the hero image being decoded.
- **Custom cursor**, **smooth scroll**, **fullscreen menu**, **Start-a-project
  modal**, **Footer** (copy-on-hover email, "coming soon" socials toast).

---

## 5. Rebrand checklist (the actual work)

1. **`src/data/content.ts`** — rewrite `studio` (→ "Lukas Ahlse", your email, your
   location), `services` (→ your skills / what you do), the About/Studio copy,
   marquee, nav labels. **Keep the existing projects** (EcoTrip / Reel / Teem) —
   they ARE Lukas's portfolio pieces, not placeholders. Refine their case-study
   *narratives* (problem → approach → decisions → outcome) rather than replacing
   them. This identity rewrite is the bulk of the work.
2. **Wordmark** `tau` → your name/mark in: `nav/Nav.tsx`, `sections/Footer.tsx`,
   `Loader/Loader.tsx`, `RouteTransition/RouteTransition.tsx`,
   `pages/CaseStudy.tsx`, `sections/ShowreelFilm.tsx` (cold-open + resolve), and
   the `hubCoreText` "tau" in `sections/Studio.tsx`. (Grep for `>tau<` and
   `tau<span`.)
3. **`index.html`** — `<title>` + meta description (recruiters/link-previews read
   these). Optionally rename the `tau-theme` localStorage key.
4. **Accent** — change `--accent` in `tokens.css` if you want your own brand
   colour instead of Tau blue. (It cascades everywhere.)
5. **Showreel** (`ShowreelFilm.tsx` `TRACKS` + `public/work/` assets) — retune the
   3 acts to your projects, or simplify.
6. **Studio axis labels** (`Studio.tsx` `NODES`) — Strategy/Research/UX-UI/Build/
   Brand/Motion → your actual skills.
7. **Hero note** (`Hero.tsx`) — "apps, websites & brands" → your one-liner.
8. **Copy accuracy** — remove Tau-specific lines (e.g. "previously at Sony" in the
   hero sub) unless true for you.

---

## 6. Deploy (free hosting + GitHub)

It's a **client-routed SPA** (`/work/:slug`), so the host must rewrite unknown
paths to `index.html` or deep links 404 on refresh.

- **Recommended — Vercel / Netlify / Cloudflare Pages:** create the GitHub repo,
  connect it in the dashboard, they auto-detect Vite, handle SPA rewrites
  automatically, give a free URL, and redeploy on every push. Near-zero config.
- **GitHub Pages (the literal "free page"):** also works, but needs (a)
  `base: '/<repo>/'` in `vite.config.ts`, (b) a router `basename` to match, and
  (c) an SPA fallback (`cp dist/index.html dist/404.html`), deployed via a GitHub
  Actions workflow. More fiddly. A **custom domain removes the base-path issue**.
- **Custom domain:** you own **lukasahlse.com** — point it at whichever host
  (free custom domains + auto-HTTPS on all of them).

GitHub push (after creating an empty repo):
```bash
git init && git add -A && git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<you>/lukas-portfolio.git
git push -u origin main
```

---

## 7. Honest notes

- The **case studies stay** — EcoTrip / Teem are self-initiated *concept* work
  (already labelled as such) and Reel is a real site. Concept work is legitimate
  portfolio material for UX roles; what matters is the **process narrative**
  (problem → approach → decisions → outcome). Lean the case-study copy into that.
- What MUST change is the **identity wrapper**: studio/agency framing → "Lukas
  Ahlse, UX designer", real bio, real contact, and skills (not agency services).
- "Reel" may be a **customised Framer template** — frame the role accurately
  ("art direction / build on a template", not "designed end-to-end").
- Keep every claim true, and let the *craft of the site itself* be part of the
  pitch.

## 8. Gotchas

- **Reveal animations** (`useReveal`) start at `opacity:0` and add `.is-in` via
  IntersectionObserver (with a scroll fallback). If something's invisible, check
  it got revealed.
- **Lenis**: overlays must `lenis.stop()` + use `data-lenis-prevent` to scroll
  internally. `window.__lenis` is the instance.
- **Showreel WAAPI**: every track needs offset-0 / offset-1 boundary keyframes or
  values bleed from the base — see the `TRACKS` builder comment.
- **Per-project accent**: case studies set `--accent` inline + `data-accent`; the
  cursor reads `data-accent`.
