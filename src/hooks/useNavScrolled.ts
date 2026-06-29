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
    const onScroll = () => setScrolled(window.scrollY > threshold)
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
