import { useEffect, useState, type CSSProperties } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { projects, coverSrc, preloadCover } from '../data/content'
import { useLenis } from '../hooks/useLenis'
import { FixedControls } from '../components/nav/FixedControls'
import { LangFixed } from '../components/nav/LangFixed'
import { Menu } from '../components/nav/Menu'
import { Footer } from '../components/sections/Footer'
import { ScreenGallery } from '../components/sections/ScreenGallery'
import { WebShowcase } from '../components/sections/WebShowcase'
import { VideoShowcase } from '../components/sections/VideoShowcase'
import { BrandGallery } from '../components/sections/BrandGallery'
import { RouteTransition } from '../components/RouteTransition/RouteTransition'
import { Reveal } from '../components/ui/Reveal'
import styles from './CaseStudy.module.css'

/** A single selected-work case study (route "/work/:slug"). */
export function CaseStudy() {
  const { slug } = useParams()
  useLenis()

  // Always start a case study from the top.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const project = projects.find((p) => p.id === slug)
  const cover = project ? coverSrc(project) : undefined

  // Preload the hero so the route transition can hold until it's decoded (the
  // page is never revealed onto a still-loading, blank hero). A safety timeout
  // means a slow/failed image can never wedge the transition.
  const [heroReady, setHeroReady] = useState(false)
  useEffect(() => {
    setHeroReady(false)
    if (!cover) {
      setHeroReady(true)
      return
    }
    let settled = false
    const ready = () => {
      if (!settled) {
        settled = true
        setHeroReady(true)
      }
    }
    const img = new Image()
    img.fetchPriority = 'high'
    img.src = cover
    // Wait for the image to be *decoded* (not just loaded) so the hero is never
    // revealed onto a frame that hasn't painted yet. Fall back to load events
    // where decode() isn't available, and keep a safety timeout regardless.
    if (typeof img.decode === 'function') {
      img.decode().then(ready, ready)
    } else {
      img.onload = ready
      img.onerror = ready
      if (img.complete) ready()
    }
    const safety = window.setTimeout(ready, 2500)
    return () => {
      img.onload = null
      img.onerror = null
      window.clearTimeout(safety)
    }
  }, [cover])

  if (!project) return <Navigate to="/" replace />

  const idx = projects.findIndex((p) => p.id === slug)
  const next = projects[(idx + 1) % projects.length]
  const fillClass = styles[`fill${project.fill.toUpperCase()}` as 'fillA' | 'fillB' | 'fillC']
  const nextFill = styles[`fill${next.fill.toUpperCase()}` as 'fillA' | 'fillB' | 'fillC']

  const Cover = ({ p, cls }: { p: typeof project; cls: string }) =>
    p.image ? (
      <img className={styles.coverImg} src={p.image.src} alt={p.image.alt} fetchPriority="high" decoding="async" />
    ) : (
      <div className={`${styles.coverImg} ${cls} ${p.grid ? styles.grid : ''}`} aria-hidden="true" />
    )

  return (
    <>
      <RouteTransition key={slug} accent={project.accent} ready={heroReady} />
      <FixedControls staticDark />
      <LangFixed />
      <Menu />

      <main
        className={styles.page}
        id="top"
        style={project.accent ? ({ '--accent': project.accent } as CSSProperties) : undefined}
        data-accent={project.accent}
      >
        <div className={`${styles.bar} wrap`}>
          <Link to="/" className={styles.wordmark} data-cursor aria-label="Lukas Ahlse — home">
            lukas<span className={styles.dot} />
          </Link>
        </div>

        <header className={`${styles.hero} wrap`}>
          <Reveal>
            <Link to="/#work" className={styles.back} data-cursor>
              <span aria-hidden="true">←</span> Selected work
            </Link>
          </Reveal>
          <Reveal as="p" className={styles.eyebrow} i={1}>
            {project.index} · {project.tag}
          </Reveal>
          <Reveal as="h1" className={styles.title} i={2}>
            {project.name}
          </Reveal>
          <Reveal as="p" className={styles.tagline} i={3}>
            {project.tagline}
          </Reveal>
          {project.liveUrl && (
            <Reveal i={4}>
              <a
                className={styles.liveLink}
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor
                data-cursor-light
              >
                Visit live site
                <svg className={styles.liveArrow} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>
            </Reveal>
          )}
          <Reveal className={styles.meta} i={5}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Role</span>
              <span>{project.role}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Services</span>
              <span>{project.services.join(', ')}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Year</span>
              <span>{project.year}</span>
            </div>
          </Reveal>
        </header>

        <div className={`${styles.coverWrap} wrap`}>
          {project.desktop ? (
            <Reveal className={styles.webCover}>
              <div className={styles.webBrowser}>
                <div className={styles.webBar} aria-hidden="true">
                  <i /><i /><i />
                </div>
                <img src={project.desktop[0].src} alt="" aria-hidden="true" fetchPriority="high" decoding="async" />
              </div>
              {project.mobile?.[0] && (
                <div className={styles.webPhone} aria-hidden="true">
                  <span className={styles.webPhoneScreen}>
                    <img src={project.mobile[0].src} alt="" />
                  </span>
                </div>
              )}
            </Reveal>
          ) : project.coverScreens ? (
            <Reveal className={`${styles.deviceBand} ${project.phoneFrame ? styles.deviceBandFramed : ''}`}>
              {project.coverScreens.map((src, n) =>
                project.phoneFrame ? (
                  <span
                    key={src}
                    className={styles.devicePhone}
                    aria-hidden="true"
                    style={{ '--n': n } as React.CSSProperties}
                  >
                    <img src={src} alt="" fetchPriority={n === 1 ? 'high' : 'auto'} decoding="async" />
                  </span>
                ) : (
                  <img
                    key={src}
                    className={styles.deviceShot}
                    src={src}
                    alt=""
                    aria-hidden="true"
                    fetchPriority={n === 1 ? 'high' : 'auto'}
                    decoding="async"
                    style={{ '--n': n } as React.CSSProperties}
                  />
                ),
              )}
            </Reveal>
          ) : (
            <Reveal className={styles.cover}>
              <Cover p={project} cls={fillClass} />
            </Reveal>
          )}
        </div>

        <section className={`${styles.section} wrap`}>
          <Reveal as="p" className={styles.overview}>
            {project.overview}
          </Reveal>
        </section>

        <section className={`${styles.results} wrap`} aria-label="Outcomes">
          {project.results.map((r, i) => (
            <Reveal className={styles.result} key={r.label} i={i}>
              <div className={styles.resultValue}>{r.value}</div>
              <div className={styles.resultLabel}>{r.label}</div>
            </Reveal>
          ))}
        </section>

        {project.screens && (
          <section className={`${styles.screens} wrap`} aria-label="Screens">
            <Reveal as="p" className={styles.sectionLabel}>
              The screens
            </Reveal>
            <Reveal i={1}>
              <ScreenGallery screens={project.screens} framed={project.phoneFrame} />
            </Reveal>
          </section>
        )}

        {project.desktop && (
          <section className={`${styles.screens} wrap`} aria-label="Screens">
            <Reveal as="p" className={styles.sectionLabel}>
              The screens
            </Reveal>
            <Reveal i={1}>
              <WebShowcase desktop={project.desktop} mobile={project.mobile ?? []} label={project.browserLabel ?? project.name} />
            </Reveal>
          </section>
        )}

        {project.videos && (
          <section className={`${styles.screens} wrap`} aria-label="In motion">
            <Reveal as="p" className={styles.sectionLabel}>
              In motion
            </Reveal>
            <Reveal i={1}>
              <VideoShowcase videos={project.videos} frame={project.videoFrame ?? 'browser'} />
            </Reveal>
          </section>
        )}

        {project.brand && (
          <section className={`${styles.screens} wrap`} aria-label="The work">
            <Reveal as="p" className={styles.sectionLabel}>
              The work
            </Reveal>
            <Reveal i={1}>
              <BrandGallery items={project.brand} />
            </Reveal>
          </section>
        )}

        <section className={`${styles.body} wrap`}>
          {project.sections.map((s, i) => (
            <Reveal
              className={`${styles.block} ${i % 2 === 1 ? styles.blockAlt : ''}`}
              key={s.heading}
              i={i}
            >
              <div className={styles.blockHead}>
                <span className={styles.blockNum}>
                  <span className={styles.blockSq} aria-hidden="true" />
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className={styles.blockHeading}>{s.heading}</h2>
              </div>
              <p className={styles.blockBody}>{s.body}</p>
            </Reveal>
          ))}
        </section>

        {project.designSystem && (
          <section className={`${styles.system} wrap`} aria-label="Design system">
            <Reveal as="p" className={styles.sectionLabel}>
              The system
            </Reveal>
            <Reveal as="p" className={styles.systemIntro} i={1}>
              {project.designSystem.intro}
            </Reveal>

            <div className={styles.systemGrid}>
              <Reveal className={styles.systemCol} i={1}>
                <h3 className={styles.systemSub}>Palette</h3>
                <div className={styles.swatches}>
                  {project.designSystem.palette.map((c) => (
                    <div className={styles.swatch} key={c.hex}>
                      <span className={styles.chip} style={{ background: c.hex }} aria-hidden="true" />
                      <span className={styles.swName}>{c.name}</span>
                      <span className={styles.swHex}>{c.hex}</span>
                      <span className={styles.swNote}>{c.note}</span>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal className={styles.systemCol} i={2}>
                <h3 className={styles.systemSub}>Type</h3>
                <ul className={styles.typeList}>
                  {project.designSystem.typefaces.map((t) => (
                    <li className={styles.typeItem} key={t.name}>
                      <span className={styles.typeName}>{t.name}</span>
                      <span className={styles.typeRole}>{t.role}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal className={styles.principlesBlock} i={1}>
              <h3 className={styles.systemSub}>Principles</h3>
              <ul className={styles.principles}>
                {project.designSystem.principles.map((p) => (
                  <li className={styles.principle} key={p}>
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>

            {project.designSystem.sheet && (
              <Reveal className={styles.sheet} i={2}>
                <img src={project.designSystem.sheet} alt={`${project.name} design system sheet`} loading="lazy" />
              </Reveal>
            )}
          </section>
        )}

        <section className={`${styles.nextWrap} wrap`}>
          <Link
            to={`/work/${next.id}`}
            className={styles.next}
            data-cursor
            data-view
            onPointerEnter={() => preloadCover(next)}
            onFocus={() => preloadCover(next)}
          >
            <div className={styles.nextText}>
              <span className={styles.nextLabel}>Next project</span>
              <span className={styles.nextName}>
                {next.name}
                <span className={styles.nextArrow} aria-hidden="true">→</span>
              </span>
            </div>
            <div className={styles.nextThumb} aria-hidden="true">
              <Cover p={next} cls={nextFill} />
            </div>
          </Link>
        </section>
      </main>

      <Footer />
    </>
  )
}
