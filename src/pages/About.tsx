import { useEffect, type ReactElement } from 'react'
import { useLocation } from 'react-router-dom'
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

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Disciplines from the home page's wheel (five, so they sit on one line). */
const DISCIPLINES = ['Research', 'UX/UI', 'Brand', 'Build', 'AI']

/**
 * The about page (route "/about"), built from the site's own patterns: the
 * blue accent tile and bento cards of "Beyond the work", and the numbered,
 * icon-led flow of "How I work".
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
      <FixedControls staticDark home />
      <LangFixed />
      <Menu />

      <main className={caseStyles.page} id="top">
        <div className={`${caseStyles.bar} wrap`}>
          {/* spacer: the wordmark itself is pinned in FixedControls */}
          <span className={caseStyles.wordmark} aria-hidden="true" style={{ visibility: 'hidden' }}>lukas</span>
        </div>

        {/* Intro: the title on one line across the top, then the story on the
            left and the blue tile on the right */}
        <header className={`wrap ${styles.hero}`}>
          <Reveal as="h1" className={`${caseStyles.title} ${styles.heroTitle}`}>
            Hi, I'm Lukas.
          </Reveal>
          <div className={styles.heroText}>
            <div className={styles.intro}>
              <Reveal as="p" i={1}>
                A product designer in {studio.locationShort}. Most recently at{' '}
                <strong>Sony Nimway</strong>, I designed smart-office products used
                internationally, across web, app and large-format screens.
              </Reveal>
              <Reveal as="p" i={2}>
                I'm curious by default: I like understanding why a product should work a certain
                way, then sweating the details until it feels right for the people using it. I love
                owning my work and pushing it forward on my own, and I'm every bit as happy
                building alongside a team. Lately I've been more hands-on in code, learning where
                AI actually helps.
              </Reveal>
            </div>
          </div>

          <Reveal as="aside" className={styles.nowTile} i={2}>
            <div className={styles.nowHead}>
              <div>
              <p className={styles.nowStatus}>
                <span className={styles.pulse} aria-hidden="true" />
                Open to work
              </p>
              <p className={styles.nowWhere}>{capitalise(studio.worldwide.replace(/^Open to work — /, ''))}</p>
              </div>
              <img
                className={styles.heroAvatar}
                src="/images/profile-sketch.webp"
                alt="Hand-drawn sketch portrait of Lukas"
                width={256}
                height={256}
              />
            </div>
            <div className={styles.chips}>
              {DISCIPLINES.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className={styles.nowActions}>
              <Button href="/Lukas-Ahlse-CV.pdf" target="_blank" rel="noopener" variant="light" onAccent>
                Download CV
              </Button>
              <a className={styles.nowMail} href={`mailto:${studio.email}`} data-cursor>
                {studio.email}
              </a>
            </div>
          </Reveal>
        </header>

        {/* Experience: bento cards, the main role given the wide tile */}
        <section className={`section wrap ${styles.block}`} id="experience">
          <Marker num="01" label="Experience" />
          <div className={styles.bento}>
            {experience.map((e, i) => (
              <Reveal key={e.org} className={`${styles.card} ${i === 0 ? styles.cardWide : ''}`} i={i}>
                <div className={styles.cardIcon}>{EXPERIENCE_ART[i] ?? <Panel />}</div>
                <span className={styles.cardRole}>{e.role}</span>
                <h2 className={styles.cardName}>{e.org}</h2>
                <p className={styles.cardNote}>{e.note}</p>
                {e.tags && (
                  <div className={styles.chipsQuiet}>
                    {e.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </section>

        {/* Education: a numbered path, the How I work way */}
        <section className={`section wrap ${styles.block}`} id="education">
          <Marker num="02" label="Education" />
          <div className={styles.path}>
            {education.map((e, i) => (
              <Step key={e.org} entry={e} i={i} />
            ))}
          </div>
        </section>

        <Process num="03" />
        <Beyond num="04" />
      </main>

      <Footer />
      <ProjectChat />
    </>
  )
}

function Step({ entry, i }: { entry: CvEntry; i: number }) {
  return (
    <Reveal className={styles.step} i={i}>
      <div className={styles.stepArt}>{EDUCATION_ART[i] ?? <Compass />}</div>
      <span className={styles.stepNo}>{String(i + 1).padStart(2, '0')}</span>
      <h2 className={styles.stepName}>{entry.org}</h2>
      <p className={styles.stepRole}>{entry.role}</p>
      <p className={styles.stepDesc}>{entry.note}</p>
    </Reveal>
  )
}

/* ---- Line icons, drawn like the How I work ones: ink strokes, one blue part ---- */
const SW = 2.6
const svg = { viewBox: '0 0 48 48', fill: 'none', 'aria-hidden': true, className: styles.svg } as const

// Sony / Nimway — a meeting-room panel with its status light.
function Panel(): ReactElement {
  return (
    <svg {...svg} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="9" width="34" height="24" rx="4" />
      <line x1="24" y1="33" x2="24" y2="40" />
      <line x1="16" y1="40" x2="32" y2="40" />
      <circle className={`${styles.accentFill} ${styles.blink}`} cx="34" cy="16" r="3" stroke="none" />
    </svg>
  )
}
// Lenus — a leaf, for the food and fitness content.
function Leaf(): ReactElement {
  return (
    <svg {...svg} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      <g className={styles.sway}>
        <path d="M10 38C10 21 21 10 39 10c0 18-11 28-29 28z" />
        <line x1="10" y1="38" x2="27" y2="21" />
      </g>
      <circle className={styles.accentFill} cx="31" cy="17" r="3" stroke="none" />
    </svg>
  )
}
// Foundations — a compass: the start, before the direction was clear.
function Compass(): ReactElement {
  return (
    <svg {...svg} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="16" />
      <polygon className={`${styles.accentFill} ${styles.spin}`} points="24,12 28,24 24,36 20,24" stroke="none" />
    </svg>
  )
}
// Interaction design — a pointer and the ripple of a tap.
function Pointer(): ReactElement {
  return (
    <svg {...svg} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 13l17 9-7 2.5L23.5 32z" />
      <circle className={`${styles.accentStroke} ${styles.ripple}`} cx="15" cy="11" r="6" strokeWidth={SW} />
    </svg>
  )
}
// Design meets code.
function Code(): ReactElement {
  return (
    <svg {...svg} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      <polyline className={styles.codeL} points="16,14 7,24 16,34" />
      <polyline className={styles.codeR} points="32,14 41,24 32,34" />
      <line className={styles.accentStroke} x1="27" y1="12" x2="21" y2="36" />
    </svg>
  )
}

const EXPERIENCE_ART = [<Panel key="p" />, <Leaf key="l" />]
const EDUCATION_ART = [<Compass key="c" />, <Pointer key="p" />, <Code key="d" />]
