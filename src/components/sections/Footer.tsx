import { useRef, useState, type ComponentType, type MouseEvent } from 'react'
import { footerColumns, studio } from '../../data/content'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { LineMask } from '../ui/LineMask'
import { useStartModal } from '../../context/StartModalContext'
import { useToast } from '../../context/ToastContext'
import { LangToggle } from '../ui/LangToggle'
import { ThemeToggle } from '../ui/ThemeToggle'
import {
  Mail,
  Chat,
  Pin,
  Globe,
  LinkedInLogo,
  InstagramLogo,
  FileText,
  Download,
  ArrowUpRight,
} from '../ui/Icons'
import { useLocalTime } from '../../hooks/useLocalTime'
import styles from './Footer.module.css'

/** Small icon shown before certain footer items, keyed by their label. */
const LINK_ICONS: Record<string, ComponentType<{ size?: number }>> = {
  'ahlselukas@gmail.com': Mail,
  WhatsApp: Chat,
  'Stockholm, Sweden': Pin,
  'Open to work — EU & remote': Globe,
  LinkedIn: LinkedInLogo,
  Instagram: InstagramLogo,
  'Download CV': FileText,
}

function ItemIcon({ label }: { label: string }) {
  const Icon = LINK_ICONS[label]
  return Icon ? (
    <span className={styles.ico} aria-hidden="true">
      <Icon size={14} />
    </span>
  ) : null
}

const CopyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

/**
 * Full-screen blue "outro" card — the closing bookend to the hero. Merges the
 * primary call-to-action (headline + Start a project + email) with the footer
 * navigation and contact details into one screen.
 */
export function Footer() {
  const time = useLocalTime()
  const { openModal } = useStartModal()
  const { notify } = useToast()
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<number | undefined>(undefined)

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

  // Placeholder links (href "#") aren't live yet — surface a toast that points
  // people to email instead of silently jumping to the top of the page.
  const onPlaceholder = (e: MouseEvent, label: string) => {
    e.preventDefault()
    notify(`${label} is coming soon`)
  }

  return (
    <footer className={styles.footer} id="contact">
      <div className={`${styles.inner} wrap`}>
        {/* Top band — availability + live local time */}
        <div className={styles.top}>
          <Reveal className={styles.avail}>
            <span className={styles.pulse} />
            Available for work — full-time or freelance
          </Reveal>
          <div className={styles.clock} aria-label={`Local time in ${studio.locationShort}`}>
            {studio.locationShort} · {time}
          </div>
        </div>

        {/* Centre — the call to action */}
        <div className={styles.cta}>
          <div className={styles.headWrap}>
            <h2 className={styles.head}>
              <LineMask>Looking for a designer?</LineMask>
              <LineMask i={1}>
                Let's <em>talk.</em>
              </LineMask>
            </h2>
            <div className={styles.scribble} aria-hidden="true">
              talk soon!
              <svg className={styles.scribbleLine} viewBox="0 0 180 16" fill="none">
                <path d="M3 10 C 36 3, 64 15, 96 7 S 150 4, 177 11" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <Reveal className={styles.actions} i={2}>
            <Button onClick={() => openModal()} variant="light" large onAccent arrow={false}>
              Contact
            </Button>
            <button
              type="button"
              className={styles.mail}
              onClick={copyEmail}
              data-cursor
              aria-label={`Copy email address ${studio.email}`}
            >
              <span>{studio.email}</span>
              <span className={styles.mailCopyIcon} aria-hidden="true">
                <CopyIcon />
              </span>
              {copied && (
                <span className={styles.mailToast} role="status">
                  Copied
                </span>
              )}
            </button>
          </Reveal>
          <Reveal as="p" className={styles.note} i={3}>
            Usually replies within a day · {studio.location} · {studio.worldwide}
          </Reveal>
        </div>

        {/* Bottom band — footer navigation + contact */}
        <div className={styles.meta}>
          <div className={styles.metaMain}>
            <div className={styles.brand}>
              <a href="#top" className={styles.mark} data-cursor aria-label="Back to top">
                lukas<span className={styles.dot} />
              </a>
              <p className={styles.tag}>
                A product designer in {studio.locationShort}, working across UX, interaction,
                motion, and brand — design through build.
              </p>
            </div>

            {footerColumns.map((col) => (
              <div className={styles.col} key={col.heading}>
                <h4>{col.heading}</h4>
                <ul>
                  {col.links.map((link) => {
                    const external = link.href.startsWith('http')
                    const download = link.href.endsWith('.pdf')
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className={styles.link}
                          data-cursor
                          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          {...(download ? { download: '' } : {})}
                          onClick={link.href === '#' ? (e) => onPlaceholder(e, link.label) : undefined}
                        >
                          <ItemIcon label={link.label} />
                          <span className={styles.label}>{link.label}</span>
                          <span className={styles.ar} aria-hidden="true">
                            {download ? <Download size={13} /> : external ? <ArrowUpRight size={13} /> : '→'}
                          </span>
                        </a>
                      </li>
                    )
                  })}
                  {'notes' in col &&
                    col.notes?.map((note) => (
                      <li key={note}>
                        <span className={styles.noteItem}>
                          <ItemIcon label={note} />
                          <span className={styles.label}>{note}</span>
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.bottom}>
            <span>© 2026 {studio.name} — All rights reserved</span>
            <div className={styles.bottomControls}>
              <LangToggle theme="onDark" />
              <ThemeToggle />
            </div>
            <span>Designed &amp; built in {studio.locationShort}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
