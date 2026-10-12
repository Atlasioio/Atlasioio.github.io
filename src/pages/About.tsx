import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { education, experience, studio, type CvEntry } from '../data/content'
import { useLenis } from '../hooks/useLenis'
import { FixedControls } from '../components/nav/FixedControls'
import { LangFixed } from '../components/nav/LangFixed'
import { Menu } from '../components/nav/Menu'
import { Process } from '../components/sections/Process'
import { Beyond } from '../components/sections/Beyond'
import { Footer } from '../components/sections/Footer'
import { ProjectChat } from '../components/ProjectChat/ProjectChat'
import { Marker } from '../components/ui/Marker'
import { Reveal } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'
import caseStyles from './CaseStudy.module.css'
import styles from './About.module.css'

/**
 * The about page (route "/about"). One heading per level, like How I work:
 * a single page title with the introduction under it, then each section is a
 * marker and a row of items, each item a name with a short text under it.
 */
export function About() {
  useLenis()
  const { hash } = useLocation()

  // Open at the top, or at a section when linked to one (e.g. /about#process).
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView())
        return
      }
    }
    window.scrollTo(0, 0)
  }, [hash])

  return (
    <>
      <FixedControls staticDark />
      <LangFixed />
      <Menu />

      <main className={caseStyles.page} id="top">
        <div className={`${caseStyles.bar} wrap`}>
          <Link to="/" className={caseStyles.wordmark} data-cursor aria-label="Lukas Ahlse — home">
            lukas<span className={caseStyles.dot} />
          </Link>
        </div>

        <header className={`wrap ${styles.hero}`}>
          <Reveal as="h1" className={caseStyles.title}>
            Hi, I'm Lukas.
          </Reveal>
          <div className={styles.intro}>
            <Reveal as="p" i={1}>
              A product designer in {studio.locationShort}. Most recently at{' '}
              <strong>Sony Nimway</strong>, I designed smart-office products used internationally,
              across web, app and large-format screens.
            </Reveal>
            <Reveal as="p" i={2}>
              I'm curious by default: I like understanding why a product should work a certain
              way, then sweating the details until it feels right for the people using it. I love
              owning my work and pushing it forward on my own, and I'm every bit as happy building
              alongside a team. Lately I've been more hands-on in code, learning where AI actually
              helps.
            </Reveal>
          </div>
          <Reveal className={styles.actions} i={3}>
            <Button href="/Lukas-Ahlse-CV.pdf" target="_blank" rel="noopener">
              Download CV
            </Button>
            <Button href={`mailto:${studio.email}`} variant="light">
              Email me
            </Button>
          </Reveal>
        </header>

        <section className={`section wrap ${styles.block}`} id="experience">
          <Marker num="01" label="Experience" />
          <CvGrid entries={experience} />
        </section>

        <section className={`section wrap ${styles.block}`} id="education">
          <Marker num="02" label="Education" />
          <CvGrid entries={education} />
        </section>

        <Process num="03" />
        <Beyond num="04" />
      </main>

      <Footer />
      <ProjectChat />
    </>
  )
}

/** Items in columns, styled like the How I work steps: a name, then text. */
function CvGrid({ entries }: { entries: CvEntry[] }) {
  return (
    <ul className={styles.grid}>
      {entries.map((e, i) => (
        <Reveal as="li" key={e.org} className={styles.item} i={i}>
          <h2 className={styles.name}>{e.org}</h2>
          <p className={styles.role}>{e.role}</p>
          <p className={styles.desc}>{e.note}</p>
        </Reveal>
      ))}
    </ul>
  )
}
