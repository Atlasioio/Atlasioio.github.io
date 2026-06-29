import { useEffect, useState } from 'react'
import type Lenis from 'lenis'
import type { CaseScreen } from '../../data/content'
import modal from '../StartProjectModal/StartProjectModal.module.css'
import styles from './WebShowcase.module.css'

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

const BrowserBar = ({ label }: { label: string }) => (
  <div className={styles.browserBar} aria-hidden="true">
    <span className={styles.dots}>
      <i /><i /><i />
    </span>
    <span className={styles.urlchip}>{label}</span>
  </div>
)

type Item = CaseScreen & { kind: 'desktop' | 'mobile' }

/**
 * Responsive web showcase: desktop screens in a browser-chrome carousel, mobile
 * screens in phone frames, a "See all" grid, and a fullscreen viewer (click any
 * screen). Mirrors the EcoTrip gallery's overlay behaviour.
 */
export function WebShowcase({ desktop, mobile, label }: { desktop: CaseScreen[]; mobile: CaseScreen[]; label: string }) {
  const all: Item[] = [
    ...desktop.map((s) => ({ ...s, kind: 'desktop' as const })),
    ...mobile.map((s) => ({ ...s, kind: 'mobile' as const })),
  ]

  const [di, setDi] = useState(0)
  const [dir, setDir] = useState(0)
  const [grid, setGrid] = useState(false)
  const [view, setView] = useState<number | null>(null)

  const anyOpen = grid || view !== null

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

  useEffect(() => {
    if (!anyOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (view !== null) {
        if (e.key === 'Escape') setView(null)
        else if (e.key === 'ArrowRight') stepView(1)
        else if (e.key === 'ArrowLeft') stepView(-1)
      } else if (grid && e.key === 'Escape') setGrid(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anyOpen, grid, view])

  const goDesk = (d: number) => {
    setDir(d)
    setDi((p) => (p + d + desktop.length) % desktop.length)
  }
  const stepView = (d: number) => {
    setDir(d)
    setView((p) => (p === null ? p : (p + d + all.length) % all.length))
  }

  const slide = dir > 0 ? styles.fromRight : dir < 0 ? styles.fromLeft : ''
  const cur = desktop[di]

  return (
    <div className={styles.showcase}>
      <div className={styles.deskStage}>
        <button type="button" className={`${styles.navBtn} ${styles.navPrev}`} onClick={() => goDesk(-1)} aria-label="Previous screen" data-cursor data-cursor-light>
          <ChevronLeft />
        </button>
        <button type="button" key={di} className={`${styles.browser} ${slide}`} onClick={() => setView(di)} aria-label={`View ${cur.caption}`} data-cursor data-view>
          <BrowserBar label={label} />
          <img className={styles.browserImg} src={cur.src} alt={cur.caption} />
        </button>
        <button type="button" className={`${styles.navBtn} ${styles.navNext}`} onClick={() => goDesk(1)} aria-label="Next screen" data-cursor data-cursor-light>
          <ChevronRight />
        </button>
      </div>

      <div className={styles.bar}>
        <p className={styles.caption}>{cur.caption}</p>
        <div className={styles.barRight}>
          <span className={styles.counter}>
            {pad(di + 1)} / {pad(desktop.length)}
          </span>
          <button type="button" className={styles.seeAll} onClick={() => setGrid(true)} data-cursor>
            See all {all.length}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div className={styles.mobileBlock}>
        <p className={styles.mobileLabel}>On mobile</p>
        <div className={styles.mobileRow}>
          {mobile.map((s, mi) => (
            <figure className={styles.phoneItem} key={s.src}>
              <button type="button" className={styles.phone} onClick={() => setView(desktop.length + mi)} aria-label={`View ${s.caption}, mobile`} data-cursor data-view>
                <span className={styles.phoneScreen}>
                  <img src={s.src} alt={`${s.caption}, mobile`} loading="lazy" />
                </span>
              </button>
              <figcaption className={styles.phoneCap}>{s.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      {grid && (
        <div className={`${modal.overlay} ${styles.lightbox}`} data-cursor-modal data-lenis-prevent onClick={(e) => { if (e.target === e.currentTarget) setGrid(false) }}>
          <div className={styles.lightInner}>
            <div className={styles.lightHead}>
              <span className={styles.lightTitle}>All screens · {all.length}</span>
              <button type="button" className={styles.lightClose} onClick={() => setGrid(false)} aria-label="Close" data-cursor>
                <CloseIcon />
              </button>
            </div>
            <div className={styles.grid}>
              {all.map((s, gi) => (
                <button key={s.src} type="button" className={`${styles.gridItem} ${s.kind === 'mobile' ? styles.gridMobile : styles.gridDesktop}`} onClick={() => { setDir(0); setView(gi) }} data-cursor data-cursor-light>
                  {s.kind === 'desktop' ? (
                    <span className={styles.gridBrowser}>
                      <BrowserBar label={label} />
                      <img src={s.src} alt={s.caption} loading="lazy" />
                    </span>
                  ) : (
                    <span className={styles.gridPhone}>
                      <img src={s.src} alt={s.caption} loading="lazy" />
                    </span>
                  )}
                  <span className={styles.gridCap}>{s.caption}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {view !== null && (
        <div className={`${modal.overlay} ${styles.viewer}`} data-cursor-modal data-lenis-prevent onClick={(e) => { if (e.target === e.currentTarget) setView(null) }}>
          <button type="button" className={styles.viewerClose} onClick={() => setView(null)} aria-label="Close" data-cursor>
            <CloseIcon />
          </button>
          <button type="button" className={`${styles.viewerNav} ${styles.viewerPrev}`} onClick={() => stepView(-1)} aria-label="Previous screen" data-cursor data-cursor-light>
            <ChevronLeft />
          </button>
          <img key={all[view].src} className={`${styles.viewerShot} ${all[view].kind === 'mobile' ? styles.viewerMobile : styles.viewerDesktop} ${slide}`} src={all[view].src} alt={all[view].caption} />
          <button type="button" className={`${styles.viewerNav} ${styles.viewerNext}`} onClick={() => stepView(1)} aria-label="Next screen" data-cursor data-cursor-light>
            <ChevronRight />
          </button>
          <div className={styles.viewerBar}>
            <span className={styles.viewerCap}>{all[view].caption}</span>
            <span className={styles.viewerCount}>
              {pad(view + 1)} / {pad(all.length)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
