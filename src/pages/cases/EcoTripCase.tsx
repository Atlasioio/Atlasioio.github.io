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
 * shape. The story: what gets in the way of greener travel, two personas, and
 * one principle, friction only where it counts.
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

  const [morePersonas, setMorePersonas] = useState(false)
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

        {/* ---- What gets in the way ---- */}
        <section className={styles.section} aria-label="What gets in the way">
          <Reveal as="h2" className={styles.h2}>Why greener travel doesn't stick.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Wanting to travel lighter isn't the hard part. Three things get in the way, and each one
            shaped a decision in the app.
          </Reveal>
          <div className={styles.blockers}>
            {BLOCKERS.map(([h, t, d], i) => (
              <Reveal className={styles.blocker} key={h} i={i}>
                <span className={styles.blockerHex}><Hex size={34} fill="var(--e-honey)" /><b>{i + 1}</b></span>
                <h3>{h}</h3>
                <p>{t}</p>
                <p className={styles.now}>{d}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---- Structure ---- */}
        <section className={styles.section} aria-label="Structure">
          <Reveal as="h2" className={styles.h2}>Nine screens, one loop.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Planning, sharing and giving back aren't separate corners of the app. Each one leads into
            the next.
          </Reveal>
          <Reveal className={styles.after} i={2}>
            <div className={styles.afterText}>
              <span className={styles.label}>How it fits together</span>
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
                {/* The fuller persona, closed by default. Opening one opens both, so they read side by side. */}
                <details className={styles.more} open={morePersonas} onToggle={(e) => setMorePersonas(e.currentTarget.open)}>
                  <summary>
                    <span>More about {p.name}</span>
                    <i aria-hidden="true">+</i>
                  </summary>
                  <div className={styles.moreBody}>
                    <blockquote className={styles.voice}>“{p.voice}”</blockquote>
                    <dl className={styles.facts}>
                      {p.facts.map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </details>
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
              <Reveal className={styles.flowRow} i={2}>
                <FlowStep n="Step 01" t="Destination" />
                <FlowStep n="Step 02" t="Transport" tone="hot" />
                <FlowStep n="The check" t="High carbon?" tone="ink" hex />
              </Reveal>
              <Reveal className={styles.lanes} i={3}>
                <div className={`${styles.lane} ${styles.laneNo}`}>
                  <span className={styles.laneTag}>No</span>
                  <p>Straight through. The honeycomb fills, and there's nothing to dismiss.</p>
                </div>
                <div className={`${styles.lane} ${styles.laneYes}`}>
                  <span className={styles.laneTag}>Yes</span>
                  <p>“Adds ~180 kg CO₂. A sleeper train cuts it to ~60 kg.”</p>
                  <div className={styles.choice}>
                    <span>Keep it</span>
                    <span className={styles.choiceDark}>See alternatives →</span>
                  </div>
                </div>
              </Reveal>
              <Reveal className={styles.flowRow} i={4}>
                <FlowStep n="Step 03" t="Stay" />
                <FlowStep n="Step 04" t="Activities" />
                <FlowStep n="Result" t="EcoScore 5 / 5" tone="ink" />
                <FlowStep n="Then" t="Post to the Hive" tone="soft" />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---- The hive as a system ---- */}
        <section className={styles.section} aria-label="The hive">
          <Reveal as="h2" className={styles.h2}>One honeycomb, at every scale.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            A trip's score is a row of hexagons, not leaves or a bar, because a honeycomb scales and
            belongs to the idea: five on a trip, a honeycomb on your profile, and one shared
            honeycomb for everyone.
          </Reveal>
          <HiveScales />
        </section>

        {/* ---- Key flows ---- */}
        <section className={styles.panels} aria-label="Key flows">
          <Panel tone="honey" no="Explore" title="Trips the hive loved."
            text="Sorted by EcoScore, so the greenest option is the first one you see. Every number comes with something to compare it to: 82% less CO₂ than flying the same route.">
            <Trio items={[['onboarding', 'Onboarding'], ['explore', 'Explore'], ['explore-trips', 'A trip']]} />
          </Panel>

          <Panel tone="cream" no="In motion" title="From exploring to a finished trip."
            text="The core flow, start to finish.">
            <video className={styles.clipVideo} src={`${W}/flow-phone.webm`} muted loop playsInline autoPlay preload="none" aria-label="A walk through exploring and planning a trip in EcoTrip." />
          </Panel>

          <div className={styles.twoUp}>
            <Panel tone="ink" no="The Hive" title="What we saved together."
              text="Shared progress first, then the trips behind it. Any post is a full breakdown you can copy.">
              <Duo items={[['community', 'The Hive'], ['community-trip', 'A trip post']]} />
            </Panel>
            <Panel tone="cream" no="Profile" title="Impact before stats."
              text="Your impact comes first, in flights’ worth of CO₂, then badges, and only then the numbers.">
              <Duo items={[['profile', 'Profile']]} single />
            </Panel>
          </div>

          <Panel tone="moss" no="Give back" title="5% of every trip, to wild bees."
            text="On every booking, no matter how you travel. Anything you pledge on top goes 100% to the bees, and EcoTrip covers the fees.">
            <Duo items={[['give-back', 'Give back'], ['why-bees', 'Why bees']]} />
          </Panel>
        </section>

        {/* ---- Explorations: the same trip card, three ways ---- */}
        <section className={styles.section} aria-label="Explorations">
          <Reveal as="h2" className={styles.h2}>Neither SaaS-plain nor eco-green.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Travel apps default to white and blue, and anything environmental defaults to green.
            Both signal virtue before a word is read. Here's the same trip, three ways.
          </Reveal>
          <div className={styles.variants}>
            {VARIANTS.map((v, i) => (
              <Reveal as="figure" className={`${styles.variant} ${v.chosen ? styles.variantChosen : ''}`} key={v.id} i={i}>
                <div className={`${styles.stage} ${styles[v.id]}`}>
                  <div className={styles.trip}>
                    <span className={styles.tripImg} />
                    <div className={styles.tripTop}>
                      <span className={styles.tripName}>Swiss Roadtrip</span>
                      <span className={styles.tripPrice}>€185</span>
                    </div>
                    <span className={styles.tripMeta}>Electric camper · 4 days</span>
                    <div className={styles.tripScore}>
                      {v.id === 'vGreen' && <Leaves />}
                      {v.id === 'vBlue' && <span className={styles.vBar}><i /></span>}
                      {v.id === 'vHoney' && <span className={styles.cells}>{[1, 1, 1, 1, 0].map((f, k) => <Hex key={k} size={18} fill={f ? '#f0a70f' : '#f6e3b4'} />)}</span>}
                      <span>{v.score}</span>
                    </div>
                  </div>
                </div>
                <figcaption>
                  <span className={v.chosen ? styles.stampIn : styles.stampOut}>{v.chosen ? 'Chosen' : 'Rejected'}</span>
                  <b>{v.name}</b>
                  <p>{v.why}</p>
                </figcaption>
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
const BLOCKERS: [string, string, string][] = [
  ['A number means nothing alone', '“132 kg CO₂” is impossible to judge. Too much? Good?', 'Every figure comes with a comparison: 82% less than flying the same route.'],
  ['Green reads as guilt', 'Eco-green and leaf icons feel like a lecture, and lectures get skipped.', 'Warm honey and earth, and a hive you add to, instead of a halo you earn.'],
  ['Alone, it feels pointless', 'One train ride instead of one flight doesn’t feel like it changes anything.', 'Every trip adds to a shared comb, so you can see what everyone saved together.'],
]
const PERSONAS = [
  {
    name: 'Jane', tag: 'the activist', tone: 'pTerra',
    wants: 'Cuts carbon at every step, and wants the bad option to feel like one.',
    sets: 'Jane set the floor:', because: 'friction belongs on the high-carbon choice, never on her own path.',
    voice: 'I already take the train. I don’t need an app telling me I’m good, I need it to stop making the flight the easy default.',
    facts: [
      ['How she travels', 'Trains and buses wherever they go, a few longer trips a year, mostly within Europe.'],
      ['What she wants', 'To compare the real footprint of her options without digging, and to plan the whole trip in one place.'],
      ['What gets in her way', 'Booking sites put the cheapest flight first, and the greener route takes three tabs to piece together.'],
      ['What EcoTrip gives her', 'Greener options first, a score that means something, and a nudge that lands on the flight, not on her.'],
    ],
  },
  {
    name: 'John', tag: 'the casual', tone: 'pHoney',
    wants: 'Takes bigger trips and won’t trade much convenience for a smaller footprint.',
    sets: 'John set the ceiling:', because: 'show the greener option, and never block the route.',
    voice: 'If it’s not much slower or pricier, sure, I’ll take the train. But if an app lectures me, I’m booking somewhere else.',
    facts: [
      ['How he travels', 'A handful of city breaks and one big holiday a year, flying by default because it’s quick.'],
      ['What he wants', 'A good trip without extra effort. He’ll pick the greener option when it costs him little.'],
      ['What gets in his way', 'Green apps feel preachy, and he can’t tell if a cut in CO₂ is worth an extra few hours.'],
      ['What EcoTrip gives him', 'One honest, dismissible line about the flight, a comparison he can read at a glance, and a route that’s never blocked.'],
    ],
  },
] as const
const VARIANTS = [
  { id: 'vGreen', name: 'Eco-green, leaves', score: '132 kg CO₂', why: 'Virtue at the palette level, and a lecture before you’ve read anything.', chosen: false },
  { id: 'vBlue', name: 'SaaS-clean, a bar', score: '38 kg CO₂', why: 'Every booking site. Clear, but cold, and nothing about it is shared.', chosen: false },
  { id: 'vHoney', name: 'Honey and earth, a honeycomb', score: '82% less than flying', why: 'Warm, about the hive’s progress, and the score has something to compare it to.', chosen: true },
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

function FlowStep({ n, t, tone, hex }: { n: string; t: string; tone?: 'hot' | 'ink' | 'soft'; hex?: boolean }) {
  const cls = tone === 'hot' ? styles.fhot : tone === 'ink' ? styles.fink : tone === 'soft' ? styles.fsoft : ''
  return (
    <span className={`${styles.fstep} ${cls}`}>
      <small>{n}</small>
      <span className={styles.fstepT}>
        {hex && <Hex size={18} fill="var(--e-honey)" />}
        {t}
      </span>
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
      <Scale label="A trip" note="Five hexagons on every trip card: the EcoScore." rows={[5]} filled={4} size={30} />
      <Scale label="You" note="A full honeycomb on your profile, filling with every trip." rows={[4, 5, 6, 5, 4]} filled={15} size={30} />
      <Scale label="The hive" note="One shared honeycomb for everyone: what we saved together." rows={[6, 7, 8, 9, 8, 7, 6]} filled={38} size={24} />
    </div>
  )
}

function Scale({ label, note, rows, filled, size }: { label: string; note: string; rows: number[]; filled: number; size: number }) {
  let k = 0
  const w = size * 0.866
  // pointy-top hexagons: rows overlap by a quarter, so this vertical step
  // keeps the gap between every pair of neighbours the same as across a row
  const gap = Math.max(2, Math.round(size * 0.1))
  return (
    <figure className={styles.scale}>
      <div className={styles.comb}>
        {rows.map((n, r) => (
          <div key={r} className={styles.combRow} style={{ marginTop: r ? -size * 0.25 + gap * 0.866 : 0, '--g': `${gap}px` } as CSSProperties}>
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
