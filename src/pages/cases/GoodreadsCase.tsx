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
import styles from './GoodreadsCase.module.css'

/**
 * The Goodreads case study, built for Goodreads alone (route "/work/goodreads").
 * Warm paper, brown ink and one rust accent, like the redesign itself. Type is
 * the site's; the serif appears only where the product or a reader is talking.
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

        {/* ---- Story ---- */}
        <section className={styles.story} aria-label="The story">
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
            <Reveal as="p" i={2}>
              The design hasn't kept up either. But a redesign that throws away the feel of
              Goodreads would lose what people come back for. So the brief was the opposite of a
              makeover: keep it bookish and recognisable, make it clearer and calmer, and give it
              the one thing it's missing.
            </Reveal>
          </div>
        </section>

        {/* ---- Two readers ---- */}
        <section className={styles.section} aria-label="Two readers">
          <Reveal as="h2" className={styles.h2}>Two readers it fails differently.</Reveal>
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

        {/* ---- The problem ---- */}
        <section className={styles.section} aria-label="The problem">
          <Reveal as="h2" className={styles.h2}>Every feature is there. Reading isn't.</Reveal>
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

          <Reveal as="h3" className={styles.h3} i={1}>Where a passage goes today.</Reveal>
          <Reveal className={styles.chain} i={2}>
            {CHAIN.map(([where, what], i) => (
              <div className={`${styles.step} ${i === CHAIN.length - 1 ? styles.stepLast : ''}`} key={where}>
                <span className={styles.stepWhere}>{where}</span>
                <span className={styles.stepWhat}>{what}</span>
              </div>
            ))}
          </Reveal>
          <Reveal as="p" className={styles.chainNote} i={1}>Four apps, six steps, nothing searchable.</Reveal>
          <Reveal className={styles.redrawn} i={2}>
            <span className={styles.redrawnLabel}>Redrawn: one boundary moved</span>
            <div className={styles.pills}>
              <span>You read, in the app</span><i aria-hidden="true">→</i>
              <span>A highlight becomes a quote</span><i aria-hidden="true">→</i>
              <span>It becomes the review</span>
            </div>
            <p>
              Because the app knows your page, four features stop needing to be built separately:
              quote capture, progress, spoiler control, and a finish moment worth marking.
            </p>
          </Reveal>
        </section>

        {/* ---- The scope: what stayed, what changed ---- */}
        <section className={styles.section} aria-label="Scope">
          <Reveal as="h2" className={styles.h2}>What stayed, and what changed.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Readers aren't leaving because Goodreads looks like Goodreads. Sorting it into what's
            loved and what's broken decided the scope, and is why this is a redesign, not a rebrand.
          </Reveal>
          <div className={styles.scope}>
            <Reveal className={styles.scopeCol} i={1}>
              <h3 className={styles.scopeHead}>Keep</h3>
              <ul>{KEEP.map(([h, t]) => <li key={h}><b>{h}</b><span>{t}</span></li>)}</ul>
            </Reveal>
            <Reveal className={`${styles.scopeCol} ${styles.scopeFix}`} i={2}>
              <h3 className={styles.scopeHead}>Fix</h3>
              <ul>{FIX.map(([h, t]) => <li key={h}><b>{h}</b><span>{t}</span></li>)}</ul>
            </Reveal>
          </div>
          <Reveal as="p" className={styles.test} i={1}>
            The test every change had to pass: would a reader coming back after two years still know
            where they are?
          </Reveal>
        </section>

        {/* ---- Five changes ---- */}
        <section className={styles.section} aria-label="Five changes">
          <Reveal as="h2" className={styles.h2}>Five changes, one idea.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            If the app holds the book, it knows your page. Most of what follows comes from that one
            decision.
          </Reveal>
          <div className={styles.changes}>
            {CHANGES.map(([h, lead, text], i) => (
              <Reveal className={styles.change} key={h} i={i % 3}>
                <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{h}</h3>
                <p><strong>{lead}</strong> {text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---- Structure: today vs after, as tab bars ---- */}
        <section className={styles.section} aria-label="Structure">
          <Reveal as="h2" className={styles.h2}>Four tabs, each job in one place.</Reveal>
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

        {/* ---- Key moments ---- */}
        <section className={styles.panels} aria-label="Key moments">
          <Panel tone="rust" no="01 · Read it here" title="A line you love becomes a quote, with its page."
            text="No screenshot, no copying into another app. The quote, the page and your note stay with the book."
            extra={<p className={styles.book}>“It was small men with their small acts and their small reasons.” <span>Red Country, p.238</span></p>}>
            <Trio items={[['reader', 'Read'], ['highlight', 'Highlight'], ['quote-kept', 'It’s kept']]} />
          </Panel>

          <div className={styles.twoUp}>
            <Panel tone="paper" no="Home" title="Pick up where you left off."
              text="Home opens on the book in your hands, how far you are, and what you've kept from it.">
              <Phone src="home" />
            </Panel>
            <Panel tone="ink" no="03 · Book Talk" title="Find books the way people already do."
              text="Short and longer videos about books, and nothing else. Want to read is one tap from the video.">
              <Phone src="discover-shorts" />
            </Panel>
          </div>

          <Panel tone="deep" no="My Books" title="Your shelves, at a glance."
            text="Covers at a size you recognise, sort and filter on top, lists and tags in front instead of buried.">
            <Duo items={[['my-books', 'Shelves'], ['my-books-lists', 'Lists']]} />
          </Panel>

          <Panel tone="rustDeep" no="04 · Finishing a book" title="Rate it how you actually felt."
            text="Drag to the rating, half stars included. Then a word or two, and the review if you want one, with the quotes you kept waiting under the draft.">
            <Trio items={[['finished', 'Finished'], ['rate', 'Rate'], ['write-review', 'Review']]} />
          </Panel>

          <div className={styles.twoUp}>
            <Panel tone="paper" no="The book page" title="Everything about a book, nothing in the way."
              text="Continue reading is the first action. Your quotes and notes sit with the book.">
              <Phone src="book-page" />
            </Panel>
            <Panel tone="deep" no="Community" title="Made things, not activity."
              text="The feed carries reviews and quotes people actually wrote, not a wall of 'rated three stars' events.">
              <Phone src="community-feed" />
            </Panel>
          </div>
        </section>

        {/* ---- Exploring, and the system ---- */}
        <section className={styles.section} aria-label="Exploring">
          <Reveal as="h2" className={styles.h2}>Three homes, not three mood boards.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            The disagreement was about structure, not style, so I built three whole home screens to
            compare. The Stack won: your books as a pile you reach into, with the covers doing the
            visual work.
          </Reveal>
          <Reveal className={styles.explore} i={2}>
            {EXPLORATIONS.map(([file, name, note, won]) => (
              <figure key={file} className={won ? styles.won : undefined}>
                <img src={`${W}/${file}.webp`} alt={`Home exploration: ${name}`} loading="lazy" decoding="async" />
                <figcaption>
                  <b>{name}{won ? <em>Chosen</em> : null}</b>
                  <span>{note}</span>
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </section>

        <section className={styles.section} aria-label="The system">
          <Reveal as="h2" className={styles.h2}>Paper to brown, so the covers are the colour.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Book covers are the loudest thing in the product. The system stays out of their way, and
            spends its one saturated colour on one action per screen.
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
              <p className={styles.specNote}>Literata 500 · titles, book text, quotes</p>
              <p className={styles.specDisplay}>My Books</p>
              <p className={styles.specNote}>Bricolage Grotesque 800 · screen titles, numbers</p>
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
              <p className={styles.rules}>Cards are fills, never borders · radius 16–22 · shadow only on floating chrome · every tap target at least 44pt.</p>
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

function Panel({ tone, no, title, text, extra, children }: { tone: Tone; no: string; title: string; text: string; extra?: ReactNode; children: ReactNode }) {
  return (
    <Reveal as="article" className={`${styles.panel} ${styles[tone]}`}>
      {children}
      <div className={styles.cap}>
        <span className={styles.no}>{no}</span>
        <h2>{title}</h2>
        <p>{text}</p>
        {extra}
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

/* ---- Explorations ---- */
const EXPLORATIONS: [string, string, string, boolean][] = [
  ['explore-still-reading', 'Still reading', 'Calm and editorial, but progress is still a button you press.', false],
  ['explore-ledger', 'The Ledger', 'Every number on show. Useful, and it turns reading into homework.', false],
  ['explore-stack', 'The Stack', 'Your books as a pile you reach into, the covers doing the work.', true],
]
