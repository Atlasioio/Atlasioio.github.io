import { useEffect, type MouseEvent } from 'react'
import type { CaseScreen } from '../../data/content'
import styles from './VideoShowcase.module.css'

const Expand = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
)

/**
 * Looping demo clips in browser frames. The first is a full-width feature; the
 * rest sit in a responsive grid. Muted + autoplay + loop so they play inline
 * without controls — click any clip to watch it fullscreen (controls appear
 * there, and are removed again on exit).
 */
export function VideoShowcase({ videos }: { videos: CaseScreen[] }) {
  // When fullscreen is exited, strip the controls we added on the way in.
  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) {
        document.querySelectorAll<HTMLVideoElement>(`.${styles.video}`).forEach((v) => {
          v.controls = false
        })
      }
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const openFullscreen = (e: MouseEvent<HTMLElement>) => {
    const video = e.currentTarget.querySelector('video') as HTMLVideoElement | null
    if (!video) return
    video.controls = true
    const req = video.requestFullscreen?.bind(video) ?? (video as unknown as { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen
    try {
      req?.()
    } catch {
      video.controls = false
    }
  }

  return (
    <div className={styles.grid}>
      {videos.map((v, i) => (
        <figure className={`${styles.item} ${i === 0 ? styles.lead : ''}`} key={v.src}>
          <button
            type="button"
            className={styles.browser}
            onClick={openFullscreen}
            aria-label={`Play ${v.caption} fullscreen`}
            data-cursor
            data-view
          >
            <span className={styles.bar} aria-hidden="true">
              <span /><span /><span />
            </span>
            <video
              className={styles.video}
              src={v.src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={v.caption}
            />
            <span className={styles.expand} aria-hidden="true">
              <Expand />
            </span>
          </button>
          <figcaption className={styles.cap}>{v.caption}</figcaption>
        </figure>
      ))}
    </div>
  )
}
