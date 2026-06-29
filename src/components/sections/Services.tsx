import { services } from '../../data/content'
import { Marker } from '../ui/Marker'
import { ServiceCard } from './ServiceCard'
import styles from './Services.module.css'

/** 02 — Services. Three offerings as image cards. */
export function Services() {
  return (
    <section className={`section wrap ${styles.section}`} id="services">
      <Marker num="02" label="What I do" />
      <div className={styles.grid}>
        {services.map((service, i) => (
          <ServiceCard key={service.id} service={service} i={i} />
        ))}
      </div>
    </section>
  )
}
