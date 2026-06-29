import { useEffect, useRef } from 'react'

/**
 * Scroll-reveal via IntersectionObserver. Returns a ref to attach to any
 * element carrying `[data-reveal]` (or `.line-mask`); adds `.is-in` once it
 * enters the viewport. Under reduced motion the global CSS already shows
 * everything, so this becomes a no-op visually.
 *
 * The IntersectionObserver can occasionally fail to fire under Lenis
 * smooth-scroll, which would leave an element stuck at `opacity: 0` forever
 * (an invisible element still takes layout space → a phantom gap). To stay
 * robust we pair the observer with a lightweight scroll/resize fallback and an
 * initial in-view check, so an element can never stay permanently hidden.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let io: IntersectionObserver | null = null
    let done = false

    const reveal = () => {
      if (done) return
      done = true
      el.classList.add('is-in')
      io?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }

    // Mirrors the observer's trigger zone: visible within the lower ~92% of the
    // viewport (and not scrolled past the top).
    const inView = () => {
      const r = el.getBoundingClientRect()
      return r.top < window.innerHeight * 0.92 && r.bottom > 0
    }
    const onScroll = () => {
      if (inView()) reveal()
    }

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) reveal()
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )
      io.observe(el)
    }

    // Fallback + initial check (covers observer misfires and already-in-view
    // content on load).
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()

    return () => {
      io?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return ref
}
