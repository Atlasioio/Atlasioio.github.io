import { useLang, type Lang } from '../../context/LangContext'
import styles from './LangToggle.module.css'

const LANGS: Lang[] = ['EN', 'SV']

/**
 * EN/SV pill. `theme` re-skins it for the surface it sits on:
 *  - 'onDark'  → light controls (over the hero card, open menu, footer)
 *  - 'onLight' → dark controls (scrolled past the hero)
 */
export function LangToggle({ theme = 'onLight' }: { theme?: 'onDark' | 'onLight' }) {
  const { lang, setLang } = useLang()
  return (
    <div className={`${styles.lang} ${styles[theme]}`} role="group" aria-label="Language">
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
