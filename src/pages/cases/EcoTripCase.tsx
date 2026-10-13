import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
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
import styles from './EcoTripCase.module.css'

/**
 * The EcoTrip case study, built for EcoTrip alone (route "/work/ecotrip").
 * Cream, honey, brown and moss, with the honeycomb cell as the recurring
 * shape. The story: an audit of my own earlier build, two personas, and one
 * principle, friction only where it counts.
 */

const W = '/work/ecotrip'

export function EcoTripCase() {
  useLenis()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const project = projects.find((p) => p.id === 'ecotrip') as Project
  const idx = projects.findIndex((p) => p.id === 'ecotrip')
  const next = projects[(idx + 1) % projects.length]

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
      <RouteTransition key="ecotrip" accent={project.accent} ready={heroReady} />
      <FixedControls home />
      <LangFixed />
      <Menu />

      <main className={styles.page} id="top">
        {/* ---- Hero ---- */}
        <header className={styles.hero} id="hero">
          <div className={styles.heroPhoto} />
          <div className={styles.heroFade} />
          <div className={styles.heroPhones} aria-hidden="true">
            <span className={styles.shot}><img src={`${W}/onboarding.webp`} alt="" /></span>
            <span className={styles.shot}><img src={`${W}/explore-trips.webp`} alt="" /></span>
          </div>
          <div className={styles.heroCopy}>
            <Reveal as="p" className={styles.eyebrow}>Travel · Concept</Reveal>
            <Reveal as="h1" className={styles.title} i={1}>
              Travel light.
              <br />
              <span className={styles.app}>Together.</span>
            </Reveal>
            <Reveal as="p" className={styles.lede} i={2}>
              A travel app that makes the lower-carbon choice a shared one: every trip adds a cell to
              the hive, and 5% of every booking goes to protecting wild bees.
            </Reveal>
            <Reveal as="p" className={styles.credits} i={3}>
              End-to-end UX/UI and brand · Solo
            </Reveal>
          </div>
        </header>

        {/* ---- Story ---- */}
        <section className={styles.story} aria-label="The story">
          <div>
            <Reveal as="p" className={styles.storyLead}>
              Travel apps either ignore carbon or make you feel guilty about it.
            </Reveal>
            <Reveal as="p" i={1}>
              Neither changes what people book. A warning nobody asked for gets dismissed, and a
              green badge on a cheap flight convinces no one.
            </Reveal>
            <Reveal as="p" i={2}>
              EcoTrip tries a third way. The greener choice isn't a sacrifice you make alone, it's
              progress you add to with everyone else: a hive that fills cell by cell, and a promise
              that 5% of every trip goes to the bees, no matter how you travel.
            </Reveal>
          </div>
        </section>

        {/* ---- Audit of the old build ---- */}
        <section className={styles.section} aria-label="Audit">
          <Reveal as="h2" className={styles.h2}>It started with my own broken build.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            EcoTrip began as an earlier version of mine, so the honest first move was to audit it.
            Here's one of its screens, recreated, and what it was telling people.
          </Reveal>
          <div className={styles.audit}>
            <Reveal className={styles.oldWrap} i={1}>
              <span className={styles.label}>Before · recreated</span>
              <OldCard />
            </Reveal>
            <ol className={styles.findings}>
              {FINDINGS.map(([h, was, now], i) => (
                <Reveal as="li" className={styles.finding} key={h} i={i}>
                  <span className={styles.pin}>{i + 1}</span>
                  <div>
                    <h3>{h}</h3>
                    <p>{was}</p>
                    <p className={styles.now}><Hex size={12} fill="var(--e-honey)" /> {now}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
          <div className={styles.counts}>
            {COUNTS.map(([n, h, t], i) => (
              <Reveal className={styles.count} key={h} i={i}>
                <span className={styles.big}>{n}</span>
                <b>{h}</b>
                <p>{t}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---- Structure ---- */}
        <section className={styles.section} aria-label="Structure">
          <Reveal as="h2" className={styles.h2}>Four dead ends became one loop.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Every screen hung off one of four tabs, with no route between them. A finished trip led
            nowhere, and nothing carried you from planning into the community.
          </Reveal>
          <Reveal className={styles.before} i={2}>
            <span className={styles.label}>Before · 126 frames</span>
            <div className={styles.cols}>
              {BEFORE.map(([tab, items]) => (
                <div className={styles.col} key={tab}>
                  <span className={styles.colHead}>{tab}</span>
                  {items.map(([t, bad]) => (
                    <span key={t} className={`${styles.node} ${bad ? styles.nodeBad : ''}`}>{t}</span>
                  ))}
                </div>
              ))}
              <div className={styles.orphans}>
                <span className={styles.label}>Unlinked</span>
                <div>
                  {['Frame 1–15', 'Bee theme', 'Colour palette', '+ 100 more'].map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal className={styles.after} i={2}>
            <div className={styles.afterText}>
              <span className={styles.label}>After · nine screens</span>
              <h3>Every trip ends in the Hive, and the Hive feeds the next trip.</h3>
              <p>
                Onboarding sets up the idea. Explore and Create both lead to a trip, every trip can be
                posted to the Hive, and a post is someone else's starting point. Giving back is its
                own branch.
              </p>
            </div>
            <LoopDiagram />
          </Reveal>
        </section>

        {/* ---- Two personas + the principle ---- */}
        <section className={styles.section} aria-label="Two travellers">
          <Reveal as="h2" className={styles.h2}>Two travellers set the limits.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Two personas, drawn from interviews with people who travel very differently.
          </Reveal>
          <div className={styles.personas}>
            {PERSONAS.map((p, i) => (
              <Reveal as="article" className={`${styles.persona} ${styles[p.tone]}`} key={p.name} i={i}>
                <div className={styles.who}>
                  <span className={styles.avatar}>J</span>
                  <div>
                    <b>{p.name}</b>
                    <span>{p.tag}</span>
                  </div>
                </div>
                <p className={styles.wants}>{p.wants}</p>
                <p className={styles.sets}><b>{p.sets}</b> {p.because}</p>
              </Reveal>
            ))}
          </div>
          <Reveal as="p" className={styles.principle} i={1}>
            Friction only where it counts.
          </Reveal>
          <Reveal as="p" className={styles.principleSub} i={2}>
            The green path stays frictionless. A high-carbon pick earns one honest, dismissible
            question, and never a block.
          </Reveal>
        </section>

        {/* ---- The nudge ---- */}
        <section className={styles.section} aria-label="The nudge">
          <div className={styles.nudge}>
            <Reveal className={styles.nudgePhone} i={1}>
              <span className={styles.shot}><img src={`${W}/create.webp`} alt="Build your trip: a flight to Zürich, with a note that it emits about three times the CO₂ of the sleeper train, and buttons to see alternatives or dismiss." loading="lazy" /></span>
            </Reveal>
            <div>
              <Reveal as="span" className={styles.label}>Plan a trip</Reveal>
              <Reveal as="h3" className={styles.h3} i={1}>One question, in one place.</Reveal>
              <Reveal className={styles.flow} i={2}>
                <FlowStep n="01" t="Destination" />
                <i aria-hidden="true">→</i>
                <FlowStep n="02" t="Transport" hot />
                <i aria-hidden="true">→</i>
                <div className={styles.branch}>
                  <span className={styles.branchHex}><Hex size={64} fill="var(--e-ink)" /><span>High carbon?</span></span>
                  <div className={styles.branchOut}>
                    <p className={styles.no}><b>No</b> Straight through. Cells light up, nothing to dismiss.</p>
                    <p className={styles.yes}><b>Yes</b> “Adds ~180 kg CO₂. A sleeper train cuts it to ~60 kg.”</p>
                    <div className={styles.choice}>
                      <span>✓ Keep it, no guilt</span>
                      <span className={styles.choiceDark}>See alternatives →</span>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal className={styles.flow2} i={3}>
                <FlowStep n="03" t="Stay" />
                <i aria-hidden="true">→</i>
                <FlowStep n="04" t="Activities" />
                <i aria-hidden="true">→</i>
                <span className={styles.result}>EcoScore 5 / 5</span>
                <i aria-hidden="true">→</i>
                <span className={styles.post}>Post to the Hive</span>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---- The hive as a system ---- */}
        <section className={styles.section} aria-label="The hive">
          <Reveal as="h2" className={styles.h2}>One cell, at every scale.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Leaves scored the trip in the old build: generic eco-green, unrelated to anything.
            Honeycomb cells replaced them because they scale. Five on a trip, a comb on your profile,
            and one shared comb for everyone.
          </Reveal>
          <HiveScales />
        </section>

        {/* ---- Key flows ---- */}
        <section className={styles.panels} aria-label="Key flows">
          <Panel tone="honey" no="Explore" title="Trips the hive loved."
            text="Sorted by EcoScore, so the greenest option is the first one you see. Every number comes with something to compare it to: 82% less CO₂ than flying the same route.">
            <Trio items={[['onboarding', 'Onboarding'], ['explore', 'Explore'], ['explore-trips', 'A trip']]} />
          </Panel>

          <Panel tone="clip" no="In motion" title="From exploring to a finished trip."
            text="The core flow, start to finish.">
            <video className={styles.clip} src={`${W}/EcoTrip-Flow-vid.webm`} muted loop playsInline autoPlay preload="none" aria-label="A walk through exploring and planning a trip in EcoTrip." />
          </Panel>

          <div className={styles.twoUp}>
            <Panel tone="ink" no="The Hive" title="What we saved together."
              text="Shared progress first, then the trips behind it. Any post is a full breakdown you can copy.">
              <Duo items={[['community', 'The Hive'], ['community-trip', 'A trip post']]} />
            </Panel>
            <Panel tone="cream" no="Profile" title="Impact before stats."
              text="The old profile led with trips and days away. Now your impact comes first, then badges, then the numbers.">
              <Duo items={[['profile', 'Profile']]} single />
            </Panel>
          </div>

          <Panel tone="moss" no="Give back" title="5% of every trip, to wild bees."
            text="On every booking, no matter how you travel. Anything you pledge on top goes 100% to the bees, and EcoTrip covers the fees.">
            <div className={styles.giveRow}>
              <Duo items={[['give-back', 'Give back'], ['why-bees', 'Why bees']]} />
              <video className={styles.clipSmall} src={`${W}/why-bees.webm`} muted loop playsInline autoPlay preload="none" aria-label="Scrolling the Why bees page." />
            </div>
          </Panel>
        </section>

        {/* ---- Explorations ---- */}
        <section className={styles.section} aria-label="Explorations">
          <Reveal as="h2" className={styles.h2}>Neither SaaS-plain nor eco-green.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Travel defaults to white and blue, and anything environmental defaults to green. Both
            signal virtue before a word is read. The bees gave a third way.
          </Reveal>
          <div className={styles.palettes}>
            {PALETTES.map((p, i) => (
              <Reveal className={`${styles.palette} ${p.chosen ? styles.chosen : ''}`} key={p.name} i={i}>
                <div className={styles.chips}>{p.colors.map((c) => <span key={c} style={{ background: c }} />)}</div>
                <div className={styles.paletteHead}>
                  <b>{p.name}</b>
                  <span className={p.chosen ? styles.stampIn : styles.stampOut}>{p.chosen ? 'Chosen' : 'Rejected'}</span>
                </div>
                <p>{p.why}</p>
              </Reveal>
            ))}
          </div>
          <div className={styles.explore2}>
            <Reveal className={styles.typeCol} i={1}>
              <span className={styles.label}>Type</span>
              <div className={`${styles.typeRow} ${styles.typeOut}`}>
                <span className={styles.typeInter}>Travel light</span>
                <span className={styles.stampOut}>Out</span>
              </div>
              <div className={`${styles.typeRow} ${styles.typeIn}`}>
                <span className={styles.app}>Travel light. Together.</span>
                <span className={styles.stampIn}>In</span>
              </div>
              <p className={styles.note}>Fredoka for display, Nunito for text: rounded, warm, and nothing like a booking site.</p>
            </Reveal>
            <Reveal className={styles.scoreCol} i={2}>
              <span className={styles.label}>Scoring a trip</span>
              <div className={styles.scores}>
                <div><Leaves /><span>Leaves</span></div>
                <div><span className={styles.bar}><i /></span><span>A bar</span></div>
                <div className={styles.scoreWin}><span className={styles.cells}>{[1, 1, 1, 0, 0].map((f, k) => <Hex key={k} size={22} fill={f ? 'var(--e-honey)' : 'var(--e-honey-soft)'} />)}</span><span>Honeycomb cells</span></div>
              </div>
            </Reveal>
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
            <Reveal as="p" className={styles.honest} i={1}>
              A self-initiated concept: it hasn't been usability tested, and I wouldn't call it
              validated.
            </Reveal>
          </section>
        )}

        {/* ---- Next ---- */}
        <section className={styles.nextWrap}>
          <Link
            to={`/work/${next.id}`}
            className={styles.next}
            style={{ '--next-bg': next.card ? `url('${next.card.bg}')` : next.image ? `url('${next.image.src}')` : 'none' } as CSSProperties}
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

/* ---- Content ---- */
const FINDINGS: [string, string, string][] = [
  ['One yellow doing every job', 'Background, button and active tab shared a colour, so nothing led.', 'Honey kept for actions; warm earth carries the rest.'],
  ['Leaves scored the trip', 'Generic eco-green, unrelated to the bees or the hive.', 'Honeycomb cells that fill, tying one trip to the hive.'],
  ['A number with nothing to compare', '“132 KgCO2” meant nothing on its own.', 'Always paired with a reference: 82% less than flying.'],
  ['Stats above impact', 'The profile led with trips and days away; the point came last.', 'Impact first, then badges, then stats.'],
]
const COUNTS: [string, string, string][] = [
  ['4', 'Isolated tabs', 'A finished trip led nowhere.'],
  ['0', 'Entry points', 'No onboarding: people met a tab bar, not an idea.'],
  ['104', 'of 126 frames orphaned', 'Duplicates, experiments and dead states outnumbered the 22 screens actually in a path.'],
]
const BEFORE: [string, [string, boolean][]][] = [
  ['Profile', [['User profile', false], ['Stats, no impact', true]]],
  ['Community', [['Community', false], ['Community 2 · duplicate', true]]],
  ['Explore', [['Explore trips', false], ['Trip overview · no way back', true]]],
  ['Create', [['Destination', false], ['Accommodation', false], ['Activities', false], ['Steps don’t connect', true]]],
]
const PERSONAS = [
  { name: 'Jane', tag: 'the activist', tone: 'pTerra', wants: 'Cuts carbon at every step, and wants the bad option to feel like one.', sets: 'Jane set the floor:', because: 'friction belongs on the high-carbon choice, never on her own path.' },
  { name: 'John', tag: 'the casual', tone: 'pHoney', wants: 'Takes bigger trips and won’t trade much convenience for a smaller footprint.', sets: 'John set the ceiling:', because: 'show the greener option, and never block the route.' },
] as const
const PALETTES = [
  { name: 'Eco-green', colors: ['#7fae7c', '#a0d6a0', '#dcefd9', '#f4faf2'], why: 'Virtue at the palette level. Reads as a sticker.', chosen: false },
  { name: 'SaaS-clean', colors: ['#6a9bd6', '#85c5f5', '#eaf4fd', '#ffffff'], why: 'Every travel app. No warmth, nothing collective.', chosen: false },
  { name: 'Honey and warm earth', colors: ['#f0a70f', '#c6870e', '#c4693a', '#6b7b35', '#221a10'], why: 'Warm and collective, about the hive’s progress rather than a halo.', chosen: true },
]

/* ---- Pieces ---- */
type Tone = 'honey' | 'ink' | 'cream' | 'moss' | 'clip'

function Panel({ tone, no, title, text, children }: { tone: Tone; no: string; title: string; text: string; children: ReactNode }) {
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

function Trio({ items }: { items: [string, string][] }) {
  return (
    <div className={styles.trio}>
      {items.map(([src, label]) => (
        <figure key={src}>
          <span className={styles.shot}><img src={`${W}/${src}.webp`} alt="" loading="lazy" decoding="async" /></span>
          <figcaption>{label}</figcaption>
        </figure>
      ))}
    </div>
  )
}

function Duo({ items, single }: { items: [string, string][]; single?: boolean }) {
  return (
    <div className={`${styles.duo} ${single ? styles.single : ''}`}>
      {items.map(([src, label]) => (
        <figure key={src}>
          <span className={styles.shot}><img src={`${W}/${src}.webp`} alt="" loading="lazy" decoding="async" /></span>
          <figcaption>{label}</figcaption>
        </figure>
      ))}
    </div>
  )
}

function FlowStep({ n, t, hot }: { n: string; t: string; hot?: boolean }) {
  return (
    <span className={`${styles.fstep} ${hot ? styles.fhot : ''}`}>
      <small>Step {n}</small>
      {t}
    </span>
  )
}

/** A pointy-top hexagon. */
function Hex({ size, fill, stroke }: { size: number; fill: string; stroke?: string }) {
  const h = size, w = size * 0.866
  return (
    <svg width={w} height={h} viewBox="0 0 86.6 100" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M43.3 0 86.6 25v50L43.3 100 0 75V25z" fill={fill} stroke={stroke} strokeWidth={stroke ? 4 : 0} />
    </svg>
  )
}

/** The old Explore card, recreated, with its four problems pinned to it. */
function OldCard() {
  return (
    <div className={styles.old}>
      <span className={styles.oldTitle}>Explore trips</span>
      <div className={styles.oldCard}>
        <span className={styles.oldImg} />
        <span className={styles.oldName}>Swiss Roadtrip</span>
        <div className={styles.oldRow}>
          <Leaves />
          <span>132 KgCO2</span>
        </div>
        <span className={`${styles.oldPin} ${styles.p2}`}>2</span>
        <span className={`${styles.oldPin} ${styles.p3}`}>3</span>
      </div>
      <div className={styles.oldNav}><i /><i /><i className={styles.oldOn} /><i /></div>
      <span className={`${styles.oldPin} ${styles.p1}`}>1</span>
      <span className={`${styles.oldPin} ${styles.p4}`}>4</span>
    </div>
  )
}

function Leaves() {
  return (
    <span className={styles.leaves} aria-hidden="true">
      {[1, 1, 1, 0].map((f, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16"><path d="M2 14C2 7 7 2 14 2c0 7-5 12-12 12z" fill={f ? '#2f6b2f' : '#d6d6d6'} /></svg>
      ))}
    </span>
  )
}

/** The loop: explore → build → post to the Hive → back to explore; onboarding in, giving back off to the side. */
function LoopDiagram() {
  const nodes = [
    { x: 250, y: 70, t: ['Explore', 'a trip'] },
    { x: 410, y: 300, t: ['Build', 'your own'] },
    { x: 90, y: 300, t: ['Post to', 'the Hive'], dark: true },
  ]
  const hex = (x: number, y: number, r: number) => {
    const pts = [0, 1, 2, 3, 4, 5].map((k) => {
      const a = ((60 * k - 90) * Math.PI) / 180
      return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`
    })
    return pts.join(' ')
  }
  return (
    <svg viewBox="0 0 560 420" className={styles.loop} role="img" aria-label="A loop: explore a trip, build your own, post it to the Hive, which feeds the next person's exploring. Onboarding leads in; Give back branches off.">
      <defs>
        <marker id="eh" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" fill="#8a7a5e" />
        </marker>
      </defs>
      <path d="M318 112 Q 400 170 392 230" fill="none" stroke="#8a7a5e" strokeWidth="2" markerEnd="url(#eh)" />
      <path d="M335 330 Q 250 380 172 330" fill="none" stroke="#8a7a5e" strokeWidth="2" markerEnd="url(#eh)" />
      <path d="M100 230 Q 110 160 185 112" fill="none" stroke="#c6870e" strokeWidth="2.5" strokeDasharray="5 6" markerEnd="url(#eh)" />
      <text x="62" y="175" className={styles.loopNote}>feeds back</text>
      {nodes.map((n) => (
        <g key={n.t.join()}>
          <polygon points={hex(n.x, n.y, 72)} fill={n.dark ? '#221a10' : '#fbf6ec'} stroke={n.dark ? '#221a10' : '#e7d9bd'} strokeWidth="2" />
          <text x={n.x} y={n.y - 4} textAnchor="middle" className={n.dark ? styles.loopTextDark : styles.loopText}>
            <tspan x={n.x}>{n.t[0]}</tspan>
            <tspan x={n.x} dy="22">{n.t[1]}</tspan>
          </text>
        </g>
      ))}
      <rect x="196" y="0" width="108" height="0" fill="none" />
      <g>
        <rect x="430" y="40" width="118" height="40" rx="20" fill="#f0a70f" />
        <text x="489" y="66" textAnchor="middle" className={styles.loopPill}>Onboarding</text>
        <path d="M430 60 L 330 66" fill="none" stroke="#c6870e" strokeWidth="2" markerEnd="url(#eh)" />
      </g>
      <g>
        <rect x="430" y="372" width="118" height="40" rx="20" fill="#6b7b35" />
        <text x="489" y="398" textAnchor="middle" className={styles.loopPillLight}>Give back</text>
        <path d="M460 360 L 448 342" fill="none" stroke="#6b7b35" strokeWidth="2" strokeDasharray="4 5" />
      </g>
    </svg>
  )
}

/** The cell at three scales; fills as it scrolls into view. */
function HiveScales() {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true)
      return
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`${styles.scales} ${on ? styles.on : ''}`}>
      <Scale label="A trip" note="Five cells on every trip card: the EcoScore." rows={[5]} filled={4} size={28} />
      <Scale label="You" note="A full comb on your profile, filling with every trip." rows={[4, 5, 6, 5, 4]} filled={15} size={30} />
      <Scale label="The hive" note="One shared comb for everyone: what we saved together." rows={[7, 8, 9, 10, 9, 8, 7]} filled={44} size={22} />
    </div>
  )
}

function Scale({ label, note, rows, filled, size }: { label: string; note: string; rows: number[]; filled: number; size: number }) {
  let k = 0
  const w = size * 0.866
  return (
    <figure className={styles.scale}>
      <div className={styles.comb}>
        {rows.map((n, r) => (
          <div key={r} className={styles.combRow} style={{ marginTop: r ? -size * 0.25 : 0 }}>
            {Array.from({ length: n }, () => {
              const i = k++
              const lit = i < filled
              return (
                <span key={i} className={`${styles.cell} ${lit ? styles.cellLit : ''}`} style={{ width: w, height: size, '--d': `${i * 28}ms` } as CSSProperties} />
              )
            })}
          </div>
        ))}
      </div>
      <figcaption>
        <b>{label}</b>
        <span>{note}</span>
      </figcaption>
    </figure>
  )
}
