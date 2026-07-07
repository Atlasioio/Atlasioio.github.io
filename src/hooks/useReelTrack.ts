import { useEffect, useRef } from 'react'

export interface ReelTrackControl {
  /** Nudge the track to a position (seconds) so it stays locked to the film. */
  sync: (seconds: number) => void
}

/**
 * Plays a looping, self-hosted track preview behind the showreel — a real song
 * rather than a synth pad, but with no third-party player or branding. Audible
 * only while `active` (the user hovers the playing reel); fades in/out and never
 * fetches until it first plays. Autoplay policy means it only starts after a
 * user gesture, so a blocked play() is retried on the next interaction.
 *
 * Returns a `sync(seconds)` so the caller can keep the song aligned to the film
 * clock (start at 0:00, follow scrubs) — it only corrects on real drift so a
 * playing track isn't constantly re-seeked into a stutter.
 */
export function useReelTrack(src: string, active: boolean, peak = 0.34): ReelTrackControl {
  const elRef = useRef<HTMLAudioElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const activeRef = useRef(active)
  activeRef.current = active

  const syncRef = useRef<(seconds: number) => void>(() => {})
  syncRef.current = (seconds: number) => {
    const el = elRef.current
    const dur = el?.duration
    if (!el || !Number.isFinite(dur) || !dur) return
    // The track is shorter than the film loop, so wrap the film position into
    // the song's length — it plays continuously and realigns to 0:00 at the top
    // of each loop. Skip corrections that are really the wrap itself (diff near a
    // full loop) so the element's own loop reset isn't fought into a stutter.
    const target = ((seconds % dur) + dur) % dur
    const diff = Math.abs(el.currentTime - target)
    if (diff > 0.22 && diff < dur - 0.22) {
      try {
        el.currentTime = target
      } catch {
        /* seeking before metadata is ready — ignore, next tick retries */
      }
    }
  }

  const ensure = (): HTMLAudioElement => {
    if (elRef.current) return elRef.current
    const el = new Audio(src)
    el.loop = true
    el.preload = 'none'
    el.volume = 0
    elRef.current = el
    return el
  }

  // Autoplay policy blocks a cold hover (hover isn't a user gesture), so the
  // first hover of a fresh page load would stay silent. Unlock the element on
  // the first real gesture *anywhere* — a muted play/pause inside that gesture
  // — so any later hover can start the track immediately.
  useEffect(() => {
    const unlock = () => {
      const el = ensure()
      const p = el.play()
      if (p) p.then(() => { if (!activeRef.current) el.pause() }).catch(() => {})
    }
    const opts = { once: true } as const
    window.addEventListener('pointerdown', unlock, opts)
    window.addEventListener('keydown', unlock, opts)
    window.addEventListener('touchstart', unlock, opts)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  return { sync: (seconds: number) => syncRef.current(seconds) }
}
