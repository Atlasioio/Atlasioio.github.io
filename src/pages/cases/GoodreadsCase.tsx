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
import styles from './GoodreadsCase.module.css'

/**
 * The Goodreads case study (route "/work/goodreads"). Warm paper, brown ink and
 * one rust accent, like the redesign itself. The page runs context → problem →
 * solution (the flows) → process → looking back; every phone opens full size
 * with the rest of its flow. The serif appears only where a reader is talking.
 */

const W = '/work/goodreads'

export function GoodreadsCase() {
  useLenis()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const project = projects.find((p) => p.id === 'goodreads') as Project
  const idx = projects.findIndex((p) => p.id === 'goodreads')
  const next = projects[(idx + 1) % projects.length]

  // Hold the route transition until the hero photo has decoded.
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

  // The full-size viewer: one set of screens (a flow, the homes, a board) at a time.
  const [boxShots, setBoxShots] = useState<LightboxShot[]>([])
  const [boxAt, setBoxAt] = useState<number | null>(null)
  const open = (shots: LightboxShot[], i: number) => {
    setBoxShots(shots)
    setBoxAt(i)
  }

  return (
    <>
      <RouteTransition key="goodreads" accent={project.accent} ready={heroReady} />
      {/* Light over the photo hero, dark once past it (the hero is #hero). */}
      <FixedControls home />
      <LangFixed />
      <Menu />

      <main className={styles.page} id="top">
        {/* ---- Hero ---- */}
        <header className={styles.hero} id="hero">
          <div className={styles.heroPhoto} />
          <div className={styles.heroFade} />
          <div className={styles.heroPhones} aria-hidden="true">
            <span className={styles.cover}><img src={`${W}/cover-home.webp`} alt="" /></span>
            <span className={styles.cover}><img src={`${W}/cover-book-page.webp`} alt="" /></span>
          </div>
          <div className={styles.heroCopy}>
            <Reveal as="p" className={styles.eyebrow}>Concept · Redesign</Reveal>
            <Reveal as="h1" className={styles.title} i={1}>
              Goodreads, rebuilt
              <br />
              around <em>reading.</em>
            </Reveal>
            <Reveal as="p" className={styles.lede} i={2}>
              The largest book app in the world, where you can't actually read. A redesign that
              puts the book back in the middle and keeps everything people love about Goodreads.
            </Reveal>
            {/* phones get one short line instead */}
            <Reveal as="p" className={styles.ledeShort} i={2}>
              The largest book app in the world, rebuilt so you can actually read in it.
            </Reveal>
            <Reveal as="p" className={styles.credits} i={3}>
              Product design · Research, structure, interaction, visual system
            </Reveal>
          </div>
        </header>

        {/* ---- The facts ---- */}
        <section className={styles.facts} aria-label="Project facts">
          {[
            ['Role', 'Solo: research, structure, interaction and visual design'],
            ['Context', 'A self-initiated redesign'],
            ['Platform', 'The Goodreads phone app'],
            ['Status', 'Concept, not yet tested with readers'],
          ].map(([k, v], i) => (
            <Reveal className={styles.fact} key={k} i={i}>
              <span>{k}</span>
              <p>{v}</p>
            </Reveal>
          ))}
        </section>

        {/* ================= 00 · Context ================= */}
        <Chapter no="00" title="Context" lead="A redesign I set myself." />

        <section className={styles.context} aria-label="Context">
          <Reveal as="p" className={styles.contextLead}>
            The biggest book app in the world has hardly changed in a decade, and people still keep
            their reading in it. I set myself a brief: keep what they love about it, fix what's
            broken, and give it the one thing it's missing.
          </Reveal>
          <div className={styles.contextGrid}>
            {CONTEXT.map(([k, v], i) => (
              <Reveal className={styles.contextItem} key={k} i={i}>
                <span>{k}</span>
                <p>{v}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= 01 · The problem ================= */}
        <Chapter no="01" title="The problem" lead="Every feature is there. Reading isn't." />

        <section className={styles.story} aria-label="The problem">
          <div>
            <Reveal as="p" className={styles.storyLead}>
              Goodreads is where millions of people keep track of what they read. You just can't
              read in it.
            </Reveal>
            <Reveal as="p" i={1}>
              The books live in Kindle or on paper. Quotes get screenshotted and forgotten in a
              camera roll. Notes end up in other apps. Goodreads comes last, and receives nothing
              but a star rating.
            </Reveal>
          </div>
        </section>

        <section className={styles.section} aria-label="Where a passage goes">
          <Reveal as="h3" className={styles.h2}>Where a passage goes today.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Following one line someone loved, from the page to Goodreads.
          </Reveal>
          <Reveal className={styles.chain} i={2}>
            {CHAIN.map(([where, what], i) => (
              <div className={`${styles.step} ${i === CHAIN.length - 1 ? styles.stepLast : ''}`} key={where}>
                <span className={styles.stepWhere}>{where}</span>
                <span className={styles.stepWhat}>{what}</span>
              </div>
            ))}
          </Reveal>
          <Reveal as="p" className={styles.chainNote} i={1}>Four apps, six steps, nothing searchable.</Reveal>
        </section>

        <section className={styles.section} aria-label="Two readers">
          <Reveal as="h3" className={styles.h2}>Two readers it fails differently.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            From conversations with readers and a read of public reviews. Directional, not
            statistical.
          </Reveal>
          <div className={styles.readers}>
            {READERS.map((r, i) => (
              <Reveal as="article" className={styles.reader} key={r.name} i={i}>
                <div className={styles.who}>
                  <b>{r.name}</b>
                  <span>{r.tag}</span>
                </div>
                <p className={styles.quote}>“{r.quote}”</p>
                <dl>
                  <dt>Wants</dt><dd>{r.wants}</dd>
                  <dt>Today</dt><dd>{r.today}</dd>
                  <dt>Needs</dt><dd>{r.needs}</dd>
                </dl>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-label="The app today">
          <Reveal as="h3" className={styles.h2}>What the app does today.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            An audit of the current Android app on a real account with 143 books. Four findings
            drove the redesign.
          </Reveal>
          <div className={styles.audit} role="table" aria-label="Audit findings">
            <div className={`${styles.auditRow} ${styles.auditHead}`} role="row">
              <span role="columnheader">What's there</span>
              <span role="columnheader">What it costs</span>
              <span role="columnheader">Decision</span>
            </div>
            {AUDIT.map(([what, cost, decision], i) => (
              <Reveal className={styles.auditRow} key={what} i={i % 3} role="row">
                <b role="cell">{what}</b>
                <span role="cell">{cost}</span>
                <span role="cell" className={styles.decision}>{decision}</span>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-label="When it is used">
          <Reveal as="h3" className={styles.h2}>When someone reaches for it.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            One book, as the redesign is meant to be used: from a line on the train to the review.
          </Reveal>
          <ol className={styles.moments}>
            {MOMENTS.map(([when, h, t, src], i) => (
              <Reveal as="li" className={styles.moment} key={when} i={i}>
                <Phone src={src} />
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
        <Chapter no="02" title="The solution" lead="If the app holds the book, it knows your page." />

        <section className={styles.sectionFirst} aria-label="One change">
          <Reveal as="h3" className={styles.h2}>Reading moves into the app.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Because the app knows your page, four features stop needing to be built separately:
            quote capture, progress, spoiler control, and a finish moment worth marking.
          </Reveal>
          <Reveal className={styles.shift} i={2}>
            <span className={styles.shiftLabel}>One boundary moved</span>
            <div className={styles.pills}>
              <span>You read, in the app</span><i aria-hidden="true">→</i>
              <span>A highlight becomes a quote</span><i aria-hidden="true">→</i>
              <span>It becomes the review</span>
            </div>
          </Reveal>
        </section>

        <section className={styles.section} aria-label="Five changes">
          <Reveal as="h3" className={styles.h2}>Five changes, one idea.</Reveal>
          <div className={styles.changes}>
            {CHANGES.map(([h, lead, text], i) => (
              <Reveal className={styles.change} key={h} i={i % 3}>
                <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
                <h4>{h}</h4>
                <p><strong>{lead}</strong> {text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-label="Structure">
          <Reveal as="h3" className={styles.h2}>Four tabs, each job in one place.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Readers come to keep track, to find the next book, and to talk about books. Today each
            job is split across five tabs and ends in a drawer, and the one thing the app is named
            after has no tab at all.
          </Reveal>
          <Reveal className={styles.ia} i={2}>
            <span className={styles.iaLabel}>Today</span>
            <div className={styles.iaRow} style={{ '--n': 6 } as CSSProperties}>
              <div className={`${styles.tab} ${styles.tabMissing}`}>
                <span className={styles.tabName}>Reading</span>
                <span className={styles.job}>Missing</span>
                <p>No tab, no screen, no data.</p>
              </div>
              {BEFORE.map(([name, job, note]) => (
                <div className={styles.tab} key={name}>
                  <span className={styles.tabName}>{name}</span>
                  <span className={styles.job}>{job}</span>
                  <p>{note}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className={styles.ia} i={3}>
            <span className={styles.iaLabel}>After</span>
            <div className={styles.iaRow} style={{ '--n': 4 } as CSSProperties}>
              {AFTER.map(([name, job, note], k) => (
                <div className={`${styles.tab} ${styles.tabAfter} ${k === 0 ? styles.tabNew : ''}`} key={name}>
                  <span className={styles.tabName}>{name}</span>
                  <span className={styles.job}>{k === 0 ? 'New · ' : ''}{job}</span>
                  <p>{note}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className={styles.absorbed} i={1}>
            <span className={styles.iaLabel}>Moved, not cut</span>
            <ul>
              {ABSORBED.map(([from, to]) => (
                <li key={from}>{from} <span aria-hidden="true">→</span> {to}</li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section className={`${styles.section} ${styles.sectionHead}`} aria-label="The key flows">
          <Reveal as="h3" className={styles.h2}>The key flows.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Six moments, each from a real situation. Any screen opens full size; the arrow keys
            step through the rest.
          </Reveal>
        </section>

        <section className={styles.panels} aria-label="Key flows">
          <Panel tone="rust" no="Reading" when="On the train, a line stops you." title="A line you love becomes a quote, with its page."
            text="No screenshot, no copying into another app. The quote, the page and your note stay with the book."
            extra={<p className={styles.book}>“It was small men with their small acts and their small reasons.” <span>Red Country, p.238</span></p>}>
            <FlowRow flow="read" onOpen={(i) => open(FLOWS.read, i)} />
          </Panel>

          <Panel tone="paper" no="Home and the book" when="Evening, opening the app." title="Pick up where you left off."
            text="Home opens on the book in your hands, how far you are, and what you've kept from it. On the book page, continue reading comes first.">
            <FlowRow flow="home" onOpen={(i) => open(FLOWS.home, i)} />
          </Panel>

          <Panel tone="ink" no="Discover and Book Talk" when="Nothing lined up to read next." title="Find books the way people already do."
            text="Recommendations that say why, and Book Talk: videos about books and nothing else. Want to read is one tap from the video.">
            <FlowRow flow="discover" onOpen={(i) => open(FLOWS.discover, i)} />
          </Panel>

          <Panel tone="deep" no="My Books" when="Looking for that quote from last month." title="Your shelves, at a glance."
            text="Covers at a size you recognise, sort and filter on top, and lists, tags and quotes in front instead of buried.">
            <FlowRow flow="shelves" onOpen={(i) => open(FLOWS.shelves, i)} />
          </Panel>

          <Panel tone="rustDeep" no="Finishing a book" when="The last page." title="Rate it how you actually felt."
            text="Drag to the rating, half stars included. Then a word or two, and the review if you want one, with the quotes you kept waiting under the draft.">
            <FlowRow flow="finish" onOpen={(i) => open(FLOWS.finish, i)} />
          </Panel>

          <Panel tone="paper" no="Community" when="Seeing what friends made of a book." title="Made things, not activity."
            text="The feed carries reviews and quotes people actually wrote, not a wall of 'rated three stars' events.">
            <FlowRow flow="community" onOpen={(i) => open(FLOWS.community, i)} />
          </Panel>
        </section>

        <section className={styles.section} aria-label="Edge cases">
          <Reveal as="h3" className={styles.h2}>When it doesn't go to plan.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The moments a book app usually gets wrong, and what the redesign does in each.
          </Reveal>
          <div className={styles.edges}>
            {EDGES.map((e, i) => (
              <Reveal className={`${styles.edge} ${styles.edgeShot}`} key={e.q} i={i % 3}>
                <Phone src={e.shot} />
                <div>
                  <h4>{e.q}</h4>
                  <p>{e.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= 03 · The process ================= */}
        <Chapter no="03" title="The process" lead="Look first, then decide what not to touch." />

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

        <section className={styles.section} aria-label="What I looked at first">
          <Reveal as="h3" className={styles.h2}>What I looked at first.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Five apps people already use for books, compared on what a reader actually does with
            them. Each owns one part; none owns the whole set.
          </Reveal>
          <Reveal i={2}>
            <button type="button" className={`${styles.openBtn} ${styles.board} ${styles.boardTop}`} onClick={() => open(MATRIX, 0)} aria-label="Open the comparison full size" data-cursor>
              <img src={`${W}/process/competitive-matrix.webp`} alt="A comparison of Goodreads, StoryGraph, Fable, Storytel, Kindle and BookTok across reading, quotes, discovery, organisation, conversation and catalogue." loading="lazy" />
            </button>
          </Reveal>
        </section>

        {/* ---- The scope: what stayed, what changed ---- */}
        <section className={styles.section} aria-label="Scope">
          <Reveal as="h3" className={styles.h2}>What stayed, and what changed.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Readers aren't leaving because Goodreads looks like Goodreads. Sorting it into what's
            loved and what's broken decided the scope, and is why this is a redesign, not a rebrand.
          </Reveal>
          <div className={styles.scope}>
            <Reveal className={styles.scopeCol} i={1}>
              <h4 className={styles.scopeHead}>Keep</h4>
              <ul>{KEEP.map(([h, t]) => <li key={h}><b>{h}</b><span>{t}</span></li>)}</ul>
            </Reveal>
            <Reveal className={`${styles.scopeCol} ${styles.scopeFix}`} i={2}>
              <h4 className={styles.scopeHead}>Fix</h4>
              <ul>{FIX.map(([h, t]) => <li key={h}><b>{h}</b><span>{t}</span></li>)}</ul>
            </Reveal>
          </div>
        </section>

        {/* ---- Exploring, and the system ---- */}
        <section className={styles.section} aria-label="Exploring">
          <Reveal as="h3" className={styles.h2}>Three homes, not three mood boards.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The disagreement was about structure, not style, so I built three whole home screens to
            compare. The Stack won: your books as a pile you reach into, with the covers doing the
            visual work.
          </Reveal>
          <Reveal className={styles.explore} i={2}>
            {EXPLORATIONS.map(([file, name, note, won], i) => (
              <figure key={file} className={won ? styles.won : undefined}>
                <button type="button" className={styles.openBtn} onClick={() => open(HOMES, i)} aria-label={`Open ${name} full size`} data-cursor>
                  <img src={`${W}/${file}.webp`} alt={`Home exploration: ${name}`} loading="lazy" decoding="async" />
                </button>
                <figcaption>
                  <b>{name}{won ? <em>Chosen</em> : null}</b>
                  <span>{note}</span>
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </section>

        <section className={styles.section} aria-label="The system">
          <Reveal as="h3" className={styles.h2}>Paper to brown, so the covers are the colour.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Book covers are the loudest thing in the product. The palette stays out of their way,
            and spends its one strong colour on one action per screen.
          </Reveal>
          <div className={styles.swatches}>
            {SWATCHES.map(([name, hex], i) => (
              <Reveal className={styles.swatch} key={name} i={i % 3}>
                <span className={styles.chip} style={{ background: hex }} />
                <b>{name}</b>
                <span>{hex}</span>
              </Reveal>
            ))}
          </div>
          <div className={styles.sysGrid}>
            <Reveal className={styles.sysCol} i={1}>
              <span className={styles.iaLabel}>Type</span>
              <p className={styles.specSerif}>Red Country</p>
              <p className={styles.specNote}>Literata · titles, book text and quotes</p>
              <p className={styles.specDisplay}>My Books</p>
              <p className={styles.specNote}>Bricolage Grotesque · screen titles and numbers</p>
              <p className={styles.specSans}>Interface copy, metadata, buttons</p>
              <p className={styles.specNote}>DM Sans · everything functional</p>
            </Reveal>
            <Reveal className={styles.sysCol} i={2}>
              <span className={styles.iaLabel}>Components</span>
              <div className={styles.btns}>
                <span className={styles.btnPrimary}>Primary</span>
                <span className={styles.btnSecondary}>Secondary</span>
                <span className={styles.btnQuiet}>Quiet</span>
              </div>
              <p className={styles.rating}>
                <span aria-hidden="true">★★★★<span className={styles.halfStar}>★</span></span> 4.5 · Loved it
              </p>
              <p className={styles.specNote}>Half stars, and a word attached to every value.</p>
            </Reveal>
            <Reveal className={styles.sysCol} i={3}>
              <span className={styles.iaLabel}>The call that simplified everything</span>
              <div className={styles.doDont}>
                <div>
                  <div className={styles.mini}><span className={styles.miniBook} /><span className={styles.miniGreen}>Want to read</span></div>
                  <p><b>Don't.</b> A green accent puts a second loud colour beside every cover. The covers lose.</p>
                </div>
                <div>
                  <div className={styles.mini}><span className={styles.miniBook} /><span className={styles.miniRust}>Want to read</span></div>
                  <p><b>Do.</b> Rust sits inside the paper-to-brown family, so it reads as the app's own voice.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================= 04 · Looking back ================= */}
        <Chapter no="04" title="Looking back" lead="What it taught me, and what I'd test first." />

        {/* ---- Reflection ---- */}
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
const CONTEXT: [string, string][] = [
  ['The brief', 'Keep it bookish and recognisable, make it clearer and calmer, and make room for reading.'],
  ['The test', 'Would a reader coming back after two years still know where they are?'],
  ['What I did', 'All of it, on my own: research, structure, interaction and the visual system.'],
]

/** [when, what is happening, what the redesign does, screen]. One book. */
const MOMENTS: [string, string, string, string][] = [
  ['On the train', 'A line stops you.', 'Highlight it, and it’s kept as a quote with its page.', 'highlight'],
  ['That evening', 'Back to the book.', 'Home opens on it: how far you are, and what you kept.', 'home'],
  ['Late at night', 'A book on someone’s video.', 'Book Talk keeps it in the app. Want to read is one tap.', 'discover-shorts'],
  ['The last page', 'Finished.', 'Rate it how you felt, half stars included.', 'rate'],
  ['Writing the review', 'What did I think?', 'The quotes you kept wait under the draft.', 'write-review'],
]

const EDGES: { q: string; a: string; shot: string }[] = [
  { q: 'You haven’t finished it yet', a: 'Reviews in the feed stop at the page you’re on, and club chat is locked to your chapter, so nobody spoils the ending.', shot: 'community-feed' },
  { q: 'You just want to log it', a: 'Everything after the last page is optional: shelve it as read, or save the rating only.', shot: 'finished' },
  { q: 'You gave up on it', a: 'Did-not-finish gets a shelf of its own, instead of being hidden.', shot: 'my-books' },
  { q: 'It’s between three and four stars', a: 'Tap the same star again for a half. A 3.5 is a real opinion.', shot: 'rate' },
  { q: 'Not everyone should see it', a: 'Who sees your review sits right under it, and spoilers hide behind a tap.', shot: 'write-review' },
  { q: 'You already own the book', a: 'Search covers everything, but the books on your shelves come first.', shot: 'search' },
]

const STEPS: [string, string][] = [
  ['Look', 'The app taken apart screen by screen, public reviews and forum threads read through, readers asked, five competitors compared.'],
  ['Decide what not to touch', 'What readers love sorted from what’s broken, the problem in one sentence, and five principles.'],
  ['The structure', 'Five tabs and a drawer became four, each job in one place.'],
  ['Three directions', 'Three whole home screens, then one.'],
  ['The system', 'Paper to brown, and the green accent dropped three rounds in.'],
  ['The hero flow', 'Finishing, rating, reviewing and shelving a book, end to end.'],
]

const READERS = [
  {
    name: 'Maya',
    tag: 'the keeper · 30–60 books a year',
    quote: 'I have 400 screenshots of book pages and I have never once looked at them again.',
    wants: 'The passage, with its page, findable later.',
    today: 'Goodreads is her shelf of record. The real work happens in Notes and a camera roll.',
    needs: 'Highlights that turn into quotes, and a review that starts from what she already wrote.',
  },
  {
    name: 'Sam',
    tag: 'the drifter · 6–12 books a year',
    quote: 'I hear about a book, add it, and then it sits on a list of sixty-nine forever.',
    wants: 'A reason to start one of them tonight.',
    today: 'Discovery happens on TikTok, storage happens on Goodreads, reading happens rarely.',
    needs: 'Discovery inside the app, and a nudge from want-to-read to actually reading.',
  },
]

const CHANGES: [string, string, string][] = [
  ['Read it here.', 'You can’t read on Goodreads.', 'Now there’s a reader in the app, so progress tracks itself instead of being a number you type in. Amazon already owns Kindle and Audible; keeping them separate from the place you track books never made sense.'],
  ['Keep what you read.', 'Quotes get lost in camera rolls.', 'Highlight a line and it’s kept as a quote, with its page. Add a note as you go. When you review the book, everything you kept is waiting under the draft.'],
  ['Book Talk.', 'People find books on BookTok, then come here to file them.', 'Book Talk is a video tab for short and longer videos about books, and nothing else: no dances, no ads for other things. Want to read is one tap from the video.'],
  ['Half stars.', 'Whole stars only is one of the oldest complaints about Goodreads.', 'A 3.5 is a real opinion. Drag across the stars to where you land: three, three and a half, four and a half.'],
  ['Still Goodreads.', 'The design is dated, but the feel is worth keeping.', 'One standard palette from paper to brown, a serif for reading, and clearer navigation: five tabs and a drawer became four. The covers stay the loudest thing on every screen.'],
]

/* ---- Pieces ---- */
type Tone = 'rust' | 'rustDeep' | 'paper' | 'deep' | 'ink'

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

function Panel({ tone, no, when, title, text, extra, children }: { tone: Tone; no: string; when: string; title: string; text: string; extra?: ReactNode; children: ReactNode }) {
  return (
    <Reveal as="article" className={`${styles.panel} ${styles[tone]}`}>
      {children}
      <div className={styles.cap}>
        <span className={styles.no}>{no}</span>
        <h3>{title}</h3>
        <p>{text}</p>
        {extra}
        <p className={styles.when}><span>When</span>{when}</p>
      </div>
    </Reveal>
  )
}

/** A bare 786×1704 screen in a bezel. */
function Phone({ src }: { src: string }) {
  return (
    <span className={styles.phone}>
      <img src={`${W}/${src}.webp`} alt="" loading="lazy" decoding="async" />
    </span>
  )
}

/** A whole flow in a row, numbered; any screen opens it full size. Centred when
 *  it fits, and scrolls sideways when it doesn't. */
function FlowRow({ flow, onOpen }: { flow: FlowKey; onOpen: (i: number) => void }) {
  return (
    <div className={styles.flowRow}>
      <ol className={styles.flowTrack}>
        {FLOWS[flow].map((s, i) => (
          <li key={s.src}>
            <button type="button" className={styles.openBtn} onClick={() => onOpen(i)} aria-label={`Open “${s.label}” full size`} data-cursor>
              <span className={styles.phone}><img src={s.src} alt="" loading="lazy" decoding="async" /></span>
            </button>
            <span className={styles.flowCap}><b>{String(i + 1).padStart(2, '0')}</b>{s.label}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ---- Scope ---- */
const KEEP: [string, string][] = [
  ['The catalogue', 'Nobody fails to find a book here.'],
  ['The social graph', 'Years of friends and shelves: why readers stay.'],
  ['The five-star scale', 'The language readers already speak.'],
  ['Shelf vocabulary', 'Want to read, Currently reading, Read.'],
  ['Paper and brown ink', 'Warm and bookish already. Updated, not swapped.'],
]
const FIX: [string, string][] = [
  ['A feed of events', '“Rated it ★★★” can’t be replied to. Now it’s things people made.'],
  ['Five tabs and a drawer', 'Four tabs. Everything in More moved, nothing cut.'],
  ['A library of text rows', 'Covers, counts, sort, filter, lists and tags on the surface.'],
  ['Whole stars only', 'Half stars, and a word for what a rating means.'],
  ['Discovery left for video', 'Book Talk brings it inside, so a video can land on a shelf.'],
  ['No reading', 'A reader, so quotes, notes and progress follow.'],
]

/* ---- Structure ---- */
const BEFORE: [string, string, string][] = [
  ['Home', 'Talk', 'An event feed with nothing to reply to.'],
  ['My Books', 'Keep track', 'Three text rows. No sort, no filter.'],
  ['Discover', 'Find next', 'Impersonal lists, not based on taste.'],
  ['Search', 'Find next', 'A tab repeating the search bar above it.'],
  ['More', 'All three', 'Groups, quotes, challenges, settings, in a drawer.'],
]
const AFTER: [string, string, string][] = [
  ['Reading', 'Read', 'Opens the book itself: reader, highlights, quotes, notes, progress.'],
  ['My Books', 'Keep track', 'Shelves, lists, tags and quotes, with sort and filter on top.'],
  ['Discover', 'Find next', 'Browse and Book Talk under one search field. Recommendations say why.'],
  ['Community', 'Talk', 'Things people made, and clubs. Chat locked to your chapter.'],
]
const ABSORBED: [string, string][] = [
  ['Search', 'Discover'],
  ['Groups', 'Clubs'],
  ['Quotes', 'My Books'],
  ['Challenges', 'the goal row'],
  ['Notifications', 'the bell on every tab'],
]

/* ---- System ---- */
const SWATCHES: [string, string][] = [
  ['Paper', '#F7F4ED'],
  ['Card', '#FFFDF8'],
  ['Quiet fill', '#EDE7DA'],
  ['Action', '#A24E1C'],
  ['Deep', '#8A3F14'],
  ['Ink', '#3A2A18'],
]

/* ---- The problem ---- */
const AUDIT: [string, string, string][] = [
  ['Home feed', 'Three cards, three events, nothing a person wrote: two by the same user, one a man replying to himself.', 'The feed carries only things people made. Bare activity collapses to one line.'],
  ['Currently reading', '“0 books”: a hole in the library, because logging progress is manual work with no reward.', 'The app holds the book. Progress becomes a by-product of reading.'],
  ['My Books', '143 books as three text rows. No sort, no filter, no search inside your shelves; tags empty.', 'Covers at a recognisable size, controls on top, lists and tags up front.'],
  ['Reading', 'No such screen. It happens in another company’s app and comes back as a typed-in number.', 'A reader, with highlight → quote as the hinge of the whole redesign.'],
]
const CHAIN: [string, string][] = [
  ['Kindle / paper', 'You read'],
  ['Screenshot', 'A passage lands'],
  ['Camera roll', 'It’s lost'],
  ['Notes app', 'Maybe retyped'],
  ['Goodreads', '“Rated it ★★★”'],
]

/* ---- Full-size sets ---- */
const shot = (src: string, label: string, note?: string): LightboxShot => ({ src: `${W}/${src}.webp`, label, note })

type FlowKey = 'read' | 'home' | 'discover' | 'shelves' | 'finish' | 'community'
const FLOWS: Record<FlowKey, LightboxShot[]> = {
  read: [
    shot('reader', 'Read', 'One serif column at a real reading measure, with the chrome cut back to the title and type size.'),
    shot('highlight', 'Highlight', 'Select a passage and the toolbar comes to you.'),
    shot('quote-kept', 'It’s kept', 'Kept word for word, with its page already filled in.'),
  ],
  home: [
    shot('home', 'Home', 'Your stack, how far you are, and what you’ve kept from the book in your hands.'),
    shot('book-page', 'The book page', 'The cover’s colour floods the top. Continue reading comes first, your quotes and notes beside it.'),
    shot('book-snapshot', 'The snapshot', 'Author, rating, series and length, without leaving the page.'),
  ],
  discover: [
    shot('discover-browse', 'Discover', 'Recommendations that say why: the book in your hands, or someone you trust.'),
    shot('discover-shorts', 'Book Talk', 'Videos about books and nothing else. Want to read is one tap away.'),
    shot('search', 'Search', 'Global, but the books on your shelves come first.'),
  ],
  shelves: [
    shot('my-books', 'My Books', 'Shelves first, did-not-finish included, with sort, filter and search on top.'),
    shot('my-books-lists', 'Lists, tags, quotes', 'Lists as cover stacks, tags with counts, and quotes and notes as a place to go.'),
  ],
  finish: [
    shot('finished', 'Finished', 'How long it took, how many quotes you kept, and where it puts you against your goal.'),
    shot('rate', 'How was it?', 'Half stars, and a word or two if you want: “Bleak but beautiful”.'),
    shot('write-review', 'The review', 'The quotes you kept wait under the draft. Spoilers hide behind a tap.'),
  ],
  community: [
    shot('community-feed', 'Community', 'Reviews and quotes people wrote. Bare activity collapses to one line.'),
  ],
}

const MATRIX: LightboxShot[] = [
  { src: `${W}/process/competitive-matrix.webp`, label: 'Nobody owns the whole set', note: 'Reading, quotes, discovery, organisation, conversation and catalogue, across six apps.', detail: true },
]

/* ---- Explorations ---- */
const EXPLORATIONS: [string, string, string, boolean][] = [
  ['explore-still-reading', 'Still reading', 'Calm and editorial, but progress is still a button you press.', false],
  ['explore-ledger', 'The Ledger', 'Every number on show. Useful, and it turns reading into homework.', false],
  ['explore-stack', 'The Stack', 'Your books as a pile you reach into, the covers doing the work.', true],
]

const HOMES: LightboxShot[] = EXPLORATIONS.map(([file, name, note]) => ({ src: `${W}/${file}.webp`, label: name, note }))
