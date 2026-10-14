import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Hamburger } from './Hamburger'
import { LinkedInButton } from './LinkedInButton'
import { useNavScrolled } from '../../hooks/useNavScrolled'
import { useMenu } from '../../context/MenuContext'
import { useStartModal } from '../../context/StartModalContext'
import styles from './FixedControls.module.css'

/**
 * The only sticky top element: hamburger · "Start a project" (the button is the
 * right-most control, always visible). No bar/background. Light over the blue
 * hero, flips to dark once scrolled past it — and snaps back to light while the
 * menu is open.
 */
/** `staticDark` forces dark controls over a light page (sub-pages with no blue
 *  hero), instead of the hero-driven light→dark flip. `staticLight` forces
 *  light controls, for pages that are dark all the way down (the Time case). */
export function FixedControls({ staticDark = false, staticLight = false, home = false }: { staticDark?: boolean; staticLight?: boolean; home?: boolean }) {
  const scrolled = useNavScrolled('hero')
  const { open, toggle } = useMenu()
  // Sub-pages: once the page has scrolled, the pinned wordmark gets a blurred
  // backing so it stays legible over headings and images passing beneath it.
  const [pastTop, setPastTop] = useState(false)
  useEffect(() => {
    if (!home) return
    let last: boolean | null = null
    const on = () => {
      const next = window.scrollY > 40
      if (next !== last) setPastTop((last = next))
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [home])
  const { openModal } = useStartModal()

  // Dark controls when scrolled past the hero (or always, on sub-pages) AND the
  // menu is closed.
  const dark = !staticLight && (staticDark || scrolled) && !open
  // Over the accent-blue hero card, the light pill's hover darkens to ink.
  const overHero = !staticDark && !staticLight && !scrolled && !open
  // On phones, once scrolled past the hero (home only — sub-pages have a
  // top-left back link the hamburger would collide with), the hamburger slides
  // over to the top-left corner; back at the top it slides home next to Contact.
  const hamLeft = scrolled && !staticDark && !staticLight && !home

  return (
    <div className={styles.navfix} data-ham-left={hamLeft ? '' : undefined}>
      <div className={`${styles.inner} ${home ? styles.withHome : ''}`}>
        {/* Sub-pages: the wordmark stays pinned top-left, as the way home. */}
        {home && (
          <Link to="/" className={`${styles.home} ${dark ? styles.homeDark : ''}`}
            data-backed={pastTop ? '' : undefined} data-cursor aria-label="Lukas Ahlse — home">
            lukas<span className={styles.homeDot} />
          </Link>
        )}
        <div className={styles.right}>
          <span className={styles.hamWrap}>
            <Hamburger open={open} onClick={toggle} theme={dark ? 'dark' : 'light'} />
          </span>
          {/* LinkedIn drops on phones (it lives in the menu + footer) so the
              controls never crowd the wordmark on narrow screens. */}
          <span className={styles.liControl}>
            <LinkedInButton theme={dark ? 'dark' : 'light'} />
          </span>
          <Button
            onClick={() => openModal()}
            className={styles.ctrlBtn}
            variant={dark ? 'solid' : 'light'}
            onAccent={overHero}
          >
            Contact
          </Button>
        </div>
      </div>
    </div>
  )
}
