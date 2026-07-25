import { useEffect, useLayoutEffect, useRef } from 'react'

/**
 * Scroll-reveal via IntersectionObserver. Returns a ref to attach to any
 * element carrying `[data-reveal]` (or `.line-mask`); adds `.is-in` once it
 * enters the viewport. Under reduced motion the global CSS already shows
 * everything, so this becomes a no-op visually.
 *
 * The IntersectionObserver can occasionally fail to fire under Lenis
 * smooth-scroll, which would leave an element stuck at `opacity: 0` forever
 * (an invisible element still takes layout space → a phantom gap). To stay
 * robust we pair the observer with a lightweight scroll/resize fallback, an
 * initial in-view check, and a couple of post-mount frames.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const done = useRef(false)

  // Re-assert `is-in` after every commit. Case-study routes reuse one component
  // instance across `/work/:slug` changes, so React rewrites the reused
  // element's className from the new node's props — which strips the class we
  // added imperatively. Without this, arriving via the "next project" link
  // leaves the next hero at opacity:0 even though its image loaded fine.
  useLayoutEffect(() => {
    if (done.current) ref.current?.classList.add('is-in')
  })

  useEffect(() => {
    if (done.current) return
    const el = ref.current
    if (!el) return

    let io: IntersectionObserver | null = null

    const reveal = () => {
      if (done.current) return
      done.current = true
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

    // Re-check across the next couple of frames. On a route change the page often
    // scroll-resets to the top just after mount — sometimes without a scroll event
    // we'd catch — so an element that mounts out of view still reveals once the
    // page settles at the top.
    let raf1 = 0
    let raf2 = 0
    raf1 = requestAnimationFrame(() => {
      onScroll()
      raf2 = requestAnimationFrame(onScroll)
    })

    return () => {
      io?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [])

  return ref
}
