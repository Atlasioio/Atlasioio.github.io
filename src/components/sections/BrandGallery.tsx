import { useEffect, useState } from 'react'
import type Lenis from 'lenis'
import type { CaseScreen } from '../../data/content'
import modal from '../StartProjectModal/StartProjectModal.module.css'
import styles from './BrandGallery.module.css'

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 6l-6 6 6 6" />
  </svg>
)
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 6l6 6-6 6" />
  </svg>
)
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Brand/print asset gallery: a masonry grid (mixed aspect ratios) with a
 * fullscreen viewer (click any asset). Mirrors the other galleries' overlay
 * behaviour — scroll-freeze + keyboard nav.
 */
export function BrandGallery({ items }: { items: CaseScreen[] }) {
  const [view, setView] = useState<number | null>(null)
  const open = view !== null

  useEffect(() => {
    if (!open) return
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
    document.body.classList.add('modal-open')
    lenis?.stop()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView(null)
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('modal-open')
      lenis?.start()
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const step = (d: number) => setView((p) => (p === null ? p : (p + d + items.length) % items.length))

  return (
    <div className={styles.gallery}>
      <div className={styles.grid}>
        {items.map((it, i) => (
          <figure className={styles.item} key={it.src}>
            <button type="button" className={styles.shot} onClick={() => setView(i)} aria-label={`View ${it.caption}`} data-cursor data-view>
              <img src={it.src} alt={it.caption} loading="lazy" />
            </button>
            <figcaption className={styles.caption}>{it.caption}</figcaption>
          </figure>
        ))}
      </div>

      {view !== null && (
        <div
          className={`${modal.overlay} ${styles.viewer}`}
          data-cursor-modal
          data-lenis-prevent
          onClick={(e) => {
            if (e.target === e.currentTarget) setView(null)
          }}
        >
          <button type="button" className={styles.viewerClose} onClick={() => setView(null)} aria-label="Close" data-cursor>
            <CloseIcon />
          </button>
          <button type="button" className={`${styles.viewerNav} ${styles.viewerPrev}`} onClick={() => step(-1)} aria-label="Previous" data-cursor data-cursor-light>
            <ChevronLeft />
          </button>
          <img key={items[view].src} className={styles.viewerShot} src={items[view].src} alt={items[view].caption} />
          <button type="button" className={`${styles.viewerNav} ${styles.viewerNext}`} onClick={() => step(1)} aria-label="Next" data-cursor data-cursor-light>
            <ChevronRight />
          </button>
          <div className={styles.viewerBar}>
            <span className={styles.viewerCap}>{items[view].caption}</span>
            <span className={styles.viewerCount}>
              {pad(view + 1)} / {pad(items.length)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
