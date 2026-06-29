import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { menuLinks, socials, studio } from '../../data/content'
import { useMenu } from '../../context/MenuContext'
import { useToast } from '../../context/ToastContext'
import styles from './Menu.module.css'

/**
 * Fullscreen primary-navigation overlay. Slides down from the top as an ink
 * panel; numbered links stagger in. Closes on link click (the anchor scroll
 * then runs); Esc + scroll lock are handled by MenuContext.
 */
export function Menu() {
  const { open, close } = useMenu()
  const { notify } = useToast()

  // Placeholder socials aren't live yet — close the menu and point to email.
  const onSocial = (e: MouseEvent, label: string) => {
    e.preventDefault()
    close()
    notify(`${label} is coming soon`)
  }

  return (
    <div
      id="menu"
      className={`${styles.menu} ${open ? styles.open : ''}`}
      aria-hidden={!open}
    >
      <nav className={styles.nav} aria-label="Primary">
        {menuLinks.map((link, i) => {
          const inner = (
            <>
              <span className={styles.no}>{link.no}</span>
              <span className={styles.txt}>{link.label}</span>
            </>
          )
          const style = { '--i': i } as React.CSSProperties
          // Path links (e.g. /work) route through the SPA; hash links scroll.
          return link.href.startsWith('/') ? (
            <Link
              key={link.href}
              to={link.href}
              className={styles.link}
              style={style}
              onClick={close}
              tabIndex={open ? 0 : -1}
              data-cursor
            >
              {inner}
            </Link>
          ) : (
            <a
              key={link.href}
              href={link.href}
              className={styles.link}
              style={style}
              onClick={close}
              tabIndex={open ? 0 : -1}
              data-cursor
            >
              {inner}
            </a>
          )
        })}
      </nav>

      <div className={styles.meta}>
        <div className={styles.metaCol}>
          <span className={styles.metaLabel}>Get in touch</span>
          <a href={`mailto:${studio.email}`} tabIndex={open ? 0 : -1} data-cursor>
            {studio.email}
          </a>
        </div>
        <div className={styles.metaCol}>
          <span className={styles.metaLabel}>Elsewhere</span>
          <div className={styles.socialRow}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                tabIndex={open ? 0 : -1}
                data-cursor
                onClick={s.href === '#' ? (e) => onSocial(e, s.label) : undefined}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div className={styles.metaCol}>
          <span className={styles.metaLabel}>Based in</span>
          <span>{studio.location} · {studio.worldwide}</span>
        </div>
      </div>
    </div>
  )
}
