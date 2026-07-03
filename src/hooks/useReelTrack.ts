import { useEffect, useRef } from 'react'

/**
 * Plays a looping, self-hosted track preview behind the showreel — a real song
 * rather than a synth pad, but with no third-party player or branding. Audible
 * only while `active` (the user hovers the playing reel); fades in/out and never
 * fetches until it first plays. Autoplay policy means it only starts after a
 * user gesture, so a blocked play() is retried on the next interaction.
 */
export function useReelTrack(src: string, active: boolean, peak = 0.34): void {
  const elRef = useRef<HTMLAudioElement | null>(null)
  const rafRef = useRef<number | null>(null)

  const ensure = (): HTMLAudioElement => {
    if (elRef.current) return elRef.current
    const el = new Audio(src)
    el.loop = true
    el.preload = 'none'
    el.volume = 0
    elRef.current = el
    return el
  }

  useEffect(() => {
    const el = ensure()
    const target = active ? peak : 0

    if (active) {
      const tryPlay = () => el.play().catch(() => {})
      const p = el.play()
      if (p) {
        p.catch(() => {
          // Autoplay blocked — resume on the first real gesture while active.
          window.addEventListener('pointerdown', tryPlay, { once: true })
          window.addEventListener('keydown', tryPlay, { once: true })
        })
      }
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const step = () => {
      const cur = el.volume
      const diff = target - cur
      if (Math.abs(diff) < 0.01) {
        el.volume = target
        if (!active) el.pause()
        rafRef.current = null
        return
      }
      el.volume = Math.max(0, Math.min(1, cur + diff * 0.09))
      rafRef.current = requestAnimationFrame(step)
    }
    step()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [active, src, peak])

  useEffect(
    () => () => {
      elRef.current?.pause()
      elRef.current = null
    },
    [],
  )
}
