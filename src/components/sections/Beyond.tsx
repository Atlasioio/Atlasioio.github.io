import { useRef, useState } from 'react'
import { aboutMe, studio } from '../../data/content'
import { Marker } from '../ui/Marker'
import { Reveal } from '../ui/Reveal'
import { useLocalTime } from '../../hooks/useLocalTime'
import styles from './Beyond.module.css'

const PlayIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
)
const PauseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z" />
  </svg>
)

/** Self-hosted 30-sec preview players — no Spotify iframe, so no third-party
 *  cookies or tracking. One plays at a time; audio isn't fetched until play. */
function Tracks() {
  const [playing, setPlaying] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const refs = useRef<(HTMLAudioElement | null)[]>([])

  const toggle = (i: number) => {
    const audios = refs.current
    if (playing === i) {
      audios[i]?.pause()
      setPlaying(null)
      return
    }
    if (playing != null) audios[playing]?.pause()
    setProgress(0)
    void audios[i]?.play()
    setPlaying(i)
  }

  return (
    <div className={styles.tracks}>
      {aboutMe.tracks.map((t, i) => {
        const on = playing === i
        return (
          <div key={t.title} className={`${styles.track} ${on ? styles.trackOn : ''}`}>
            <button
              type="button"
              className={styles.trackPlay}
              onClick={() => toggle(i)}
              aria-label={`${on ? 'Pause' : 'Play'} a preview of ${t.title} by ${t.artist}`}
              data-cursor
            >
              <img className={styles.cover} src={t.cover} alt="" loading="lazy" width={112} height={112} />
              <span className={styles.playBadge} aria-hidden="true">
                {on ? <PauseIcon /> : <PlayIcon />}
              </span>
            </button>
            <div className={styles.trackMeta}>
              <p className={styles.trackTitle}>{t.title}</p>
              <p className={styles.trackArtist}>{t.artist}</p>
              <div className={styles.progress}>
                <span
                  className={styles.progressFill}
                  style={{ transform: `scaleX(${on ? progress : 0})` }}
                />
              </div>
            </div>
            <a
              className={styles.spotifyOut}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${t.title} on Spotify`}
              data-cursor
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
            <audio
              ref={(el) => { refs.current[i] = el }}
              src={t.preview}
              preload="none"
              onTimeUpdate={(e) => {
                if (playing !== i) return
                const a = e.currentTarget
                setProgress(a.duration ? a.currentTime / a.duration : 0)
              }}
              onEnded={() => { setPlaying(null); setProgress(0) }}
            />
          </div>
        )
      })}
    </div>
  )
}

/** 05 — Beyond the work. A personal bento: who I am, what's on repeat, what I'm
 *  reading, what I do off the clock, and where I am right now. */
export function Beyond() {
  const time = useLocalTime()

  return (
    <section className={`section wrap ${styles.section}`} id="beyond">
      <Marker num="05" label="Beyond the work" />
      <Reveal as="h2" className={styles.title}>
        A bit more human.
      </Reveal>

      <div className={styles.bento}>
        {/* Intro — the accent tile */}
        <Reveal className={`${styles.tile} ${styles.intro}`} i={0}>
          <span className={styles.hej} aria-hidden="true">hej!</span>
          <div>
            <img
              className={styles.avatar}
              src="/images/profile-sketch.webp"
              alt="Hand-drawn sketch portrait of Lukas"
              loading="lazy"
            />
            <h3 className={styles.introName}>Hi, I'm Lukas.</h3>
            <p className={styles.introBlurb}>{aboutMe.blurb}</p>
          </div>
          <div className={styles.tags}>
            {aboutMe.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </Reveal>

        {/* On repeat — self-hosted preview players */}
        <Reveal className={`${styles.tile} ${styles.music}`} i={1}>
          <span className={styles.label}>On repeat</span>
          <Tracks />
        </Reveal>

        {/* On the nightstand — books */}
        <Reveal className={`${styles.tile} ${styles.books}`} i={2}>
          <span className={styles.label}>On the nightstand</span>
          <div className={styles.bookRow}>
            {aboutMe.books.map((b) => (
              <div className={styles.book} key={b.title}>
                <img className={styles.bookCover} src={b.cover} alt={`Cover of ${b.title}`} loading="lazy" />
                <div>
                  <p className={styles.bookTitle}>{b.title}</p>
                  <p className={styles.bookAuthor}>{b.author}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Off the clock — interests */}
        <Reveal className={`${styles.tile} ${styles.clock}`} i={3}>
          <span className={styles.label}>Off the clock</span>
          <div className={styles.tags}>
            {aboutMe.interests.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </Reveal>

        {/* Currently — location + status */}
        <Reveal className={`${styles.tile} ${styles.now}`} i={4}>
          <span className={styles.label}>Currently</span>
          <p className={styles.nowLoc}>
            {studio.locationShort} · {time}
          </p>
          <div className={styles.status}>
            <span className={styles.dot} aria-hidden="true" />
            Open to work
          </div>
        </Reveal>
      </div>
    </section>
  )
}
