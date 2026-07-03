import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../data/content'
import { useLenis } from '../hooks/useLenis'
import { FixedControls } from '../components/nav/FixedControls'
import { LangFixed } from '../components/nav/LangFixed'
import { Menu } from '../components/nav/Menu'
import { Footer } from '../components/sections/Footer'
import { CaseRow } from '../components/sections/CaseRow'
import { ProjectChat } from '../components/ProjectChat/ProjectChat'
import { Reveal } from '../components/ui/Reveal'
import caseStyles from './CaseStudy.module.css'
import workStyles from '../components/sections/Work.module.css'

/** The full work index (route "/work") — every project as a case row. */
export function AllWork() {
  useLenis()

  // Always open from the top.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
            <Link to="/#work" className={caseStyles.back} data-cursor>
              <span aria-hidden="true">←</span> Home
            </Link>
          </Reveal>
          <Reveal as="p" className={caseStyles.eyebrow} i={1}>
            Work · {projects.length} projects
          </Reveal>
          <Reveal as="h1" className={caseStyles.title} i={2}>
            Selected work
          </Reveal>
          <Reveal as="p" className={caseStyles.tagline} i={3}>
            Concept work and real client projects — design through build.
          </Reveal>
        </header>

        <section className={`${workStyles.section} wrap`} aria-label="All projects">
          <div className={workStyles.list}>
            {projects.map((project) => (
              <CaseRow key={project.id} project={project} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <ProjectChat />
    </>
  )
}
