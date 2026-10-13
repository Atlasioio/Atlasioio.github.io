import { useEffect, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { preloadCover, projects, type Project } from '../data/content'
import { useLenis } from '../hooks/useLenis'
import { FixedControls } from '../components/nav/FixedControls'
import { LangFixed } from '../components/nav/LangFixed'
import { Menu } from '../components/nav/Menu'
import { Footer } from '../components/sections/Footer'
import { ProjectChat } from '../components/ProjectChat/ProjectChat'
import { Marker } from '../components/ui/Marker'
import { ProjectThumb } from '../components/ui/ProjectThumb'
import { Reveal } from '../components/ui/Reveal'
import caseStyles from './CaseStudy.module.css'
import styles from './AllWork.module.css'

/** The four with full case studies (and home-card art) first, then the rest. */
const caseStudies = projects.filter((p) => p.featured && p.card)
const moreWork = projects.filter((p) => !(p.featured && p.card))

const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
  </svg>
)

/** The full work index (route "/work"): case studies as large cards, then the rest. */
export function AllWork() {
  useLenis()

  // Always open from the top.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <FixedControls staticDark home />
      <LangFixed />
      <Menu />

      <main className={caseStyles.page} id="top">
        <div className={`${caseStyles.bar} wrap`}>
          {/* spacer: the wordmark itself is pinned in FixedControls */}
          <span className={caseStyles.wordmark} aria-hidden="true" style={{ visibility: 'hidden' }}>lukas</span>
        </div>

        <header className={`${styles.hero} wrap`}>
          <div>
            <Reveal>
              <Link to="/#work" className={caseStyles.back} data-cursor>
                <span aria-hidden="true">←</span> Home
              </Link>
            </Reveal>
            <Reveal as="h1" className={styles.title} i={1}>
              All work.
            </Reveal>
            <Reveal as="p" className={styles.lede} i={2}>
              Four in-depth case studies, then brand, web and client work. Concept and shipped, design
              through build.
            </Reveal>
          </div>
          <Reveal as="p" className={styles.count} i={3}>
            <b>{projects.length}</b>projects
          </Reveal>
        </header>

        <section className={`${styles.group} wrap`} aria-label="Case studies">
          <div className={styles.groupHead}>
            <Marker num="01" label="Case studies" />
            <p>The full story: research, decisions, the system, and how it turned out.</p>
          </div>
          <div className={styles.big}>
            {caseStudies.map((p, i) => (
              <Card key={p.id} project={p} i={i % 2} big />
            ))}
          </div>
        </section>

        <section className={`${styles.group} wrap`} aria-label="More work">
          <div className={styles.groupHead}>
            <Marker num="02" label="More work" />
            <p>Shorter write-ups: a brand, a website, a tool I built, and client work under NDA.</p>
          </div>
          <div className={styles.small}>
            {moreWork.map((p, i) => (
              <Card key={p.id} project={p} i={i} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <ProjectChat />
    </>
  )
}

/** One project: the art on top (photo and phone for case studies, the shared
 *  cover for the rest), then its name, number and one line. */
function Card({ project: p, i, big = false }: { project: Project; i: number; big?: boolean }) {
  const card = p.card
  const phone = card ? card.phones[card.cardPhone ?? 0] : undefined
  return (
    <Reveal i={i}>
      <Link
        to={`/work/${p.id}`}
        className={`${styles.card} ${big ? styles.cardBig : ''}`}
        aria-label={`${p.name} — view case study`}
        onPointerEnter={() => preloadCover(p)}
        onFocus={() => preloadCover(p)}
        data-cursor
      >
        <div className={styles.art}>
          {big && card ? (
            <>
              <span
                className={styles.photo}
                style={{ backgroundImage: `url('${card.bg}')`, backgroundPosition: card.pos ?? '50% 50%' } as CSSProperties}
              />
              {phone && <img className={styles.phone} src={phone} alt="" loading="lazy" />}
            </>
          ) : (
            <ProjectThumb project={p} />
          )}
          <span className={styles.tag}>{p.tag}</span>
          <span className={styles.go} aria-hidden="true">
            <Arrow />
          </span>
        </div>
        <div className={styles.meta}>
          <h2>{p.name}</h2>
          <span className={styles.idx}>{p.index}</span>
          <p>{big && card ? `${card.title}.` : p.outcome}</p>
          {p.nda && <span className={styles.nda}>Visuals under NDA</span>}
        </div>
      </Link>
    </Reveal>
  )
}
