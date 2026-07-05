import type { CSSProperties } from 'react'
import type { Project } from '../../data/content'
import styles from '../sections/Work.module.css'

/**
 * The framed project preview, shared by the work index (CaseRow) and the case
 * study's "next project" card so both stay in sync. Renders the treatment that
 * suits the project's assets — a phone on a warm band (coverScreens), a laptop +
 * phone combo (desktop), a full-colour cover (brand / image), or the abstract
 * fill — filling whatever square/box it's dropped into (position: absolute).
 */
export function ProjectThumb({ project }: { project: Project }) {
  const fillClass = styles[`fill${project.fill.toUpperCase()}` as 'fillA' | 'fillB' | 'fillC']

  if (project.coverScreens) {
    return (
      <div className={styles.deviceThumb} aria-hidden="true">
        <img src={project.coverScreens[1] ?? project.coverScreens[0]} alt="" loading="lazy" />
      </div>
    )
  }

  if (project.desktop) {
    return (
      <div
        className={styles.comboThumb}
        style={project.coverBg ? ({ background: project.coverBg } as CSSProperties) : undefined}
        aria-hidden="true"
      >
        <div className={`${styles.comboStage} ${!project.mobile?.length ? styles.comboSolo : ''}`}>
          <div className={styles.comboLaptop}>
            <div className={styles.comboScreen}>
              <span className={styles.comboScr}>
                <img src={project.desktop[0].src} alt="" loading="lazy" />
              </span>
            </div>
            <div className={styles.comboBase} />
          </div>
          {project.mobile?.[0] && (
            <div className={styles.comboPhone}>
              <span className={styles.comboPhoneScreen}>
                <img src={project.mobile[0].src} alt="" loading="lazy" />
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (project.brand) {
    return (
      <div className={styles.brandThumb} aria-hidden="true">
        <img src={(project.image ?? project.brand[0]).src} alt="" loading="lazy" />
      </div>
    )
  }

  if (project.image) {
    return <img className={styles.img} src={project.image.src} alt={project.image.alt} loading="lazy" />
  }

  return <div className={`${styles.img} ${fillClass} ${project.grid ? styles.grid : ''}`} aria-hidden="true" />
}
