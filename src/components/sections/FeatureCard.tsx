import { useRef, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { preloadCover, type Project, type ProjectCard } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import styles from './FeatureCard.module.css'

/**
 * One large home-page card: a darkened photo, the copy centred on the left and
 * one phone on the right (`card.cardPhone` picks which). The whole card is the link. `card.mark` picks both
 * the white line mark and the card's (small) hover motion.
 */
export function FeatureCard({ project, card }: { project: Project; card: ProjectCard }) {
  const to = `/work/${project.id}`

  // Clips over the phone screens: nothing is fetched until the first hover;
  // they play while hovered and pause where they are when the pointer leaves.
  // Where a clip can't play (or motion is reduced) the phone image stays.
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const play = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    videos.current.forEach((v) => v?.play().catch(() => {}))
  }
  const pause = () => videos.current.forEach((v) => v?.pause())
  const bg = {
    backgroundImage: `url('${card.bg}')`,
    '--pos': card.pos,
    '--size': card.size,
    '--pos-sm': card.posSm,
  } as CSSProperties

  return (
    <Reveal
      as="article"
      className={styles.card}
      data-motion={card.mark}
      style={{ '--accent': project.accent ?? 'var(--ink)' } as CSSProperties}
    >
      <Link
        className={styles.inner}
        to={to}
        data-cursor
        aria-label={`${project.name}: view case study`}
        onPointerEnter={(e) => {
          preloadCover(project)
          if (e.pointerType === 'mouse') play()
        }}
        onPointerLeave={pause}
        onFocus={() => preloadCover(project)}
      >
        <div className={styles.bg} style={bg} />
        <div className={styles.scrim} style={{ '--s': card.scrim } as CSSProperties} />

        <div className={styles.copy}>
          <div className={styles.brand}>
            <Mark kind={card.mark} />
            <span className={styles.name}>
              {project.name}
            </span>
          </div>
          <h3 className={styles.title}>{card.title}</h3>
          <span className={styles.btn}>
            View case study
            <span className={styles.arrow} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
              </svg>
            </span>
          </span>
        </div>

        <div className={styles.phones} aria-hidden="true">
          {[card.cardPhone ?? 0].map((i) => {
            const src = card.phones[i]
            const clip = card.videos?.[i]
            return (
              <span key={src} className={styles.phone}>
                <img src={src} alt="" loading="lazy" decoding="async" />
                {clip && (
                  <video
                    ref={(el) => { videos.current[i] = el }}
                    src={clip}
                    muted
                    loop
                    playsInline
                    preload="none"
                    disablePictureInPicture
                  />
                )}
              </span>
            )
          })}
        </div>
      </Link>
    </Reveal>
  )
}

/** White 32px line marks. The moving part of each carries its own class:
 *  the whole Time and EcoTrip marks turn, Sherry's lid lifts, a Goodreads page turns. */
function Mark({ kind }: { kind: ProjectCard['mark'] }) {
  const common = {
    className: styles.mark,
    width: 32,
    height: 32,
    viewBox: '0 0 32 32',
    fill: 'none',
    stroke: '#fff',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (kind) {
    case 'time':
      return (
        <svg {...common}>
          <path d="M16 5V1.5M21.5 6.47l1.75-3.03M25.53 10.5l3.03-1.75M27 16h3.5M25.53 21.5l3.03 1.75M21.5 25.53l1.75 3.03M16 27v3.5M10.5 25.53l-1.75 3.03M6.47 21.5l-3.03 1.75M5 16H1.5M6.47 10.5L3.44 8.75M10.5 6.47L8.75 3.44" />
          <circle cx="16" cy="16" r="5.5" fill="#fff" stroke="none" />
        </svg>
      )
    case 'sherry':
      return (
        <svg {...common}>
          <path className={styles.lid} d="M4 14v-2a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v2z" />
          <path d="M4 14h24v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
          <rect x="12.5" y="18" width="7" height="2.6" rx="1.3" fill="#fff" stroke="none" />
        </svg>
      )
    case 'goodreads':
      return (
        <svg {...common}>
          <path d="M16 9c-2.5-2-6-3-11-3v19c5 0 8.5 1 11 3 2.5-2 6-3 11-3V6c-5 0-8.5 1-11 3zM16 9v19" />
          <path className={styles.page} d="M16 9c2-1.6 4.8-2.5 9-2.8v17.6c-4.2.3-7 1.2-9 2.8z" />
        </svg>
      )
    case 'ecotrip':
      return (
        <svg {...common}>
          <path d="M16 3l11.26 6.5v13L16 29 4.74 22.5v-13z" />
          <path d="M16 10.5l4.76 2.75v5.5L16 21.5l-4.76-2.75v-5.5z" fill="#fff" stroke="none" />
        </svg>
      )
  }
}
