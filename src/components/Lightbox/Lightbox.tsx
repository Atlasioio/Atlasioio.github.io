import { useEffect, useRef, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { createPortal } from 'react-dom'
import styles from './Lightbox.module.css'

export interface LightboxShot {
  /** full image path */
  src: string
  label: string
  note?: string
  /** a full-length scrolling page: scrolls inside the viewer */
  tall?: boolean
  /** a partial board or photo rather than a phone screen */
  detail?: boolean
  /** anything extra under the title, such as status chips */
  extra?: ReactNode
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * One screen at full height, with its caption, stepping through its set.
 * Esc or a click outside closes it; the arrow keys step. Portalled to <body>,
 * so it carries its own colours and works on any case page.
 */
export function Lightbox({ shots, index, setIndex }: { shots: LightboxShot[]; index: number; setIndex: Dispatch<SetStateAction<number | null>> }) {
  const s = shots[index]
  const closeRef = useRef<HTMLButtonElement>(null)
  const close = () => setIndex(null)
  const step = (d: 1 | -1) => setIndex((i) => (i == null ? i : Math.min(shots.length - 1, Math.max(0, i + d))))

  useEffect(() => {
    const before = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis
    lenis?.stop()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIndex(null)
      else if (e.key === 'ArrowRight') setIndex((i) => (i == null ? i : Math.min(shots.length - 1, i + 1)))
      else if (e.key === 'ArrowLeft') setIndex((i) => (i == null ? i : Math.max(0, i - 1)))
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lenis?.start()
      before?.focus()
    }
  }, [setIndex, shots.length])

  if (!s) return null
  return createPortal(
    <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={s.label} data-lenis-prevent onClick={close}>
      <div className={styles.inner} onClick={(e) => e.stopPropagation()}>
        <div className={`${styles.image} ${s.tall ? styles.tall : ''} ${s.detail ? styles.detail : ''}`} data-lenis-prevent>
          <img src={s.src} alt={s.label} />
        </div>
        <div className={styles.side}>
          {shots.length > 1 && <p className={styles.count}>{pad(index + 1)} / {pad(shots.length)}</p>}
          <h4 className={styles.title}>{s.label}</h4>
          {s.extra}
          {s.note && <p className={styles.note}>{s.note}</p>}
          {shots.length > 1 && (
            <div className={styles.nav}>
              <button type="button" onClick={() => step(-1)} disabled={index === 0} aria-label="Previous" data-cursor>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 8h-11M7 3.5 2.5 8 7 12.5" /></svg>
              </button>
              <button type="button" onClick={() => step(1)} disabled={index === shots.length - 1} aria-label="Next" data-cursor>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" /></svg>
              </button>
            </div>
          )}
        </div>
        <button ref={closeRef} type="button" className={styles.close} onClick={close} aria-label="Close" data-cursor>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /></svg>
        </button>
      </div>
    </div>,
    document.body,
  )
}
