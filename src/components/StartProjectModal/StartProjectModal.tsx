import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import { studio, socials } from '../../data/content'
import { useStartModal } from '../../context/StartModalContext'
import styles from './StartProjectModal.module.css'

const LINKEDIN_URL = socials.find((s) => s.label === 'LinkedIn')?.href ?? '#'

/**
 * Real message delivery via Web3Forms (https://web3forms.com) — a free, no-backend
 * relay that emails submissions straight to the studio inbox. Get an access key by
 * entering your email on their site (no account); it's safe to expose client-side.
 * Set it in `.env` as VITE_WEB3FORMS_KEY (and in the Vercel project's env vars).
 *
 * If no key is configured or the request fails, we surface a real error rather than
 * a fake "sent" — the form never claims success it can't back up.
 */
const WEB3FORMS_KEY = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined)?.trim() || ''
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

type Status = 'idle' | 'sending' | 'sent' | 'error'

interface Message {
  name: string
  email: string
  message: string
}

async function sendMessage(payload: Message): Promise<void> {
  if (!WEB3FORMS_KEY) {
    throw new Error('Contact form is not configured (missing delivery key).')
  }
  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `Portfolio contact${payload.name ? ` — ${payload.name}` : ''}`,
      from_name: payload.name || 'Portfolio visitor',
      replyto: payload.email,
      name: payload.name || '(not given)',
      email: payload.email,
      message: payload.message,
    }),
  })
  const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || `Delivery failed (${res.status}).`)
  }
}

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

const FOCUSABLE = 'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'

/** The dialog contents — mounted fresh each open, so form state resets. */
function Dialog({ close, closing }: { close: () => void; closing: boolean }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<number | undefined>(undefined)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Focus management: focus into the dialog on open, trap Tab, restore on close.
  useEffect(() => {
    const el = dialogRef.current
    const prevFocus = document.activeElement as HTMLElement | null
    const focusables = () =>
      [...(el?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])].filter((f) => !f.hasAttribute('disabled'))
    focusables()[0]?.focus()

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const list = focusables()
      if (!list.length) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    el?.addEventListener('keydown', onKey)
    return () => {
      el?.removeEventListener('keydown', onKey)
      window.clearTimeout(copyTimer.current)
      prevFocus?.focus?.()
    }
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(studio.email)
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true)
    window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      await sendMessage({ name, email, message })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      className={`${styles.dialog} ${closing ? styles.dialogClosing : ''}`}
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-title"
    >
      <button type="button" className={styles.close} onClick={close} aria-label="Close" data-cursor>
        <CloseIcon />
      </button>

      {status === 'sent' ? (
        <div className={styles.success} role="status">
          <div className={styles.check} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className={styles.title} id="start-title">
            Message sent.
          </h2>
          <p className={styles.lead}>
            Thanks for reaching out — I'll get back to you within a day, usually sooner. Talk soon.
          </p>
          <button type="button" className={styles.doneBtn} onClick={close} data-cursor data-cursor-light>
            Done
          </button>
        </div>
      ) : (
        <>
          <p className={styles.eyebrow}>Contact</p>
          <h2 className={styles.title} id="start-title">
            Let's talk.
          </h2>
          <p className={styles.lead}>
            Looking for a product designer — full-time, freelance, or just a chat? Leave a note and
            I'll get back to you, usually within a day.
          </p>

          <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">
                Name <span className={styles.optional}>— optional</span>
              </label>
              <input
                id="name"
                className={styles.input}
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className={styles.input}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                className={styles.textarea}
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="A line about what you're after — a role, a project, or just hello…"
              />
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.submit} disabled={status === 'sending'} data-cursor data-cursor-light>
                {status === 'sending' ? 'Sending…' : 'Send message'}
                <span className={styles.arr} aria-hidden="true">→</span>
              </button>
              <span className={styles.alt}>
                or{' '}
                <button type="button" className={styles.mailCopy} onClick={copyEmail} aria-label={`Copy email address ${studio.email}`} data-cursor>
                  <span>{studio.email}</span>
                  <span className={styles.copyIcon} aria-hidden="true">
                    <CopyIcon />
                  </span>
                  {copied && (
                    <span className={styles.toast} role="status">
                      Copied
                    </span>
                  )}
                </button>
                <span className={styles.altSep} aria-hidden="true">·</span>
                <a className={styles.altLink} href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" data-cursor>
                  LinkedIn
                </a>
              </span>
            </div>

            {status === 'error' && (
              <p className={styles.error} role="alert">
                Couldn't send your message — please try again, or email {studio.email} directly.
              </p>
            )}
          </form>
        </>
      )}
    </div>
  )
}

const EXIT_MS = 450

/** Gate + blurred overlay. Keeps the dialog mounted through its exit animation
 *  (the page behind blurs/un-blurs gradually and the dialog rises/falls). */
export function StartProjectModal() {
  const { open, close } = useStartModal()
  const [render, setRender] = useState(open)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (open) {
      setRender(true)
      setClosing(false)
      return
    }
    if (!render) return
    setClosing(true)
    const t = window.setTimeout(() => {
      setRender(false)
      setClosing(false)
    }, EXIT_MS)
    return () => window.clearTimeout(t)
  }, [open, render])

  if (!render) return null

  const onOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) close()
  }

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ''}`}
      onClick={onOverlayClick}
      data-cursor-modal
    >
      <Dialog close={close} closing={closing} />
    </div>
  )
}
