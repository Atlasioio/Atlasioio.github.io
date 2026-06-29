import type { ReactElement } from 'react'
import { steps } from '../../data/content'
import { Marker } from '../ui/Marker'
import { Reveal } from '../ui/Reveal'
import styles from './Process.module.css'

const SW = 2.6

/* ---- Per-stage line illustrations (animate on step hover) ---------------- */

// Discovery — a magnifying glass that scans across on hover.
function Discovery(): ReactElement {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={styles.svg}>
      <g className={styles.magnifier} stroke="currentColor" strokeWidth={SW} strokeLinecap="round">
        <circle cx="20" cy="20" r="12" />
        <line x1="28.5" y1="28.5" x2="40" y2="40" />
        <circle className={`${styles.discDot} ${styles.accentFill}`} cx="20" cy="20" r="4" stroke="none" />
      </g>
    </svg>
  )
}

// Design — composition shapes that rearrange (accent square rotates, circle grows).
function Design(): ReactElement {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={SW} aria-hidden="true" className={styles.svg}>
      <rect className={styles.dSquare} x="8" y="9" width="15" height="15" rx="2.5" />
      <circle className={styles.dCircle} cx="34" cy="16" r="8" />
      <rect className={`${styles.dAccent} ${styles.accentFill}`} x="25" y="26" width="15" height="15" rx="2.5" stroke="none" />
    </svg>
  )
}

// Build — code brackets that spread apart on hover.
function Build(): ReactElement {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={styles.svg}>
      <polyline className={styles.bLeft} points="18,13 7,24 18,35" />
      <polyline className={styles.bRight} points="30,13 41,24 30,35" />
      <line className={styles.accentStroke} x1="27" y1="11" x2="21" y2="37" />
    </svg>
  )
}

// Launch — an upward arrow that lifts off on hover.
function Launch(): ReactElement {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={styles.svg}>
      <g className={styles.lArrow} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
        <line x1="24" y1="39" x2="24" y2="14" />
        <polyline points="15,23 24,12 33,23" />
      </g>
      <circle className={styles.accentFill} cx="24" cy="41" r="3" stroke="none" />
    </svg>
  )
}

const ART: Record<string, () => ReactElement> = {
  '01': Discovery,
  '02': Design,
  '03': Build,
  '04': Launch,
}

/** 04 — Process. Four numbered steps, each with a stage-appropriate illustration. */
export function Process() {
  return (
    <section className="section wrap" id="process">
      <Marker num="04" label="How I work" />
      <div className={styles.grid}>
        {steps.map((step, i) => {
          const Art = ART[step.no] ?? Discovery
          return (
            <Reveal key={step.no} className={styles.step} i={i}>
              <div className={styles.bar} />
              <div className={styles.art}>
                <Art />
              </div>
              <div className={styles.no}>{step.no}</div>
              <div className={styles.name}>{step.name}</div>
              <p className={styles.desc}>{step.description}</p>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
