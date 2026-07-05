import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { projects, type Project } from '../../data/content'
import { useStartModal } from '../../context/StartModalContext'
import { buildChatConfig } from '../../lib/chatContext'
import styles from './ProjectChat.module.css'

type Mode = 'bar' | 'open' | 'mini'
interface Action {
  label: string
  /** Navigation target (project / process section). */
  to?: string
  /** Opens the contact form modal instead of navigating. */
  contact?: boolean
}
interface Msg {
  role: 'user' | 'assistant'
  content: string
  error?: boolean
  actions?: Action[]
}

/** Turns an assistant reply into tappable follow-ups: any project it names links
 *  to that case study; a mention of the design process or contact links home. */
function deriveActions(text: string, currentId?: string): Action[] {
  const out: Action[] = []
  const lower = text.toLowerCase()
  for (const p of projects) {
    if (p.id === currentId) continue
    const re = new RegExp(`\\b${p.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').toLowerCase()}\\b`)
    if (re.test(lower)) out.push({ label: `View ${p.name}`, to: `/work/${p.id}` })
  }
  if (/design process|how i work|my process|the process\b/.test(lower)) {
    out.push({ label: 'See my design process', to: '/#process' })
  }
  if (/get in touch|reach out|contact me|email me|drop me a/.test(lower)) {
    out.push({ label: 'Get in touch', contact: true })
  }
  return out.slice(0, 4)
}

const AVATAR = '/images/profile-sketch.webp'

const ChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6" /></svg>
)
const Minimize = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M6 12h12" /></svg>
)
const CloseX = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
)
const SendIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12l16-8-6 16-3-7-7-1z" /></svg>
)

/**
 * A fixed, Claude-powered assistant for the work pages. Docks as a small bar you
 * press to raise the chat window; a minimize button shrinks it into a circular
 * sketch-avatar in the corner. Knows the whole portfolio (index) or one project
 * (case study) via `project`, and answers only from the site's own content.
 */
export function ProjectChat({ project }: { project?: Project }) {
  const cfg = useMemo(() => buildChatConfig(project), [project])
  const { openModal } = useStartModal()
  const [mode, setMode] = useState<Mode>('bar')
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const dockRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset when the scope changes (navigating between case studies).
  useEffect(() => {
    setMessages([])
    setInput('')
  }, [cfg])

  // Keep the log pinned to the latest message.
  useEffect(() => {
    if (mode === 'open' && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [messages, loading, mode])

  // Keep the window sitting above the mobile on-screen keyboard: the
  // VisualViewport shrinks when the keyboard opens, so we expose that height as
  // --kb and the CSS lifts the dock and trims the panel to fit.
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const update = () => {
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      dockRef.current?.style.setProperty('--kb', `${Math.round(kb)}px`)
    }
    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [])

  // Focus the field when the window opens; Esc minimizes it.
  useEffect(() => {
    if (mode !== 'open') return
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMode('bar')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode])

  const send = async (raw: string) => {
    const q = raw.trim()
    if (!q || loading) return
    const next: Msg[] = [...messages, { role: 'user', content: q }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next, system: cfg.system }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'error')
      const reply = data.reply || '…'
      setMessages((m) => [...m, { role: 'assistant', content: reply, actions: deriveActions(reply, project?.id) }])
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          error: true,
          content: "Sorry — I couldn't reach the assistant just now. You can still get in touch with me directly:",
          actions: [{ label: 'Get in touch', contact: true }],
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.dock} data-mode={mode} ref={dockRef}>
      {/* A single shell that morphs between the three states; the layers below
          cross-fade inside it. */}
      <div className={styles.shell}>
        {/* Docked bar (initial + minimized-to-bar) */}
        <div className={styles.barContent} aria-hidden={mode !== 'bar'}>
          <button type="button" className={styles.barMain} onClick={() => setMode('open')} aria-label="Open the project assistant" tabIndex={mode === 'bar' ? 0 : -1} data-cursor>
            <span className={styles.avatar}>
              <img src={AVATAR} alt="" width={40} height={40} />
              <span className={styles.pulse} aria-hidden="true" />
            </span>
            <span className={styles.barLabel}>{cfg.title}</span>
            <span className={styles.barChevron} aria-hidden="true"><ChevronUp /></span>
          </button>
          <button type="button" className={styles.barClose} onClick={() => setMode('mini')} aria-label="Close chat to corner" tabIndex={mode === 'bar' ? 0 : -1} data-cursor>
            <CloseX />
          </button>
        </div>

        {/* Minimized avatar (corner circle) */}
        <button type="button" className={styles.miniContent} onClick={() => setMode('open')} aria-label="Open the project assistant" aria-hidden={mode !== 'mini'} tabIndex={mode === 'mini' ? 0 : -1} data-cursor>
          <img src={AVATAR} alt="" width={58} height={58} />
          <span className={styles.pulse} aria-hidden="true" />
        </button>

        {/* Chat window */}
        <div className={styles.windowContent} role="dialog" aria-label="Project assistant" aria-hidden={mode !== 'open'}>
          <header className={styles.head}>
          <div className={styles.who}>
            <span className={styles.whoAvatar}>
              <img src={AVATAR} alt="" width={36} height={36} />
            </span>
            <div>
              <p className={styles.whoName}>Lukas</p>
              <p className={styles.whoSub}>{cfg.subtitle}</p>
            </div>
          </div>
          <div className={styles.headCtrls}>
            <button type="button" className={styles.min} onClick={() => setMode('bar')} aria-label="Minimize chat">
              <Minimize />
            </button>
            <button type="button" className={styles.min} onClick={() => setMode('mini')} aria-label="Close chat to corner">
              <CloseX />
            </button>
          </div>
        </header>

        <div className={styles.log} ref={logRef}>
          <p className={styles.intro}>{cfg.greeting}</p>

          {messages.map((m, i) => (
            <Fragment key={i}>
              <div className={`${styles.msg} ${m.role === 'user' ? styles.user : styles.assistant} ${m.error ? styles.err : ''}`}>
                {m.content}
              </div>
              {m.actions && m.actions.length > 0 && (
                <div className={styles.actions}>
                  {m.actions.map((a) =>
                    a.contact ? (
                      <button key={a.label} type="button" className={styles.action} onClick={() => openModal()} data-cursor>
                        {a.label}
                        <span aria-hidden="true">→</span>
                      </button>
                    ) : (
                      <Link key={a.to} to={a.to!} className={styles.action} data-cursor>
                        {a.label}
                        <span aria-hidden="true">→</span>
                      </Link>
                    ),
                  )}
                </div>
              )}
            </Fragment>
          ))}

          {loading && (
            <div className={`${styles.msg} ${styles.assistant} ${styles.typing}`} aria-label="Assistant is typing">
              <span className={styles.dot} />
              <span className={`${styles.dot} ${styles.dot2}`} />
              <span className={`${styles.dot} ${styles.dot3}`} />
            </div>
          )}

          {messages.length === 0 && !loading && (
            <div className={styles.suggests}>
              {cfg.suggestions.map((s) => (
                <button key={s} type="button" className={styles.suggest} onClick={() => send(s)} data-cursor>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className={styles.inputRow}
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
        >
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything…"
            aria-label="Message"
            maxLength={500}
          />
          <button type="submit" className={styles.send} disabled={!input.trim() || loading} aria-label="Send">
            <SendIcon />
          </button>
        </form>
        </div>
      </div>
    </div>
  )
}
