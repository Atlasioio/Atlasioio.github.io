import { useEffect } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const HOVER_SELECTOR = '[data-cursor], a, button'

/**
 * Custom cursor: a fast dot + a lerp-trailing ring that follow the pointer.
 * The ring grows over interactive elements and shows "View" over work media
 * (`[data-view]`). Fine-pointer only; disabled on touch / coarse / reduced
 * motion (the elements are then hidden via CSS, but we also skip the rAF loop).
 *
 * Expects two elements to exist in the DOM with ids `cur-dot` and `cur-ring`.
 */
export function useCustomCursor(): void {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!finePointer || reduced) return

    const dot = document.getElementById('cur-dot')
    const ring = document.getElementById('cur-ring')
    if (!dot || !ring) return

    document.body.classList.add('cursor-on')

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let dx = mx
    let dy = my
    let rx = mx
    let ry = my
    let frame = 0
    let lastX = -1
    let lastY = -1
    let lastScroll = -1

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }

    // White cursor over a dark/blue surface, accent-blue over the off-white
    // page. Uses the element stack under the pointer so overlays (the nav) get
    // the colour of the section *behind* them, and forces white over buttons
    // (which turn dark/accent on hover). Recomputed only when the pointer or
    // scroll position actually changes.
    const DARK = '#hero, #contact, #menu'
    const updateColour = () => {
      if (mx === lastX && my === lastY && window.scrollY === lastScroll) return
      lastX = mx
      lastY = my
      lastScroll = window.scrollY
      const stack = document.elementsFromPoint(mx, my)
      const top = stack[0] as HTMLElement | undefined
      const forceLight = !!top?.closest('[data-cursor-light]')
      // Inside the inquiry modal, ignore the (blurred) page behind it — the
      // cursor stays blue, only going light over its buttons.
      const inModal = !!top?.closest('[data-cursor-modal]')
      const onDark =
        forceLight || (!inModal && stack.some((el) => (el as HTMLElement).closest?.(DARK)))
      dot.classList.toggle('on-dark', onDark)
      ring.classList.toggle('on-dark', onDark)

      // Per-project signature colour: tint the cursor over a `[data-accent]`
      // block (e.g. EcoTrip's work row / case study) — but not while it's white
      // over a dark surface/button.
      const brandCol = onDark ? undefined : top?.closest<HTMLElement>('[data-accent]')?.dataset.accent
      if (brandCol) {
        dot.style.setProperty('--cur', brandCol)
        ring.style.setProperty('--cur', brandCol)
      } else {
        dot.style.removeProperty('--cur')
        ring.style.removeProperty('--cur')
      }
    }

    const loop = () => {
      dx += (mx - dx) * 0.9
      dy += (my - dy) * 0.9
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      dot.style.transform = `translate(${dx}px, ${dy}px)`
      ring.style.transform = `translate(${rx}px, ${ry}px)`
      updateColour()
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      dot.style.opacity = '1'
      ring.style.opacity = '1'
      // Areas that opt out of the grown ring (e.g. the showreel) keep the
      // plain dot + default ring.
      if (target.closest('[data-cursor-quiet]')) {
        ring.classList.remove('is-hover', 'is-view')
        return
      }
      const isView = target.closest('[data-view]')
      const isHover = target.closest(HOVER_SELECTOR)
      if (isView) {
        ring.classList.add('is-view')
        ring.classList.remove('is-hover')
      } else if (isHover) {
        ring.classList.add('is-hover')
        ring.classList.remove('is-view')
      }
    }
    const onOut = (e: MouseEvent) => {
      const to = e.relatedTarget as HTMLElement | null
      if (!to || (!to.closest('[data-view]') && !to.closest(HOVER_SELECTOR))) {
        ring.classList.remove('is-hover', 'is-view')
      }
    }
    const onLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }
    const onEnter = () => {
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.body.classList.remove('cursor-on')
    }
  }, [reduced])
}
