import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
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
import styles from './TimeCase.module.css'

/**
 * The Time case study, built for Time alone (route "/work/time"). Dark, like
 * the app: Time's near-black ground, its category gradients as the light in
 * each panel, and the story told mostly through the screens. Every other
 * project still uses the shared CaseStudy template.
 */

const W = '/work/time'
const LIVE = 'https://time-lac-kappa.vercel.app'

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
    const img = new Image()
    img.src = `${W}/card-bg.webp`
    img.decode().then(ready, ready)
    const safety = window.setTimeout(ready, 2500)
    return () => window.clearTimeout(safety)
  }, [])

  return (
    <>
      <RouteTransition key="time" accent={project.accent} ready={heroReady} />
      <FixedControls staticLight />
      <LangFixed />
      <Menu />

      <main className={styles.page} id="top">
        <div className={styles.bar}>
          <Link to="/" className={styles.wordmark} data-cursor aria-label="Lukas Ahlse — home">
            lukas<span className={styles.dot} />
          </Link>
        </div>

        {/* ---- Hero: the photo, Time's glow over it, two still phones ---- */}
        <header className={styles.hero}>
          <div className={styles.heroPhoto} />
          <div className={styles.heroGlow} />
          <div className={styles.heroFade} />
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
              Time
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

        {/* ---- The story ---- */}
        <section className={styles.story} aria-label="The story">
          <div>
            <Reveal as="p">
              <strong>Most timers measure time passing. I wanted one that measures time held.</strong>
            </Reveal>
            <Reveal as="p" i={1}>
              Time is a session timer with no pause button. You pick what kind of work you're about
              to do, name it, set a length and start. Stopping early means holding a button down for
              over a second, and that's recorded too. Afterwards it asks one question: how did it go.
            </Reveal>
            <Reveal as="p" i={2}>
              It's built for one person, me, and I use it every day. What builds up isn't a
              productivity score, but a record you can read back: how much you set aside, how much of
              it you actually held, and how it felt.
            </Reveal>
          </div>
        </section>

        {/* ---- Where it started: what bugged me about what came before ---- */}
        <section className={styles.section} aria-label="Where it started">
          <Reveal as="h2" className={styles.h2}>Every timer I tried.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Before Time I used Pomodoro apps, the phone's timer and a separate to-do list. These
            are the things I kept saying about them.
          </Reveal>
          <div className={styles.quotes}>
            {QUOTES.map(([q, size, tone], i) => (
              <Reveal as="p" key={q} className={`${styles.quote} ${styles[`q_${size}`]} ${styles[`c_${tone}`]}`} i={i % 4}>
                “{q}”
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---- What using it taught me ---- */}
        <section className={styles.section} aria-label="Insights">
          <Reveal as="h2" className={styles.h2}>What using it taught me.</Reveal>
          <div className={styles.insights}>
            {INSIGHTS.map(([h, t, tone], i) => (
              <Reveal className={styles.insight} key={h} i={i}>
                <span className={`${styles.insightDot} ${styles[`d_${tone}`]}`} aria-hidden="true" />
                <h3>{h}</h3>
                <p>{t}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---- What it had to be: three principles, then what each means in the app ---- */}
        <section className={styles.section} aria-label="Principles">
          <Reveal as="h2" className={styles.h2}>What it had to be.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Three principles, and where they meet. Every point around them is something that is
            actually in the app.
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

        {/* ---- The idea, in four decisions ---- */}
        <section className={styles.panels} aria-label="Four decisions">
          <Panel tone="deep" no="01 · No pause" title="The only way out is to hold."
            text="While a session runs there is nothing to press except a control you hold for over a second. A paused timer measures attendance; the thing worth knowing is whether you stayed.">
            <Phone src={`${W}/session-running.webp`} clip={`${W}/how-it-went.webm`} />
          </Panel>

          <div className={styles.twoUp}>
            <Panel tone="move" no="02 · Intent first" title="What kind of work, before how long."
              text="The first screen asks what you're about to do. The length is the last decision, not the first.">
              <Phone src={`${W}/pick-a-category.webp`} clip={`${W}/session-flow.webm`} />
            </Panel>
            <Panel tone="dark" no="03 · One question" title="How did it go?"
              text="Four cards, Rough to Perfect, tinted by the session you just finished and picked from the same arc you started on.">
              <Phone src={`${W}/how-it-went.webp`} />
            </Panel>
          </div>

          <Panel tone="calm" no="04 · Stopping early" title="Ending early isn't failing."
            text="It's recorded, it shows up in the week as a short column, and it's never red. Going down is information, not an error.">
            <Phone src={`${W}/me-week.webp`} clip={`${W}/open-a-sheet.webm`} />
          </Panel>
        </section>

        {/* ---- One session, start to finish ---- */}
        <section className={styles.section} aria-label="The session">
          <Reveal as="h2" className={styles.h2}>One session, start to finish.</Reveal>
          <div className={styles.flow}>
            {[
              ['pick-a-category', 'Pick a category'],
              ['name-it', 'Name it'],
              ['set-the-length', 'Set the length'],
              ['session-running', 'Hold to end'],
              ['session-done', 'Done'],
              ['how-it-went', 'How did it go'],
            ].map(([file, label], i) => (
              <Reveal as="figure" className={styles.flowStep} key={file} i={i}>
                <Phone src={`${W}/${file}.webp`} />
                <figcaption><span>{String(i + 1).padStart(2, '0')}</span>{label}</figcaption>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---- The record ---- */}
        <section className={styles.panelsTight} aria-label="The record">
          <Panel tone="ember" no="The record" title="A record you can read back."
            text="Every figure opens into what it's made of, and every day opens into what you actually ran. Patterns sit behind a button, because they're a question you ask now and then.">
            <div className={styles.trio}>
              <figure><Phone src={`${W}/me-month.webp`} /><figcaption>The month</figcaption></figure>
              <figure><Phone src={`${W}/day.webp`} /><figcaption>A day</figcaption></figure>
              <figure><Phone src={`${W}/patterns.webp`} /><figcaption>Patterns</figcaption></figure>
            </div>
          </Panel>
        </section>

        {/* ---- The system ---- */}
        <section className={styles.section} aria-label="The system">
          <Reveal as="h2" className={styles.h2}>One colour, at every size.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Eleven palettes of four stops. A mark big enough to show the gradient shows it; one
            under 24pt takes a single named stop. So a bar, a card, the session orb and an 8pt
            legend dot all read as the same category.
          </Reveal>
          <div className={styles.boards}>
            <Reveal className={styles.board} i={2}>
              <img src={`${W}/process/the-system-dark.webp`} alt="The eleven category palettes and Nunito in five weights." loading="lazy" />
            </Reveal>
          </div>
        </section>

        {/* ---- Counted, not claimed ---- */}
        <section className={styles.section} aria-label="Counted, not claimed">
          <Reveal as="h2" className={styles.h2}>Counted, not claimed.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            There are no usage figures, because there are no users to have them. These are counted
            out of the app itself.
          </Reveal>
          <div className={styles.tiles}>
            <Tile big="11 → 1" tone="deep" lead="Eleven dots, one real colour."
              text="A day in the month grid spliced three palettes into one gradient. Read back off a real month, one dot in eleven was a colour the palette actually contains." i={0} />
            <Tile big="36 / 14" tone="move" lead="36 borders, 14 opacities."
              text="Not a system, accretion. Cards now have no border at all: the fill is the edge." i={1} />
            <Tile big="3 → 5" tone="calm" lead="The doc was wrong about its own type."
              text="It claimed three weights. Counting found five, and the most used wasn't listed. The document changed, not the app." i={2} />
          </div>
        </section>

        {/* ---- How it's built ---- */}
        <section className={styles.section} aria-label="How it's built">
          <Reveal as="h2" className={styles.h2}>How it's built.</Reveal>
          <div className={styles.built}>
            {[
              ['Expo and React Native', 'One codebase for iOS, Android and the web.'],
              ['Local-first', "Everything lives on the device, written twice over so an interrupted write can't lose a record. No account, no server, no analytics."],
              ['An installable web app', 'The web build is a PWA, deployed on Vercel. It is the version linked here.'],
              ['Checked against its own rules', "A script counts radii, surface opacities, type weights, gutters, tap targets and accessibility labels, and prints what's standard and what's one-off."],
            ].map(([h, t], i) => (
              <Reveal className={styles.builtItem} key={h} i={i}>
                <h3>{h}</h3>
                <p>{t}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---- Reflection ---- */}
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

function Panel({ tone, no, title, text, children }: { tone: Tone; no: string; title: string; text: string; children: React.ReactNode }) {
  return (
    <Reveal as="article" className={`${styles.panel} ${styles[tone]}`}>
      {children}
      <div className={styles.cap}>
        <span className={styles.no}>{no}</span>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </Reveal>
  )
}

function Tile({ big, tone, lead, text, i }: { big: string; tone: Tone; lead: string; text: string; i: number }) {
  return (
    <Reveal className={styles.tile} i={i}>
      <div className={`${styles.big} ${styles[`g_${tone}`]}`}>{big}</div>
      <p><strong>{lead}</strong> {text}</p>
    </Reveal>
  )
}

/**
 * A gallery screen (824×1732: a 780×1688 screen in a 22px frame). With `clip`,
 * the recording plays over the screen while the phone is on screen, and pauses
 * when it scrolls away; with reduced motion it stays on the still.
 */
function Phone({ src, clip }: { src: string; clip?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.35 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <span className={styles.phone}>
      <img src={src} alt="" loading="lazy" decoding="async" />
      {clip && <video ref={ref} src={clip} muted loop playsInline preload="none" disablePictureInPicture />}
    </span>
  )
}

/* ---- Where it started ---- */
type QTone = 'pink' | 'green' | 'blue' | 'gold' | 'white' | 'muted'
/** [quote, size, colour]. In my own voice, about the timers and lists I used before. */
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

/* ---- What using it taught me ---- */
const INSIGHTS: [string, string, 'pink' | 'green' | 'blue' | 'gold'][] = [
  ['Hard isn’t one thing.', 'Admin is its own category. Doing your taxes is hard, but it isn’t deep work, and lumping them together hides which kind of hard the week actually was.', 'blue'],
  ['Fun needs a limit too.', 'Play gets its own category because it’s good, and because it’s the one that overruns. For play, the length works as a ceiling, not a target.', 'gold'],
  ['The list and the timer belong together.', 'Start a session straight from a to-do, and the tick lands on the day you did it. Two apps became one.', 'green'],
  ['A session isn’t done until you say how it went.', 'Time held is half the record. One question at the end, how did it go, is the other half.', 'pink'],
]

/* ---- What it had to be ---- */
type Pillar = { name: string; tone: 'pink' | 'green' | 'blue'; points: string[][] }
const PILLARS: Pillar[] = [
  { name: 'Honest', tone: 'pink', points: [['No pause', 'button'], ['Ending early', 'is recorded'], ['No number', 'without a why'], ['Status never', 'colour alone'], ['Rate every', 'session'], ['Held, not', 'elapsed']] },
  { name: 'Intentional', tone: 'green', points: [['Category', 'before length'], ['Name the', 'session'], ['Admin apart', 'from deep work'], ['Play gets', 'a limit too'], ['Start from', 'a to-do'], ['One question', 'at the end']] },
  { name: 'Calm', tone: 'blue', points: [['Nothing', 'turns red'], ['Only the', 'timer moves'], ['No account,', 'no tracking'], ['Patterns', 'on request'], ['The fill is', 'the edge'], ['Works', 'offline']] },
]
const TONE = { pink: ['#FFAB4E', '#FF4A6E', '#E81E96'], green: ['#ABF25F', '#1ED489', '#0BA6BA'], blue: ['#E3CBFF', '#93A5FF', '#5B36D2'] }

function Grad({ id, tone }: { id: string; tone: keyof typeof TONE }) {
  const [a, b, c] = TONE[tone]
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={a} />
      <stop offset=".5" stopColor={b} />
      <stop offset="1" stopColor={c} />
    </linearGradient>
  )
}

/** Three principles overlapping, the centre named from the side. */
function Venn() {
  const circles = [
    { name: 'Honest', tone: 'pink' as const, cx: 380, cy: 210, lx: 380, ly: 165 },
    { name: 'Intentional', tone: 'green' as const, cx: 300, cy: 345, lx: 262, ly: 400 },
    { name: 'Calm', tone: 'blue' as const, cx: 460, cy: 345, lx: 498, ly: 400 },
  ]
  return (
    <svg viewBox="0 0 760 520" className={styles.vennSvg} role="img" aria-label="Honest, Intentional and Calm overlap; where all three meet is Time held.">
      <defs>{circles.map((c) => <Grad key={c.tone} id={`v-${c.tone}`} tone={c.tone} />)}</defs>
      {circles.map((c) => (
        <circle key={c.name} cx={c.cx} cy={c.cy} r="150" fill="none" stroke={`url(#v-${c.tone})`} strokeWidth="2.5" />
      ))}
      {circles.map((c) => (
        <text key={c.name} x={c.lx} y={c.ly} textAnchor="middle" className={styles.vennLabel}>{c.name}</text>
      ))}
      <text x="30" y="92" className={styles.vennLabel}>Time held</text>
      <path d="M120 108 L370 290 M370 290 l-13 -1 M370 290 l-5 -12" stroke="rgba(244,241,248,.55)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/** A principle with the six things in the app that make it true. */
function Spoke({ name, tone, points }: Pillar) {
  const C = 310, CY = 300, R = 214
  return (
    <svg viewBox="0 0 620 600" className={styles.spokeSvg} role="img" aria-label={`${name}: ${points.map((p) => p.join(' ')).join(', ')}`}>
      <defs><Grad id={`s-${tone}`} tone={tone} /></defs>
      {points.map((lines, i) => {
        const a = ((-90 + i * 60) * Math.PI) / 180
        const x = C + R * Math.cos(a), y = CY + R * Math.sin(a)
        const ex = C + 92 * Math.cos(a), ey = CY + 92 * Math.sin(a)
        const ix = x - 72 * Math.cos(a), iy = y - 72 * Math.sin(a)
        return (
          <g key={lines.join(' ')}>
            <line x1={ex} y1={ey} x2={ix} y2={iy} stroke={`url(#s-${tone})`} strokeWidth="1.6" opacity=".7" />
            <circle cx={x} cy={y} r="72" fill="none" stroke="rgba(244,241,248,.32)" strokeWidth="1.4" strokeDasharray="2 5" strokeLinecap="round" />
            <text x={x} y={y - (lines.length - 1) * 11.5 + 6} textAnchor="middle" className={styles.spokeText}>
              {lines.map((l, k) => <tspan key={l} x={x} dy={k ? 23 : 0}>{l}</tspan>)}
            </text>
          </g>
        )
      })}
      <circle cx={C} cy={CY} r="92" fill="#07050b" stroke={`url(#s-${tone})`} strokeWidth="3" />
      <text x={C} y={CY + 10} textAnchor="middle" className={styles.spokeName}>{name}</text>
    </svg>
  )
}
