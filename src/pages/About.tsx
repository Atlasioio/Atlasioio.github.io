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

/** The about page (route "/about"): the longer introduction, where I've worked
 *  and studied, how I work, and the personal bento. */
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

        <header className={`${caseStyles.hero} wrap`}>
          <Reveal>
            <Link to="/" className={caseStyles.back} data-cursor>
              <span aria-hidden="true">←</span> Home
            </Link>
          </Reveal>
          <Reveal as="p" className={caseStyles.eyebrow} i={1}>
            About
          </Reveal>
          <Reveal as="h1" className={caseStyles.title} i={2}>
            Hi, I'm Lukas.
          </Reveal>
          <Reveal as="p" className={caseStyles.tagline} i={3}>
            A product designer in {studio.locationShort}. Curious by default, and happiest where
            craft, the why's and problem-solving overlap.
          </Reveal>
        </header>

        <section className={`section wrap ${styles.intro}`} id="intro">
          <Marker num="01" label="Who I am" />
          <div className={styles.introGrid}>
            <div className={styles.introText}>
              <Reveal as="p">
                Most recently I was at <strong>Sony Nimway</strong>, designing smart-office
                products used internationally, across web, app and large-format screens.
              </Reveal>
              <Reveal as="p" i={1}>
                I like understanding <em>why</em> a product should work a certain way, then
                sweating the details until it feels right for the people using it. I love owning
                my work and pushing it forward on my own, and I'm every bit as happy building
                alongside a team.
              </Reveal>
              <Reveal as="p" i={2}>
                Lately I've been more hands-on in code, learning where AI actually helps.
              </Reveal>
            </div>
            <Reveal as="aside" className={styles.introAside} i={2}>
              <dl className={styles.facts}>
                <div>
                  <dt>Based in</dt>
                  <dd>{studio.location}</dd>
                </div>
                <div>
                  <dt>Most recently</dt>
                  <dd>UX designer, Sony / Nimway</dd>
                </div>
                <div>
                  <dt>Looking for</dt>
                  <dd>{studio.worldwide}</dd>
                </div>
              </dl>
              <div className={styles.actions}>
                <Button href="/Lukas-Ahlse-CV.pdf" target="_blank" rel="noopener">
                  Download CV
                </Button>
                <Button href={`mailto:${studio.email}`} variant="light">
                  Email me
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={`section wrap ${styles.cv}`} id="experience">
          <Marker num="02" label="Experience" />
          <CvList entries={experience} />
          <Reveal as="h3" className={styles.subhead}>
            Education
          </Reveal>
          <CvList entries={education} />
        </section>

        <Process num="03" />
        <Beyond num="04" />
      </main>

      <Footer />
      <ProjectChat />
    </>
  )
}

function CvList({ entries }: { entries: CvEntry[] }) {
  return (
    <ul className={styles.list}>
      {entries.map((e, i) => (
        <Reveal as="li" key={e.org} className={styles.row} i={i}>
          <p className={styles.org}>{e.org}</p>
          <div>
            <p className={styles.role}>{e.role}</p>
            <p className={styles.note}>{e.note}</p>
          </div>
        </Reveal>
      ))}
    </ul>
  )
}
