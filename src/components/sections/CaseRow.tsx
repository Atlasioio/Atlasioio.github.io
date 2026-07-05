import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { preloadCover, type Project } from '../../data/content'
import { LinkLike } from '../ui/LinkLike'
import { ProjectThumb } from '../ui/ProjectThumb'
import { Reveal } from '../ui/Reveal'
import { Plus } from '../ui/Icons'
import styles from './Work.module.css'

/**
 * One case-study row. Media side alternates via :nth-child in CSS. The framed
 * preview (phone / laptop combo / cover / fill) is shared with the case study's
 * "next project" card via ProjectThumb.
 */
export function CaseRow({ project }: { project: Project }) {
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
        <ProjectThumb project={project} />
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
