import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
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
  /** Suggested next questions, from the reply's FOLLOW-UPS line. */
  followUps?: string[]
}

/** Splits the reply from its trailing "FOLLOW-UPS: a | b | c" line. */
function splitFollowUps(text: string): { body: string; followUps: string[] } {
  const m = text.match(/\n?\s*FOLLOW-?UPS?:\s*(.+)\s*$/i)
  if (!m) return { body: text.trim(), followUps: [] }
  const followUps = m[1].split('|').map((q) => q.trim().replace(/^[-*\d.\s]+/, '')).filter((q) => q.length > 3).slice(0, 3)
  return { body: text.slice(0, m.index).trim(), followUps }
}

/** **bold** and *italic*, nothing else; returns React nodes (never HTML). */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (/^\*[^*\s][^*]*\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>
    return part
  })
}

/** Paragraphs, line breaks, and simple bulleted or numbered lists. */
function Rich({ text }: { text: string }) {
  const blocks = text.replace(/\r/g, '').split(/\n{2,}/)
  return (
    <>
      {blocks.map((block, b) => {
        const lines = block.split('\n').filter((l) => l.trim())
        if (lines.length && lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
          return <ul key={b}>{lines.map((l, i) => <li key={i}>{inline(l.replace(/^\s*[-*•]\s+/, ''))}</li>)}</ul>
        }
        if (lines.length && lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
          return <ol key={b}>{lines.map((l, i) => <li key={i}>{inline(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>)}</ol>
        }
        return (
          <p key={b}>
            {lines.map((l, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {inline(l.replace(/^#+\s*/, ''))}
              </Fragment>
            ))}
          </p>
        )
      })}
    </>
  )
}

/** Turns an assistant reply into tappable follow-ups: any project it names links
 *  to that case study; a mention of the design process or contact links home. */
function deriveActions(text: string, currentId?: string): Action[] {
  const out: Action[] = []
  const lower = text.toLowerCase()
  for (const p of projects) {
    if (p.id === currentId) continue
    // Case-sensitive on the name as written, so ordinary words don't match ("time" isn't Time).
    const re = new RegExp(`\\b${p.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
    if (re.test(text)) out.push({ label: `View ${p.name}`, to: `/work/${p.id}` })
  }
  if (/design process|how i work|my process|the process\b/.test(lower)) {
    out.push({ label: 'See my design process', to: '/about#process' })
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
      const { body, followUps } = splitFollowUps(data.reply || '…')
      setMessages((m) => [...m, { role: 'assistant', content: body, actions: deriveActions(body, project?.id), followUps }])
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

        {/* data-lenis-prevent: wheel and touch scroll this list, not the page behind it. */}
        <div className={styles.log} ref={logRef} data-lenis-prevent>
          <p className={styles.intro}>{cfg.greeting}</p>

          {messages.map((m, i) => (
            <Fragment key={i}>
              {m.role === 'user' ? (
                <div className={`${styles.msg} ${styles.user}`}>{m.content}</div>
              ) : (
                <div className={styles.row}>
                  <img className={styles.face} src={AVATAR} alt="" width={28} height={28} />
                  <div className={`${styles.msg} ${styles.assistant} ${m.error ? styles.err : ''}`}>
                    <Rich text={m.content} />
                  </div>
                </div>
              )}
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
              {/* Follow-up questions, under the latest answer only. */}
              {i === messages.length - 1 && !loading && m.followUps && m.followUps.length > 0 && (
                <div className={styles.followUps}>
                  {m.followUps.map((q) => (
                    <button key={q} type="button" className={styles.suggest} onClick={() => send(q)} data-cursor>
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </Fragment>
          ))}

          {loading && (
            <div className={styles.row}>
              <img className={styles.face} src={AVATAR} alt="" width={28} height={28} />
              <div className={`${styles.msg} ${styles.assistant} ${styles.typing}`} aria-label="Assistant is typing">
                <span className={styles.dot} />
                <span className={`${styles.dot} ${styles.dot2}`} />
                <span className={`${styles.dot} ${styles.dot3}`} />
              </div>
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
