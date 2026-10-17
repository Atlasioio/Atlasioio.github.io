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
import styles from './SonyCase.module.css'

/**
 * The Sony / Nimway case study, built for it alone (route "/work/sony").
 * Client work under NDA: the photos are Nimway's own public product
 * photography, and the two interactive pieces (one room read from four
 * distances, and a panel's free / soon / busy states) are drawn for this page
 * with made-up room names, so none of the real screens are shown.
 */

const W = '/work/sony'

const FLOW = [
  ['Discover', 'Real hardware in live offices: how people glance at a door, find a room, book on the move.'],
  ['Define', 'One job per surface. A panel states, a map orients, the app manages.'],
  ['Develop', 'Flows in Figma against Sony’s design system, tried on the devices themselves.'],
  ['Deliver', 'Close with product managers and engineers, into the product’s releases.'],
] as const

type Stop = 'hand' | 'door' | 'lobby' | 'corridor'
const STOPS: { k: Stop; m: string; name: string; line: string }[] = [
  { k: 'hand', m: '0.3 m', name: 'In your hand', line: 'The app. Every room, every time, and the booking itself.' },
  { k: 'door', m: '1 m', name: 'At the door', line: 'The panel. This room: free or not, until when, and book it now.' },
  { k: 'lobby', m: '5 m', name: 'Across the lobby', line: 'The wayfinding map. Where the free rooms are, from where you stand.' },
  { k: 'corridor', m: '10 m', name: 'Down the corridor', line: 'Only the light around the panel reads. Green, yellow or red is the whole message.' },
]

type Status = 'free' | 'soon' | 'busy'
const STATUS: Record<Status, { label: string; word: string; action: string }> = {
  free: { label: 'Free', word: 'Available until 14:00', action: 'Book now' },
  soon: { label: 'Soon', word: 'Booked from 13:15', action: 'Book 15 min' },
  busy: { label: 'Busy', word: 'Busy until 13:30', action: 'Check in' },
}

const SURFACES = [
  {
    no: '01 · Meeting-room panels',
    title: 'A panel states.',
    body: 'Mounted beside each door and read at arm’s length or from down the corridor. It answers one question, can I use this room, and lets you act on the answer.',
    points: ['Booking straight from the panel', 'Status by light, word and time', 'Occupancy, so empty bookings don’t hold a room'],
    pics: [
      ['panel-room', 'A Nimway panel glowing green beside a meeting room'],
      ['panel', 'A Nimway room panel'],
    ],
  },
  {
    no: '02 · Wayfinding maps',
    title: 'A map orients.',
    body: 'Large floor plans in lobbies and corridors, read from across a room by people walking past. Availability has to land at a glance, before anyone stops.',
    points: ['Free and booked rooms as colour on the plan', '“You are here”, and the way to a room', 'Type and contrast set for distance'],
    pics: [
      ['wayfinding', 'A Nimway floor-plan screen in an office lobby'],
      ['find', 'Finding a colleague on the floor plan'],
      ['book', 'Booking from the map on a phone'],
    ],
  },
  {
    no: '03 · Booking app and web',
    title: 'The app manages.',
    body: 'In your pocket and on your desk: find a room or a desk, book it, change it, and see who’s in, with everything the wall screens only hint at.',
    points: ['Find and book rooms and desks', 'Manage bookings on the move', 'The same rooms and states as on the walls'],
    pics: [
      ['web', 'The Nimway web app on a laptop'],
      ['apps', 'The Nimway app on phone and tablet'],
      ['phone-person', 'Someone using the Nimway app in an office'],
    ],
  },
] as const

