import type { CaseScreen } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import styles from './ScreenScroll.module.css'

/**
 * Screens read top to bottom rather than browsed in a carousel: one screen per
 * row, alternating sides, with room beside each for the reasoning behind it.
 * A carousel hides most of the work behind an arrow and gives the screens no
 * place to argue for themselves — scrolling shows the whole set in order and
 * lets the ones that carry a decision explain it.
 */
export function ScreenScroll({ screens }: { screens: CaseScreen[] }) {
  return (
    <div className={styles.scroll}>
      {screens.map((s, i) => (
        <Reveal className={styles.item} key={s.src} i={i % 2}>
          <figure className={styles.shot}>
            <img src={s.src} alt={s.caption} loading="lazy" />
          </figure>
          <div className={styles.text}>
            <span className={styles.no} aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className={styles.caption}>{s.caption}</p>
            {s.note && <p className={styles.note}>{s.note}</p>}
          </div>
        </Reveal>
      ))}
    </div>
  )
}
