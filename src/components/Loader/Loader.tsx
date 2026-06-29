import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import styles from './Loader.module.css'

const DURATION = 850 // ms to count 00 → 100

/**
 * Page-load overlay: ink-on-bg `lukas.` mark with a 00→100 counter and a progress
 * bar, then wipes up. Calls `onDone` when it finishes (or immediately under
 * reduced motion) so the hero can trigger its line-reveal.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion()
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (reduced) {
      onDoneRef.current()
      return
    }

    document.body.classList.add('is-loading')
    let raf = 0
    let start: number | null = null

    const tick = (ts: number) => {
      if (start === null) start = ts
      const p = Math.min(1, (ts - start) / DURATION)
      const eased = 1 - Math.pow(1 - p, 2) // decelerate into 100
      setCount(Math.round(eased * 100))
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        window.setTimeout(() => {
          setDone(true)
          document.body.classList.remove('is-loading')
          onDoneRef.current()
        }, 140)
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      document.body.classList.remove('is-loading')
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div className={`${styles.loader} ${done ? styles.done : ''}`} aria-hidden="true">
      <div className={styles.mark}>
        lukas<span className={styles.dot} />
      </div>
      <div className={styles.count}>{String(count).padStart(2, '0')}</div>
      <div className={styles.bar} style={{ width: `${count}%` }} />
    </div>
  )
}
