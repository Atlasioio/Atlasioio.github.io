import { Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
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
import styles from './JobquestCase.module.css'

/**
 * The Jobquest case study, built for Jobquest alone (route "/work/jobquest").
 * A desktop web app, so a browser window stands in for the phones in the hero.
 * The two interactive pieces are the app's own ideas redrawn in code: one set
 * of applications moving between board, grid and map, and two offers weighed
 * against a target. Colours are the app's: lime on deep green, stage colours
 * straight from its stylesheet.
 */

const W = '/work/jobquest'

const FLOW = [
  ['Discover', 'Spreadsheets, notes and inboxes: where a job search really lives, and where it falls apart.'],
  ['Define', 'Three questions, three views, and a status you can read at a glance.'],
  ['Develop', 'Designed in the browser and built in the same loop, from idea to clickable in hours.'],
  ['Deliver', 'A working app: board, grid and map, a dashboard, offers, and documents per application.'],
] as const

type Stage = 'saved' | 'draft' | 'applied' | 'interview' | 'take' | 'offer' | 'accepted' | 'rejected'
const STAGES: { k: Stage; name: string; icon: string; why: string }[] = [
  { k: 'saved', name: 'Saved', icon: '☆', why: 'A muted lilac: interesting, but nothing has happened yet.' },
  { k: 'draft', name: 'Drafting', icon: '✎', why: 'A neutral sand, close to the paper: work in progress, no one is waiting on it.' },
  { k: 'applied', name: 'Applied', icon: '↗', why: 'A calm blue: it’s out there, and the ball is in their court.' },
  { k: 'interview', name: 'Interview', icon: '☏', why: 'Gold: something is happening, and it needs you.' },
  { k: 'take', name: 'Take-home', icon: '✂', why: 'Moved from peach into amber, so it reads as part of the interview family, not as a warning.' },
  { k: 'offer', name: 'Offer', icon: '★', why: 'The most saturated green on the board, because this is the one to act on.' },
  { k: 'accepted', name: 'Accepted', icon: '✓', why: 'A calmer sage green: done, so it doesn’t compete with an open offer.' },
  { k: 'rejected', name: 'Rejected', icon: '×', why: 'Toned down from a warning pink to a dusty mauve: closed, not alarming.' },
]

type View = 'board' | 'grid' | 'map'
type City = 'sthlm' | 'gbg' | 'malmo' | 'remote'
const JOBS: { co: string; role: string; st: Stage; city: City; mark: string; c: string; ink?: string }[] = [
  { co: 'Storytel', role: 'Senior Designer', st: 'saved', city: 'remote', mark: 'S', c: '#ff5c28' },
  { co: 'Vercel', role: 'Senior Product Designer', st: 'saved', city: 'remote', mark: '▲', c: '#111111' },
  { co: 'Volvo Cars', role: 'Lead Product Designer', st: 'applied', city: 'gbg', mark: 'V', c: '#1b365d' },
  { co: 'IKEA', role: 'Senior UX Designer', st: 'applied', city: 'malmo', mark: 'I', c: '#0058a3' },
  { co: 'Linear', role: 'Design Engineer', st: 'applied', city: 'remote', mark: 'L', c: '#5e6ad2' },
  { co: 'Mentimeter', role: 'Senior Designer', st: 'interview', city: 'sthlm', mark: 'M', c: '#2e5bff' },
  { co: 'Tink', role: 'Product Designer', st: 'take', city: 'sthlm', mark: 'T', c: '#0a1f44' },
  { co: 'Klarna', role: 'Senior Product Designer', st: 'offer', city: 'sthlm', mark: 'K', c: '#e9a5c0', ink: '#1a1715' },
  { co: 'Spotify', role: 'Senior UX Designer', st: 'offer', city: 'sthlm', mark: 'S', c: '#1db954' },
]
const CITIES: Record<City, [string, number, number]> = {
  sthlm: ['Stockholm', 0.66, 0.36],
  gbg: ['Gothenburg', 0.33, 0.6],
  malmo: ['Malmö', 0.4, 0.84],
  remote: ['Remote · EU', 0.86, 0.72],
}
const COLUMNS: [Stage, string][] = [['saved', 'Saved'], ['applied', 'Applied'], ['interview', 'Interviewing'], ['offer', 'Offer']]
const QUESTION: Record<View, string> = { board: '“What’s in flight?”', grid: '“Where is everything?”', map: '“What’s nearby?”' }
const stageName = (k: Stage) => STAGES.find((s) => s.k === k)!.name

export function JobquestCase() {
  useLenis()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const project = projects.find((p) => p.id === 'jobquest') as Project
  const idx = projects.findIndex((p) => p.id === 'jobquest')
  const next = projects[(idx + 1) % projects.length]
  // only a photo backdrop reads under the title; anything else falls back to the panel colour
  const nextBg = next.card?.bg ?? (['teem', 'jobquest'].includes(next.id) ? `/work/${next.id}/card-bg.webp` : undefined)

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

  const [stage, setStage] = useState<Stage>('take')
  const active = STAGES.find((s) => s.k === stage)!

  return (
    <>
      <RouteTransition key="jobquest" accent={project.accent} ready={heroReady} />
      <FixedControls home />
      <LangFixed />
      <Menu />

      <main className={styles.page} id="top">
        {/* ---- Hero: the sticky-note wall, and the app in a browser window ---- */}
        <header className={styles.hero} id="hero">
          <div className={styles.heroPhoto} />
          <div className={styles.heroFade} />
          <div className={styles.heroApp} aria-hidden="true">
            <Browser src={`${W}/app-board.webp`} />
          </div>
          <div className={styles.heroCopy}>
            <Reveal as="p" className={styles.eyebrow}>Web app · Shipped</Reveal>
            <Reveal as="h1" className={styles.title} i={1}>
              The job hunt,
              <br />
              without the <em>spreadsheet.</em>
            </Reveal>
            <Reveal as="p" className={styles.lede} i={2}>
              A job-search tracker that shows where every application stands, on a board, a grid or a
              map, with the CV, cover letter and offer for each one in the same place.
            </Reveal>
            {/* phones get one short line instead */}
            <Reveal as="p" className={styles.ledeShort} i={2}>
              Every application, offer and CV in one place: on a board, a grid or a map.
            </Reveal>
            <Reveal as="p" className={styles.credits} i={3}>
              Product design and build · React, TypeScript
            </Reveal>
          </div>
        </header>

        {/* ---- Story ---- */}
        <section className={styles.story} aria-label="The story">
          <Reveal>
            <p className={styles.storyLead}>A job search is a pipeline. A spreadsheet flattens it into rows.</p>
            <p>
              Every application moves through stages, has a next step, a tailored CV and cover letter,
              and maybe an offer to weigh. In a spreadsheet, all of that is just another column to read.
            </p>
            <p>
              Jobquest keeps it in one place and answers the three questions people actually ask: what’s
              in flight, where is everything, and what’s nearby.
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

        {/* ---- One search, three questions ---- */}
        <section className={styles.section} aria-label="Three views">
          <Reveal as="h2" className={styles.h2}>One search, three questions.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The same applications, three ways. Switch the view and watch them move: the board for what’s
            in flight, the grid for everything at once, the map for what’s nearby.
          </Reveal>
          <Reveal>
            <Views />
          </Reveal>
        </section>

        {/* ---- Status ---- */}
        <section className={styles.section} aria-label="Status">
          <Reveal as="h2" className={styles.h2}>Status you can read without reading.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Eight stages, each with a colour, an icon and its name, so it never rests on colour alone.
            The colours were tuned so the eye lands where it should. Hover or tap a stage.
          </Reveal>
          <Reveal className={styles.pipe}>
            {STAGES.map((s, i) => (
              <button
                key={s.k}
                type="button"
                className={`${styles.stp} ${stage === s.k ? styles.stpOn : ''}`}
                style={{ '--c': `var(--st-${s.k})`, '--c-bg': `var(--st-${s.k}-bg)` } as CSSProperties}
                onMouseEnter={() => setStage(s.k)}
                onFocus={() => setStage(s.k)}
                onClick={() => setStage(s.k)}
                aria-pressed={stage === s.k}
                data-cursor
              >
                <span className={styles.stpIcon} aria-hidden="true">{s.icon}</span>
                <b>{s.name}</b>
                <small>0{i + 1}</small>
              </button>
            ))}
          </Reveal>
          <p className={styles.why} style={{ '--c': `var(--st-${stage})` } as CSSProperties} aria-live="polite">
            <span className={styles.whySwatch} aria-hidden="true" />
            <span>
              <b>{active.name}.</b> {active.why}
            </span>
          </p>
        </section>

        {/* ---- The morning glance ---- */}
        <section className={styles.section} aria-label="Dashboard">
          <Reveal as="h2" className={styles.h2}>The morning glance.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Home is a dashboard for the first five minutes of the day: what moved, what needs a nudge,
            and how the week is going.
          </Reveal>
          <Reveal className={styles.glance}>
            <Browser src={`${W}/app-home.webp`} alt="The Jobquest home dashboard" />
          </Reveal>
          <div className={styles.marks}>
            {[
              ['Needs your attention', 'Offers to decide on, take-homes due, and applications that have gone quiet.'],
              ['Pace and pipeline', 'How many went out, how far they got, and where the funnel narrows.'],
              ['A daily rhythm', 'Small goals and a streak, so a slow week still has something to show for it.'],
            ].map(([t, d], i) => (
              <Reveal key={t} i={i}>
                <b>{t}</b>
                {d}
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---- Deciding on an offer ---- */}
        <section className={styles.section} aria-label="Offers">
          <Reveal as="h2" className={styles.h2}>Deciding on an offer.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            When two offers land in the same week, the numbers sit side by side, against the number you
            were hoping for. Move your target.
          </Reveal>
          <div className={styles.offers}>
            <Reveal>
              <Offers />
            </Reveal>
            <Reveal className={styles.shot} i={1}>
              <img src={`${W}/app-compare.webp`} alt="Comparing two offers in the app" loading="lazy" />
            </Reveal>
          </div>
        </section>

        {/* ---- Built so nothing gets lost ---- */}
        <section className={styles.section} aria-label="Data safety">
          <Reveal as="h2" className={styles.h2}>Built so nothing gets lost.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            A job search is months of notes, dates and documents. Losing it would be worse than never
            having it, so the app is careful with every save.
          </Reveal>
          <div className={styles.safe}>
            {[
              ['⌂', 'Stays in your browser', 'No account and no server. Everything lives on your device, and the files stay with the job they belong to.'],
              ['⛨', 'A write guard', 'A save that would wipe or shrink your data is stopped before it happens, and the app tells you.'],
              ['◷', 'A snapshot on every start', 'Each time it opens, a copy is set aside first, and again before any import or restore.'],
              ['✓', 'Tested migrations', 'When the data model changes, a migration carries old saves forward, and a test proves nothing is dropped.'],
            ].map(([ic, t, d], i) => (
              <Reveal className={styles.safeItem} key={t} i={i}>
                <span className={styles.safeIcon} aria-hidden="true">{ic}</span>
                <b>{t}</b>
                <span>{d}</span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---- How it's built ---- */}
        <section className={styles.section} aria-label="How it's built">
          <Reveal as="h2" className={styles.h2}>How it’s built.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Designed and built in the same loop, pair-programmed with Claude Code, so an idea could go
            from sketch to something clickable in hours and be judged in the browser rather than on a
            canvas.
          </Reveal>
          <Reveal className={styles.stack} i={2}>
            {['Vite', 'React', 'TypeScript', 'Zustand', 'IndexedDB for files', 'd3-geo for the map', 'Claude Code'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </Reveal>
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

/** A screenshot in a plain browser window. */
function Browser({ src, alt = '' }: { src: string; alt?: string }) {
  return (
    <div className={styles.browser}>
      <div className={styles.chrome} aria-hidden="true">
        <i />
        <i />
        <i />
        <span>jobquest</span>
      </div>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  )
}

/** The same applications as board, grid or map. Each card is positioned in
 *  JS for the current view, and CSS transitions carry it to the next one. */
function Views() {
  const [view, setView] = useState<View>('board')
  const stageRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { w: W, h: H } = size
  const narrow = W < 620
  const cols = narrow ? 2 : 4
  const gap = 10
  const cw = (W - 24 - gap * (cols - 1)) / cols
  const colTop = (ci: number) => (narrow ? Math.floor(ci / cols) * (H / 2) : 0)
  const colH = narrow ? H / 2 : H

  const counts: Record<number, number> = {}
  const cityCount: Partial<Record<City, number>> = {}
  const place = (j: (typeof JOBS)[number], i: number) => {
    if (view === 'board') {
      const ci = COLUMNS.findIndex(([k]) => k === (j.st === 'take' ? 'interview' : j.st))
      const n = (counts[ci] = (counts[ci] ?? 0) + 1) - 1
      return { x: 12 + (ci % cols) * (cw + gap) + 8, y: colTop(ci) + 44 + n * 60, w: cw - 16, h: 52 }
    }
    if (view === 'grid') return { x: 12, y: 46 + i * 46, w: W - 24, h: 42 }
    const [, cx, cy] = CITIES[j.city]
    const n = (cityCount[j.city] = (cityCount[j.city] ?? 0) + 1) - 1
    const r = n ? 26 + n * 3 : 0
    return { x: cx * W + Math.cos(n * 1.25) * r - 21, y: cy * H + Math.sin(n * 1.25) * r - 30, w: 42, h: 42 }
  }

  return (
    <div className={styles.views}>
      <div className={styles.viewBar}>
        <div className={styles.seg} role="group" aria-label="View">
          {(['board', 'grid', 'map'] as View[]).map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} data-cursor>
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <p className={styles.question} aria-live="polite">{QUESTION[view]}</p>
      </div>

      <div className={styles.stage} data-v={view} ref={stageRef}>
        {/* the furniture of each view, cross-faded */}
        <div className={styles.furniture} aria-hidden="true">
          {COLUMNS.map(([k, t], ci) => (
            <Fragment key={k}>
              <div className={`${styles.colBg} ${styles.forBoard}`} style={{ left: 12 + (ci % cols) * (cw + gap), width: cw, top: colTop(ci) + 6, height: colH - 12 }} />
              <div className={`${styles.colHead} ${styles.forBoard}`} style={{ left: 12 + (ci % cols) * (cw + gap) + 12, top: colTop(ci) + 16 }}>
                <i style={{ background: `var(--st-${k})` }} />
                {t}
              </div>
            </Fragment>
          ))}
          <div className={`${styles.gridHead} ${styles.forGrid}`}>
            <span>Company</span>
            <span>Role</span>
            <span>Location</span>
            <span>Status</span>
          </div>
          <div className={`${styles.mapBg} ${styles.forMap}`}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M40 98 C36 86 30 78 28 66 C26 56 34 50 40 44 C46 36 50 24 58 16 C64 10 72 6 80 4 L100 0 L100 100 L44 100 Z" fill="#cfd8c2" />
            </svg>
          </div>
          {Object.values(CITIES).map(([n, x, y]) => (
            <div key={n} className={`${styles.city} ${styles.forMap}`} style={{ left: x * W, top: y * H + 40 }}>
              {n}
            </div>
          ))}
        </div>

        {W > 0 &&
          JOBS.map((j, i) => {
            const p = place(j, i)
            return (
              <div
                key={j.co}
                className={styles.job}
                style={{ transform: `translate(${p.x}px, ${p.y}px)`, width: p.w, height: p.h, transitionDelay: `${i * 25}ms` }}
                title={j.co}
              >
                <span className={styles.jobMark} style={{ background: j.c, color: j.ink ?? '#fff' }} aria-hidden="true">
                  {j.mark}
                </span>
                <span className={styles.jobText}>
                  <b>{j.co}</b>
                  <span>{j.role}</span>
                </span>
                <span className={styles.jobCity}>{CITIES[j.city][0]}</span>
                <span className={styles.jobStatus} style={{ background: `var(--st-${j.st}-bg)` }}>
                  <i style={{ background: `var(--st-${j.st})` }} />
                  {stageName(j.st)}
                </span>
              </div>
            )
          })}
      </div>

      <div className={styles.viewNote}>
        {(
          [
            ['board', 'Board', 'The pipeline by stage. Drag a card to move it on.'],
            ['grid', 'Grid', 'Dense and sortable, grouped by status, for the full picture.'],
            ['map', 'Map', 'Roles by city, for the “what’s nearby” question.'],
          ] as const
        ).map(([v, t, d]) => (
          <div key={v} className={view === v ? styles.noteOn : ''}>
            <b>{t}</b>
            {d}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Two offers against your target salary (thousands of SEK a month). */
function Offers() {
  const [target, setTarget] = useState(78)
  const MIN = 55
  const MAX = 95
  const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100
  const offers = [
    { co: 'Klarna', role: 'Senior Product Designer', amt: 75, mark: 'K', c: '#e9a5c0', ink: '#1a1715' },
    { co: 'Spotify', role: 'Senior UX Designer', amt: 80, mark: 'S', c: '#1db954', ink: '#fff' },
  ]
  return (
    <div className={styles.cmp}>
      <label className={styles.target}>
        <span className={styles.targetRow}>
          <span className={styles.targetLabel}>Your target</span>
          <b>
            {target}k <small>SEK / mo</small>
          </b>
        </span>
        <input type="range" min={60} max={92} value={target} onChange={(e) => setTarget(+e.target.value)} aria-label="Your target salary, thousands of SEK per month" />
      </label>
      {offers.map((o) => {
        const d = o.amt - target
        return (
          <div key={o.co} className={styles.offer}>
            <span className={styles.offerMark} style={{ background: o.c, color: o.ink }} aria-hidden="true">
              {o.mark}
            </span>
            <b>
              {o.co} <span>· {o.role}</span>
            </b>
            <span className={styles.amt}>{o.amt}k</span>
            <span className={styles.bar}>
              <i style={{ width: `${pct(o.amt)}%`, background: d >= 0 ? 'var(--st-offer)' : 'var(--st-take)' }} />
              <span className={styles.tgt} style={{ left: `${pct(target)}%` }} />
            </span>
            <span className={`${styles.gap} ${d >= 0 ? styles.over : styles.under}`}>
              {d === 0 ? 'Right on your target' : d > 0 ? `${d}k above your target` : `${-d}k under your target`}
            </span>
          </div>
        )
      })}
      <p className={styles.cmpNote}>Then the rest of the decision: deadlines, location, work mode, and talking points for a counter-offer.</p>
    </div>
  )
}
