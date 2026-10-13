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
            An audit of the current app, and where a passage actually goes today: from the book,
            to a screenshot, to a camera roll, to a notes app. Goodreads is the last stop, and gets
            a number.
          </Reveal>
          <div className={styles.boards2}>
            <Board src="process/audit-current.webp" alt="Audit of the current Goodreads app: four findings that drove the redesign." i={2} />
            <Board src="process/boundary.webp" alt="Where a passage goes today, and the same chain with the app holding the book." i={3} />
          </div>
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

        {/* ---- The shift in structure ---- */}
        <section className={styles.section} aria-label="Structure">
          <Reveal as="h2" className={styles.h2}>Four tabs, each job in one place.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            Readers come to keep track, to find the next book, and to talk about books. Today each
            of those is split across five tabs and a drawer. Nothing was deleted for tidiness:
            everything in the old drawer went somewhere it belongs, and the missing tab became the
            first one.
          </Reveal>
          <div className={styles.boards2}>
            <Board src="process/ia-before.webp" alt="The structure today: three jobs, five tabs and a More drawer." i={2} />
            <Board src="process/ia-after.webp" alt="The structure after: Reading, My Books, Discover and Community." i={3} />
          </div>
          <Board src="process/split.webp" alt="What not to touch, written down first: what readers love, and what is cluttered and fixable." wide i={1} />
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
          <Board src="process/explorations.webp" alt="Three home screen explorations side by side." wide i={2} />
        </section>

        <section className={styles.section} aria-label="The system">
          <Reveal as="h2" className={styles.h2}>Paper to brown, so the covers are the colour.</Reveal>
          <Reveal as="p" className={styles.sub} i={1}>
            One warm family and one action colour. An earlier pass used a green accent and it fought
            every cover on the page; cutting every hue outside paper and brown let the books be the
            loudest thing on every screen.
          </Reveal>
          <Board src="process/design-system.webp" alt="The design system: palette, type and components." wide i={2} />
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

function Board({ src, alt, wide, i }: { src: string; alt: string; wide?: boolean; i?: number }) {
  return (
    <Reveal className={`${styles.board} ${wide ? styles.boardWide : ''}`} i={i}>
      <img src={`${W}/${src}`} alt={alt} loading="lazy" decoding="async" />
    </Reveal>
  )
}
