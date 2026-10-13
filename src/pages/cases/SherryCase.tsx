import { useEffect, useLayoutEffect, useState, type CSSProperties, type ReactNode } from 'react'
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
import styles from './SherryCase.module.css'

/**
 * The Sherry case study, built for Sherry alone (route "/work/sherry"). The
 * one project built on fieldwork, so the page leads with the people and the
 * places, then the one decision (the library drop-box) everything follows from.
 * Colours are Sherry's own: burgundy into moss green on warm white.
 */

const W = '/work/sherry'

export function SherryCase() {
  useLenis()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const project = projects.find((p) => p.id === 'sherry') as Project
  const idx = projects.findIndex((p) => p.id === 'sherry')
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
      <RouteTransition key="sherry" accent={project.accent} ready={heroReady} />
      <FixedControls home />
      <LangFixed />
      <Menu />

      <main className={styles.page} id="top">
        {/* ---- Hero ---- */}
        <header className={styles.hero} id="hero">
          <div className={styles.heroPhoto} />
          <div className={styles.heroFade} />
          <div className={styles.heroPhones} aria-hidden="true">
            <span className={styles.cover}><img src={`${W}/cover-browse.webp`} alt="" /></span>
            <span className={styles.cover}><img src={`${W}/cover-item.webp`} alt="" /></span>
          </div>
          <div className={styles.heroCopy}>
            <Reveal as="p" className={styles.eyebrow}>Fieldwork · Concept · 2024</Reveal>
            <Reveal as="h1" className={styles.title} i={1}>
              Don't buy it.
              <br />
              Borrow it.
            </Reveal>
            <Reveal as="p" className={styles.lede} i={2}>
              A tool library for Malmö's neighbourhoods. Every handover goes through the local
              library's drop-box, so nobody has to stand in a stranger's hallway.
            </Reveal>
            <Reveal as="p" className={styles.credits} i={3}>
              Research and interaction design · a team of three
            </Reveal>
          </div>
        </header>

        {/* ---- Story ---- */}
        <section className={styles.story} aria-label="The story">
          <div>
            <Reveal as="p" className={styles.storyLead}>
              A wallpaper table costs around 2,000 kr. It gets used for one hallway.
            </Reveal>
            <Reveal as="p" i={1}>
              Everyone can do that maths, and buying still wins. Not because people won't share, but
              because everything around the object is harder than buying it: finding who has one,
              knowing if it's free this weekend, and above all arranging to collect it from a
              stranger's home.
            </Reveal>
            <Reveal as="p" i={2}>
              Kirseberg in Malmö already shares. It has even run its own local currency. What it
              didn't have was a way to hand things over without knocking on a stranger's door.
            </Reveal>
          </div>
        </section>

        {/* ---- Fieldwork ---- */}
        <section className={styles.section} aria-label="Fieldwork">
          <Reveal as="h2" className={styles.h2}>We went where Kirseberg already meets.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Rather than sending a survey, we spent time in the places the district already gathers,
            and let the people running them tell us what it needs.
          </Reveal>
          <Reveal className={styles.places} i={2}>
            {PLACES.map(([name, what]) => (
              <div className={styles.place} key={name}>
                <b>{name}</b>
                <span>{what}</span>
              </div>
            ))}
          </Reveal>

          <div className={styles.workshop}>
            <Reveal as="figure" className={styles.photo} i={1}>
              <img src={`${W}/process/workshop-2.webp`} alt="A card-sorting game on a library table, with picture cards of tools and kitchen gear." loading="lazy" />
            </Reveal>
            <Reveal className={styles.workshopText} i={2}>
              <span className={styles.label}>At the library</span>
              <h3>A card game about who you'd lend to.</h3>
              <p>
                Visitors placed picture cards of things they own on a table split into three rows:
                who lends, what gets lent, and who borrows. Then they tried different pairs of people.
              </p>
              <ul className={styles.tokens}>
                {TOKENS.map(([sv, en]) => (
                  <li key={sv}><b>{sv}</b><span>{en}</span></li>
                ))}
              </ul>
              <p>
                The set-ups ran from lending straight to a stranger, to lending through the library
                to whoever visits.
              </p>
            </Reveal>
            <Reveal as="figure" className={`${styles.photo} ${styles.photoSmall}`} i={3}>
              <img src={`${W}/process/workshop-1.webp`} alt="The same game from above, with the rows labelled who lends, what is lent and who borrows." loading="lazy" />
            </Reveal>
          </div>
        </section>

        {/* ---- Findings ---- */}
        <section className={styles.section} aria-label="Findings">
          <Reveal as="h2" className={styles.h2}>Five things we heard.</Reveal>
          <div className={styles.findings}>
            {FINDINGS.map(([h, t], i) => (
              <Reveal className={`${styles.finding} ${i === 0 ? styles.findingKey : ''}`} key={h} i={i % 3}>
                <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{h}</h3>
                <p>{t}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---- The handover ---- */}
        <section className={styles.section} aria-label="The handover">
          <Reveal as="h2" className={styles.h2}>Sharing dies at the handover.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Finding the thing was never the problem. Collecting it was. So the whole product is
            built around one move: the library becomes the place where things change hands.
          </Reveal>

          <Reveal as="h3" className={styles.h3} i={1}>Borrowing from a neighbour today</Reveal>
          <Reveal className={styles.chain} i={2}>
            {TODAY.map(([where, what], i) => (
              <div className={`${styles.step} ${i === TODAY.length - 1 ? styles.stepBad : ''}`} key={where}>
                <span className={styles.stepWhere}>{where}</span>
                <span className={styles.stepWhat}>{what}</span>
              </div>
            ))}
          </Reveal>

          <Reveal className={styles.dropbox} i={2}>
            <DropBox />
            <div className={styles.dropboxText}>
              <span className={styles.label}>With Sherry</span>
              <div className={styles.pills}>
                {WITH.map((w, i) => (
                  <span key={w}>
                    <span className={styles.pill}>{w}</span>
                    {i < WITH.length - 1 && <i aria-hidden="true">→</i>}
                  </span>
                ))}
              </div>
              <p>
                No meeting, no agreeing on a time, no question of whose home. The library is already
                trusted, and a drop-box asks for a few square metres and no staff time.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ---- Three people ---- */}
        <section className={styles.section} aria-label="Who it is for">
          <Reveal as="h2" className={styles.h2}>Two sides, and a host.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The borrower's problem is time. The lender's is risk. The drop-box answers both, which is
            why both sides live in the same app.
          </Reveal>
          <div className={styles.people}>
            {PEOPLE.map((p, i) => (
              <Reveal as="article" className={`${styles.person} ${styles[p.tone]}`} key={p.who} i={i}>
                <span className={styles.label}>{p.who}</span>
                <h3>{p.line}</h3>
                <dl>
                  <dt>Blocker</dt><dd>{p.blocker}</dd>
                  <dt>Sherry</dt><dd>{p.answer}</dd>
                </dl>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---- Paper ---- */}
        <section className={styles.section} aria-label="Sketches">
          <Reveal as="h2" className={styles.h2}>It started on paper.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The early sketches still offered a choice of where to pick things up: the library, or a
            meeting place. The more we heard, the clearer it got that the choice itself was the
            problem. In the final app, it's always the library.
          </Reveal>
          <div className={styles.paper}>
            <Reveal as="figure" className={`${styles.sheet} ${styles.sheetA}`} i={1}>
              <img src={`${W}/process/sketch-request.webp`} alt="Sketch of the request flow, asking whether to pick up at the library or a meeting place." loading="lazy" />
              <figcaption>“Where would you like to pick up the item? Library / Meeting place.”</figcaption>
            </Reveal>
            <Reveal as="figure" className={`${styles.sheet} ${styles.sheetB}`} i={2}>
              <img src={`${W}/process/sketch-signup.webp`} alt="Sketch of sign-up through a library card, under the early name Sharry with a cherry logo." loading="lazy" />
              <figcaption>Signing up with your library card, back when it was called Sharry.</figcaption>
            </Reveal>
            <Reveal as="figure" className={`${styles.sheet} ${styles.sheetC}`} i={3}>
              <img src={`${W}/process/sketch-flows.webp`} alt="Sketches of home, search, messages, offers and listing screens." loading="lazy" />
              <figcaption>Home, search, offers and listing, before the tabs settled.</figcaption>
            </Reveal>
          </div>
        </section>

        {/* ---- Five tabs ---- */}
        <section className={styles.section} aria-label="Structure">
          <Reveal as="h2" className={styles.h2}>Five tabs, five questions.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Each tab answers a question someone actually arrives with.
          </Reveal>
          <Reveal className={styles.tabs} i={2}>
            {TABS.map(([tab, q], i) => (
              <div className={`${styles.tab} ${i === 2 ? styles.tabPlus : ''}`} key={tab}>
                <span className={styles.tabName}>{tab}</span>
                <p>{q}</p>
              </div>
            ))}
          </Reveal>
        </section>

        {/* ---- Key moments ---- */}
        <section className={styles.panels} aria-label="Key moments">
          <Panel tone="wine" no="Onboarding" title="It ends by choosing your drop-box."
            text="The first thing the app learns is the one thing that decides what you can actually collect: the box you can walk to.">
            <Trio items={[['welcome', 'Welcome'], ['onboarding-dropbox', 'How it works'], ['onboarding-area', 'Your box']]} />
          </Panel>

          <Panel tone="cream" no="Borrowing" title="One number instead of an awkward conversation."
            text="Borrowing is free. Instead of a price, each thing has an insured value, and four numbered terms say exactly what you're agreeing to.">
            <Trio items={[['browse', 'Browse'], ['item', 'The item'], ['terms', 'Four terms']]} />
          </Panel>

          <Panel tone="moss" no="Collecting" title="A code, and a box you can walk to."
            text="When the lender drops it off, a one-time code arrives. Open the box whenever the library is open; each loan carries its own timeline.">
            <Trio items={[['request-sent', 'Sent'], ['dropbox-code', 'The code'], ['borrowing', 'Your loans']]} />
          </Panel>

          <div className={styles.twoUp}>
            <Panel tone="cream" no="Lending" title="The other side, on your own schedule."
              text="Who's asking, why, and what they're agreeing to. Drop it in the box when it suits you.">
              <Duo items={[['handle-request', 'A request'], ['list-item', 'List something']]} />
            </Panel>
            <Panel tone="wineDeep" no="Impact" title="Was it worth it?"
              text="Kronor saved, storage freed and CO₂ not emitted, before any badges. Half the badges are for lending.">
              <Duo items={[['impact', 'Impact'], ['badges', 'Badges']]} />
            </Panel>
          </div>
        </section>

        {/* ---- What the rebuild changed ---- */}
        <section className={styles.section} aria-label="Rebuild">
          <Reveal as="h2" className={styles.h2}>What the rebuild changed.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The research held. The interaction design changed.
          </Reveal>
          <div className={styles.rebuild}>
            {REBUILD.map(([before, after], i) => (
              <Reveal className={styles.rebuildRow} key={before} i={i}>
                <span className={styles.before}>{before}</span>
                <i aria-hidden="true">→</i>
                <span className={styles.after}>{after}</span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---- Written for everyone ---- */}
        <section className={styles.section} aria-label="Writing">
          <div className={styles.writing}>
            <div>
              <Reveal as="h2" className={styles.h2}>Written for someone still learning Swedish.</Reveal>
              <Reveal as="p" className={styles.sub} i={1}>
                The library wanted to reach people who don't read Swedish easily. That set the
                writing rules for every screen.
              </Reveal>
              <Reveal as="ul" className={styles.rules} i={2}>
                <li>Short sentences.</li>
                <li>Numbered terms, one promise each.</li>
                <li>Name the person and the amount.</li>
                <li>Status as a plain state: “Ready to collect”, not an icon.</li>
              </Reveal>
            </div>
            <Reveal className={styles.terms} i={2}>
              <span className={styles.termsHead}>Before you borrow</span>
              <p className={styles.termsLead}>Mattias lends this on the standard Sherry terms.</p>
              <ol>
                <li>Collect from the library box within 3 days of the code arriving.</li>
                <li>Keep it up to 2 weeks, then return it to the same box.</li>
                <li>Message Mattias if plans change. Normal wear is fine.</li>
                <li>If it breaks or goes missing, you cover the insured 499 kr.</li>
              </ol>
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
          </section>
        )}

        {/* ---- Next ---- */}
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

/* ---- Content ---- */
const PLACES: [string, string][] = [
  ['The library', 'Already trusted, already open, and keen to be more than books.'],
  ['The language café', 'Where we learned who the writing had to work for.'],
  ['The sports club', 'Lots of gear, used a few times a year.'],
  ['The neighbourhood café', 'Where people already swap tips about who has what.'],
]

const TOKENS: [string, string][] = [
  ['Du', 'you'],
  ['Främling', 'a stranger'],
  ['Besökare', 'a visitor'],
  ['Bibliotek', 'the library'],
]

const FINDINGS: [string, string][] = [
  ['The library is trusted. Strangers’ hallways aren’t.', 'Making the library the handover point removes the meeting, the timing and the safety question in one move. This became the spine of the product.'],
  ['Buying wins on hassle, not on price.', 'Everyone can do the maths. What makes buying easier is everything around the object.'],
  ['Space is the limit, not willingness.', 'People would share; there’s just nowhere to keep things. A drop-box needs a few square metres and no staff time.'],
  ['Exchange without money already works here.', 'So borrowing stays free, and price is replaced by an insured value.'],
  ['Not everyone reads Swedish easily.', 'The library wanted to reach newer Swedish speakers, which set the writing rules for every screen.'],
]

const TODAY: [string, string][] = [
  ['Ask around', 'Who has one?'],
  ['Message', 'Is it free this weekend?'],
  ['Agree a time', 'Back and forth'],
  ['Their home', 'Stand in a stranger’s hallway'],
]
const WITH = ['Request it', 'The lender drops it in the box', 'A code arrives', 'Collect whenever the library is open']

const PEOPLE = [
  { who: 'The borrower', tone: 'pWine', line: 'Needs it once, for one weekend.', blocker: 'Time: finding it, asking, agreeing when.', answer: 'Search what’s nearby, request, collect with a code.' },
  { who: 'The lender', tone: 'pMoss', line: 'Has a garage full of things they rarely use.', blocker: 'Risk: will it come back, and in one piece?', answer: 'An insured value, four clear terms, and a review after every loan.' },
  { who: 'The library', tone: 'pCream', line: 'Wants to be more than a place for books.', blocker: 'Space and staff time.', answer: 'A drop-box that takes a few square metres and runs itself.' },
] as const

const TABS: [string, string][] = [
  ['Browse', 'What can I get?'],
  ['Loans', 'What’s mine right now?'],
  ['+', 'I have something spare.'],
  ['Inbox', 'Who needs an answer?'],
  ['You', 'Was this worth it?'],
]

const REBUILD: [string, string][] = [
  ['A PIN in a pop-up', 'A Loans tab split by direction, each loan with a timeline and an expiring code.'],
  ['Six bullets of legal-sounding text', 'Four numbered promises that name the lender and the insured amount.'],
  ['A badges page full of confetti', 'Impact first, in kronor, square metres and CO₂, then badges with progress, half of them for lending.'],
]

/* ---- Pieces ---- */
type Tone = 'wine' | 'wineDeep' | 'moss' | 'cream'

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

function Phone({ src }: { src: string }) {
  return (
    <span className={styles.phone}>
      <img src={`${W}/${src}.webp`} alt="" loading="lazy" decoding="async" />
    </span>
  )
}

function Trio({ items }: { items: [string, string][] }) {
  return (
    <div className={styles.trio}>
      {items.map(([src, label]) => (
        <figure key={src}>
          <Phone src={src} />
          <figcaption>{label}</figcaption>
        </figure>
      ))}
    </div>
  )
}

function Duo({ items }: { items: [string, string][] }) {
  return (
    <div className={styles.duo}>
      {items.map(([src, label]) => (
        <figure key={src}>
          <Phone src={src} />
          <figcaption>{label}</figcaption>
        </figure>
      ))}
    </div>
  )
}

/** The library drop-box, drawn: a locker wall with one door open and a code pad. */
function DropBox() {
  return (
    <svg viewBox="0 0 320 300" className={styles.dropboxArt} role="img" aria-label="A drop-box at the library: a wall of lockers, one open, with a keypad showing 3821.">
      <rect x="20" y="30" width="230" height="250" rx="16" fill="#5e1c28" />
      <rect x="20" y="30" width="230" height="38" rx="16" fill="#4a1520" />
      <text x="135" y="55" textAnchor="middle" className={styles.dropboxSign}>BIBLIOTEK · SHERRY</text>
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => {
          const x = 36 + c * 70, y = 82 + r * 64, open = r === 1 && c === 1
          return open ? (
            <g key={`${r}${c}`}>
              <rect x={x} y={y} width="58" height="54" rx="7" fill="#2a0c12" />
              <rect x={x + 8} y={y + 22} width="34" height="26" rx="4" fill="#e7a23c" />
              <rect x={x + 8} y={y + 22} width="34" height="8" rx="3" fill="#c97f1e" />
              <path d={`M${x + 58} ${y} l18 -8 v62 l-18 8 z`} fill="#8a3442" />
            </g>
          ) : (
            <g key={`${r}${c}`}>
              <rect x={x} y={y} width="58" height="54" rx="7" fill="#7a2836" />
              <circle cx={x + 48} cy={y + 27} r="3" fill="#f3d9d4" opacity=".7" />
            </g>
          )
        }),
      )}
      <rect x="262" y="120" width="44" height="78" rx="9" fill="#2f4a33" />
      <rect x="268" y="128" width="32" height="18" rx="4" fill="#cfe6c4" />
      <text x="284" y="141" textAnchor="middle" className={styles.dropboxCode}>3821</text>
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`k${r}${c}`} cx={274 + c * 10} cy={158 + r * 11} r="3" fill="#cfe6c4" opacity=".8" />))}
    </svg>
  )
}
