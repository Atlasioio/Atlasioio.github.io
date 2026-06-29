import { Button } from '../ui/Button'
import { LinkLike } from '../ui/LinkLike'
import { Showreel } from './Showreel'
import { ShowreelBoundary } from './ShowreelBoundary'
import { useStartModal } from '../../context/StartModalContext'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { studio } from '../../data/content'
import styles from './Hero.module.css'

const HEADLINE_LINES = ['Design &', 'development', 'for products that', 'want to feel']

/**
 * The editorial first screen: an inset accent "card". The headline clip-reveals
 * upward once the loader finishes (`started`).
 */
export function Hero({ started }: { started: boolean }) {
  const { openModal } = useStartModal()
  const reduced = usePrefersReducedMotion()

  const lineMask = (children: React.ReactNode, i: number) => (
    <span className={styles.lineMask} key={i}>
      <span style={{ '--i': i } as React.CSSProperties}>{children}</span>
    </span>
  )

  return (
    <section className={`${styles.hero} ${started ? styles.started : ''}`} id="hero">
      {/* Background video, tinted by the accent overlay so it keeps the blue.
          Skipped under reduced motion (the hero stays solid blue). */}
      {!reduced && (
        <video
          className={styles.bgVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
      )}
      <div className={styles.bgTint} aria-hidden="true" />

      <ShowreelBoundary>
        <Showreel />
      </ShowreelBoundary>

      <div className={`${styles.inner} wrap`}>
        <div className={styles.top}>
          <div className={`${styles.eyebrow} ${started ? 'is-in' : ''}`} data-reveal>
            <span className={styles.pulse} />
            Product designer · {studio.location}
          </div>
        </div>

        <div className={styles.main}>
          <h1 className={styles.headline}>
            {HEADLINE_LINES.map((line, i) => lineMask(line, i))}
            {lineMask(<em>inevitable.</em>, HEADLINE_LINES.length)}
          </h1>

          <div className={styles.row}>
            <p
              className={`${styles.sub} ${started ? 'is-in' : ''}`}
              data-reveal
              style={{ '--i': 3 } as React.CSSProperties}
            >
              A product designer with enterprise roots —{' '}
              <strong>most recently at Sony Nimway</strong>, designing smart-office products
              across web, app, and large-format screens.
            </p>
            <div
              className={`${styles.cta} ${started ? 'is-in' : ''}`}
              data-reveal
              style={{ '--i': 4 } as React.CSSProperties}
            >
              <Button onClick={() => openModal()} variant="light" large onAccent>
                Contact
              </Button>
              <LinkLike href="#work" onDark>
                See the work
              </LinkLike>
            </div>
          </div>
        </div>
      </div>

      {/* Hand-scribbled margin note — what the studio makes (echoes the showreel
          sign-off). Writes itself on once the hero starts. */}
      <div className={`${styles.scribble} ${started ? styles.scribbleIn : ''}`} aria-hidden="true">
        <svg className={styles.scribbleArrow} viewBox="0 0 64 70" fill="none">
          <path className={styles.draw} d="M58 8 C 34 6, 14 22, 12 56" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <path className={styles.draw} d="M4 44 L12 60 L26 53" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className={styles.scribbleText}>
          apps, websites
          <br />&amp; brands
        </span>
        <svg className={styles.scribbleLine} viewBox="0 0 180 16" fill="none">
          <path className={styles.draw} d="M3 10 C 36 3, 64 15, 96 7 S 150 4, 177 11" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      </div>

      <div className={styles.scrollcue} aria-hidden="true">
        <span>Scroll</span>
        <span className={styles.track}>
          <i />
        </span>
      </div>
    </section>
  )
}
