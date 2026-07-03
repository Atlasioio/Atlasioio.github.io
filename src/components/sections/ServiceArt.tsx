import styles from './Services.module.css'

/* Animated, looping illustrations for the three core services. Schematic line
   mockups in the house style — ink strokes (currentColor), accent highlights,
   screen surfaces on the page background so they adapt to light/dark. */

const screen = 'var(--bg)'
const ink = 'currentColor'
const accent = 'var(--accent)'

/**
 * Tinkering — the curious, hands-on side: a code snippet types itself, a card
 * builds line by line and its button clicks, a toggle flips on, and an AI spark
 * spins. All looping.
 */
export function TinkerArt() {
  return (
    <svg className={styles.artSvg} viewBox="0 0 400 500" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {/* A little build/loading bar that fills up */}
      <g transform="rotate(-9 116 165)">
        <rect x="74" y="152" width="86" height="26" rx="13" fill={ink} fillOpacity="0.12" />
        <rect className={styles.tkFill} x="78" y="156" width="78" height="18" rx="9" fill={accent} fillOpacity="0.75" />
      </g>

      {/* Card that builds itself, then its button clicks */}
      <g>
        <rect x="118" y="210" width="170" height="140" rx="14" fill={screen} stroke={ink} strokeOpacity="0.2" strokeWidth="2" />
        <rect x="138" y="232" width="64" height="9" rx="4.5" fill={ink} fillOpacity="0.2" />
        <rect className={styles.tkLine} style={{ animationDelay: '0.15s' }} x="138" y="252" width="138" height="7" rx="3.5" fill={ink} fillOpacity="0.14" />
        <rect className={styles.tkLine} style={{ animationDelay: '0.4s' }} x="138" y="266" width="120" height="7" rx="3.5" fill={ink} fillOpacity="0.14" />
        <rect className={styles.tkLine} style={{ animationDelay: '0.65s' }} x="138" y="280" width="98" height="7" rx="3.5" fill={ink} fillOpacity="0.12" />
        <rect className={styles.tkBtn} x="138" y="300" width="66" height="22" rx="11" fill={accent} fillOpacity="0.9" />
        <rect x="214" y="300" width="60" height="22" rx="8" fill={ink} fillOpacity="0.1" />
      </g>

      {/* Mini code snippet that types, with a blinking cursor */}
      <g className={styles.tkSnip}>
        <g transform="rotate(8 320 174)">
          <rect x="282" y="140" width="76" height="68" rx="10" fill={ink} fillOpacity="0.9" />
          <rect className={styles.tkLine} style={{ animationDelay: '0s' }} x="292" y="154" width="24" height="6" rx="3" fill={accent} fillOpacity="0.9" />
          <rect className={styles.tkLine} style={{ animationDelay: '0.3s' }} x="320" y="154" width="26" height="6" rx="3" fill={screen} fillOpacity="0.32" />
          <rect className={styles.tkLine} style={{ animationDelay: '0.55s' }} x="300" y="166" width="36" height="6" rx="3" fill={screen} fillOpacity="0.5" />
          <rect className={styles.tkLine} style={{ animationDelay: '0.8s' }} x="300" y="178" width="24" height="6" rx="3" fill={screen} fillOpacity="0.3" />
          <rect className={styles.tkLine} style={{ animationDelay: '1.05s' }} x="292" y="190" width="22" height="6" rx="3" fill={accent} fillOpacity="0.6" />
          <rect className={styles.tkCursor} x="318" y="188" width="3" height="9" rx="1.5" fill={screen} fillOpacity="0.85" />
        </g>
      </g>

      {/* Toggle that flips on (sits below-left of the card) */}
      <g transform="rotate(6 97 367)">
        <rect x="64" y="354" width="66" height="26" rx="13" fill={ink} fillOpacity="0.16" />
        <rect className={styles.tkOn} x="64" y="354" width="66" height="26" rx="13" fill={accent} fillOpacity="0.8" />
        <circle className={styles.tkKnob} cx="78" cy="367" r="10" fill={screen} stroke={ink} strokeOpacity="0.2" strokeWidth="1.5" />
      </g>

      {/* AI spark that spins + pulses */}
      <path className={styles.tkSpark} d="M326 300 C 328 316, 331 319, 347 320 C 331 321, 328 324, 326 340 C 324 324, 321 321, 305 320 C 321 319, 324 316, 326 300 Z" fill={accent} fillOpacity="0.9" />
    </svg>
  )
}

/**
 * UX/UI design — a two-act loop that cross-fades between the two halves of the
 * craft: a *user flow* (wireframe screens with a user travelling the path) and
 * the *system behind it* (nodes whose links draw in, then a check confirms).
 */
