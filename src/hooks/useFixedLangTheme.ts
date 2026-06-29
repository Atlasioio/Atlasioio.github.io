import { useEffect, useState } from 'react'

interface FixedLangState {
  /** Light controls (over the blue hero card). */
  light: boolean
  /** Hidden once the blue outro/footer is reached (it has its own toggle). */
  hidden: boolean
}

/**
 * Theme + visibility for the fixed bottom-right controls, derived from which
 * section the bottom of the viewport currently sits over:
 *  - over the blue hero card (top) → light controls
 *  - over the off-white middle sections → dark controls
 *  - over the blue outro/footer (#contact) → hidden (it renders its own toggle)
 */
export function useFixedLangTheme(): FixedLangState {
  const [state, setState] = useState<FixedLangState>({ light: true, hidden: false })

  useEffect(() => {
    const compute = () => {
      const line = window.innerHeight - 52 // ≈ the controls' vertical position
      const hero = document.getElementById('hero')
      const outro = document.getElementById('contact')

      const heroBottom = hero ? hero.getBoundingClientRect().bottom : -Infinity
      const outroTop = outro ? outro.getBoundingClientRect().top : Infinity

      const hidden = outroTop <= line
      const light = heroBottom >= line
      setState((prev) =>
        prev.light === light && prev.hidden === hidden ? prev : { light, hidden },
      )
    }

    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute, { passive: true })
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [])

  return state
}
