import type { CaseScreen } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import styles from './ScreenScroll.module.css'

interface Entry {
  group?: string
  caption: string
  note?: string
  shots: CaseScreen[]
}

/** Fold consecutive screens sharing a group id into one entry. The first screen
 *  in a group supplies the heading and the note; the rest contribute the image
 *  only, their own captions surviving as alt text. */
function fold(screens: CaseScreen[]): Entry[] {
  const out: Entry[] = []
  for (const s of screens) {
    const last = out[out.length - 1]
    if (s.group && last && last.group === s.group) last.shots.push(s)
    else out.push({ group: s.group, caption: s.caption, note: s.note, shots: [s] })
  }
  return out
}

/**
 * Screens read top to bottom rather than browsed in a carousel. A single screen
 * sits beside its reasoning, sides alternating down the page; screens that
 * belong to one idea — the capture sequence, the two halves of My Books, the
 * faces of Discover — run side by side under one heading instead of taking a
 * row each. Deliberately static: seeing the three capture states at once IS the
 * argument, and the motion loops are where movement belongs.
 */
export function ScreenScroll({ screens }: { screens: CaseScreen[] }) {
  const entries = fold(screens)

  return (
    <div className={styles.scroll}>
      {entries.map((e, i) => {
        const grouped = e.shots.length > 1
        const shots = e.shots.map((s) => (
          <figure className={styles.shot} key={s.src}>
            <img src={s.src} alt={s.caption} loading="lazy" />
          </figure>
        ))
        const text = (
          <div className={styles.text}>
            <span className={styles.no} aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className={styles.caption}>{e.caption}</p>
            {e.note && <p className={styles.note}>{e.note}</p>}
          </div>
        )

        return grouped ? (
          <Reveal className={styles.groupItem} key={e.shots[0].src} i={0}>
            {text}
            <div className={styles.shots} data-count={e.shots.length}>
              {shots}
            </div>
          </Reveal>
        ) : (
          <Reveal className={styles.item} key={e.shots[0].src} i={i % 2}>
            {shots}
            {text}
          </Reveal>
        )
      })}
    </div>
  )
}
