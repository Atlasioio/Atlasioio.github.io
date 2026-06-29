import { useRef } from 'react'
import { marqueeItems } from '../../data/content'
import styles from './Marquee.module.css'

/**
 * Capability keyword strip — a single set duplicated, track animated to -50%
 * for a seamless loop. No background; blends into the page. Speeds up on hover
 * (via the running animation's playbackRate, so there's no position jump).
 */
export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null)

  const setRate = (rate: number) => {
    trackRef.current?.getAnimations().forEach((a) => {
      a.updatePlaybackRate ? a.updatePlaybackRate(rate) : (a.playbackRate = rate)
    })
  }

  // Two copies => the track is 200% wide and -50% returns to the start exactly.
  const set = [...marqueeItems, ...marqueeItems]
  return (
    <section
      className={styles.marquee}
      aria-label="Capabilities"
      onMouseEnter={() => setRate(2.4)}
      onMouseLeave={() => setRate(1)}
    >
      <div className={styles.track} ref={trackRef}>
        {set.map((item, i) => (
          <span
            key={i}
            className={`${styles.item} ${i % 2 === 1 ? styles.alt : ''}`}
            aria-hidden={i >= marqueeItems.length}
          >
            {item}
            <span className={styles.sep}>✳</span>
          </span>
        ))}
      </div>
    </section>
  )
}
