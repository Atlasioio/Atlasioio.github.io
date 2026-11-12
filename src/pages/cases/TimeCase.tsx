import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
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
import { Lightbox, type LightboxShot } from '../../components/Lightbox/Lightbox'
import { DETAILS, DIRECTIONS, EDGES, FLOWS, ITERATIONS, K, LOOKED_AT, PROBLEMS, TIMELINE, type Shot, type Track } from './timeShots'
import styles from './TimeCase.module.css'

/**
 * The Koitto case study (route "/work/time", kept from when the app was called
 * Time). Dark, like the app: its near-black ground, its category gradients as
 * the light in each panel. The page runs problem → solution (the flows) →
 * process → looking back, and every strip of screens opens full size.
 */

const W = '/work/time'
const LIVE = 'https://time-lac-kappa.vercel.app'
const img = (src: string) => `${K}/${src}.webp`

export function TimeCase() {
  useLenis()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const project = projects.find((p) => p.id === 'time') as Project
  const idx = projects.findIndex((p) => p.id === 'time')
  const next = projects[(idx + 1) % projects.length]

  // Hold the route transition until the hero photo has decoded, as CaseStudy
  // does for its cover, with a safety timeout so it can never wedge.
  const [heroReady, setHeroReady] = useState(false)
  useEffect(() => {
    let done = false
    const ready = () => {
      if (!done) {
        done = true
        setHeroReady(true)
      }
    }
    const im = new Image()
    im.src = `${W}/card-bg.webp`
    im.decode().then(ready, ready)
    const safety = window.setTimeout(ready, 2500)
    return () => window.clearTimeout(safety)
  }, [])

  return (
    <>
      <RouteTransition key="time" accent={project.accent} ready={heroReady} />
      <FixedControls staticLight home />
      <LangFixed />
      <Menu />

      <main className={styles.page} id="top">
        <div className={styles.bar}>
          {/* spacer: the wordmark itself is pinned in FixedControls */}
          <span className={styles.wordmark} aria-hidden="true" style={{ visibility: 'hidden' }}>lukas</span>
        </div>

        {/* ---- Hero: the photo, the app's glow over it, two still phones ---- */}
        <header className={styles.hero}>
          <div className={styles.heroPhoto} />
          <div className={styles.heroGlow} />
          <div className={styles.heroFade} />
          {/* phones only: the live link sits on top of the device */}
          <a className={styles.livePill} href={LIVE} target="_blank" rel="noopener noreferrer" data-cursor>
            <i aria-hidden="true" />
            Try it live
            <span aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 11.5l7-7M6 4.5h5.5V10" /></svg>
            </span>
          </a>
          <div className={styles.heroPhones} aria-hidden="true">
            <span className={`${styles.phone} ${styles.cover}`}>
              <img src={`${W}/cover-category.webp`} alt="" />
            </span>
            <span className={`${styles.phone} ${styles.cover}`}>
              <img src={`${W}/cover-me-week.webp`} alt="" />
            </span>
          </div>
          <div className={styles.heroCopy}>
            <Reveal as="p" className={styles.status}>
              <i aria-hidden="true" />
              Shipped · in daily use
            </Reveal>
            <Reveal as="h1" className={styles.title} i={1}>
              Koitto
            </Reveal>
            <Reveal as="p" className={styles.lede} i={2}>
              A focus timer that keeps an honest record.
            </Reveal>
            <Reveal className={styles.actions} i={3}>
              <TryLive />
              <span className={styles.credits}>Design and code · Solo · Expo, React Native</span>
            </Reveal>
          </div>
        </header>

        {/* ---- The facts: role, time, where it runs ---- */}
        <section className={styles.facts} aria-label="Project facts">
          {[
            ['Role', 'Solo: research, design and code'],
            ['Timeline', 'Six weeks, from first sketch to shipped'],
            ['Platforms', 'iOS, Android and the web, one codebase'],
            ['Status', 'Live on the web; App Store and Google Play next'],
          ].map(([k, v], i) => (
            <Reveal className={styles.fact} key={k} i={i}>
              <span>{k}</span>
              <p>{v}</p>
            </Reveal>
          ))}
        </section>

        {/* ================= 00 · Context ================= */}
        <Chapter no="00" title="Context" lead="A timer for myself that grew into an app for anyone." tone="gold" />

        <section className={styles.context} aria-label="Context">
          <Reveal as="p" className={styles.contextLead}>
            I wanted a better way to manage my own time, so I designed myself a session timer. When
            I decided to open it up to other people, the questions changed: why would anyone come
            back to it, and what would make it worth their while? That turned a timer into an app.
          </Reveal>
          <div className={styles.contextGrid}>
            {[
              ['Where it started', 'A session timer for myself: pick the kind of time, set a length, hold to the end.'],
              ['The turning point', 'Opening it up meant thinking about retention and value. That is when the to-do list and the record of where your time went arrived.'],
              ['What I did', 'All of it: the research, the design, the build, and shipping it to the web.'],
            ].map(([k, v], i) => (
              <Reveal className={styles.contextItem} key={k} i={i}>
                <span>{k}</span>
                <p>{v}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= 01 · The problem ================= */}
        <Chapter no="01" title="The problem" lead="People set time aside, then drift." tone="pink" />

        <section className={styles.story} aria-label="The problem">
          <div>
            <Reveal as="p">
              <strong>Most timers measure time passing. I wanted one that measures time held.</strong>
            </Reveal>
            <Reveal as="p" i={1}>
              The tools meant to help either let people off too easily or punish them for slipping,
              and they only count work as time well spent, so rest, exercise and play look like time
              lost. By the end of the day people feel busy, but can’t say where their time went, or
              what to change.
            </Reveal>
            <Reveal as="p" i={2}>
              Koitto is for people who already know what they should be doing but feel scattered,
              and want an honest record of how much time they set aside, how much of it they held,
              and how it felt.
            </Reveal>
            <Reveal as="p" className={styles.hmw} i={3}>
              <span>How might we</span>
              help people keep the time they chose, for anything they choose it for, and see
              honestly where it went?
            </Reveal>
          </div>
        </section>

        {/* The evidence: complaints, then the four problems behind them */}
        <section className={styles.sectionFirst} aria-label="Why timers get abandoned">
          <Reveal as="h3" className={styles.h2}>Why timers get abandoned.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Pomodoro apps, the phone’s timer, a to-do list on the side. From desktop research:
            app-store reviews of timers and to-do apps, Reddit threads, and people I know. The same
            complaints came up again and again.
          </Reveal>
          <div className={styles.quotes}>
            {QUOTES.map(([q, size, tone], i) => (
              <Reveal as="p" key={q} className={`${styles.quote} ${styles[`q_${size}`]} ${styles[`c_${tone}`]}`} i={i % 4}>
                “{q}”
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-label="Four problems">
          <Reveal as="h3" className={styles.h2}>Four problems behind them.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Sorted, the complaints come down to four things. Each one became a decision in the app.
          </Reveal>
          <div className={styles.problems}>
            {PROBLEMS.map((p, i) => (
              <Reveal className={styles.problem} key={p.h} i={i}>
                <span className={`${styles.insightDot} ${styles[`d_${p.tone}`]}`} aria-hidden="true" />
                <h4>{p.h}</h4>
                <ul>
                  {p.quotes.map((q) => <li key={q}>“{q}”</li>)}
                </ul>
                <p className={styles.so}><span>So</span>{p.so}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-label="When it's used">
          <Reveal as="h3" className={styles.h2}>When someone reaches for it.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            One week, as the app is designed to be used: planning, working, putting the phone away,
            looking back.
          </Reveal>
          <ol className={styles.moments}>
            {MOMENTS.map(([when, h, t, shot], i) => (
              <Reveal as="li" className={styles.moment} key={when} i={i}>
                <Screen src={img(shot)} />
                <div>
                  <span className={styles.momentWhen}>{when}</span>
                  <h4>{h}</h4>
                  <p>{t}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ================= 02 · The solution ================= */}
        <Chapter no="02" title="The solution" lead="One timer and one list, keeping one honest record." tone="green" />

        <section className={styles.panels} aria-label="Four decisions">
          <Panel tone="move" no="01 · Intent first" title="What kind of time, before how long."
            text="The first screen asks what you’re about to do. The length is the last decision, not the first.">
            <Screen src={img('01-session-flow/01-pick-a-category')} />
          </Panel>

          <div className={styles.twoUp}>
            <Panel tone="deep" no="02 · No pause" title="The only way out is to hold."
              text="While a session runs there is nothing to press except a control you hold for over a second. A paused timer measures attendance; the thing worth knowing is whether you stayed.">
              <Screen src={img('01-session-flow/15-hold-to-end-early')} />
            </Panel>
            <Panel tone="calm" no="03 · Stopping early" title="Ending early isn’t failing."
              text="It’s recorded as what you kept, it shows in the week as a shorter column, and it’s never red. Going down is information, not an error.">
              <Screen src={img('01-session-flow/16-ended-early-never-red')} />
            </Panel>
          </div>

          <Panel tone="ember" no="04 · One question" title="How did it go?"
            text="Four cards, Rough to Perfect, tinted by the session you just finished and picked from the same arc you started on.">
            <Screen src={img('01-session-flow/10-how-did-it-go')} />
          </Panel>
        </section>

        <section className={styles.section} aria-label="The key flows">
          <Reveal as="h3" className={styles.h2}>The key flows.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The main journeys, each starting from a real situation, and what comes next for a
            session you leave. Every screen opens full size.
          </Reveal>
          <Reveal i={2}>
            <Gallery tracks={FLOWS} label="Key flows" numbered />
          </Reveal>
        </section>

        <section className={styles.section} aria-label="Edge cases">
          <Reveal as="h3" className={styles.h2}>When it doesn’t go to plan.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The cases a timer usually gets wrong, and what Koitto does in each.
          </Reveal>
          <div className={styles.edges}>
            {EDGES.map((e, i) => (
              <Reveal className={`${styles.edge} ${e.shot ? styles.edgeShot : ''}`} key={e.q} i={i % 3}>
                {e.shot && <Screen src={img(e.shot)} />}
                <div>
                  <h4>{e.q}</h4>
                  <p>{e.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-label="Details">
          <Reveal as="h3" className={styles.h2}>Details that make it yours.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Koitto starts with sensible defaults, then lets each person bend it to how they work.
          </Reveal>
          <div className={styles.details}>
            {DETAILS.map((d, i) => (
              <Reveal className={styles.detailCard} key={d.q} i={i}>
                {d.shot && <Screen src={img(d.shot)} />}
                <div>
                  <h4>{d.q}</h4>
                  <p>{d.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= 03 · The process ================= */}
        <Chapter no="03" title="The process" lead="From a canvas to a shipped app." tone="blue" />

        <section className={styles.sectionFirst} aria-label="Timeline">
          <Reveal as="h3" className={styles.h2}>How it went.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Designed on a canvas and a clickable prototype first, then built, with every open
            question drawn as options side by side before anything was decided.
          </Reveal>
          <ol className={styles.timeline}>
            {TIMELINE.map(([d, t], i) => (
              <Reveal as="li" key={d} i={i % 4}>
                <span>{pad(i + 1)} · {d}</span>
                <p>{t}</p>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-label="What I looked at first">
          <Reveal as="h3" className={styles.h2}>What I looked at first.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The apps people already use for their time: the phone's own timer, focus and
            productivity apps, day planners, habit and schedule apps, and apps that turn data into
            a picture of your day. What I kept, and what I did the opposite of.
          </Reveal>
          <LookedAt />
        </section>

        {/* What it had to be: three principles, then what each means in the app */}
        <section className={styles.section} aria-label="Principles">
          <Reveal as="h3" className={styles.h2}>What it had to be.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The four problems became three principles, and where they meet. Every point around them
            is something that is actually in the app.
          </Reveal>
          <Reveal className={styles.venn} i={2}>
            <Venn />
          </Reveal>
          <div className={styles.spokes}>
            {PILLARS.map((p, i) => (
              <Reveal className={styles.spoke} key={p.name} i={i}>
                <Spoke {...p} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.sectionTight} aria-label="Iterations">
          <Reveal as="h3" className={styles.h2}>How each decision got there.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The versions each decision went through: what was chosen, what was set aside, and
            why.
          </Reveal>
          <Reveal i={2}>
            <Gallery tracks={ITERATIONS} label="Iterations" />
          </Reveal>
        </section>

        <section className={styles.section} aria-label="Other ways it could go">
          <Reveal as="h3" className={styles.h2}>Other ways it could go.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Each step of a session could be designed differently. Here is what each alternative
            would gain, and what it would cost.
          </Reveal>
          <Reveal i={2}>
            <Gallery tracks={DIRECTIONS} label="Other ways it could go" />
          </Reveal>
        </section>

        {/* ---- How it's built ---- */}
        <section className={styles.section} aria-label="How it's built">
          <Reveal as="h3" className={styles.h2}>How it’s built.</Reveal>
          <div className={styles.built}>
            {[
              ['Expo and React Native', 'One codebase for iOS, Android and the web.'],
              ['Local-first', 'Everything lives on the device, written twice over so an interrupted write can’t lose a record. No account, no server, no analytics.'],
              ['An installable web app', 'The web build is a PWA, deployed on Vercel. It is the version linked here.'],
              ['Checked against its own rules', 'A script checks the app against its design rules, so spacing, type and colour stay consistent as it grows.'],
            ].map(([h, t], i) => (
              <Reveal className={styles.builtItem} key={h} i={i}>
                <h4>{h}</h4>
                <p>{t}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= 04 · Looking back ================= */}
        <Chapter no="04" title="Looking back" lead="What it taught me, and where I’d take it next." tone="gold" />

        {project.reflection && (
          <section className={styles.sectionFirst} aria-label="Reflection">
            <div className={styles.reflection}>
              {project.reflection.map((r, i) => (
                <Reveal className={styles.reflectionItem} key={r.heading} i={i}>
                  <h4>{r.heading}</h4>
                  <p>{r.body}</p>
                </Reveal>
              ))}
            </div>
          </section>
        )}


        {/* ---- Close: try it, then the next project ---- */}
        <section className={styles.close} aria-label="Try it">
          <Reveal as="h2" className={styles.closeTitle}>Try it yourself.</Reveal>
          <Reveal className={styles.actions} i={1}>
            <TryLive />
            <span className={styles.credits}>Works in the browser, and installs like an app.</span>
          </Reveal>
        </section>

        <section className={styles.nextWrap}>
          <Link
            to={`/work/${next.id}`}
            className={styles.next}
            style={{ '--next-bg': next.card ? `url('${next.card.bg}')` : 'none' } as CSSProperties}
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

function TryLive() {
  return (
    <a className={styles.btn} href={LIVE} target="_blank" rel="noopener noreferrer" data-cursor>
      Try it live
      <span aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
        </svg>
      </span>
    </a>
  )
}

type Tone = 'deep' | 'move' | 'calm' | 'ember' | 'dark'

/** Other apps, each with what it does and what Koitto took from it. Every
 *  screenshot opens full size. */
function LookedAt() {
  const [at, setAt] = useState<number | null>(null)
  const shots: LightboxShot[] = LOOKED_AT.map((l) => ({ src: `${K}/${l.src}.webp`, label: l.kind, note: l.saw, detail: true }))
  return (
    <>
      <div className={styles.looks}>
        {LOOKED_AT.map((l, i) => (
          <Reveal className={styles.look} key={l.src} i={i}>
            <button type="button" className={styles.lookShot} onClick={() => setAt(i)} aria-label={`Open ${l.kind} full size`} data-cursor>
              <img src={`${K}/${l.src}.webp`} alt="" loading="lazy" style={l.focus ? { objectPosition: l.focus } : undefined} />
            </button>
            <span className={styles.lookKind}>{l.kind}</span>
            <p className={styles.lookSaw}>{l.saw}</p>
            <p className={styles.so}><span>So</span>{l.so}</p>
          </Reveal>
        ))}
      </div>
      {at != null && <Lightbox shots={shots} index={at} setIndex={setAt} />}
    </>
  )
}

/** A chapter opener: the number, the title, and the one line it argues. */
function Chapter({ no, title, lead, tone }: { no: string; title: string; lead: string; tone: 'pink' | 'green' | 'blue' | 'gold' }) {
  return (
    <header className={styles.chapter}>
      <Reveal as="p" className={styles.chapterNo}>
        <i className={styles[`d_${tone}`]} aria-hidden="true" />
        {no}
      </Reveal>
      <Reveal as="h2" className={styles.chapterTitle} i={1}>{title}</Reveal>
      <Reveal as="p" className={styles.chapterLead} i={2}>{lead}</Reveal>
    </header>
  )
}

function Panel({ tone, no, title, text, children }: { tone: Tone; no: string; title: string; text: string; children: React.ReactNode }) {
  return (
    <Reveal as="article" className={`${styles.panel} ${styles[tone]}`}>
      {children}
      <div className={styles.cap}>
        <span className={styles.no}>{no}</span>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </Reveal>
  )
}

/**
 * A screen in a device frame. The frames are plain 390×844 screens, so the
 * bezel is drawn here; a `detail` is a partial board shown as a card instead,
 * and a `tall` full-length page is cropped to its first screen.
 */
function Screen({ src, alt = '', detail, tall }: { src: string; alt?: string; detail?: boolean; tall?: boolean }) {
  if (detail) {
    return (
      <span className={styles.detail}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </span>
    )
  }
  return (
    <span className={`${styles.screen} ${tall ? styles.screenTall : ''}`}>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </span>
  )
}

const VERDICT: Record<string, string> = {
  chosen: 'Chosen',
  'set aside': 'Set aside',
  moved: 'Moved to Patterns',
  shipped: 'Shipped',
}

function Chips({ shot }: { shot: Shot }) {
  if (!shot.verdict) return null
  return (
    <span className={styles.chips}>
      {shot.verdict && (
        <span className={`${styles.chip} ${styles[`v_${shot.verdict.replace(' ', '_')}`]}`}>{VERDICT[shot.verdict]}</span>
      )}
    </span>
  )
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Tabs over a sideways strip of screens. Each tab is one flow or one decision;
 * any screen opens full size, and the arrows page the strip for a mouse.
 */
function Gallery({ tracks, label, numbered = false }: { tracks: Track[]; label: string; numbered?: boolean }) {
  const id = useId()
  const [t, setT] = useState(0)
  const [open, setOpen] = useState<number | null>(null)
  const strip = useRef<HTMLDivElement>(null)
  const track = tracks[t]

  useEffect(() => {
    strip.current?.scrollTo({ left: 0 })
  }, [t])

  const page = (dir: 1 | -1) => {
    const el = strip.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryBar}>
        <div className={styles.tabs} role="tablist" aria-label={label}>
          {tracks.map((tr, i) => (
            <button
              key={tr.id}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={i === t}
              aria-controls={`${id}-panel`}
              tabIndex={i === t ? 0 : -1}
              className={`${styles.tab} ${i === t ? styles.tabOn : ''}`}
              onClick={() => setT(i)}
              onKeyDown={(e) => {
                if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
                const n = (i + (e.key === 'ArrowRight' ? 1 : tracks.length - 1)) % tracks.length
                setT(n)
                document.getElementById(`${id}-tab-${n}`)?.focus()
              }}
              data-cursor
            >
              {tr.tab}
            </button>
          ))}
        </div>
        <div className={styles.arrows}>
          <button type="button" onClick={() => page(-1)} aria-label="Scroll the screens back" data-cursor>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 8h-11M7 3.5 2.5 8 7 12.5" /></svg>
          </button>
          <button type="button" onClick={() => page(1)} aria-label="Scroll the screens on" data-cursor>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" /></svg>
          </button>
        </div>
      </div>

      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${t}`}>
        <div className={styles.trackHead}>
          {track.when && (
            <p className={styles.when}>
              <span>When</span>
              {track.when}
            </p>
          )}
          <p className={styles.trackIntro}>{track.intro}</p>
        </div>
        <div className={styles.strip} ref={strip}>
          {track.shots.map((s, i) => (
            <figure className={`${styles.shot} ${s.detail ? styles.shotDetail : ''}`} key={s.src}>
              <button type="button" className={styles.shotBtn} onClick={() => setOpen(i)} aria-label={`Open “${s.label}” full size`} data-cursor>
                <Screen src={img(s.src)} detail={s.detail} tall={s.tall} />
              </button>
              <figcaption>
                <span className={styles.shotHead}>
                  {numbered && <span className={styles.shotNo}>{pad(i + 1)}</span>}
                  {s.label}
                </span>
                <Chips shot={s} />
                {s.note && <span className={styles.shotNote}>{s.note}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {open != null && (
        <Lightbox
          shots={track.shots.map((s) => ({ src: img(s.src), label: s.label, note: s.note, tall: s.tall, detail: s.detail, extra: <Chips shot={s} /> }))}
          index={open}
          setIndex={setOpen}
        />
      )}
    </div>
  )
}

/* ---- Where it started ---- */
type QTone = 'pink' | 'green' | 'blue' | 'gold' | 'white' | 'muted'
/** [quote, size, colour]. Common complaints about timers and to-do lists. */
const QUOTES: [string, 'xl' | 'l' | 'm' | 's', QTone][] = [
  ['I have no idea where my week went', 'xl', 'pink'],
  ['I’d just ignore it when it rang', 'm', 'white'],
  ['I paused it and never came back', 'l', 'green'],
  ['Finishing a session felt like nothing', 'm', 'blue'],
  ['25 minutes, whether I’m in flow or not', 's', 'muted'],
  ['Did that session even go well?', 'l', 'gold'],
  ['My to-do list and my timer don’t know each other', 'm', 'white'],
  ['Doing my taxes counted the same as deep work', 's', 'blue'],
  ['One hour of gaming turned into four', 'l', 'pink'],
  ['It’s a stopwatch, not a record', 's', 'green'],
]

/** [when, what is happening, what Koitto does, screen]. One week of use. */
const MOMENTS: [string, string, string, string][] = [
  ['Sunday evening', 'Planning the week.', '“Go for a swim” goes on the list as Move: 30 minutes, every weekend.', '02-todo-flow/05-repeat-on-weekends'],
  ['Sunday, 20:00', 'Sitting down to work.', '“Research case” starts from the list: deep work, 50 minutes, done by 20:50.', '01-session-flow/07-running'],
  ['Sunday, 20:18', 'The phone goes in a pocket.', 'The session keeps running. At 20:50 the lock screen asks how it went.', '08-notifications/01-ios-lock-screen-session-ends'],
  ['Friday', '“Where did my week go?”', 'Me opens on the week: 8h 22m, against the week before, and what it went on.', '03-me-flow/04-by-week'],
  ['Saturday, 09:00', 'The swim comes round.', 'A reminder, only on the days it’s due: “30 min, when you are ready.”', '08-notifications/02-ios-lock-screen-todo-reminder'],
]

/* ---- What it had to be ---- */
type Pillar = { name: string; tone: 'pink' | 'green' | 'blue'; points: string[][] }
const PILLARS: Pillar[] = [
  { name: 'Honest', tone: 'pink', points: [['No pause', 'button'], ['Ending early', 'is recorded'], ['No number', 'without a why'], ['Status never', 'colour alone'], ['Rate every', 'session'], ['Held, not', 'elapsed']] },
  { name: 'Intentional', tone: 'green', points: [['Category', 'before length'], ['Name the', 'session'], ['Admin apart', 'from deep work'], ['Play gets', 'a limit too'], ['Start from', 'a to-do'], ['One question', 'at the end']] },
  { name: 'Calm', tone: 'blue', points: [['Nothing', 'turns red'], ['Only the', 'timer moves'], ['No account,', 'no tracking'], ['Patterns', 'on request'], ['The fill is', 'the edge'], ['Works', 'offline']] },
]

const SOLID = { pink: '#FF4A6E', green: '#1ED489', blue: '#93A5FF' }

/**
 * Three principles as hairline circles, like a star map: colour only on each
 * circle's dot, and a white dot where all three meet.
 */
function Venn() {
  const circles = [
    { name: 'Honest', tone: 'pink' as const, cx: 380, cy: 210, dx: 380, dy: 255, lx: 380, ly: 180 },
    { name: 'Intentional', tone: 'green' as const, cx: 300, cy: 345, dx: 333, dy: 333, lx: 262, ly: 385 },
    { name: 'Calm', tone: 'blue' as const, cx: 460, cy: 345, dx: 427, dy: 333, lx: 498, ly: 385 },
  ]
  return (
    <svg viewBox="0 0 760 520" className={styles.vennSvg} role="img" aria-label="Honest, Intentional and Calm overlap; where all three meet is Time held.">
      {circles.map((c) => (
        <circle key={c.name} cx={c.cx} cy={c.cy} r="150" fill="none" stroke="rgba(244,241,248,.35)" strokeWidth="1.2" />
      ))}
      {circles.map((c) => <circle key={c.name} cx={c.dx} cy={c.dy} r="7" fill={SOLID[c.tone]} />)}
      <circle cx="380" cy="300" r="9" fill="#fff" />
      <circle cx="380" cy="300" r="18" fill="none" stroke="#fff" strokeOpacity=".35" />
      {circles.map((c) => (
        <text key={c.name} x={c.lx} y={c.ly} textAnchor="middle" className={styles.vennLabel}>{c.name}</text>
      ))}
      <text x="408" y="306" className={styles.vennCentre}>Time held</text>
    </svg>
  )
}

/**
 * A principle as a constellation: its six points as coloured dots joined to
 * the centre and to each other by hairlines, set slightly off a perfect ring.
 */
function Spoke({ name, tone, points }: Pillar) {
  const C = 310, CY = 300
  const pts = points.map((lines, i) => {
    const a = ((-90 + i * 60) * Math.PI) / 180 + (i % 2 ? 0.12 : -0.08)
    const r = i % 2 ? 190 : 165
    return { lines, x: C + r * Math.cos(a), y: CY + r * Math.sin(a), c: Math.cos(a), s: Math.sin(a) }
  })
  return (
    <svg viewBox="0 0 620 600" className={styles.spokeSvg} role="img" aria-label={`${name}: ${points.map((p) => p.join(' ')).join(', ')}`}>
      {pts.map((q) => <line key={'c' + q.lines.join()} x1={C} y1={CY} x2={q.x} y2={q.y} stroke="rgba(244,241,248,.25)" strokeWidth="1" />)}
      {pts.map((q, i) => {
        const n = pts[(i + 1) % pts.length]
        return <line key={'r' + q.lines.join()} x1={q.x} y1={q.y} x2={n.x} y2={n.y} stroke="rgba(244,241,248,.12)" strokeWidth="1" />
      })}
      {pts.map((q) => {
        const side = Math.abs(q.c) < 0.2
        const anchor = side ? 'middle' : q.c > 0 ? 'start' : 'end'
        const x = q.x + (side ? 0 : q.c > 0 ? 16 : -16)
        const y = side ? (q.s < 0 ? q.y - 34 : q.y + 34) : q.y
        return (
          <g key={q.lines.join()}>
            <circle cx={q.x} cy={q.y} r="6" fill={SOLID[tone]} />
            <text x={x} y={y - (q.lines.length - 1) * 11.5 + 6} textAnchor={anchor} className={styles.spokeText}>
              {q.lines.map((l, k) => <tspan key={l} x={x} dy={k ? 23 : 0}>{l}</tspan>)}
            </text>
          </g>
        )
      })}
      <circle cx={C} cy={CY} r="10" fill="#fff" />
      {/* the name sits on a patch of page colour, so the hairlines pass behind it */}
      <rect x={C - name.length * 9.4 - 14} y={CY + 22} width={name.length * 18.8 + 28} height="42" rx="21" fill="#07050b" />
      <text x={C} y={CY + 54} textAnchor="middle" className={styles.spokeName}>{name}</text>
    </svg>
  )
}
