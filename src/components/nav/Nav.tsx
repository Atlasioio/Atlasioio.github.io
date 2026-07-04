import { Link } from 'react-router-dom'
import { topNavLinks } from '../../data/content'
import { Button } from '../ui/Button'
import { Hamburger } from './Hamburger'
import { LinkedInButton } from './LinkedInButton'
import styles from './Nav.module.css'

/**
 * Static top bar: wordmark + centred links. Sits at the top of the page and
 * scrolls away (not fixed, no background/border) — always light over the hero.
 *
 * The links stay centred because an invisible ghost copy of the fixed controls
 * reserves their exact width on the right. The ghost is aria-hidden and
 * non-interactive (visibility:hidden also removes it from the tab order).
 */
export function Nav() {
  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <a href="#top" className={styles.wordmark} data-cursor>
          lukas<span className={styles.dot} />
        </a>

        <ul className={styles.links}>
          {topNavLinks.map((link) => (
            <li key={link.href}>
              {link.href.startsWith('/') ? (
                <Link to={link.href} data-cursor>{link.label}</Link>
              ) : (
                <a href={link.href}>{link.label}</a>
              )}
            </li>
          ))}
        </ul>

        <div className={styles.ghost} aria-hidden="true">
          <Hamburger open={false} onClick={() => {}} theme="light" />
          <LinkedInButton theme="light" />
          <Button href="#" variant="light">
            Contact
          </Button>
        </div>
      </div>
    </header>
  )
}
