import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { studio } from '../data/content'
import styles from '../components/ui/Toast.module.css'

interface ToastValue {
  /** Show a "coming soon" card that offers the studio email (copy + mailto). */
  notify: (title: string) => void
}

const ToastContext = createContext<ToastValue | null>(null)

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)
const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 13l4 4L19 7" />
  </svg>
)
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
)
const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

/**
 * Minimal global toast (bottom-right card). Used for "coming soon" placeholders:
 * pairs the message with an explicit copy-email button and a one-click mailto.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; title: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const idRef = useRef(0)
  const dismissTimer = useRef<number | undefined>(undefined)
  const copyTimer = useRef<number | undefined>(undefined)

  const notify = useCallback((title: string) => {
    idRef.current += 1
    setCopied(false)
    setToast({ id: idRef.current, title })
    window.clearTimeout(dismissTimer.current)
    dismissTimer.current = window.setTimeout(() => setToast(null), 7000)
  }, [])

  const close = useCallback(() => {
    window.clearTimeout(dismissTimer.current)
    setToast(null)
  }, [])

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(studio.email)
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true)
    window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopied(false), 1600)
    // Keep the card around a little longer after a copy.
    window.clearTimeout(dismissTimer.current)
    dismissTimer.current = window.setTimeout(() => setToast(null), 5000)
  }, [])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className={styles.wrap}>
          <div key={toast.id} className={styles.card} role="status" aria-live="polite">
            <button type="button" className={styles.close} onClick={close} aria-label="Dismiss" data-cursor>
              <CloseIcon />
            </button>

            <div className={styles.head}>
              <span className={styles.icon} aria-hidden="true">
                <ClockIcon />
              </span>
              <div>
                <p className={styles.title}>{toast.title}</p>
                <p className={styles.sub}>Not live yet — reach me directly.</p>
              </div>
            </div>

            <div className={styles.field}>
              <span className={styles.email}>{studio.email}</span>
              <button
                type="button"
                className={`${styles.copy} ${copied ? styles.done : ''}`}
                onClick={copyEmail}
                aria-label={`Copy email address ${studio.email}`}
                data-cursor
                data-cursor-light
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <a className={styles.mail} href={`mailto:${studio.email}`} data-cursor data-cursor-light>
              <MailIcon />
              Email me
            </a>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
