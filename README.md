# Tau Studio — Homepage

The Tau Studio homepage, rebuilt from the hi-fi HTML/CSS design reference into a
clean **Vite + React + TypeScript** app. It locks the visual language (tokens,
type scale, motion vocabulary) so the rest of the site can be built on it later.

## Stack

- **Vite + React 18 + TypeScript**
- **CSS Modules** over a shared CSS-variable token system (`src/styles/tokens.css`)
- **Lenis** for production smooth scroll (`src/hooks/useLenis.ts`)
- Bespoke, hand-rolled motion (no animation library) — faithful to the reference

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck + production build
npm run preview  # preview the build
```

## Structure

```
src/
  styles/      tokens.css (the design system) + global.css (helpers, reveal primitive)
  data/        content.ts — all copy + services/work/process as typed, CMS-ready data
  hooks/       reveal · lenis · nav theme-flip · custom cursor · reduced-motion
  context/     MenuContext (menuOpen + scroll lock) · LangContext (EN/SV)
  components/
    Loader/ CustomCursor/
    nav/        Nav · FixedControls · Hamburger · Menu
    ui/         Button · LinkLike · LangToggle · Marker · Reveal · LineMask · Icons
    sections/   Hero · Marquee · Studio · Services · Work · Credibility · Process · Closing · Footer
```

## Motion

Page-load counter + wipe, IntersectionObserver scroll reveals (with `--i`
stagger), headline clip-reveals, seamless marquee, lerp-following custom cursor
(fine-pointer only), the fullscreen morphing menu, nav theme-flip, and hero
parallax. Everything degrades gracefully under `prefers-reduced-motion`.

## Production notes / TODO

- **Imagery is placeholder.** Service cards point at abstract SVGs in
  `public/images/`; work tiles use abstract CSS fills. Wire `services[].image`
  and `projects[].image` in `src/data/content.ts` to real assets / a CMS.
- **Sony** is referenced in copy only — no logo, not implied as a client.
- **Language** toggle is visual only; copy ships in EN, SV translations are TBD.
  `LangContext` is the place to hook up i18n.
- Credibility badges (Dribbble, Awwwards) are placeholders — wire to real
  profiles or remove.
