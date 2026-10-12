import { Link } from 'react-router-dom'
import { projects } from '../../data/content'
import { Marker } from '../ui/Marker'
import { Reveal } from '../ui/Reveal'
import { CaseRow } from './CaseRow'
import { FeatureCard } from './FeatureCard'
import styles from './Work.module.css'

/** Featured projects for the curated home strip; the rest live on /work. */
const featured = projects.filter((p) => p.featured)
const rest = projects.filter((p) => !p.featured)
/** "A, B, C and D" */
const list = (names: string[]) =>
  names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
/** Spelled out, so the line cannot drift from the data as it did at three. */
const COUNT = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven']

/** 03 — Selected work. The centrepiece: a few large case rows, then a link to all. */
export function Work() {
  return (
    <section className={`section wrap ${styles.section}`} id="work">
      <Marker num="03" label="Selected work" />
      <div className={styles.head}>
        <Reveal as="h2" className={styles.title}>
          A few projects worth a closer look.
        </Reveal>
        <Reveal as="p" className={styles.note} i={1}>
          {COUNT[featured.length] ?? featured.length} projects here; see them all on the work page.
        </Reveal>
      </div>

      <div className={`${styles.list} ${styles.cards}`}>
        {featured.map((project) =>
          project.card ? (
            <FeatureCard key={project.id} project={project} card={project.card} />
          ) : (
            <CaseRow key={project.id} project={project} />
          ),
        )}
        {/* The way on to /work closes the stack as its own slim card, rather
            than a lone button floating under it. */}
        <Reveal>
          <Link to="/work" className={styles.allCard} data-cursor>
            <span className={styles.allText}>
              <span className={styles.allTitle}>See all {projects.length} projects</span>
              <span className={styles.allNames}>Also {list(rest.map((p) => p.name))}.</span>
            </span>
            <span className={styles.allArrow} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
              </svg>
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
