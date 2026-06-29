import { useEffect, useState, type CSSProperties } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import styles from './RouteTransition.module.css'

const DURATION = 620 // ms to count 00 → 100
const SLIDE_MS = 900 // matches the CSS slide-out

/**
 * Route transition overlay for case studies — the same `lukas.` loader as the
 * homepage (counter + progress bar), but it slides off to the right to reveal
 * the project instead of wiping up. Re-keyed per project so it replays on each
 * navigation. Honours the project's signature colour.
 */
export function RouteTransition({ accent, ready = true }: { accent?: string; ready?: boolean }) {
  const reduced = usePrefersReducedMotion()
  const [count, setCount] = useState(0)
  const [counted, setCounted] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [gone, setGone] = useState(reduced)

  useEffect(() => {
    if (reduced) {
      setGone(true)
      return
    }
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
        setCounted(true)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  // Exit once the count has finished AND the page's hero image is ready, so the
  // project is never revealed onto a still-decoding (blank) hero.
  useEffect(() => {
    if (!counted || !ready || exiting) return
    const t = window.setTimeout(() => setExiting(true), 120)
    return () => window.clearTimeout(t)
  }, [counted, ready, exiting])

  useEffect(() => {
    if (!exiting) return
    const t = window.setTimeout(() => setGone(true), SLIDE_MS)
    return () => window.clearTimeout(t)
  }, [exiting])

  if (gone) return null

  return (
    <div
      className={`${styles.trans} ${exiting ? styles.exiting : ''}`}
      style={accent ? ({ '--accent': accent } as CSSProperties) : undefined}
      aria-hidden="true"
    >
      <div className={styles.mark}>
        lukas<span className={styles.dot} />
      </div>
      <div className={styles.count}>{String(count).padStart(2, '0')}</div>
      <div className={styles.bar} style={{ width: `${count}%` }} />
    </div>
  )
}
