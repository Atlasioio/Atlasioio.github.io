import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
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
  /** A case study: shown as a row with its thumbnail. */
  project?: Project
}
interface Msg {
  role: 'user' | 'assistant'
  content: string
  error?: boolean
  actions?: Action[]
  /** Suggested next questions, from the reply's FOLLOW-UPS line. */
  followUps?: string[]
}
/** A hover preview of a mentioned project, placed inside the chat window. */
interface Peek {
  project: Project
  left: number
  top: number
}

/** Splits the reply from its trailing "FOLLOW-UPS: a | b | c" line. */
function splitFollowUps(text: string): { body: string; followUps: string[] } {
  const m = text.match(/\n?\s*FOLLOW-?UPS?:\s*(.+)\s*$/i)
  if (!m) return { body: text.trim(), followUps: [] }
  const followUps = m[1].split('|').map((q) => q.trim().replace(/^[-*\d.\s]+/, '')).filter((q) => q.length > 3).slice(0, 3)
  return { body: text.slice(0, m.index).trim(), followUps }
}

/* ---- Project names ------------------------------------------------------ */

/** What a project is called in conversation: "Goodreads Redesign" is usually
 *  just "Goodreads", and "Sony / Nimway" either half. */
const shortName = (p: Project) => p.name.replace(/\s+Redesign$/, '')
const NAME_TO_PROJECT = new Map<string, Project>()
for (const p of projects) {
  for (const n of [p.name, shortName(p), ...p.name.split(' / ')]) NAME_TO_PROJECT.set(n.trim(), p)
}
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// Case-sensitive on the name as written, so ordinary words don't match ("time" isn't Time).
// Longest first, so "Goodreads Redesign" wins over "Goodreads".
const NAME_RE = new RegExp(
  `\\b(${[...NAME_TO_PROJECT.keys()].sort((a, b) => b.length - a.length).map(escape).join('|')})\\b`,
  'g',
)

type RenderName = (name: string, key: string) => ReactNode | null

/** Plain text with project names swapped for mention pills. */
function withMentions(text: string, key: string, renderName?: RenderName): ReactNode[] {
  if (!renderName) return [text]
  return text.split(NAME_RE).map((part, i) => (i % 2 === 1 ? renderName(part, `${key}-${i}`) ?? part : part))
}

/** **bold** and *italic*, nothing else; returns React nodes (never HTML). */
function inline(text: string, renderName?: RenderName): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      const inner = part.slice(2, -2)
      // a bolded project name becomes its mention, not bold text
      const named = NAME_TO_PROJECT.has(inner) && renderName?.(inner, `b${i}`)
      return named || <strong key={i}>{withMentions(inner, `b${i}`, renderName)}</strong>
    }
    if (/^\*[^*\s][^*]*\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>
    return <Fragment key={i}>{withMentions(part, `t${i}`, renderName)}</Fragment>
  })
}

