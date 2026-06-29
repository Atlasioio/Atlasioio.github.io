import { useEffect, useState } from 'react'
import type Lenis from 'lenis'
import type { CaseScreen } from '../../data/content'
import modal from '../StartProjectModal/StartProjectModal.module.css'
import styles from './ScreenGallery.module.css'

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
 * Phone-screen gallery: a carousel (two per slide, one on narrow viewports),
 * a "See all" scrollable grid, and a fullscreen single-screen viewer — opened
 * by clicking a phone in either the carousel or the grid.
 */
export function ScreenGallery({ screens, framed = false }: { screens: CaseScreen[]; framed?: boolean }) {
  const len = screens.length
  const [perView, setPerView] = useState(2)
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(0)
  const [grid, setGrid] = useState(false)
  const [photo, setPhoto] = useState<number | null>(null)

  const anyOpen = grid || photo !== null

  // One screen per slide on narrow viewports, two otherwise.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)')
    const apply = () => setPerView(mq.matches ? 1 : 2)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const pageCount = Math.ceil(len / perView)
  useEffect(() => {
    setPage((p) => Math.min(p, pageCount - 1))
  }, [pageCount])

  // Freeze the page while an overlay is open (one effect → no flicker on nav).
  useEffect(() => {
    if (!anyOpen) return
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
    document.body.classList.add('modal-open')
    lenis?.stop()
    return () => {
      document.body.classList.remove('modal-open')
      lenis?.start()
    }
  }, [anyOpen])

  // Keyboard: the viewer takes Escape + arrows; the grid takes Escape.
  useEffect(() => {
    if (!anyOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (photo !== null) {
        if (e.key === 'Escape') setPhoto(null)
        else if (e.key === 'ArrowRight') goPhoto(1)
        else if (e.key === 'ArrowLeft') goPhoto(-1)
      } else if (grid && e.key === 'Escape') {
        setGrid(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anyOpen, grid, photo])

  const go = (d: number) => {
    setDir(d)
    setPage((p) => (p + d + pageCount) % pageCount)
  }
  const goPhoto = (d: number) => {
    setDir(d)
    setPhoto((p) => (p === null ? p : (p + d + len) % len))
  }
  const openPhoto = (i: number) => {
    setDir(0)
    setPhoto(i)
  }

  const start = page * perView
  const pageScreens = screens.slice(start, start + perView)
  const end = Math.min(start + perView, len)
  const counter =
    perView === 1 || start + 1 === end
      ? `${pad(start + 1)} / ${pad(len)}`
      : `${pad(start + 1)}–${pad(end)} / ${pad(len)}`
  const slide = dir > 0 ? styles.fromRight : dir < 0 ? styles.fromLeft : ''

  return (
    <div className={`${styles.gallery} ${framed ? styles.framed : ''}`}>
      <div className={styles.stage}>
        <button type="button" className={`${styles.navBtn} ${styles.navPrev}`} onClick={() => go(-1)} aria-label="Previous screens" data-cursor data-cursor-light>
          <ChevronLeft />
        </button>

        <div key={page} className={`${styles.frame} ${slide}`}>
          {pageScreens.map((s, li) => (
            <figure className={styles.slideItem} key={s.src}>
              <button type="button" className={styles.shotBtn} onClick={() => openPhoto(start + li)} aria-label={`View ${s.caption}`} data-cursor data-view>
                <img className={styles.shot} src={s.src} alt={s.caption} />
              </button>
              <figcaption className={styles.shotCaption}>{s.caption}</figcaption>
            </figure>
          ))}
        </div>

        <button type="button" className={`${styles.navBtn} ${styles.navNext}`} onClick={() => go(1)} aria-label="Next screens" data-cursor data-cursor-light>
          <ChevronRight />
        </button>
      </div>

      <div className={styles.bar}>
        <span className={styles.counter}>{counter}</span>
        <button type="button" className={styles.seeAll} onClick={() => setGrid(true)} data-cursor>
          See all {len}
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {grid && (
        <div
          className={`${modal.overlay} ${styles.lightbox}`}
          data-cursor-modal
          data-lenis-prevent
          onClick={(e) => {
            if (e.target === e.currentTarget) setGrid(false)
          }}
        >
          <div className={styles.lightInner}>
            <div className={styles.lightHead}>
              <span className={styles.lightTitle}>All screens · {len}</span>
              <button type="button" className={styles.lightClose} onClick={() => setGrid(false)} aria-label="Close" data-cursor>
                <CloseIcon />
              </button>
            </div>
            <div className={styles.grid}>
              {screens.map((s, gi) => (
                <button key={s.src} type="button" className={styles.gridItem} onClick={() => openPhoto(gi)} data-cursor data-cursor-light>
                  <span className={styles.gridFrame}>
                    <img src={s.src} alt={s.caption} loading="lazy" />
                  </span>
                  <span className={styles.gridCap}>{s.caption}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {photo !== null && (
        <div
          className={`${modal.overlay} ${styles.viewer}`}
          data-cursor-modal
          data-lenis-prevent
          onClick={(e) => {
            if (e.target === e.currentTarget) setPhoto(null)
          }}
        >
          <button type="button" className={styles.viewerClose} onClick={() => setPhoto(null)} aria-label="Close" data-cursor>
            <CloseIcon />
          </button>
          <button type="button" className={`${styles.viewerNav} ${styles.viewerPrev}`} onClick={() => goPhoto(-1)} aria-label="Previous screen" data-cursor data-cursor-light>
            <ChevronLeft />
          </button>
          <img key={screens[photo].src} className={`${styles.viewerShot} ${slide}`} src={screens[photo].src} alt={screens[photo].caption} />
          <button type="button" className={`${styles.viewerNav} ${styles.viewerNext}`} onClick={() => goPhoto(1)} aria-label="Next screen" data-cursor data-cursor-light>
            <ChevronRight />
          </button>
          <div className={styles.viewerBar}>
            <span className={styles.viewerCap}>{screens[photo].caption}</span>
            <span className={styles.viewerCount}>
              {pad(photo + 1)} / {pad(len)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
