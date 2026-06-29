import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './Button.module.css'

type Variant = 'solid' | 'ghost' | 'light'

interface ButtonProps {
  children: ReactNode
  variant?: Variant
  large?: boolean
  /** Show the nudging arrow (default true). */
  arrow?: boolean
  /**
   * Sitting on the accent-blue hero card: hover darkens to ink instead of the
   * accent (which would blend into the card).
   */
  onAccent?: boolean
  /** Internal route — renders a router Link. */
  to?: string
  /** External / hash / mailto — renders a plain anchor. */
  href?: string
  /** Action (e.g. open a modal) — renders a <button>. */
  onClick?: () => void
  className?: string
  'aria-label'?: string
}

/**
 * Pill button. Renders a router `Link` (`to`), a plain anchor (`href`), or a
 * `<button>` (action / `onClick`). The arrow nudges +3px and the pill turns
 * accent on hover (CSS).
 */
export function Button({
  children,
  variant = 'solid',
  large = false,
  arrow = true,
  onAccent = false,
  to,
  href,
  onClick,
  className,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classes = [
    styles.btn,
    variant === 'ghost' && styles.ghost,
    variant === 'light' && styles.light,
    large && styles.large,
    onAccent && styles.onAccent,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const inner: ReactNode = (
    <>
      {children}
      {arrow && (
        <span className={styles.arr} aria-hidden="true">
          →
        </span>
      )}
    </>
  )

  const shared = {
    className: classes,
    'data-cursor': true,
    'data-cursor-light': true,
    'aria-label': ariaLabel,
  } as const

  if (to) {
    return (
      <Link to={to} onClick={onClick} {...shared}>
        {inner}
      </Link>
    )
  }
  if (href !== undefined) {
    return (
      <a href={href} onClick={onClick} {...shared}>
        {inner}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} {...shared}>
      {inner}
    </button>
  )
}
