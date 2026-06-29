import { socials } from '../../data/content'
import { LinkedInLogo } from '../ui/Icons'
import styles from './LinkedInButton.module.css'

const LINKEDIN_URL = socials.find((s) => s.label === 'LinkedIn')?.href ?? '#'

/** Circular icon button — same shape/size as the hamburger — linking to LinkedIn. */
export function LinkedInButton({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <a
      href={LINKEDIN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.btn} ${theme === 'dark' ? styles.dark : ''}`}
      aria-label="LinkedIn profile"
      data-cursor
    >
      <LinkedInLogo size={17} />
    </a>
  )
}
