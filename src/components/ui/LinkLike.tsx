import type { AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import styles from './LinkLike.module.css'

interface LinkLikeProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Accent dot + animated underline + nudging arrow. */
  children: React.ReactNode
  /** Re-theme for placement on the dark hero card. */
  onDark?: boolean
  /** Internal route — renders a router Link instead of a plain anchor. */
  to?: string
}

export function LinkLike({ children, onDark = false, className, to, ...rest }: LinkLikeProps) {
  const classes = [styles.linklike, onDark && styles.onDark, className].filter(Boolean).join(' ')
  const inner = (
    <>
      <span className={styles.dotmark} aria-hidden="true" />
      <span className={styles.u}>{children}</span>
      <span className={styles.arr} aria-hidden="true">→</span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} data-cursor>
        {inner}
      </Link>
    )
  }
  return (
    <a className={classes} data-cursor {...rest}>
      {inner}
    </a>
  )
}
