import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from 'react'
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
import styles from './ReelCase.module.css'

/**
 * The Reel case study, built for Reel alone (route "/work/reel"). A responsive
 * website, so the two interactive pieces are about width: a window you drag
 * from desktop down to phone (with the real site one click away), and the full
 * desktop and phone pages scrolling side by side. Near-monochrome, like the
 * site, with its timber facade as the hero.
 */

const W = '/work/reel'

const FLOW = [
  ['Discover', 'Studio sites side by side: what made the work look better, and what got in its way.'],
  ['Define', 'One idea per screen, two typefaces, and a palette taken from the photographs.'],
  ['Develop', 'Built mobile-up in Framer, so every layout was judged at every width as it was made.'],
  ['Deliver', 'A live, responsive site: home, about, services, projects and contact.'],
] as const

/** Where each section starts in the full-page captures, as a share of the scroll. */
const RAIL: [string, number][] = [
  ['Hero', 0],
  ['About', 0.16],
  ['Services', 0.32],
  ['Projects', 0.58],
  ['Newsletter', 0.82],
  ['Footer', 0.93],
]

export function ReelCase() {
  useLenis()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const project = projects.find((p) => p.id === 'reel') as Project
  const idx = projects.findIndex((p) => p.id === 'reel')
  const next = projects[(idx + 1) % projects.length]
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

  return (
    <>
      <RouteTransition key="reel" accent={project.accent} ready={heroReady} />
      <FixedControls home />
      <LangFixed />
      <Menu />

      <main className={styles.page} id="top">
        {/* ---- Hero: Reel's own facade, the site on a laptop-size window and a phone ---- */}
        <header className={styles.hero} id="hero">
          <div className={styles.heroPhoto} />
          <div className={styles.heroFade} />
          <div className={styles.heroDevices} aria-hidden="true">
            <Browser src={`${W}/d-hero.webp`} />
            <span className={styles.heroPhone}>
              <img src={`${W}/m-hero.webp`} alt="" />
            </span>
          </div>
          <div className={styles.heroCopy}>
            <Reveal as="p" className={styles.eyebrow}>Web · Concept</Reveal>
            <Reveal as="h1" className={styles.title} i={1}>
              Let the buildings
              <br />
              <em>do the talking.</em>
            </Reveal>
            <Reveal as="p" className={styles.lede} i={2}>
              A concept site for a contemporary architecture and interior studio: near-monochrome,
              typographic, and out of the way of the photography. Designed and built in Framer.
            </Reveal>
            <Reveal className={styles.heroRow} i={3}>
              {project.liveUrl && (
                <a className={styles.live} href={project.liveUrl} target="_blank" rel="noreferrer" data-cursor>
                  Visit the live site <i aria-hidden="true">↗</i>
                </a>
              )}
              <span className={styles.credits}>Web design and Framer build · Solo</span>
            </Reveal>
          </div>
        </header>

        {/* ---- Story ---- */}
        <section className={styles.story} aria-label="The story">
          <Reveal>
            <p className={styles.storyLead}>
              Architecture sites tend to fail one of two ways: sterile grids that flatten the work, or
              layouts that fight it.
            </p>
            <p>
              Reel aims for the narrow middle: a quiet, near-monochrome system that frames the
              photography, with one idea per screen.
            </p>
            <p>
              And it has to hold together everywhere, from a wide display down to a phone, because
              that’s where most people first see a studio’s work.
            </p>
          </Reveal>
        </section>

        {/* ---- Process ---- */}
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

        {/* ---- Drag the edge ---- */}
        <section className={styles.section} aria-label="Responsive">
          <Reveal as="h2" className={styles.h2}>Drag the edge.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The site is built to hold its calm at any width. Pull the handle, or pick a size, and watch
            it change from a wide display to a phone.
          </Reveal>
          <Reveal>
            <Resizer liveUrl={project.liveUrl} />
          </Reveal>
        </section>

        {/* ---- The same page, two widths ---- */}
        <section className={styles.section} aria-label="Desktop and phone">
          <Reveal as="h2" className={styles.h2}>The same page, two widths.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Scroll on, and the desktop and phone versions scroll with you, section by section. The
            order and the ideas stay the same; only the arrangement changes.
          </Reveal>
          <TwoWidths />
        </section>

        {/* ---- System ---- */}
        <section className={styles.section} aria-label="Type and colour">
          <Reveal as="h2" className={styles.h2}>Two faces, one quiet palette.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Urbanist, set light and large, does the talking; Inter carries everything you read. The only
            colour on the page comes from the photographs.
          </Reveal>
          <div className={styles.sys}>
            <Reveal className={styles.spec}>
              <span className={styles.label}>Display</span>
              <p className={styles.urb}>
                Vision.
                <br />
                Structure.
                <br />
                <b>Impact.</b>
              </p>
              <div className={styles.role}>
                <b>Urbanist</b>
                <span>Light and large, for headlines only.</span>
              </div>
            </Reveal>
            <Reveal className={styles.spec} i={1}>
              <span className={styles.label}>Text</span>
              <p className={styles.interBody}>
                Every home tells a story. We help you tell yours, through spaces that are considered,
                calm, and built around the way you actually live.
              </p>
              <div className={styles.role}>
                <b>Inter</b>
                <span>Everything you read.</span>
              </div>
            </Reveal>
            <Reveal className={styles.palette} i={2}>
              <span className={`${styles.sw} ${styles.swBlack}`}>Black</span>
              <span className={`${styles.sw} ${styles.swWhite}`}>White</span>
              <span className={`${styles.sw} ${styles.swPhotos}`}>
                <img src={`${W}/card-bg.webp`} alt="" loading="lazy" />
                <img src={`${W}/photo-0.webp`} alt="" loading="lazy" />
                <img src={`${W}/photo-1.webp`} alt="" loading="lazy" />
                <img src={`${W}/photo-2.webp`} alt="" loading="lazy" />
              </span>
            </Reveal>
          </div>
          <div className={styles.facts}>
            {[
              ['Mobile-up', 'Built from the phone outwards, then given room at Framer’s tablet and desktop sizes.'],
              ['No hand-off', 'Designed and built in the same tool, so the live site is the design.'],
              ['One idea per screen', 'Vision, studio, services, work: each gets its own moment.'],
            ].map(([t, d], i) => (
              <Reveal key={t} i={i}>
                <b>{t}</b>
                {d}
              </Reveal>
            ))}
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

function Browser({ src, alt = '' }: { src: string; alt?: string }) {
  return (
    <div className={styles.browser}>
      <div className={styles.chrome} aria-hidden="true">
        <i />
        <i />
        <i />
        <span>reeldesign</span>
      </div>
      <img src={src} alt={alt} />
    </div>
  )
}

/** A window you drag (or set) from desktop width down to a phone. It shows a
 *  picture of the page until asked; the live Framer site only loads on click,
 *  since Framer's page runs Framer's own analytics. */
function Resizer({ liveUrl }: { liveUrl?: string }) {
  const MIN = 360
  const MAX = 1100
  const stageRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(MAX)
  const [max, setMax] = useState(MAX)
  const [dragging, setDragging] = useState(false)
  const [live, setLive] = useState(false)
  const drag = useRef<{ x: number; w: number } | null>(null)

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const measure = () => setMax(Math.max(MIN, Math.min(MAX, el.clientWidth - 44)))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const w = Math.round(Math.max(MIN, Math.min(max, width)))
  const size = w >= 1000 ? 'Desktop' : w >= 700 ? 'Tablet' : 'Phone'
  const presets: [string, number][] = [['Desktop', MAX], ['Tablet', 810], ['Phone', 390]]

  const onDown = (e: RPointerEvent<HTMLSpanElement>) => {
    drag.current = { x: e.clientX, w }
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }
  // the window is centred, so the edge moves half as far as the width changes
  const onMove = (e: RPointerEvent<HTMLSpanElement>) => {
    if (drag.current) setWidth(drag.current.w + (e.clientX - drag.current.x) * 2)
  }
  const onUp = () => {
    drag.current = null
    setDragging(false)
  }

  return (
    <div className={styles.resize}>
      <div className={styles.rbar}>
        <p className={styles.readout} aria-live="polite">
          <b>{w}px</b>
          <span>{size}</span>
        </p>
        <div className={styles.presets} role="group" aria-label="Window size">
          {presets.map(([n, pw]) => (
            <button key={n} type="button" aria-pressed={size === n} onClick={() => setWidth(pw)} data-cursor>
              {n}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.rstage} ref={stageRef}>
        <div className={`${styles.rwin} ${dragging ? styles.rwinDragging : ''}`} style={{ width: w }}>
          <div className={styles.chrome} aria-hidden="true">
            <i />
            <i />
            <i />
            <span>reeldesign</span>
          </div>
          <div className={`${styles.rview} ${size === 'Phone' ? styles.isPhone : ''}`}>
            {live && liveUrl ? (
              <iframe src={liveUrl} title="The live Reel site" />
            ) : (
              <>
                <img className={styles.rDesk} src={`${W}/d-hero.webp`} alt="The Reel site at desktop width" loading="lazy" />
                <img className={styles.rPhone} src={`${W}/m-hero.webp`} alt="The Reel site at phone width" loading="lazy" />
              </>
            )}
          </div>
          <span
            className={styles.handle}
            role="slider"
            tabIndex={0}
            aria-label="Window width"
            aria-valuemin={MIN}
            aria-valuemax={max}
            aria-valuenow={w}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setWidth(w - 40)
              if (e.key === 'ArrowRight') setWidth(w + 40)
            }}
            data-cursor
          />
        </div>
        {!live && liveUrl && (
          <div className={styles.loadLive}>
            <button type="button" onClick={() => setLive(true)} data-cursor>
              Load the live site <span aria-hidden="true">↗</span>
            </button>
            <small>Opens the real page from Framer, which runs Framer’s own analytics.</small>
          </div>
        )}
      </div>
      <p className={styles.rnote}>Until you load it, this is a picture of the page. Loaded, it’s the real site, scrolling and all.</p>
    </div>
  )
}

/** The full desktop and phone pages, scrolled together by the page scroll. */
function TwoWidths() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const deskRef = useRef<HTMLImageElement>(null)
  const phoneRef = useRef<HTMLImageElement>(null)
  const [on, setOn] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const wrap = wrapRef.current
      if (!wrap) return
      const r = wrap.getBoundingClientRect()
      const total = wrap.offsetHeight - window.innerHeight
      const t = total > 0 ? Math.max(0, Math.min(1, -r.top / total)) : 0
      for (const img of [deskRef.current, phoneRef.current]) {
        if (!img?.parentElement) continue
        const travel = Math.max(0, img.offsetHeight - img.parentElement.clientHeight)
        img.style.transform = `translate3d(0, ${-t * travel}px, 0)`
      }
      let i = 0
      RAIL.forEach(([, at], k) => {
        if (t >= at) i = k
      })
      setOn((prev) => (prev === i ? prev : i))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className={styles.sync} ref={wrapRef}>
      <div className={styles.syncSticky}>
        <ul className={styles.rail} aria-label="Sections">
          {RAIL.map(([name], i) => (
            <li key={name} className={i === on ? styles.railOn : ''}>
              {name}
            </li>
          ))}
        </ul>
        <div className={styles.dwin}>
          <div className={styles.chrome} aria-hidden="true">
            <i />
            <i />
            <i />
            <span>reeldesign</span>
          </div>
          <div className={styles.view}>
            <img ref={deskRef} src={`${W}/d-full-hero.webp`} alt="The whole Reel page at desktop width" loading="lazy" />
          </div>
        </div>
        <div className={styles.pwin}>
          <div className={styles.view}>
            <img ref={phoneRef} src={`${W}/m-full.webp`} alt="The whole Reel page at phone width" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  )
}
