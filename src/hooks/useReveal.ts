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
 * robust we pair the observer with a scroll/resize fallback and an initial
 * in-view check.
 *
 * Everything is shared: one observer and one throttled scroll check for every
 * element still waiting. (Each element once had its own scroll listener that
 * measured itself on every frame; with 30–40 waiting below a case-study hero,
 * that made the top of every case page stutter until they had all revealed.)
 */
interface Pending {
  el: HTMLElement
  reveal: () => void
}

const pending = new Set<Pending>()
const byEl = new Map<Element, Pending>()
let io: IntersectionObserver | null = null
let timer = 0
let frame = 0
let lastCheck = 0

/** Reads every waiting element's position in one pass, then reveals the ones in
 *  view. Mirrors the observer's trigger zone: within the lower ~92% of the
 *  viewport, and not scrolled past the top. */
function check() {
  frame = 0
  lastCheck = performance.now()
  const line = window.innerHeight * 0.92
  const hits: Pending[] = []
  for (const p of pending) {
    const r = p.el.getBoundingClientRect()
    if (r.top < line && r.bottom > 0) hits.push(p)
  }
  hits.forEach((p) => p.reveal())
}

/** The scroll fallback: at most one check every ~150ms, in an animation frame. */
function onScroll() {
  if (timer || frame) return
  const wait = Math.max(0, 150 - (performance.now() - lastCheck))
  timer = window.setTimeout(() => {
    timer = 0
    frame = requestAnimationFrame(check)
  }, wait)
}

/** A check over the next two frames, for newly mounted elements. On a route
 *  change the page often resets to the top just after mount, sometimes without
 *  a scroll event, so the second frame catches it once the page settles. */
function kick() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    check()
    frame = requestAnimationFrame(check)
  })
}

function register(p: Pending) {
  if (!pending.size) {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
  }
  pending.add(p)
  byEl.set(p.el, p)
  if ('IntersectionObserver' in window) {
    io ??= new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && byEl.get(e.target)?.reveal()),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(p.el)
  }
  kick()
}

function unregister(p: Pending) {
  if (!pending.delete(p)) return
  byEl.delete(p.el)
  io?.unobserve(p.el)
  if (!pending.size) {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  }
}

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
    const entry: Pending = {
      el,
      reveal: () => {
        if (done.current) return
        done.current = true
        el.classList.add('is-in')
        unregister(entry)
      },
    }
    register(entry)
    return () => unregister(entry)
  }, [])

  return ref
}
