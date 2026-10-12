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
            A product designer in {studio.locationShort}, most recently at Sony / Nimway.
          </Reveal>
        </header>

        {/* Three text styles only, borrowed from the sections below: a section
            title (as "A bit more human."), item names (as the How I work steps)
            and body text. */}
        <section className={`section wrap ${styles.block}`} id="intro">
          <Marker num="01" label="Who I am" />
          <Reveal as="h2" className={styles.title}>
            Curious by default.
          </Reveal>
          <div className={styles.prose}>
            <Reveal as="p">
              At <strong>Sony Nimway</strong> I designed smart-office products used
              internationally, across web, app and large-format screens.
            </Reveal>
            <Reveal as="p" i={1}>
              I like understanding <em>why</em> a product should work a certain way, then sweating
              the details until it feels right for the people using it. I love owning my work and
              pushing it forward on my own, and I'm every bit as happy building alongside a team.
            </Reveal>
            <Reveal as="p" i={2}>
              Lately I've been more hands-on in code, learning where AI actually helps.
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
        </section>

        <section className={`section wrap ${styles.block}`} id="experience">
          <Marker num="02" label="Experience" />
          <Reveal as="h2" className={styles.title}>
            Where I've worked.
          </Reveal>
          <CvList entries={experience} />
        </section>

        <section className={`section wrap ${styles.block}`} id="education">
          <Marker num="03" label="Education" />
          <Reveal as="h2" className={styles.title}>
            What I studied.
          </Reveal>
          <CvList entries={education} />
        </section>

        <Process num="04" />
        <Beyond num="05" />
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
          <h3 className={styles.org}>{e.org}</h3>
          <p className={styles.note}>
            <strong>{e.role}.</strong> {e.note}
          </p>
        </Reveal>
      ))}
    </ul>
  )
}
