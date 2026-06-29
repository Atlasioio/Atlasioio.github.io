import { Reveal } from '../ui/Reveal'
import { LinkedInLogo, Mail } from '../ui/Icons'
import { socials, studio } from '../../data/content'
import styles from './Credibility.module.css'

const LINKEDIN_URL = socials.find((s) => s.label === 'LinkedIn')?.href ?? '#'

/** One honest trust line + real contact links (no logos or invented awards). */
export function Credibility() {
  return (
    <section className={styles.cred}>
      <div className={`section wrap ${styles.inner}`}>
        <Reveal as="p" className={styles.line}>
          <strong>Most recently a product designer at Sony Nimway</strong>
          <span className={styles.mute}> — smart-office products across web, app, and large-format screens.</span>
        </Reveal>
        <Reveal className={styles.badges} i={1}>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={styles.badge} data-cursor>
            <LinkedInLogo size={15} />
            LinkedIn
          </a>
          <a href={`mailto:${studio.email}`} className={styles.badge} data-cursor>
            <Mail size={15} />
            {studio.email}
          </a>
        </Reveal>
      </div>
    </section>
  )
}
