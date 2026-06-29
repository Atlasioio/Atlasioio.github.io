import { useEffect, useRef } from 'react'

/**
 * A procedural ambient pad for the showreel — a soft, slowly-evolving chord
 * synthesised with the Web Audio API (no audio file, no licensing). It stays
 * silent until `active` is true (the user hovers the playing reel), then fades
 * in; fades out otherwise. AudioContext autoplay policy means sound only starts
 * after a user gesture, so we also resume on the first interaction while active.
 */
export function useAmbientPad(active: boolean): void {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)

  const ensure = (): AudioContext | null => {
    if (ctxRef.current) return ctxRef.current
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    const ctx = new AC()

    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    // Warm low-pass the whole bed sits behind.
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 720
    lp.Q.value = 0.6
    lp.connect(master)

    // A calm, open chord (A2 · E3 · A3 · C#4) — each note a detuned sine/triangle
    // pair for a soft analogue shimmer.
    const chord = [110, 164.81, 220, 277.18]
    chord.forEach((f, i) => {
      const g = ctx.createGain()
      g.gain.value = i === 0 ? 0.5 : 0.26
      g.connect(lp)
      const a = ctx.createOscillator()
      a.type = 'sine'
      a.frequency.value = f
      a.detune.value = -5
      const b = ctx.createOscillator()
      b.type = 'triangle'
      b.frequency.value = f
      b.detune.value = 6
      a.connect(g)
      b.connect(g)
      a.start()
      b.start()
    })

    // Slow filter drift so it never feels static.
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.06
    const lfoDepth = ctx.createGain()
    lfoDepth.gain.value = 260
    lfo.connect(lfoDepth)
    lfoDepth.connect(lp.frequency)
    lfo.start()

    ctxRef.current = ctx
    masterRef.current = master
    return ctx
  }

  useEffect(() => {
    if (!active) {
      const ctx = ctxRef.current
      const m = masterRef.current
      if (ctx && m) {
        m.gain.cancelScheduledValues(ctx.currentTime)
        m.gain.setTargetAtTime(0, ctx.currentTime, 0.3)
      }
      return
    }

    const ctx = ensure()
    if (!ctx) return
    const m = masterRef.current!
    const fadeUp = () => {
      m.gain.cancelScheduledValues(ctx.currentTime)
      m.gain.setTargetAtTime(0.05, ctx.currentTime, 0.45)
    }
    if (ctx.state === 'suspended') {
      ctx.resume().then(fadeUp).catch(() => {})
      // Fallback: resume on the first real gesture while active.
      const onGesture = () => {
        ctx.resume().then(fadeUp).catch(() => {})
      }
      window.addEventListener('pointerdown', onGesture, { once: true })
      window.addEventListener('keydown', onGesture, { once: true })
      return () => {
        window.removeEventListener('pointerdown', onGesture)
        window.removeEventListener('keydown', onGesture)
      }
    }
    fadeUp()
  }, [active])

  useEffect(
    () => () => {
      ctxRef.current?.close().catch(() => {})
      ctxRef.current = null
    },
    [],
  )
}