/** Paragraphs, line breaks, and simple bulleted or numbered lists. */
function Rich({ text, renderName }: { text: string; renderName?: RenderName }) {
  const blocks = text.replace(/\r/g, '').split(/\n{2,}/)
  return (
    <>
      {blocks.map((block, b) => {
        const lines = block.split('\n').filter((l) => l.trim())
        if (lines.length && lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
          return <ul key={b}>{lines.map((l, i) => <li key={i}>{inline(l.replace(/^\s*[-*•]\s+/, ''), renderName)}</li>)}</ul>
        }
        if (lines.length && lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
          return <ol key={b}>{lines.map((l, i) => <li key={i}>{inline(l.replace(/^\s*\d+[.)]\s+/, ''), renderName)}</li>)}</ol>
        }
        return (
          <p key={b}>
            {lines.map((l, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {inline(l.replace(/^#+\s*/, ''), renderName)}
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
  const named = new Set<Project>()
  for (const m of text.matchAll(NAME_RE)) named.add(NAME_TO_PROJECT.get(m[1])!)
  // in the order the site lists them
  for (const p of projects) {
    if (p.id === currentId || !named.has(p)) continue
    out.push({ label: shortName(p), to: `/work/${p.id}`, project: p })
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

/** A project's home card in miniature: its backdrop with the phone peeking in. */
function Thumb({ project: p, className = '' }: { project: Project; className?: string }) {
  const phone = p.card ? p.card.phones[p.card.cardPhone ?? 0] : undefined
  const bg = p.card?.bg ?? p.image?.src
  return (
    <span
      className={`${styles.thumb} ${className}`}
      style={{ background: bg ? `center / cover no-repeat url(${bg})` : p.coverBg }}
      aria-hidden="true"
    >
      {phone && <img src={phone} alt="" loading="lazy" />}
    </span>
  )
}

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
const ArrowDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
)
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M4 7l8 6 8-6" /></svg>
)
const StepsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="6" cy="18" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="18" cy="6" r="2" /><path d="M7.5 16.5l3-3M13.5 10.5l3-3" /></svg>
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
  const [moreBelow, setMoreBelow] = useState(false)
  const [peek, setPeek] = useState<Peek | null>(null)
  const dockRef = useRef<HTMLDivElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const lastQuestionRef = useRef<HTMLDivElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)
  const prevMode = useRef<Mode>(mode)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset when the scope changes (navigating between case studies).
  useEffect(() => {
    setMessages([])
    setInput('')
  }, [cfg])

  /** True when part of the conversation sits below the fold (the spacer doesn't count). */
  const checkMore = () => {
    const log = logRef.current
    if (!log) return
    const spacer = spacerRef.current?.offsetHeight ?? 0
    setMoreBelow(log.scrollHeight - spacer - log.scrollTop - log.clientHeight > 40)
  }

  // A new question moves to the top of the window and its answer reads down
  // from there, instead of the log jumping to the end of a long reply. The
  // spacer after the last message makes room for that when the turn is short.
  useLayoutEffect(() => {
    const log = logRef.current
    const spacer = spacerRef.current
    if (mode !== 'open' || !log || !spacer) return
    const justOpened = prevMode.current !== 'open'
    prevMode.current = mode
    const q = lastQuestionRef.current
    spacer.style.height = '0px'
    if (!q) return checkMore()
    const top = q.offsetTop - 12
    spacer.style.height = `${Math.max(0, top + log.clientHeight - log.scrollHeight)}px`
    const asked = messages[messages.length - 1]?.role === 'user'
    if (asked || justOpened) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      log.scrollTo({ top, behavior: asked && !reduce ? 'smooth' : 'auto' })
    }
    checkMore()
  }, [messages, loading, mode])
  useEffect(() => {
    if (mode !== 'open') prevMode.current = mode
  }, [mode])

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
    setPeek(null)
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

  /** Shows a mentioned project's preview above (or below) its pill. */
  const showPeek = (p: Project, el: HTMLElement) => {
    const win = windowRef.current?.getBoundingClientRect()
    if (!win) return
    const r = el.getBoundingClientRect()
    const W = 232, H = 172
    const left = Math.max(12, Math.min(r.left - win.left, win.width - W - 12))
    const top = r.top - win.top > H + 70 ? r.top - win.top - H - 8 : r.bottom - win.top + 8
    setPeek({ project: p, left, top })
  }

  /** A project name in an answer, as a pill linking to its case study. */
  const renderName: RenderName = (name, key) => {
    const p = NAME_TO_PROJECT.get(name)
    if (!p || p.id === project?.id) return null
    return (
      <Link
        key={key}
        to={`/work/${p.id}`}
        className={styles.mention}
        onMouseEnter={(e) => showPeek(p, e.currentTarget)}
        onMouseLeave={() => setPeek(null)}
        onFocus={(e) => showPeek(p, e.currentTarget)}
        onBlur={() => setPeek(null)}
        data-cursor
      >
        <Thumb project={p} className={styles.mentionThumb} />
        {name}
      </Link>
    )
  }

  const lastUser = messages.map((m) => m.role).lastIndexOf('user')

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
        <div className={styles.windowContent} role="dialog" aria-label="Project assistant" aria-hidden={mode !== 'open'} ref={windowRef}>
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
        <div
          className={styles.log}
          ref={logRef}
          onScroll={() => {
            checkMore()
            if (peek) setPeek(null)
          }}
          data-lenis-prevent
        >
          <p className={styles.intro}>{cfg.greeting}</p>

          {messages.map((m, i) => (
            <Fragment key={i}>
              {m.role === 'user' ? (
                <div className={`${styles.msg} ${styles.user}`} ref={i === lastUser ? lastQuestionRef : undefined}>{m.content}</div>
              ) : (
                <div className={styles.row}>
                  <img className={styles.face} src={AVATAR} alt="" width={28} height={28} />
                  <div className={`${styles.msg} ${styles.assistant} ${m.error ? styles.err : ''}`}>
                    <Rich text={m.content} renderName={m.error ? undefined : renderName} />
                  </div>
                </div>
              )}
              {/* Where to go next: case studies with their thumbnail, then any other links. */}
              {m.actions && m.actions.length > 0 && (
                <div className={styles.links}>
                  {m.actions.map((a) => {
                    const body = (
                      <>
                        {a.project ? (
                          <Thumb project={a.project} className={styles.linkThumb} />
                        ) : (
                          <span className={styles.linkIcon} aria-hidden="true">{a.contact ? <MailIcon /> : <StepsIcon />}</span>
                        )}
                        <span className={styles.linkText}>
                          <b>{a.label}</b>
                          {a.project && <span>{a.project.outcome}</span>}
                        </span>
                        <span className={styles.linkGo} aria-hidden="true">→</span>
                      </>
                    )
                    return a.contact ? (
                      <button key={a.label} type="button" className={styles.link} onClick={() => openModal()} data-cursor>
                        {body}
                      </button>
                    ) : (
                      <Link key={a.to} to={a.to!} className={styles.link} data-cursor>
                        {body}
                      </Link>
                    )
                  })}
                </div>
              )}
              {/* Follow-up questions, under the latest answer only. */}
              {i === messages.length - 1 && !loading && m.followUps && m.followUps.length > 0 && (
                <div className={styles.followUps}>
                  <p className={styles.askNext}>Ask next</p>
                  {m.followUps.map((q) => (
                    <button key={q} type="button" className={styles.followUp} onClick={() => send(q)} data-cursor>
                      <i aria-hidden="true">↳</i>
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

          <div className={styles.spacer} ref={spacerRef} aria-hidden="true" />
        </div>

        <button
          type="button"
          className={`${styles.moreBelow} ${moreBelow ? styles.moreOn : ''}`}
          onClick={() => logRef.current?.scrollBy({ top: logRef.current.clientHeight * 0.8, behavior: 'smooth' })}
          tabIndex={moreBelow ? 0 : -1}
          aria-hidden={!moreBelow}
          data-cursor
        >
          <ArrowDown />
          More below
        </button>

        {peek && (
          <div className={styles.peek} style={{ left: peek.left, top: peek.top }} aria-hidden="true">
            <Thumb project={peek.project} className={styles.peekThumb} />
            <div>
              <b>
                {shortName(peek.project)} · {peek.project.year}
              </b>
              {peek.project.outcome}
            </div>
          </div>
        )}

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
