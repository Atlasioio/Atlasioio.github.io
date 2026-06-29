import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { preloadCover, type Project } from '../../data/content'
import { LinkLike } from '../ui/LinkLike'
import { Reveal } from '../ui/Reveal'
import { Plus } from '../ui/Icons'
import styles from './Work.module.css'

/**
 * One case-study row. Media side alternates via :nth-child in CSS. Shows a real
 * 4:3 `<img>` when `project.image` is set, otherwise the abstract monochrome
 * placeholder fill.
 */
export function CaseRow({ project }: { project: Project }) {
  const fillClass = styles[`fill${project.fill.toUpperCase()}` as 'fillA' | 'fillB' | 'fillC']

  const to = `/work/${project.id}`

  return (
    <Reveal
      as="article"
      className={styles.case}
      style={project.accent ? ({ '--accent': project.accent } as CSSProperties) : undefined}
      data-accent={project.accent}
    >
      <Link
        className={styles.media}
        to={to}
        data-cursor
        data-view
        aria-label={`${project.name} — view case study`}
        onPointerEnter={() => preloadCover(project)}
        onFocus={() => preloadCover(project)}
      >
        {project.coverScreens ? (
          <div className={styles.deviceThumb} aria-hidden="true">
            <img src={project.coverScreens[1] ?? project.coverScreens[0]} alt="" loading="lazy" />
          </div>
        ) : project.desktop ? (
          <div
            className={styles.comboThumb}
            style={project.coverBg ? { background: project.coverBg } : undefined}
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
        ) : project.brand ? (
          <div className={styles.brandThumb} aria-hidden="true">
            <img src={(project.image ?? project.brand[0]).src} alt="" loading="lazy" />
          </div>
        ) : project.image ? (
          <img className={styles.img} src={project.image.src} alt={project.image.alt} loading="lazy" />
        ) : (
          <div
            className={`${styles.img} ${fillClass} ${project.grid ? styles.grid : ''}`}
            aria-hidden="true"
          />
        )}
        <div className={styles.tag}>{project.tag}</div>
        <div className={styles.plus} aria-hidden="true">
          <Plus />
        </div>
      </Link>

      <div className={styles.info}>
        <div className={styles.idx}>{project.index}</div>
        <h3 className={styles.name}>{project.name}</h3>
        <div className={styles.role}>
          <span className={styles.o}>{project.role}</span>
          <span className={styles.dot} />
          <span>{project.outcome}</span>
        </div>
        <p className={styles.desc}>{project.description}</p>
        <LinkLike to={to} className={styles.link}>
          View case study
        </LinkLike>
      </div>
    </Reveal>
  )
}
