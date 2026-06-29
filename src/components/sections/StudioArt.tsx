import type { ComponentType } from 'react'
import styles from './Studio.module.css'

/* Tiny looping motifs for the hover cards on the Studio axis — same house style
   as the Services illustrations (ink strokes = currentColor, accent highlights,
   screen surfaces on the page bg), shrunk to a 120×96 stage. */

const ink = 'currentColor'
const accent = 'var(--accent)'
const screen = 'var(--bg)'

function AI() {
  return (
    <svg className={styles.miniArt} viewBox="0 0 120 96" fill="none" aria-hidden="true">
      {/* A small neural constellation: a pulsing accent core wired to four
          satellite nodes — the same ink-stroke / accent-highlight house style. */}
      <g stroke={ink} strokeOpacity="0.24" strokeWidth="2.5" strokeLinecap="round">
        <line x1="60" y1="48" x2="34" y2="26" />
        <line x1="60" y1="48" x2="88" y2="28" />
        <line x1="60" y1="48" x2="34" y2="70" />
        <line x1="60" y1="48" x2="88" y2="68" />
      </g>
      <g fill={ink} fillOpacity="0.5">
        <circle cx="34" cy="26" r="5" />
        <circle cx="88" cy="28" r="5" />
        <circle cx="34" cy="70" r="5" />
        <circle cx="88" cy="68" r="5" />
      </g>
      <circle className={styles.mPulse} cx="60" cy="48" r="9" fill={accent} />
    </svg>
  )
}

function Research() {
  return (
    <svg className={styles.miniArt} viewBox="0 0 120 96" fill="none" aria-hidden="true">
      <g stroke={ink} strokeOpacity="0.16" strokeWidth="3" strokeLinecap="round">
        <line x1="22" y1="30" x2="98" y2="30" />
        <line x1="22" y1="48" x2="98" y2="48" />
        <line x1="22" y1="66" x2="78" y2="66" />
      </g>
      <g className={styles.mScan}>
        <circle cx="0" cy="0" r="15" fill={screen} stroke={accent} strokeWidth="4" />
        <line x1="11" y1="11" x2="22" y2="22" stroke={accent} strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function UxUi() {
  return (
    <svg className={styles.miniArt} viewBox="0 0 120 96" fill="none" aria-hidden="true">
      <rect x="30" y="14" width="60" height="68" rx="9" fill={screen} stroke={ink} strokeOpacity="0.2" strokeWidth="3" />
      <rect x="40" y="26" width="30" height="6" rx="3" fill={ink} fillOpacity="0.18" />
      <rect x="40" y="40" width="40" height="5" rx="2.5" fill={ink} fillOpacity="0.12" />
      <rect className={styles.mTapBtn} x="40" y="56" width="36" height="14" rx="7" fill={accent} />
      <g className={styles.mTap}>
        <path d="M0 0 L0 15 L4.5 10.5 L7.5 17 L10 16 L7 9.5 L13 9.5 Z" fill={accent} stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

function Build() {
  return (
    <svg className={styles.miniArt} viewBox="0 0 120 96" fill="none" aria-hidden="true">
      <rect className={`${styles.mBrick} ${styles.mBrick1}`} x="40" y="62" width="40" height="14" rx="3" fill={ink} fillOpacity="0.82" />
      <rect className={`${styles.mBrick} ${styles.mBrick2}`} x="40" y="44" width="40" height="14" rx="3" fill={accent} />
      <rect className={`${styles.mBrick} ${styles.mBrick3}`} x="40" y="26" width="40" height="14" rx="3" fill={ink} fillOpacity="0.4" />
    </svg>
  )
}

function Brand() {
  return (
    <svg className={styles.miniArt} viewBox="0 0 120 96" fill="none" aria-hidden="true">
      <circle cx="60" cy="38" r="25" stroke={ink} strokeOpacity="0.16" strokeWidth="2.5" />
      <text x="60" y="54" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="800" fontSize="42" fill={ink}>
        L
      </text>
      <rect className={`${styles.mChip} ${styles.mChipA}`} x="35" y="74" width="14" height="14" rx="3" />
      <rect className={`${styles.mChip} ${styles.mChipB}`} x="53" y="74" width="14" height="14" rx="3" />
      <rect className={`${styles.mChip} ${styles.mChipC}`} x="71" y="74" width="14" height="14" rx="3" />
    </svg>
  )
}

function Motion() {
  return (
    <svg className={styles.miniArt} viewBox="0 0 120 96" fill="none" aria-hidden="true">
      <g className={styles.mStreak} stroke={accent} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.4">
        <line x1="22" y1="48" x2="44" y2="48" />
        <line x1="26" y1="36" x2="42" y2="36" />
        <line x1="26" y1="60" x2="42" y2="60" />
      </g>
      <circle className={styles.mPuck} cx="56" cy="48" r="9" fill={accent} />
    </svg>
  )
}

/** Keyed by node label so the card can pick the matching motif. */
export const STUDIO_ART: Record<string, ComponentType> = {
  AI,
  Research,
  'UX/UI': UxUi,
  Build,
  Brand,
  Motion,
}
