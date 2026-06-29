import styles from './Hamburger.module.css'

interface HamburgerProps {
  open: boolean
  onClick: () => void
  /** 'light' bars over the hero / open menu, 'dark' once scrolled. */
  theme: 'light' | 'dark'
}

/** Two-bar button that morphs into an X when the menu is open. */
export function Hamburger({ open, onClick, theme }: HamburgerProps) {
  const classes = [
    styles.hamburger,
    theme === 'dark' && styles.dark,
    open && styles.open,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      aria-controls="menu"
      data-cursor
    >
      <span />
      <span />
      <span />
    </button>
  )
}
