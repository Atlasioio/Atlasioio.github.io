import { useEffect, useState, type ComponentType, type MouseEvent } from 'react'
import type { Service } from '../../data/content'
import { useServiceModal } from '../../context/ServiceModalContext'
import { useStartModal } from '../../context/StartModalContext'
import { WebArt, UxArt, BrandArt } from '../sections/ServiceArt'
import modal from '../StartProjectModal/StartProjectModal.module.css'
import styles from './ServiceModal.module.css'

/** Animated illustrations, keyed by service id (mirrors ServiceCard). */
const ART: Record<string, ComponentType> = {
  'svc-web': WebArt,
  'svc-ux': UxArt,
  'svc-brand': BrandArt,
}

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 6l-6 6 6 6" />
  </svg>
)
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 6l6 6-6 6" />
  </svg>
)
const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 13l4 4L19 7" />
  </svg>
)

/** Per-service content — keyed by service id so it re-animates on each step.
 *  (The CTA lives in the dialog shell, pinned to the bottom, so it doesn't
 *  shift as content length changes between services.) */
function Content({ service }: { service: Service }) {
  const Art = ART[service.id]

  return (
    <>
      <h2 className={styles.title} id="service-title">
        {service.name}
      </h2>
      <p className={styles.lead}>{service.detail.lead}</p>

      <div className={styles.body}>
        {Art && (
          <div className={styles.visual} aria-hidden="true">
            <Art />
          </div>
        )}

        <div className={styles.cols}>
          <div className={styles.block}>
            <h3 className={styles.blockTitle}>What that involves</h3>
            <ul className={styles.list}>
              {service.detail.includes.map((item) => (
                <li key={item} className={styles.item}>
                  <span className={styles.tick}>
                    <Check />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>How it works</h3>
            <p className={styles.approach}>{service.detail.approach}</p>
            <div className={styles.tags}>
              {service.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/** The dialog shell — persistent controls (prev/counter/next/close) wrap the
 *  keyed, directionally-animated content. */
function Dialog({ service, closing, close }: { service: Service; closing: boolean; close: () => void }) {
  const { index, total, dir, next, prev } = useServiceModal()
  const { openModal } = useStartModal()
  const slide = dir > 0 ? styles.fromRight : dir < 0 ? styles.fromLeft : ''

  const startProject = () => {
    openModal()
    close()
  }

  return (
    <div
      className={`${modal.dialog} ${styles.dialog} ${closing ? modal.dialogClosing : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-title"
    >
      <div className={styles.header}>
        <p className={`${modal.eyebrow} ${styles.eyebrow}`}>{service.index} · Service</p>
        <div className={styles.closeRow}>
          <span className={styles.escHint} aria-hidden="true">Esc</span>
          <button type="button" className={`${styles.ctrl} ${styles.closeCtrl}`} onClick={close} aria-label="Close" data-cursor>
            <CloseIcon />
          </button>
        </div>
      </div>

      <div key={service.id} className={`${styles.content} ${slide}`}>
        <Content service={service} />
      </div>

      <div className={styles.foot}>
        <button type="button" className={styles.cta} onClick={startProject} data-cursor data-cursor-light>
          Get in touch
          <span className={styles.arr} aria-hidden="true">→</span>
        </button>
        <div className={styles.nav}>
          <button type="button" className={styles.ctrl} onClick={prev} aria-label="Previous service" data-cursor>
            <ChevronLeft />
          </button>
          <span className={styles.counter} aria-hidden="true">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <button type="button" className={styles.ctrl} onClick={next} aria-label="Next service" data-cursor>
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  )
}

const EXIT_MS = 450

/** Gate + blurred overlay; keeps the dialog mounted through its exit animation. */
export function ServiceModal() {
  const { service, open, close, next, prev } = useServiceModal()
  // Hold the last service through the closing animation (context goes null on close).
  const [shown, setShown] = useState<Service | null>(service)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (service) {
      setShown(service)
      setClosing(false)
      return
    }
    if (!shown) return
    setClosing(true)
    const t = window.setTimeout(() => {
      setShown(null)
      setClosing(false)
    }, EXIT_MS)
    return () => window.clearTimeout(t)
  }, [service, shown])

  // Arrow keys step between services while the modal is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, next, prev])

  if (!shown) return null

  const onOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) close()
  }

  return (
    <div
      className={`${modal.overlay} ${closing ? modal.overlayClosing : ''}`}
      onClick={onOverlayClick}
      data-cursor-modal
    >
      <Dialog service={shown} closing={closing} close={close} />
    </div>
  )
}
