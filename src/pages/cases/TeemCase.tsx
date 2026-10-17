import { useEffect, useLayoutEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { projects, preloadCover, type Project } from '../../data/content'
import { useLenis } from '../../hooks/useLenis'
import { FixedControls } from '../../components/nav/FixedControls'
import { LangFixed } from '../../components/nav/LangFixed'
import { Menu } from '../../components/nav/Menu'
import { Footer } from '../../components/sections/Footer'
import { RouteTransition } from '../../components/RouteTransition/RouteTransition'
import { ProjectChat } from '../../components/ProjectChat/ProjectChat'
import { Reveal } from '../../components/ui/Reveal'
import styles from './TeemCase.module.css'

/**
 * The Teem case study, built for Teem alone (route "/work/teem"). A brand, not
 * an app, so the printed leaflet stands in for the phones in the hero, and the
 * two interactive pieces are the can taken apart and the palette drawn as the
 * landscape it comes from. Colours are Teem's own: matcha and pine on latte.
 */

const W = '/work/teem'

/** Discover → Deliver, kept to a line each: a small brand, a short process. */
const FLOW = [
  ['Discover', 'The matcha shelf: most brands lean on one move, paint it green and call it zen.'],
  ['Define', 'A brief for myself: honour the tea, belong in a café fridge, stay calm and tactile.'],
  ['Develop', 'A shortlist of names, a brushstroke mark, and a label redrawn for the curve.'],
  ['Deliver', 'The wordmark, the can and a four-page leaflet, mocked up as finished pieces.'],
] as const

/** The can, part by part: three from the tea house, three from the café. */
const PARTS = [
  { n: 1, side: 'tea', name: 'The mark', line: 'A stroke of whisked matcha, with the name written on it by hand.', x: 49.3, y: 26.7 },
  { n: 2, side: 'tea', name: '抹茶', line: 'The kanji for matcha, set small and white, almost like a seal.', x: 49.3, y: 52 },
  { n: 3, side: 'tea', name: 'The landscape', line: 'Jade hills and a white river: the shape of tea country.', x: 47.8, y: 77 },
  { n: 4, side: 'cafe', name: 'Cold Brew Matcha Latte', line: 'A plain serif that says what’s inside, the way a café menu does.', x: 49.3, y: 44 },
  { n: 5, side: 'cafe', name: 'The latte band', line: 'A warm cream fade behind the type: the milk in the latte.', x: 60.5, y: 58 },
  { n: 6, side: 'cafe', name: 'The can itself', line: 'Tall and cold, made for the fridge and the walk out the door.', x: 49.3, y: 13 },
] as const

/** The palette, as the places in the picture it paints. */
const SWATCHES = [
  { k: 'latte', name: 'Latte', hex: '#EFE7C4', role: 'The sky · surfaces' },
  { k: 'sage', name: 'Sage', hex: '#A9C79C', role: 'Far hills · calm' },
  { k: 'lime', name: 'Lime', hex: '#8AB84A', role: 'Middle hills · highlights' },
  { k: 'matcha', name: 'Matcha', hex: '#3F8A3C', role: 'Near hills · the mark' },
  { k: 'pine', name: 'Pine', hex: '#2E6B4F', role: 'Foreground · type' },
  { k: 'peri', name: 'Periwinkle', hex: '#5D6BB0', role: 'The river · one accent' },
] as const
type SwatchKey = (typeof SWATCHES)[number]['k']

export function TeemCase() {
  useLenis()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const project = projects.find((p) => p.id === 'teem') as Project
  const idx = projects.findIndex((p) => p.id === 'teem')
  const next = projects[(idx + 1) % projects.length]
  // only a photo backdrop reads under the title; anything else falls back to the pine panel
  const nextBg = next.card?.bg

  const [heroReady, setHeroReady] = useState(false)
  useEffect(() => {
    let done = false
    const ready = () => {
      if (!done) {
        done = true
        setHeroReady(true)
      }
    }
    const img = new Image()
    img.src = `${W}/card-bg.webp`
    img.decode().then(ready, ready)
    const safety = window.setTimeout(ready, 2500)
    return () => window.clearTimeout(safety)
  }, [])

  const [part, setPart] = useState<number | null>(null)
  const [grid, setGrid] = useState(false)
  const active = PARTS.find((p) => p.n === part)
  // Hover on a pointer, tap to toggle on touch.
  const partProps = (n: number) => ({
    onMouseEnter: () => setPart(n),
    onFocus: () => setPart(n),
    onClick: () => setPart((c) => (c === n ? null : n)),
    'data-on': part === n || undefined,
  })

  return (
    <>
      <RouteTransition key="teem" accent={project.accent} ready={heroReady} />
      <FixedControls home />
      <LangFixed />
      <Menu />

      <main className={styles.page} id="top">
        {/* ---- Hero: the tea rows, and the leaflet's two covers where the other cases put phones ---- */}
        <header className={styles.hero} id="hero">
          <div className={styles.heroPhoto} />
          <div className={styles.heroFade} />
          <div className={styles.heroPrints} aria-hidden="true">
            <img src={`${W}/leaflet-cover.webp`} alt="" />
            <img src={`${W}/leaflet-back.webp`} alt="" />
          </div>
          <div className={styles.heroCopy}>
            <Reveal as="p" className={styles.eyebrow}>Brand · Concept</Reveal>
            <Reveal as="h1" className={styles.title} i={1}>
              Teeming
              <br />
              with <em>matcha.</em>
            </Reveal>
            <Reveal as="p" className={styles.lede} i={2}>
              A brand for a cold-brew matcha latte: the name, the mark, the can and a printed
              leaflet, made to feel calm and tactile.
            </Reveal>
            {/* phones get one short line instead */}
            <Reveal as="p" className={styles.ledeShort} i={2}>
              A cold-brew matcha brand: the name, the mark, the can and a leaflet.
            </Reveal>
            <Reveal as="p" className={styles.credits} i={3}>
              Brand, packaging and print · Solo
            </Reveal>
          </div>
        </header>

        {/* ---- Story ---- */}
        <section className={styles.story} aria-label="The story">
          <Reveal>
            <p className={styles.storyLead}>
              A cold-brew matcha latte sits between two cultures: the care of Japanese tea, and the
              grab-and-go of a café fridge.
            </p>
            <p>
              Teem is a brand I set myself for it. The brief was to honour matcha’s roots without the
              usual all-green shorthand, and to make something calm and tactile: a break from screens.
            </p>
            <p>Four pieces came out of it: a name, a mark, a can, and a four-page leaflet.</p>
          </Reveal>
        </section>

        {/* ---- How it came together: the site's four steps, one line each ---- */}
        <section className={styles.section} aria-label="Process">
          <ol className={styles.flow}>
            {FLOW.map(([name, line], i) => (
              <Reveal as="li" className={styles.flowStep} key={name} i={i}>
                <span className={styles.flowNo}>0{i + 1}</span>
                <b>{name}</b>
                <span>{line}</span>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ---- The can, part by part ---- */}
        <section className={styles.section} aria-label="The can">
          <Reveal as="h2" className={styles.h2}>Half tea house, half café.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Every part of the can comes from one side of that line or the other. Hover or tap a part, on
            the can or in the lists.
          </Reveal>
          <Reveal className={`${styles.anatomy} ${part ? styles.hovering : ''}`} onMouseLeave={() => setPart(null)}>
            {(['tea', 'cafe'] as const).map((side) => (
              <div key={side} className={`${styles.side} ${side === 'cafe' ? styles.cafe : ''}`}>
                <span className={styles.label}>{side === 'tea' ? 'From the tea house' : 'From the café'}</span>
                {PARTS.filter((p) => p.side === side).map((p) => (
                  <button key={p.n} type="button" className={styles.part} {...partProps(p.n)} data-cursor>
                    <i aria-hidden="true">{p.n}</i>
                    <b>{p.name}</b>
                    <span>{p.line}</span>
                  </button>
                ))}
              </div>
            ))}
            <div className={styles.canStage}>
              <img src={`${W}/packaging.webp`} alt="The Teem can, front view" />
              {PARTS.map((p) => (
                <span
                  key={p.n}
                  className={`${styles.dot} ${p.side === 'cafe' ? styles.dotCafe : ''}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  aria-hidden="true"
                  {...partProps(p.n)}
                >
                  {p.n}
                </span>
              ))}
              <p className={`${styles.callout} ${active ? styles.calloutOn : ''}`} aria-live="polite">
                {active && (
                  <>
                    <b>
                      {active.side === 'tea' ? 'Tea house' : 'Café'} · {active.name}
                    </b>
                    {active.line}
                  </>
                )}
              </p>
            </div>
          </Reveal>
        </section>

        {/* ---- Naming ---- */}
        <section className={styles.section} aria-label="Naming">
          <Reveal className={styles.naming}>
            <div>
              <span className={styles.namingLabel}>Naming · the shortlist</span>
              <ul className={styles.names}>
                <li>matcha co</li>
                <li>zenleaf</li>
                <li>kiln</li>
                <li className={styles.win}>teem.</li>
              </ul>
            </div>
            <div className={styles.def}>
              <small>teem · verb</small>
              <p>To be full of something; to be swarming with it.</p>
              <p>
                Abundance and easy energy, in four letters that fit on the front of a can. The line
                almost writes itself: teeming with matcha.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ---- The mark ---- */}
        <section className={styles.section} aria-label="The mark">
          <Reveal as="h2" className={styles.h2}>One stroke, one word.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The mark is a swatch of matcha with the name written on it by hand. It works as a label as
            much as a logo, which is exactly how it sits on the can.
          </Reveal>
          <Reveal className={styles.equation}>
            <figure className={styles.eq}>
              <img src={`${W}/logo-stroke.webp`} alt="A green matcha brushstroke" />
              <figcaption>01 · The stroke</figcaption>
            </figure>
            <span className={styles.op} aria-hidden="true">+</span>
            <figure className={styles.eq}>
              <img src={`${W}/logo-name.webp`} alt="The word teem, hand-drawn" />
              <figcaption>02 · The name</figcaption>
            </figure>
            <span className={styles.op} aria-hidden="true">=</span>
            <figure className={`${styles.eq} ${styles.eqFinal}`}>
              <img src={`${W}/logo-mark.webp`} alt="The Teem mark: the word on the stroke" />
              <figcaption>03 · The mark</figcaption>
            </figure>
          </Reveal>
          <div className={styles.markRow}>
            <Reveal className={styles.markBig} role="img" aria-label="The Teem mark on a green gradient">{null}</Reveal>
            <Reveal className={styles.why} i={1}>
              <span className={styles.label}>Why a brushstroke</span>
              <b>It’s the product, before it’s a logo.</b>
              <p>
                A stroke of whisked matcha says what’s in the can without a single leaf or circle. The
                hand-drawn word keeps it friendly rather than ceremonial.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---- Drawn for the curve ---- */}
        <section className={styles.section} aria-label="The label">
          <Reveal as="h2" className={styles.h2}>Drawn for the curve, not the flat.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            A flat layout looks finished on screen and falls apart on a can, where you only ever see the
            middle. So the label was redrawn for the round: the name and the kanji stack in the narrow
            front, and the river runs straight down it.
          </Reveal>
          <Reveal className={styles.curve}>
            <figure>
              <img src={`${W}/label-flat.webp`} alt="The flat label artwork" />
              <figcaption>Flat</figcaption>
            </figure>
            <span className={styles.curveArrow} aria-hidden="true">→</span>
            <figure>
              <img src={`${W}/label-can.webp`} alt="The label redrawn for the can" />
              <figcaption>On the can</figcaption>
            </figure>
          </Reveal>
        </section>

        {/* ---- The palette is the landscape ---- */}
        <section className={styles.section} aria-label="Palette">
          <Reveal as="h2" className={styles.h2}>The palette is the landscape.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Six colours, and every one of them is a place in the picture. Hover a hill or a swatch.
          </Reveal>
          <Landscape />
        </section>

        {/* ---- The leaflet ---- */}
        <section className={styles.section} aria-label="Leaflet">
          <Reveal as="h2" className={styles.h2}>Four pages, two columns.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The printed piece is where the brand slows down: a cover, a back, and one spread set on a
            quiet two-column grid in Georgia.
          </Reveal>
          <Reveal className={styles.print}>
            <img src={`${W}/leaflet-cover.webp`} alt="Leaflet front cover" loading="lazy" />
            <img src={`${W}/leaflet-back.webp`} alt="Leaflet back cover" loading="lazy" />
          </Reveal>
          <Reveal className={styles.spread} data-grid={grid ? 'on' : 'off'}>
            <img src={`${W}/leaflet-spread.webp`} alt="The leaflet's interior spread" loading="lazy" />
            {/* The four text columns and the fold, measured off the spread. */}
            <div className={styles.grid} aria-hidden="true">
              <i style={{ left: '4.1%', width: '19.1%' }} />
              <i style={{ left: '26.4%', width: '19.6%' }} />
              <i style={{ left: '54.5%', width: '19.5%' }} />
              <i style={{ left: '76.7%', width: '19.3%' }} />
              <i className={styles.fold} />
            </div>
          </Reveal>
          <div className={styles.spreadBar}>
            <p>Interior spread: Perfect Match(a) and Matcha &amp; chill.</p>
            <button type="button" className={styles.toggle} aria-pressed={grid} onClick={() => setGrid((g) => !g)} data-cursor>
              <i aria-hidden="true">#</i>
              {grid ? 'Hide the grid' : 'Show the grid'}
            </button>
          </div>
        </section>

        {/* ---- Type ---- */}
        <section className={styles.section} aria-label="Type">
          <Reveal as="h2" className={styles.h2}>A hand, and a page.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Two voices, kept apart: the hand-drawn word only ever appears as the mark, and everything
            you read is Georgia, for the calm of print.
          </Reveal>
          <div className={styles.type}>
            <Reveal className={`${styles.spec} ${styles.specHand}`}>
              <span className={styles.label}>Display</span>
              <img src={`${W}/logo-name.webp`} alt="The hand-drawn teem wordmark" />
              <div className={styles.role}>
                <b>Chalkduster</b>
                <span>Hand-drawn. The wordmark, nothing else.</span>
              </div>
            </Reveal>
            <Reveal className={`${styles.spec} ${styles.specPrint}`} i={1}>
              <span className={styles.label}>Text</span>
              <div>
                <p className={styles.specBig}>Cold Brew Matcha Latte</p>
                <p className={styles.specMid}>Teem with matcha latte zenergy</p>
              </div>
              <p className={styles.kanji}>抹茶</p>
              <div className={styles.role}>
                <b>Georgia</b>
                <span>Headings and body, on the can and in print.</span>
              </div>
            </Reveal>
          </div>
        </section>

        {project.reflection && (
          <section className={styles.section} aria-label="Reflection">
            <Reveal as="h2" className={styles.h2}>Looking back.</Reveal>
            <div className={styles.reflection}>
              {project.reflection.map((r, i) => (
                <Reveal className={styles.reflectionItem} key={r.heading} i={i}>
                  <h3>{r.heading}</h3>
                  <p>{r.body}</p>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ---- Next ---- */}
        <section className={styles.nextWrap}>
          <Link
            to={`/work/${next.id}`}
            className={styles.next}
            style={{ '--next-bg': nextBg ? `url('${nextBg}')` : 'none' } as CSSProperties}
            data-cursor
            onPointerEnter={() => preloadCover(next)}
            onFocus={() => preloadCover(next)}
          >
            <span className={styles.nextLabel}>Next project</span>
            <span className={styles.nextName}>
              {next.name} <span aria-hidden="true">→</span>
            </span>
          </Link>
          <div className={styles.exits}>
            <Link to="/work" data-cursor>All projects</Link>
            <Link to="/" data-cursor>Home</Link>
          </div>
        </section>
      </main>

      <Footer />
      <ProjectChat project={project} />
    </>
  )
}

/** The cover's hills, redrawn in code: one layer per colour. Hover a hill or a
 *  swatch and that layer lifts while the rest dim. */
function Landscape() {
  const [on, setOn] = useState<SwatchKey | null>(null)
  const [tip, setTip] = useState({ x: 0, y: 0 })
  const sw = SWATCHES.find((s) => s.k === on)
  const layer = (k: SwatchKey) => ({
    className: `${styles.layer} ${on === k ? styles.layerOn : ''}`,
    onMouseMove: (e: React.MouseEvent<SVGElement>) => {
      const r = (e.currentTarget.ownerSVGElement ?? (e.currentTarget as unknown as SVGSVGElement)).getBoundingClientRect()
      setTip({ x: Math.min(Math.max(12, e.clientX - r.left + 14), r.width - 230), y: Math.max(12, e.clientY - r.top - 70) })
      setOn(k)
    },
  })
  return (
    <>
      <Reveal className={`${styles.land} ${on ? styles.landHovering : ''}`} onMouseLeave={() => setOn(null)}>
        <svg viewBox="0 0 1200 520" role="img" aria-label="A landscape of layered hills, each layer one colour of the Teem palette">
          <rect {...layer('latte')} width="1200" height="520" fill="#efe7c4" />
          <path {...layer('sage')} fill="#a9c79c" d="M0 290 C150 220 260 250 380 205 C500 160 610 240 730 196 C850 152 990 214 1200 170 L1200 520 L0 520Z" />
          <path {...layer('lime')} fill="#8ab84a" d="M0 340 C120 300 200 250 300 268 C380 282 420 226 470 196 C520 166 566 262 646 302 C766 352 910 280 1200 318 L1200 520 L0 520Z" />
          <g {...layer('matcha')} fill="#3f8a3c">
            <path d="M0 398 C140 356 238 296 340 326 C440 356 520 430 610 520 L0 520Z" />
            <path d="M590 520 C680 430 830 256 928 246 C1010 240 1064 330 1200 300 L1200 520Z" />
          </g>
          <g {...layer('pine')} fill="#2e6b4f">
            <path d="M0 520 L0 446 C100 424 222 402 334 432 C424 456 478 484 566 520Z" />
            <path d="M632 520 C716 474 820 404 942 384 C1062 364 1140 424 1200 412 L1200 520Z" />
          </g>
          <g {...layer('peri')}>
            <path fill="#5d6bb0" d="M586 292 C616 330 544 352 572 386 C604 420 532 446 552 484 L540 520 L676 520 C648 476 680 444 654 412 C626 380 664 348 622 316 Z" />
            <path fill="#ffffff" d="M594 296 C618 330 556 352 584 386 C614 418 552 446 570 482 L562 520 L654 520 C630 476 662 444 640 412 C612 380 650 350 612 318 Z" />
          </g>
        </svg>
        <div className={`${styles.tip} ${sw ? styles.tipOn : ''}`} style={{ left: tip.x, top: tip.y }} aria-hidden="true">
          {sw && (
            <>
              <b>
                {sw.name} {sw.hex}
              </b>
              <span>{sw.role}</span>
            </>
          )}
        </div>
      </Reveal>
      <div className={styles.legend}>
        {SWATCHES.map((s) => (
          <button
            key={s.k}
            type="button"
            className={`${styles.chip} ${on === s.k ? styles.chipOn : ''}`}
            onMouseEnter={() => {
              setTip({ x: 24, y: 24 })
              setOn(s.k)
            }}
            onMouseLeave={() => setOn(null)}
            onFocus={() => {
              setTip({ x: 24, y: 24 })
              setOn(s.k)
            }}
            onBlur={() => setOn(null)}
            data-cursor
          >
            <i style={{ background: s.hex }} aria-hidden="true" />
            <span>
              <b>{s.name}</b>
              {s.hex} · {s.role.split(' · ')[0]}
            </span>
          </button>
        ))}
      </div>
    </>
  )
}
