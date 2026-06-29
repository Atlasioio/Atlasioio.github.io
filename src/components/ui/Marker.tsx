import { useReveal } from '../../hooks/useReveal'
import styles from './Marker.module.css'

/** Numbered, mono section marker — e.g. `01 — Studio`. */
export function Marker({ num, label }: { num: string; label: string }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div className={styles.marker} data-reveal ref={ref}>
      <span className={styles.num}>{num}</span>
      <span className={styles.dash}>—</span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}