export function UxArt() {
  const screens = [
    { id: 's1', cls: styles.uxScreen1, x: 68, y: 116 },
    { id: 's2', cls: styles.uxScreen2, x: 224, y: 116 },
    { id: 's3', cls: styles.uxScreen3, x: 146, y: 292 },
  ]
  return (
    <svg className={styles.artSvg} viewBox="0 0 400 500" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {/* Act 1 — the user flow */}
      <g className={styles.uxFlow}>
        <g stroke={ink} strokeOpacity="0.32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M178 161 H 220" />
          <path d="M213 155 L 220 161 L 213 167" />
          <path d="M279 206 L 206 288" />
          <path d="M205 277 L 205 289 L 216 285" />
        </g>
        {screens.map((s) => (
          <g key={s.id} className={`${styles.uxScreen} ${s.cls}`}>
            <rect x={s.x} y={s.y} width="110" height="90" rx="11" fill={screen} stroke={ink} strokeOpacity="0.42" strokeWidth="2.5" />
            <rect x={s.x + 14} y={s.y + 14} width="42" height="8" rx="4" fill={accent} fillOpacity="0.75" />
            <rect x={s.x + 14} y={s.y + 32} width="82" height="6" rx="3" fill={ink} fillOpacity="0.16" />
            <rect x={s.x + 14} y={s.y + 46} width="62" height="6" rx="3" fill={ink} fillOpacity="0.14" />
            <rect x={s.x + 14} y={s.y + 64} width="46" height="14" rx="7" fill={ink} fillOpacity="0.12" />
          </g>
        ))}
        {/* the user travelling the flow */}
        <circle className={styles.uxFlowDot} r="9" fill={accent} />
      </g>

      {/* Act 2 — the node graph behind it */}
      <g className={styles.uxNodes}>
        <g stroke={ink} strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round">
          <line className={styles.uxLink} x1="200" y1="170" x2="130" y2="300" />
          <line className={`${styles.uxLink} ${styles.uxLink2}`} x1="130" y1="300" x2="270" y2="300" />
          <line className={`${styles.uxLink} ${styles.uxLink3}`} x1="270" y1="300" x2="200" y2="170" />
        </g>
        <g>
          <circle cx="200" cy="170" r="30" fill={screen} stroke={ink} strokeOpacity="0.5" strokeWidth="2.5" />
          <circle cx="130" cy="300" r="30" fill={screen} stroke={ink} strokeOpacity="0.5" strokeWidth="2.5" />
          <circle cx="270" cy="300" r="30" fill={screen} stroke={ink} strokeOpacity="0.5" strokeWidth="2.5" />
          <circle className={styles.uxNode} cx="200" cy="170" r="10" fill={accent} />
          <circle className={`${styles.uxNode} ${styles.uxNode2}`} cx="130" cy="300" r="10" fill={accent} />
          <circle className={`${styles.uxNode} ${styles.uxNode3}`} cx="270" cy="300" r="10" fill={accent} />
        </g>
        <g className={styles.uxCheck}>
          <circle cx="200" cy="395" r="26" fill={accent} />
          <path d="M188 395 l8 8 l16 -18" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  )
}

/**
 * Brand identity — the wordmark glyph cycles through forms and the swatch row
 * cycles colours, looping (a living identity system).
 */
export function BrandArt() {
  const glyphs = ['L', 'u', 'k', '&']
  return (
    <svg className={styles.artSvg} viewBox="0 0 400 500" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {/* construction guides */}
      <g stroke={ink} strokeOpacity="0.16" strokeWidth="2">
        <circle cx="200" cy="200" r="120" />
        <line x1="80" y1="200" x2="320" y2="200" />
        <line x1="200" y1="80" x2="200" y2="320" />
      </g>
      {/* cycling glyph */}
      <g>
        {glyphs.map((g, i) => (
          <text
            key={g}
            className={`${styles.brandGlyph} ${styles[`brandGlyph${i}` as 'brandGlyph0']}`}
            x="200"
            y="262"
            textAnchor="middle"
            fontFamily="Archivo, sans-serif"
            fontSize="220"
            fontWeight="800"
            fill={ink}
          >
            {g}
          </text>
        ))}
      </g>
      {/* swatch row cycling colours */}
      <g>
        <rect className={`${styles.swatch} ${styles.swatch0}`} x="116" y="380" width="48" height="48" rx="8" />
        <rect className={`${styles.swatch} ${styles.swatch1}`} x="176" y="380" width="48" height="48" rx="8" />
        <rect className={`${styles.swatch} ${styles.swatch2}`} x="236" y="380" width="48" height="48" rx="8" />
      </g>
    </svg>
  )
}
