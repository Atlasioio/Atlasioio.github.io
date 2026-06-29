import { useTheme } from '../../context/ThemeContext'
import styles from './ThemeToggle.module.css'

/**
 * Light/dark switch. The button is filled with the *opposite* of the current
 * mode — solid black in light mode (so it reads as "switch to dark"), solid
 * white in dark mode — and shows the icon of the mode you'd switch to.
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'

  // Show the *target* icon: moon in light mode (go dark), sun in dark mode.
  const sunStyle: React.CSSProperties = {
    opacity: dark ? 1 : 0,
    transform: dark ? 'rotate(0) scale(1)' : 'rotate(-90deg) scale(0.4)',
  }
  const moonStyle: React.CSSProperties = {
    opacity: dark ? 0 : 1,
    transform: dark ? 'rotate(90deg) scale(0.4)' : 'rotate(0) scale(1)',
  }

  return (
    <button
      type="button"
      className={`${styles.btn} ${dark ? styles.dark : ''}`}
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={dark}
      data-cursor
    >
      <span className={styles.icons}>
        <svg className={styles.sun} style={sunStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        <svg className={styles.moon} style={moonStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
        </svg>
      </span>
    </button>
  )
}
