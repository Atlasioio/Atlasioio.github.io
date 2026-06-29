import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { services, type Service } from '../data/content'

interface ServiceModalValue {
  /** The service whose detail is open, or null. */
  service: Service | null
  open: boolean
  /** Position of the open service within `services` (-1 when closed). */
  index: number
  total: number
  /** Last navigation direction: 1 = next, -1 = prev, 0 = fresh open. */
  dir: number
  openService: (service: Service) => void
  next: () => void
  prev: () => void
  close: () => void
}

const ServiceModalContext = createContext<ServiceModalValue | null>(null)

/**
 * Controls the per-service detail modal — opened from a service card, rendered
 * over the blurred page like the inquiry modal. Supports prev/next stepping
 * through the services (wrapping). Locks body scroll, closes on Escape.
 */
export function ServiceModalProvider({ children }: { children: ReactNode }) {
  const [service, setService] = useState<Service | null>(null)
  const [dir, setDir] = useState(0)
  const open = service !== null

  const openService = useCallback((s: Service) => {
    setDir(0)
    setService(s)
  }, [])
  const close = useCallback(() => setService(null), [])

  const step = useCallback((delta: number) => {
    setDir(delta)
    setService((curr) => {
      if (!curr) return curr
      const i = services.findIndex((s) => s.id === curr.id)
      const n = (i + delta + services.length) % services.length
      return services[n]
    })
  }, [])
  const next = useCallback(() => step(1), [step])
  const prev = useCallback(() => step(-1), [step])

  useEffect(() => {
    document.body.classList.toggle('modal-open', open)
    return () => {
      if (open) document.body.classList.remove('modal-open')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setService(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const index = service ? services.findIndex((s) => s.id === service.id) : -1

  const value = useMemo(
    () => ({ service, open, index, total: services.length, dir, openService, next, prev, close }),
    [service, open, index, dir, openService, next, prev, close],
  )
  return <ServiceModalContext.Provider value={value}>{children}</ServiceModalContext.Provider>
}

export function useServiceModal(): ServiceModalValue {
  const ctx = useContext(ServiceModalContext)
  if (!ctx) throw new Error('useServiceModal must be used within ServiceModalProvider')
  return ctx
}
