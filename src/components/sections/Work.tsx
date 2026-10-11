import { projects } from '../../data/content'
import { Marker } from '../ui/Marker'
import { Reveal } from '../ui/Reveal'
import { Button } from '../ui/Button'
import { CaseRow } from './CaseRow'
import styles from './Work.module.css'

/** Featured projects for the curated home strip; the rest live on /work. */
const featured = projects.filter((p) => p.featured)
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

      <div className={styles.list}>
        {featured.map((project) => (
          <CaseRow key={project.id} project={project} />
        ))}
      </div>

      <Reveal className={styles.more} i={1}>
        <Button to="/work" large>
          View all work ({projects.length})
        </Button>
      </Reveal>
    </section>
  )
}