export function SonyCase() {
  useLenis()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const project = projects.find((p) => p.id === 'sony') as Project
  const idx = projects.findIndex((p) => p.id === 'sony')
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

  const [stop, setStop] = useState<Stop>('door')
  const [status, setStatus] = useState<Status>('free')

  return (
    <>
      <RouteTransition key="sony" accent={project.accent} ready={heroReady} />
      <FixedControls home />
      <LangFixed />
      <Menu />

      <main className={styles.page} id="top">
        {/* ---- Hero: a panel glowing beside a meeting room (Nimway's photo) ---- */}
        <header className={styles.hero} id="hero">
          <div className={styles.heroPhoto} />
          <div className={styles.heroFade} />
          {/* phones: no photo, so the drawn panel stands in for it */}
          <div className={styles.heroDevice} aria-hidden="true">
            <Panel status="free" />
          </div>
          <div className={styles.heroCopy}>
            <Reveal as="p" className={styles.eyebrow}>
              <i aria-hidden="true" />
              Client work · Sony
            </Reveal>
            <Reveal as="h1" className={styles.title} i={1}>
              One office,
              <br />
              read from <em>every distance.</em>
            </Reveal>
            <Reveal as="p" className={styles.lede} i={2}>
              Nimway is Sony’s smart-office platform, used by companies in several countries. I designed
              across its meeting-room panels, wayfinding maps and booking app and web, so the same rooms
              read right at the door, across the lobby and in your hand.
            </Reveal>
            {/* phones get one short line instead */}
            <Reveal as="p" className={styles.ledeShort} i={2}>
              Sony’s smart-office platform: room panels, wayfinding maps and the booking app.
            </Reveal>
            <Reveal as="p" className={styles.credits} i={3}>
              UX and UI design · Sony Nimway
            </Reveal>
          </div>
        </header>

        {/* ---- Story ---- */}
        <section className={styles.story} aria-label="The story">
          <Reveal>
            <p className={styles.storyLead}>A smart office lives on walls and in pockets as much as in an app.</p>
            <p>
              The same room is a panel by its door, a shape on a floor plan in the lobby, and a line in a
              list on your phone. Each is read from a different distance, with a different amount of
              attention, and touched differently or not at all.
            </p>
            <p>
              The work was keeping that one product without making every screen the same: shared logic
              and a shared system, tuned to where each one is read.
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

        {/* ---- Read from where you stand ---- */}
        <section className={styles.section} aria-label="Distances">
          <Reveal as="h2" className={styles.h2}>Read from where you stand.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The same meeting room, from four places in the office. Move closer or further away and see
            how much it can say. Drawn for this page; the real screens are under NDA.
          </Reveal>
          <Reveal className={styles.dist}>
            <div className={styles.scene} aria-live="polite">
              <div className={`${styles.state} ${stop === 'hand' ? styles.stateOn : ''}`} aria-hidden={stop !== 'hand'}>
                <div className={styles.phoneM}>
                  <div className={styles.phoneScr}>
                    <b>Rooms near you</b>
                    {[
                      ['free', 'Fjord · 6', 'Free till 14:00'],
                      ['busy', 'Delta · 4', 'Busy · 13:30'],
                      ['soon', 'Atlas · 10', 'Booked 13:15'],
                      ['free', 'Lagoon · 2', 'Free all day'],
                      ['free', 'Cove · 8', 'Free till 15:30'],
                    ].map(([s, n, t]) => (
                      <span key={n} className={styles.row}>
                        <i style={{ background: `var(--n-${s})` }} />
                        <span>{n}</span>
                        <small>{t}</small>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`${styles.state} ${stop === 'door' ? styles.stateOn : ''}`} aria-hidden={stop !== 'door'}>
                <Panel status="free" />
              </div>
              <div className={`${styles.state} ${stop === 'lobby' ? styles.stateOn : ''}`} aria-hidden={stop !== 'lobby'}>
                <FloorPlan />
              </div>
              <div className={`${styles.state} ${stop === 'corridor' ? styles.stateOn : ''}`} aria-hidden={stop !== 'corridor'}>
                <Corridor />
              </div>
            </div>
            <div className={styles.distSide}>
              <ul className={styles.stops}>
                {STOPS.map((s) => (
                  <li key={s.k}>
                    <button
                      type="button"
                      aria-pressed={stop === s.k}
                      onClick={() => setStop(s.k)}
                      onMouseEnter={() => setStop(s.k)}
                      onFocus={() => setStop(s.k)}
                      data-cursor
                    >
                      <small>{s.m}</small>
                      <b>{s.name}</b>
                      <span>{s.line}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className={styles.rule}>
                <b>The rule:</b> the further away, the fewer things a screen gets to say, and the bigger it
                says them.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ---- Free, soon, busy ---- */}
        <section className={styles.section} aria-label="Room status">
          <Reveal as="h2" className={styles.h2}>Free, soon, busy.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            A panel’s light carries its status down a corridor, but colour is never the only signal: up
            close, the same state is a word and a time. Switch it.
          </Reveal>
          <div className={styles.light}>
            <Reveal className={styles.lightDemo}>
              <Panel status={status} />
              <div className={styles.seg} role="group" aria-label="Room status">
                {(Object.keys(STATUS) as Status[]).map((s) => (
                  <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)} data-cursor>
                    <i style={{ background: `var(--n-${s})` }} aria-hidden="true" />
                    {STATUS[s].label}
                  </button>
                ))}
              </div>
            </Reveal>
            <Reveal as="figure" className={styles.photo} i={1}>
              <img src={`${W}/panels-three.webp`} alt="Three Nimway room panels, lit green, yellow and red" loading="lazy" />
              <figcaption>Nimway product photo</figcaption>
            </Reveal>
          </div>
          <div className={styles.notes}>
            {[
              ['From afar, the light', 'One colour, readable from the end of a corridor.'],
              ['Up close, the words', 'The state and the time it changes, so it never rests on colour.'],
              ['Then, one action', 'Book it, or check in, with nothing else in the way.'],
            ].map(([t, d], i) => (
              <Reveal key={t} i={i}>
                <b>{t}</b>
                {d}
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---- The surfaces ---- */}
        <section className={styles.section} aria-label="Surfaces">
          <Reveal as="h2" className={styles.h2}>Three surfaces, one product.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Where I spent most of my time. My own screens are under NDA, so these are Nimway’s public
            product photos of the surfaces I worked on.
          </Reveal>
          {SURFACES.map((s, si) => (
            <Reveal className={`${styles.surface} ${si % 2 ? styles.flip : ''}`} key={s.no}>
              <div className={styles.txt}>
                <span className={styles.label}>{s.no}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <ul>
                  {s.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.pics}>
                {s.pics.map(([src, alt], i) => (
                  <figure key={src} className={`${styles.photo} ${s.pics.length === 2 && i === 1 ? styles.wide : ''}`}>
                    <img src={`${W}/${src}.webp`} alt={alt} loading="lazy" />
                    {i === 0 && <figcaption>Nimway product photo</figcaption>}
                  </figure>
                ))}
              </div>
            </Reveal>
          ))}
        </section>

        {/* ---- Tested where it lives ---- */}
        <section className={styles.section} aria-label="Testing">
          <Reveal as="h2" className={styles.h2}>Tested where it lives.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            A panel can’t be judged on a monitor. The work was tried on the real hardware, in offices
            people were working in, with product managers and engineers close by.
          </Reveal>
          <div className={styles.tested}>
            {[
              ['On the device', 'Panels and floor-plan screens at their real size, on the wall, at the distance they’re read from.'],
              ['In live offices', 'With people walking past, booking, and running late, not in a lab.'],
              ['With the team', 'Product managers and engineers in the loop from the first flow to the release.'],
            ].map(([t, d], i) => (
              <Reveal className={styles.testedItem} key={t} i={i}>
                <b>{t}</b>
                <span>{d}</span>
              </Reveal>
            ))}
          </div>
          <Reveal as="p" className={styles.shipped}>
            <i aria-hidden="true" />
            <span>
              <b>Partly shipped.</b> Some of the flows are in Nimway today; more arrive in upcoming
              releases.
            </span>
          </Reveal>
          <p className={styles.credit}>Product photography: Sony Nimway, from nimway.com. My own designs are under NDA.</p>
        </section>

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

/** A meeting-room panel, drawn: its light, the room, the state in words, one action. */
function Panel({ status }: { status: Status }) {
  const s = STATUS[status]
  return (
    <div className={styles.panelM} style={{ '--glow': `var(--n-${status})` } as CSSProperties}>
      <div className={styles.panelScr}>
        <div className={styles.panelL}>
          <span className={styles.panelName}>Fjord</span>
          <span className={styles.panelWord}>
            <i aria-hidden="true" />
            {s.word}
          </span>
          <span className={styles.panelBtn}>{s.action}</span>
        </div>
        <div className={styles.panelR} aria-hidden="true">
          <span className={styles.panelDay}>Today</span>
          <span className={styles.slot}>12:00 Free</span>
          <span className={`${styles.slot} ${styles.slotBooked}`}>14:00 Design review</span>
          <span className={`${styles.slot} ${styles.slotBooked}`}>15:30 1:1</span>
        </div>
      </div>
    </div>
  )
}

function FloorPlan() {
  const room = (x: number, y: number, w: number, h: number, name: string, s?: Status) => (
    <g key={name}>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={s ? `var(--n-${s}-soft)` : '#e3e8ee'} />
      <text x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle" fontSize={s ? 9 : 8} fill={s ? `var(--n-${s}-ink)` : '#56606b'}>
        {name}
      </text>
    </g>
  )
  return (
    <div className={styles.plan}>
      <svg viewBox="0 0 320 180" role="img" aria-label="A floor plan: Fjord, Cove and Lagoon free, Delta busy, Atlas booked soon, and a You are here marker">
        <rect x="10" y="10" width="300" height="160" rx="6" fill="#f2f4f6" stroke="#d5dbe2" />
        {room(18, 18, 70, 56, 'Fjord', 'free')}
        {room(94, 18, 56, 56, 'Delta', 'busy')}
        {room(156, 18, 80, 56, 'Atlas', 'soon')}
        {room(242, 18, 60, 56, 'Cove', 'free')}
        {room(18, 110, 110, 52, 'Open desks')}
        {room(242, 110, 60, 52, 'Lagoon', 'free')}
        <circle cx="185" cy="136" r="7" fill="#233a5e" />
        <circle cx="185" cy="136" r="13" fill="none" stroke="#233a5e" strokeOpacity=".3" strokeWidth="3" />
        <text x="185" y="160" textAnchor="middle" fontSize="9" fontWeight="600" fill="#233a5e">You are here</text>
      </svg>
    </div>
  )
}

function Corridor() {
  const doors: { name: string; s: Status; style: CSSProperties }[] = [
    { name: 'Delta', s: 'busy', style: { left: '20%' } },
    { name: 'Fjord', s: 'free', style: { left: '33%', top: '38%', height: '20%', width: '3%' } },
    { name: 'Atlas', s: 'soon', style: { right: '33%', top: '38%', height: '20%', width: '3%' } },
    { name: 'Cove', s: 'free', style: { right: '20%' } },
  ]
  return (
    <div className={styles.corr}>
      <div className={styles.wall} />
      <div className={styles.floor} />
      {doors.map((d) => (
        <div key={d.name} className={styles.door} style={{ ...d.style, '--c': `var(--n-${d.s})` } as CSSProperties}>
          <span>{d.name}</span>
        </div>
      ))}
    </div>
  )
}
