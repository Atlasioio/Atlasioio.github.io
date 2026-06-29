import { projects } from '../../data/content'
import { Marker } from '../ui/Marker'
import { Reveal } from '../ui/Reveal'
import { LinkLike } from '../ui/LinkLike'
import { CaseRow } from './CaseRow'
import styles from './Work.module.css'

/** Featured projects for the curated home strip; the rest live on /work. */
const featured = projects.filter((p) => p.featured)

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
          Three projects here; see them all on the work page.
        </Reveal>
      </div>

      <div className={styles.list}>
        {featured.map((project) => (
          <CaseRow key={project.id} project={project} />
        ))}
      </div>

      <Reveal className={styles.more} i={1}>
        <LinkLike to="/work">View all work ({projects.length})</LinkLike>
      </Reveal>
    </section>
  )
}
