import type { ComponentType } from 'react'
import type { Service } from '../../data/content'
import { useServiceModal } from '../../context/ServiceModalContext'
import { Reveal } from '../ui/Reveal'
import { ArrowUpRight } from '../ui/Icons'
import { WebArt, UxArt, BrandArt } from './ServiceArt'
import styles from './Services.module.css'

/** Built-in animated illustrations, keyed by service id (real CMS imagery
 *  would override these via service.image). */
const ART: Record<string, ComponentType> = {
  'svc-web': WebArt,
  'svc-ux': UxArt,
  'svc-brand': BrandArt,
}

/** One service offering as an image card. Clicking the media opens the
 *  service-detail modal. */
export function ServiceCard({ service, i }: { service: Service; i: number }) {
  const Art = ART[service.id]
  const { openService } = useServiceModal()
  return (
    <Reveal as="article" className={styles.card} i={i}>
      <button
        type="button"
        className={styles.media}
        onClick={() => openService(service)}
        aria-label={`${service.name} — view details`}
        data-cursor
      >
        {Art ? (
          <Art />
        ) : (
          <img className={styles.img} src={service.image.src} alt={service.image.alt} loading="lazy" />
        )}
        <span className={styles.index}>{service.index}</span>
        <span className={styles.cta} aria-hidden="true">
          <ArrowUpRight />
        </span>
      </button>
      <div className={styles.cardBody}>
        <h3 className={styles.name}>{service.name}</h3>
        <p className={styles.desc}>{service.description}</p>
        <div className={styles.tags}>
          {service.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </Reveal>
  )
}
