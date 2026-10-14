import { useEffect, useState } from 'react'

/**
 * Drives the nav theme-flip: light controls over the dark hero card, dark once
 * scrolled past it. Threshold tracks the hero's bottom (recomputed on resize).
 */
export function useNavScrolled(heroId = 'hero'): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let threshold = 80

    const recompute = () => {
      const hero = document.getElementById(heroId)
      threshold = hero ? hero.offsetTop + hero.offsetHeight - 70 : 80
    }
    // only tell React when it actually flips, not on every scroll frame
    let last: boolean | null = null
    const onScroll = () => {
      const next = window.scrollY > threshold
      if (next !== last) setScrolled((last = next))
    }
    const onResize = () => {
      recompute()
      onScroll()
    }

    recompute()
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [heroId])

  return scrolled
}
