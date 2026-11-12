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
import { Lightbox, type LightboxShot } from '../../components/Lightbox/Lightbox'
import styles from './SherryCase.module.css'

/**
 * The Sherry case study (route "/work/sherry"). The one project built on
 * fieldwork. The page runs problem → solution (the flows) → process → looking
 * back; every phone opens full size with the rest of its flow behind it.
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

  // The full-size viewer: one set of screens (a flow, the sketches) at a time.
  const [boxShots, setBoxShots] = useState<LightboxShot[]>([])
  const [boxAt, setBoxAt] = useState<number | null>(null)
  const open = (shots: LightboxShot[], src: string) => {
    setBoxShots(shots)
    setBoxAt(Math.max(0, shots.findIndex((s) => s.src === src)))
  }
  const openFlow = (flow: FlowKey) => (src: string) => open(FLOWS[flow], `${W}/${src}.webp`)

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
            <Reveal as="p" className={styles.eyebrow}>Fieldwork · Concept</Reveal>
            <Reveal as="h1" className={styles.title} i={1}>
              Don't buy it.
              <br />
              Borrow it.
            </Reveal>
            <Reveal as="p" className={styles.lede} i={2}>
              A tool library for Malmö's neighbourhoods. Every handover goes through the local
              library's drop-box, so nobody has to stand in a stranger's hallway.
            </Reveal>
            {/* phones get one short line instead */}
            <Reveal as="p" className={styles.ledeShort} i={2}>
              A tool library where every handover goes through the local library.
            </Reveal>
            <Reveal as="p" className={styles.credits} i={3}>
              Research, interaction and visual design
            </Reveal>
          </div>
        </header>

        {/* ---- The facts ---- */}
        <section className={styles.facts} aria-label="Project facts">
          {[
            ['Role', 'Research, interaction and visual design'],
            ['Where', 'Kirseberg in Malmö, with its library'],
            ['Platform', 'A mobile app and a library drop-box'],
            ['Status', 'Concept: researched, designed, then rebuilt'],
          ].map(([k, v], i) => (
            <Reveal className={styles.fact} key={k} i={i}>
              <span>{k}</span>
              <p>{v}</p>
            </Reveal>
          ))}
        </section>

        {/* ================= 01 · The problem ================= */}
        <Chapter no="01" title="The problem" lead="Sharing dies at the handover." />

        <section className={styles.story} aria-label="The problem">
          <div>
            <Reveal as="p" className={styles.storyLead}>
              Every flat on the street has its own drill. Most of them sit in a drawer.
            </Reveal>
            <Reveal as="p" i={1}>
              Everyone knows one would do for the whole street, and buying still wins. Not because
              people won't share, but because everything around the object is harder than buying
              it: finding who has one, knowing if it's free this weekend, and above all arranging
              to collect it from a stranger's home.
            </Reveal>
            <Reveal as="p" i={2}>
              Kirseberg in Malmö already shares. It has even run its own local currency. What it
              didn't have was a way to hand things over without knocking on a stranger's door.
            </Reveal>
          </div>
        </section>

        <section className={styles.section} aria-label="Where it breaks">
          <Reveal as="h3" className={styles.h2}>Where borrowing breaks.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Finding the thing was never the problem. Collecting it was: four steps of asking,
            waiting and arranging, ending in someone else's hallway.
          </Reveal>
          <Reveal className={styles.chain} i={2}>
            {TODAY.map(([where, what], i) => (
              <div className={`${styles.step} ${i === TODAY.length - 1 ? styles.stepBad : ''}`} key={where}>
                <span className={styles.stepWhere}>{where}</span>
                <span className={styles.stepWhat}>{what}</span>
              </div>
            ))}
          </Reveal>
        </section>

        <section className={styles.section} aria-label="Who it is for">
          <Reveal as="h3" className={styles.h2}>Two sides, and a host.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The borrower's problem is time. The lender's is risk. The library's is space. One
            answer had to work for all three.
          </Reveal>
          <div className={styles.people}>
            {PEOPLE.map((p, i) => (
              <Reveal as="article" className={`${styles.person} ${styles[p.tone]}`} key={p.who} i={i}>
                <span className={styles.label}>{p.who}</span>
                <h4>{p.line}</h4>
                <dl>
                  <dt>Blocker</dt><dd>{p.blocker}</dd>
                  <dt>Sherry</dt><dd>{p.answer}</dd>
                </dl>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-label="When it is used">
          <Reveal as="h3" className={styles.h2}>When someone reaches for it.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            One loan, as the app is designed to be used: from a shelf that needs hanging to a drill
            back in the box.
          </Reveal>
          <ol className={styles.moments}>
            {MOMENTS.map(([when, h, t, shot], i) => (
              <Reveal as="li" className={styles.moment} key={when} i={i}>
                <Phone src={shot} />
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
        <Chapter no="02" title="The solution" lead="The library becomes the place where things change hands." />

        <section className={styles.sectionFirst} aria-label="The handover">
          <Reveal as="h3" className={styles.h2}>Every handover goes through the library.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            No meeting, no agreeing on a time, no question of whose home. The library is already
            trusted, and a drop-box asks for a few square metres and no staff time.
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
                Borrowing is free. Instead of a price, each thing carries an insured value, and four
                numbered terms say exactly what you're agreeing to.
              </p>
            </div>
          </Reveal>
        </section>

        <section className={styles.section} aria-label="Structure">
          <Reveal as="h3" className={styles.h2}>Five tabs, five questions.</Reveal>
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

        <section className={`${styles.section} ${styles.sectionHead}`} aria-label="The key flows">
          <Reveal as="h3" className={styles.h2}>The key flows.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Five moments, each from a real situation. Every screen opens full size, with the rest
            of its flow behind it.
          </Reveal>
        </section>

        <section className={styles.panels} aria-label="Key moments">
          <Panel tone="wine" no="Getting started" when="The first time you open it." title="It ends by choosing your drop-box."
            text="The first thing the app learns is the one thing that decides what you can actually collect: the box you can walk to.">
            <Trio items={[['welcome', 'Welcome'], ['onboarding-dropbox', 'How it works'], ['onboarding-area', 'Your box']]} onOpen={openFlow('start')} />
          </Panel>

          <Panel tone="cream" no="Borrowing" when="Saturday morning, a shelf to hang and no drill." title="One number instead of an awkward conversation."
            text="Borrowing is free. Instead of a price, each thing has an insured value, and four numbered terms say exactly what you're agreeing to.">
            <Trio items={[['browse', 'Browse'], ['item', 'The item'], ['terms', 'Four terms']]} onOpen={openFlow('borrow')} />
          </Panel>

          <Panel tone="moss" no="Collecting" when="On the way home, when the code arrives." title="A code, and a box you can walk to."
            text="When the lender drops it off, a one-time code arrives. Open the box whenever the library is open; each loan carries its own timeline.">
            <Trio items={[['request-sent', 'Sent'], ['dropbox-code', 'The code'], ['borrowing', 'Your loans']]} onOpen={openFlow('collect')} />
          </Panel>

          <div className={styles.twoUp}>
            <Panel tone="cream" no="Lending" when="A neighbour asks for the putty set you used once." title="The other side, on your own schedule."
              text="Who's asking, why, and what they're agreeing to. Drop it in the box when it suits you.">
              <Duo items={[['handle-request', 'A request'], ['list-item', 'List something']]} onOpen={openFlow('lend')} />
            </Panel>
            <Panel tone="wineDeep" no="Impact" when="Wondering whether it was worth it." title="Was it worth it?"
              text="Kronor saved, storage freed and CO₂ not emitted, before any badges. Half the badges are for lending.">
              <Duo items={[['impact', 'Impact'], ['badges', 'Badges']]} onOpen={openFlow('impact')} />
            </Panel>
          </div>
        </section>

        <section className={styles.section} aria-label="Edge cases">
          <Reveal as="h3" className={styles.h2}>When it doesn't go to plan.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The worries that stop people lending and borrowing, and what Sherry does about each.
          </Reveal>
          <div className={styles.edges}>
            {EDGES.map((e, i) => (
              <Reveal className={`${styles.edge} ${e.shot ? styles.edgeShot : ''}`} key={e.q} i={i % 3}>
                {e.shot && <Phone src={e.shot} />}
                <div>
                  <h4>{e.q}</h4>
                  <p>{e.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---- Written for everyone ---- */}
        <section className={styles.section} aria-label="Writing">
          <div className={styles.writing}>
            <div>
              <Reveal as="h3" className={styles.h2}>Written for someone still learning Swedish.</Reveal>
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

        {/* ================= 03 · The process ================= */}
        <Chapter no="03" title="The process" lead="Fieldwork first, then paper, then the screens." />

        <section className={styles.sectionFirst} aria-label="Steps">
          <Reveal as="h3" className={styles.h2}>How it went.</Reveal>
          <ol className={styles.timeline}>
            {STEPS.map(([h, t], i) => (
              <Reveal as="li" key={h} i={i % 3}>
                <span>{String(i + 1).padStart(2, '0')} · {h}</span>
                <p>{t}</p>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-label="Fieldwork">
          <Reveal as="h3" className={styles.h2}>I went where Kirseberg already meets.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Rather than sending a survey, I spent time in the places the district already gathers,
            and let the people running them tell me what it needs.
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
            <div className={styles.workshopLeft}>
              <Reveal className={styles.workshopText} i={1}>
                <span className={styles.label}>At the library</span>
                <h4>A card game about who you'd lend to.</h4>
                <p>
                  Visitors placed picture cards of things they own on a table split into three rows:
                  who lends, what gets lent, and who borrows. Then they tried different pairs of
                  people.
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
              <Reveal as="figure" className={`${styles.photo} ${styles.photoSmall}`} i={2}>
                <img src={`${W}/process/workshop-1.webp`} alt="The same game from above, with the rows labelled who lends, what is lent and who borrows." loading="lazy" />
              </Reveal>
            </div>
            <Reveal as="figure" className={`${styles.photo} ${styles.photoBig}`} i={1}>
              <img src={`${W}/process/workshop-2.webp`} alt="A card-sorting game on a library table, with picture cards of tools and kitchen gear." loading="lazy" />
            </Reveal>
          </div>
        </section>

        <section className={styles.section} aria-label="Findings">
          <Reveal as="h3" className={styles.h2}>Five things I heard.</Reveal>
          <div className={styles.findings}>
            {FINDINGS.map(([h, t], i) => (
              <Reveal className={`${styles.finding} ${i === 0 ? styles.findingKey : ''}`} key={h} i={i % 3}>
                <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
                <h4>{h}</h4>
                <p>{t}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-label="Sketches">
          <Reveal as="h3" className={styles.h2}>It started on paper.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The early sketches still offered a choice of where to pick things up: the library, or a
            meeting place. The more I heard, the clearer it got that the choice itself was the
            problem. In the final app, it's always the library.
          </Reveal>
          <div className={styles.paper}>
            {SKETCHES.slice(0, 3).map((s, i) => (
              <Reveal as="figure" className={`${styles.sheet} ${styles[`sheet${'ABC'[i]}`]}`} i={i + 1} key={s.src}>
                <button type="button" className={styles.openBtn} onClick={() => open(SKETCHES, s.src)} aria-label={`Open “${s.label}” full size`} data-cursor>
                  <img src={s.src} alt={s.alt} loading="lazy" />
                </button>
                <figcaption>{s.label}</figcaption>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-label="Rebuild">
          <Reveal as="h3" className={styles.h2}>What the rebuild changed.</Reveal>
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
          <Reveal className={styles.beforeAfter} i={1}>
            {BEFORE_AFTER.map((s) => (
              <figure key={s.src}>
                <button type="button" className={styles.openBtn} onClick={() => open(BEFORE_AFTER, s.src)} aria-label={`Open “${s.label}” full size`} data-cursor>
                  <span className={styles.phone}><img src={s.src} alt="" loading="lazy" /></span>
                </button>
                <figcaption><b>{s.tag}</b>{s.label}</figcaption>
              </figure>
            ))}
          </Reveal>
        </section>

        {/* ================= 04 · Looking back ================= */}
        <Chapter no="04" title="Looking back" lead="What it taught me, and what's left to prove." />

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
      {boxAt != null && <Lightbox shots={boxShots} index={boxAt} setIndex={setBoxAt} />}
    </>
  )
}

/* ---- Content ---- */
const PLACES: [string, string][] = [
  ['The library', 'Already trusted, already open, and keen to be more than books.'],
  ['The language café', 'Where I learned who the writing had to work for.'],
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

/** [when, what is happening, what Sherry does, screen]. One loan. */
const MOMENTS: [string, string, string, string][] = [
  ['Saturday morning', 'A shelf to hang, and no drill.', 'A search for “electric drill” finds 18 nearby, sorted by distance.', 'results'],
  ['Ten minutes later', 'One that fits.', 'Mattias’s drill, 400 m away, insured at 499 kr. Four terms, then the request.', 'item'],
  ['That afternoon', 'Mattias says yes.', 'He drops it in the library box when he’s passing. Nobody has to meet.', 'onboarding-dropbox'],
  ['On the way home', 'A code arrives.', '3821 opens the box. The loan shows every step it has been through.', 'dropbox-code'],
  ['Two weeks later', 'Back in the same box.', 'A quick review of the handover, the condition and the lender.', 'review'],
]

const TABS: [string, string][] = [
  ['Browse', 'What can I get?'],
  ['Loans', 'What’s mine right now?'],
  ['+', 'I have something spare.'],
  ['Inbox', 'Who needs an answer?'],
  ['You', 'Was this worth it?'],
]

const EDGES: { q: string; a: string; shot?: string }[] = [
  { q: 'It breaks or goes missing', a: 'The insured value is named before anyone asks, and the borrower covers it. Normal wear is fine, and the terms say so.', shot: 'terms' },
  { q: 'Plans change', a: 'Each loan keeps its own chat with the lender, beside the steps it has been through.', shot: 'dropbox-code' },
  { q: 'You can’t collect right away', a: 'There are three days from the code arriving, and the box opens whenever the library is open. Loans leads with what needs you today.', shot: 'borrowing' },
  { q: 'Will it come back?', a: 'The lender sees who is asking, their rating and why they want it, then a review closes every loan, on both sides.', shot: 'handle-request' },
  { q: 'Nobody is free to meet', a: 'Nobody has to be. The lender drops it in when passing, and the borrower collects when it suits them.', shot: 'onboarding-dropbox' },
  { q: 'It’s too far to collect', a: 'Onboarding ends by choosing your box, so the feed only shows what you could actually collect.', shot: 'onboarding-area' },
  { q: 'Swedish is hard to read', a: 'Short sentences, numbered terms, the person and the amount named, and every state in words: “Ready to collect”.' },
  { q: 'You’re only ever a borrower', a: 'Half the badges are earned by lending, and listing something spare takes one screen.' },
  { q: 'It never feels worth it', a: 'Impact comes first, in kronor not spent, storage not filled and CO₂ not emitted.' },
]

const STEPS: [string, string][] = [
  ['Fieldwork', 'Time in four places Kirseberg already meets, instead of a survey.'],
  ['A card game', 'At the library, visitors paired people and things to show who they would lend to.'],
  ['Five findings', 'What I heard, sorted into five things. The first became the spine.'],
  ['Paper', 'Every screen sketched, still offering a meeting place beside the library.'],
  ['First version', 'The app designed from the findings.'],
  ['The rebuild', 'The same research, with the interaction design done again.'],
]

const REBUILD: [string, string][] = [
  ['A PIN in a pop-up', 'A Loans tab split by direction, each loan with a timeline and an expiring code.'],
  ['Six bullets of legal-sounding text', 'Four numbered promises that name the lender and the insured amount.'],
  ['A badges page full of confetti', 'Impact first, in kronor, square metres and CO₂, then badges with progress, half of them for lending.'],
]

/* ---- Full-size sets ---- */
const shot = (src: string, label: string, note?: string): LightboxShot => ({ src: `${W}/${src}.webp`, label, note })

type FlowKey = 'start' | 'borrow' | 'collect' | 'lend' | 'impact'
const FLOWS: Record<FlowKey, LightboxShot[]> = {
  start: [
    shot('welcome', 'Welcome', 'Borrow from the neighbours you already walk past.'),
    shot('onboarding-dropbox', 'How it works', 'The lender drops it in the box; you open it with a one-time code.'),
    shot('onboarding-area', 'Your box', 'The one you can walk to. It decides what the feed shows.'),
  ],
  borrow: [
    shot('browse', 'Browse', 'What’s ready to collect first, then what’s fresh nearby.'),
    shot('search', 'Search', 'With how many of each thing are nearby, and rooms to browse by.'),
    shot('results', 'Results', 'Sorted by distance, with what’s already in the box marked.'),
    shot('item', 'The item', 'Longest loan, insured value and distance up front: 14 days, 499 kr, 400 m.'),
    shot('terms', 'Four terms', 'Plain promises that name the lender and the amount. Agreeing sends the request.'),
  ],
  collect: [
    shot('request-sent', 'Sent', 'The code arrives in Loans once the lender says yes.'),
    shot('dropbox-code', 'The code', 'Valid until the library closes, with every step of the loan below it.'),
    shot('borrowing', 'Your loans', 'Split by direction, leading with what needs you: collect today, return in 3 days.'),
    shot('review', 'Back in the box', 'A quick review: the handover, the condition, the communication.'),
  ],
  lend: [
    shot('lending-out', 'What you have out', 'Requests to answer, things waiting in the box, things out now.'),
    shot('handle-request', 'A request', 'Who’s asking, why, and what they agree to if you say yes.'),
    shot('list-item', 'List something', 'Photos, condition, insured value, and the box it goes through.'),
  ],
  impact: [
    shot('profile', 'You', 'Borrows, lends and rating, verified at the library.'),
    shot('impact', 'Your impact', '2,480 kr not spent, 1.4 m² not filled, 38 kg of CO₂ not emitted.'),
    shot('badges', 'Badges', 'With progress, and half of them earned by lending.'),
  ],
}

const SKETCHES: (LightboxShot & { alt: string })[] = [
  { src: `${W}/process/sketch-request.webp`, label: '“Where would you like to pick up the item? Library / Meeting place.”', alt: 'Sketch of the request flow, asking whether to pick up at the library or a meeting place.', detail: true },
  { src: `${W}/process/sketch-signup.webp`, label: 'Signing up with your library card, back when it was called Sharry.', alt: 'Sketch of sign-up through a library card, under the early name Sharry with a cherry logo.', detail: true },
  { src: `${W}/process/sketch-flows.webp`, label: 'Home, search, offers and listing, before the tabs settled.', alt: 'Sketches of home, search, messages, offers and listing screens.', detail: true },
  { src: `${W}/process/sketch-home-search.webp`, label: 'Home and search, with one version crossed out.', alt: 'Sketches of the home and search screens, one crossed out.', detail: true },
  { src: `${W}/process/sketch-listing.webp`, label: 'Listing something: photos, category, brand, condition and an insurance price, with logo doodles beside it.', alt: 'Sketches of the listing flow with category, brand and condition pickers, and early logo doodles.', detail: true },
]

const BEFORE_AFTER: (LightboxShot & { tag: string })[] = [
  { src: `${W}/process/badges-before.webp`, tag: 'Before', label: 'Badges as the whole page, each a big medal with a line of praise.' },
  { src: `${W}/impact.webp`, tag: 'After', label: 'Impact first, in kronor, square metres and CO₂.' },
  { src: `${W}/badges.webp`, tag: 'After', label: 'Then badges, with progress, half of them for lending.' },
]

/* ---- Pieces ---- */
type Tone = 'wine' | 'wineDeep' | 'moss' | 'cream'

/** A chapter opener: the number, the title, and the one line it argues. */
function Chapter({ no, title, lead }: { no: string; title: string; lead: string }) {
  return (
    <header className={styles.chapter}>
      <Reveal as="p" className={styles.chapterNo}>
        <i aria-hidden="true" />
        {no}
      </Reveal>
      <Reveal as="h2" className={styles.chapterTitle} i={1}>{title}</Reveal>
      <Reveal as="p" className={styles.chapterLead} i={2}>{lead}</Reveal>
    </header>
  )
}

function Panel({ tone, no, when, title, text, children }: { tone: Tone; no: string; when: string; title: string; text: string; children: ReactNode }) {
  return (
    <Reveal as="article" className={`${styles.panel} ${styles[tone]}`}>
      {children}
      <div className={styles.cap}>
        <span className={styles.no}>{no}</span>
        <h3>{title}</h3>
        <p>{text}</p>
        <p className={styles.when}><span>When</span>{when}</p>
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

/** A screen that opens its flow full size. */
function OpenPhone({ src, label, onOpen }: { src: string; label: string; onOpen: (src: string) => void }) {
  return (
    <button type="button" className={styles.openBtn} onClick={() => onOpen(src)} aria-label={`Open “${label}” full size`} data-cursor>
      <Phone src={src} />
    </button>
  )
}

function Trio({ items, onOpen }: { items: [string, string][]; onOpen: (src: string) => void }) {
  return (
    <div className={styles.trio}>
      {items.map(([src, label]) => (
        <figure key={src}>
          <OpenPhone src={src} label={label} onOpen={onOpen} />
          <figcaption>{label}</figcaption>
        </figure>
      ))}
    </div>
  )
}

function Duo({ items, onOpen }: { items: [string, string][]; onOpen: (src: string) => void }) {
  return (
    <div className={styles.duo}>
      {items.map(([src, label]) => (
        <figure key={src}>
          <OpenPhone src={src} label={label} onOpen={onOpen} />
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
          const x = 36 + c * 70, y = 82 + r * 64, opened = r === 1 && c === 1
          return opened ? (
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
