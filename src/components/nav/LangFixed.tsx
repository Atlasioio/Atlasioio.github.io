import { LangToggle } from '../ui/LangToggle'
import { ThemeToggle } from '../ui/ThemeToggle'
import { useFixedLangTheme } from '../../hooks/useFixedLangTheme'
import { useMenu } from '../../context/MenuContext'
import styles from './LangFixed.module.css'

/**
 * Persistent controls fixed to the bottom-right of the viewport: EN/SV language
 * + a light/dark theme switch. Both re-theme for the surface beneath them, and
 * hide over the footer (which has its own toggle) and while the menu is open.
 */
export function LangFixed() {
  const { light, hidden } = useFixedLangTheme()
  const { open } = useMenu()
  const isHidden = hidden || open
  const surface = light ? 'onDark' : 'onLight'

  return (
    <div className={`${styles.wrap} ${isHidden ? styles.hidden : ''}`}>
      <LangToggle theme={surface} />
      <ThemeToggle />
    </div>
  )
}
