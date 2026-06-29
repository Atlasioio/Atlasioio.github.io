import styles from './Services.module.css'

/* Animated, looping illustrations for the three core services. Schematic line
   mockups in the house style — ink strokes (currentColor), accent highlights,
   screen surfaces on the page background so they adapt to light/dark. */

const screen = 'var(--bg)'
const ink = 'currentColor'
const accent = 'var(--accent)'

/**
 * Web design & development — a browser and a phone; a cursor clicks the CTA and
 * taps a phone item, both responding (the "responsive, interactive" idea).
 */
export function WebArt() {
  return (
    <svg className={styles.artSvg} viewBox="0 0 400 500" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {/* Browser window */}
      <g>
        <rect x="34" y="78" width="246" height="188" rx="14" fill={screen} stroke={ink} strokeOpacity="0.18" strokeWidth="2" />
        <line x1="34" y1="112" x2="280" y2="112" stroke={ink} strokeOpacity="0.14" strokeWidth="2" />
        <circle cx="52" cy="95" r="4" fill={ink} fillOpacity="0.25" />
        <circle cx="66" cy="95" r="4" fill={ink} fillOpacity="0.25" />
        <circle cx="80" cy="95" r="4" fill={ink} fillOpacity="0.25" />
        <rect x="120" y="90" width="140" height="10" rx="5" fill={ink} fillOpacity="0.08" />
        {/* content */}
        <rect className={styles.wSel} x="52" y="130" width="120" height="14" rx="7" fill={ink} fillOpacity="0.16" />
        <rect x="52" y="156" width="190" height="9" rx="4.5" fill={ink} fillOpacity="0.1" />
        <rect x="52" y="174" width="170" height="9" rx="4.5" fill={ink} fillOpacity="0.1" />
        <rect className={styles.wBtn} x="52" y="204" width="92" height="34" rx="17" fill={accent} />
      </g>

      {/* Phone */}
      <g>
        <rect x="236" y="250" width="128" height="210" rx="26" fill={ink} fillOpacity="0.9" />
        <rect x="245" y="259" width="110" height="192" rx="18" fill={screen} />
        <rect x="282" y="270" width="36" height="6" rx="3" fill={ink} fillOpacity="0.3" />
        <rect className={styles.pHero} x="259" y="290" width="82" height="50" rx="9" fill={accent} fillOpacity="0.55" />
        <rect className={styles.pItem} x="259" y="352" width="82" height="22" rx="7" fill={ink} fillOpacity="0.1" />
        <rect className={styles.pItem2} x="259" y="382" width="82" height="22" rx="7" fill={ink} fillOpacity="0.1" />
        <rect x="259" y="418" width="50" height="20" rx="10" fill={ink} fillOpacity="0.12" />
      </g>

      {/* Stylized blue-and-white cursor that moves between the two */}
      <g className={styles.cursor}>
        <path
          d="M0 0 L0 25 L7 18 L13 29 L17 27 L11 17 L21 17 Z"
          fill={accent}
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

/**
 * UX/UI design — three nodes whose links draw in and connect, then a checkmark
 * confirms the flow (the "polished UX moment"), looping.
 */
export function UxArt() {
  return (
    <svg className={styles.artSvg} viewBox="0 0 400 500" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {/* links */}
      <g stroke={ink} strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round">
        <line className={styles.uxLine1} x1="200" y1="170" x2="130" y2="300" />
        <line className={styles.uxLine2} x1="130" y1="300" x2="270" y2="300" />
        <line className={styles.uxLine3} x1="270" y1="300" x2="200" y2="170" />
      </g>
      {/* nodes */}
      <g>
        <circle cx="200" cy="170" r="30" fill={screen} stroke={ink} strokeOpacity="0.5" strokeWidth="2.5" />
        <circle cx="130" cy="300" r="30" fill={screen} stroke={ink} strokeOpacity="0.5" strokeWidth="2.5" />
        <circle cx="270" cy="300" r="30" fill={screen} stroke={ink} strokeOpacity="0.5" strokeWidth="2.5" />
        <circle className={`${styles.uxDot} ${styles.uxDot1}`} cx="200" cy="170" r="10" fill={accent} />
        <circle className={`${styles.uxDot} ${styles.uxDot2}`} cx="130" cy="300" r="10" fill={accent} />
        <circle className={`${styles.uxDot} ${styles.uxDot3}`} cx="270" cy="300" r="10" fill={accent} />
      </g>
      {/* polished moment — a check appears once connected */}
      <g className={styles.uxCheck}>
        <circle cx="200" cy="395" r="26" fill={accent} />
        <path d="M188 395 l8 8 l16 -18" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
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
