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
 *  hero), instead of the hero-driven light→dark flip. */
export function FixedControls({ staticDark = false }: { staticDark?: boolean }) {
  const scrolled = useNavScrolled('hero')
  const { open, toggle } = useMenu()
  const { openModal } = useStartModal()

  // Dark controls when scrolled past the hero (or always, on sub-pages) AND the
  // menu is closed.
  const dark = (staticDark || scrolled) && !open
  // Over the accent-blue hero card, the light pill's hover darkens to ink.
  const overHero = !staticDark && !scrolled && !open
  // On phones, once scrolled past the hero (home only — sub-pages have a
  // top-left back link the hamburger would collide with), the hamburger slides
  // over to the top-left corner; back at the top it slides home next to Contact.
  const hamLeft = scrolled && !staticDark

  return (
    <div className={styles.navfix} data-ham-left={hamLeft ? '' : undefined}>
      <div className={styles.inner}>
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
