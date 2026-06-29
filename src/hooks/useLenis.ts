import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Lenis from 'lenis'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useStartModal } from '../context/StartModalContext'
import { useServiceModal } from '../context/ServiceModalContext'
import { useMenu } from '../context/MenuContext'

/**
 * Production smooth scroll (replaces the prototype's native scroll-behavior).
 * Lenis drives momentum scrolling and is wired to in-page anchor links so the
 * menu / nav jumps animate. Disabled entirely under reduced-motion, and stopped
 * while an overlay (the inquiry modal or the menu) is open — otherwise Lenis
 * keeps scrolling the page behind it, since it bypasses `overflow: hidden`.
 */
export function useLenis(): void {
  const reduced = usePrefersReducedMotion()
  const { open: modalOpen } = useStartModal()
  const { open: serviceOpen } = useServiceModal()
  const { open: menuOpen } = useMenu()
  const navigate = useNavigate()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // On mount: jump to the incoming hash section (e.g. /#work from a case
    // study), otherwise start at the top. Scroll restoration is disabled, so
    // this is authoritative.
    const settleScroll = (toEl: (el: HTMLElement) => void, toTop: () => void) => {
      const hash = window.location.hash
      if (hash.length > 1) {
        const el = document.querySelector(hash)
        if (el) {
          window.setTimeout(() => toEl(el as HTMLElement), 60)
          return
        }
      }
      toTop()
    }

    if (reduced) {
      settleScroll(
        (el) => el.scrollIntoView(),
        () => window.scrollTo(0, 0),
      )
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenisRef.current = lenis
    // Exposed so local overlays (e.g. the case-study gallery lightbox) can
    // freeze page scroll without threading a context through.
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    settleScroll(
      (el) => lenis.scrollTo(el, { immediate: true, offset: 0 }),
      () => lenis.scrollTo(0, { immediate: true }),
    )

    // Route same-page anchor clicks through Lenis for animated jumps. If the
    // target isn't on this page (e.g. a section link clicked from a case-study
    // page), navigate home with the hash — Home scrolls to it on arrival.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      e.preventDefault()
      const target = document.querySelector(id)
      if (target) {
        lenis.scrollTo(target as HTMLElement, { offset: 0 })
      } else {
        navigate('/' + id)
      }
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('click', onClick)
      lenisRef.current = null
      delete (window as unknown as { __lenis?: Lenis }).__lenis
      lenis.destroy()
    }
  }, [reduced, navigate])

  // Freeze page scroll while an overlay is open.
  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    if (modalOpen || serviceOpen || menuOpen) lenis.stop()
    else lenis.start()
  }, [modalOpen, serviceOpen, menuOpen])
}
