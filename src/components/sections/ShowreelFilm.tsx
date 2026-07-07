import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, type CSSProperties } from 'react'
import styles from './ShowreelFilm.module.css'

/**
 * The bespoke hero showreel — a ~28s looping composition cut from the real
 * EcoTrip / Reel / Teem assets, graded per project and stitched by the
 * blue-dot wipe. Motion runs on the Web Animations API: every element gets one
 * infinite animation over the shared 28s master clock, so they stay in sync and
 * a single play/pause toggles them all (driven by the `playing` prop).
 */

const TOTAL = 28_000
const EO = 'cubic-bezier(.22,1,.36,1)' // ease-out (entrances)
const IO = 'cubic-bezier(.7,0,.3,1)' // ease-in-out (wipes)

type Frame = { t: number; opacity?: number; transform?: string; easing?: string }
type Track = { id: string; frames: Frame[] }

const over: CSSProperties = { gridArea: '1 / 1' }

// All times in seconds across the 28s loop.
const TRACKS: Track[] = [
  // ---- Scene visibility (crossfades) ----
  { id: 'cold', frames: [{ t: 0, opacity: 0 }, { t: 0.45, opacity: 1 }, { t: 3.0, opacity: 1 }, { t: 3.5, opacity: 0 }] },
  { id: 'eco', frames: [{ t: 3.3, opacity: 0 }, { t: 3.9, opacity: 1 }, { t: 9.3, opacity: 1 }, { t: 9.9, opacity: 0 }] },
  { id: 'reel', frames: [{ t: 9.6, opacity: 0 }, { t: 10.2, opacity: 1 }, { t: 15.2, opacity: 1 }, { t: 15.8, opacity: 0 }] },
  { id: 'teem', frames: [{ t: 15.5, opacity: 0 }, { t: 16.1, opacity: 1 }, { t: 21.2, opacity: 1 }, { t: 21.8, opacity: 0 }] },
  { id: 'res', frames: [{ t: 21.5, opacity: 0 }, { t: 22.1, opacity: 1 }, { t: 27.4, opacity: 1 }, { t: 27.9, opacity: 0 }] },

  // ---- Blue-dot wipe (four pulses at the cuts) ----
  {
    id: 'wipe',
    frames: [
      { t: 0, transform: 'scale(0)' },
      { t: 3.18, transform: 'scale(0)', easing: IO }, { t: 3.5, transform: 'scale(1.06)', easing: IO }, { t: 3.86, transform: 'scale(0)' },
      { t: 9.28, transform: 'scale(0)', easing: IO }, { t: 9.6, transform: 'scale(1.06)', easing: IO }, { t: 9.96, transform: 'scale(0)' },
      { t: 15.28, transform: 'scale(0)', easing: IO }, { t: 15.6, transform: 'scale(1.06)', easing: IO }, { t: 15.96, transform: 'scale(0)' },
      { t: 21.28, transform: 'scale(0)', easing: IO }, { t: 21.6, transform: 'scale(1.06)', easing: IO }, { t: 21.96, transform: 'scale(0)' },
      { t: 28, transform: 'scale(0)' },
    ],
  },

  // ---- Cold open (brand sting: wordmark rises, then the dot pops with a ring) ----
  { id: 'cold-mark', frames: [{ t: 0.2, opacity: 0, transform: 'translateY(26%) scale(.92)', easing: EO }, { t: 1.0, opacity: 1, transform: 'translateY(0) scale(1)' }, { t: 2.9, opacity: 1, transform: 'translateY(0) scale(1)' }, { t: 3.4, opacity: 0, transform: 'translateY(0) scale(1.04)' }] },
  { id: 'cold-dot', frames: [{ t: 0.95, transform: 'scale(0)' }, { t: 1.3, transform: 'scale(1.25)', easing: EO }, { t: 1.55, transform: 'scale(1)' }] },
  { id: 'cold-ring', frames: [{ t: 1.25, opacity: 0, transform: 'scale(.3)' }, { t: 1.45, opacity: 0.9, transform: 'scale(.7)', easing: EO }, { t: 2.1, opacity: 0, transform: 'scale(2.6)' }] },
  { id: 'cold-kick', frames: [{ t: 1.4, opacity: 0 }, { t: 2.0, opacity: 0.6 }, { t: 2.9, opacity: 0.6 }, { t: 3.3, opacity: 0 }] },

  // ---- EcoTrip ----
  { id: 'eco-a', frames: [{ t: 3.9, opacity: 0, transform: 'scale(1.02)', easing: EO }, { t: 4.4, opacity: 1 }, { t: 6.6, opacity: 1 }, { t: 7.1, opacity: 0, transform: 'scale(1.12)' }] },
  { id: 'eco-b', frames: [{ t: 6.6, opacity: 0, transform: 'scale(1.03)' }, { t: 7.1, opacity: 1 }, { t: 9.2, opacity: 1 }, { t: 9.7, opacity: 0, transform: 'scale(1.12)' }] },
  { id: 'eco-h1', frames: [{ t: 4.4, transform: 'translateY(115%)', easing: EO }, { t: 5.1, transform: 'translateY(0)' }] },
  { id: 'eco-h2', frames: [{ t: 4.6, transform: 'translateY(115%)', easing: EO }, { t: 5.3, transform: 'translateY(0)' }] },
  { id: 'eco-label', frames: [{ t: 4.2, opacity: 0, transform: 'translateY(-40%)', easing: EO }, { t: 4.8, opacity: 1, transform: 'none' }] },

  // ---- Reel ----
  { id: 'reel-browser', frames: [{ t: 10.2, opacity: 0, transform: 'translateY(7%) scale(.96)', easing: EO }, { t: 10.9, opacity: 1, transform: 'none' }] },
  // Start just below the full-page capture's (black) hero band so it opens on
  // live content, hold a beat, then scroll down slowly through the page.
  { id: 'reel-shot', frames: [{ t: 10.2, transform: 'translateY(-21%)' }, { t: 11.5, transform: 'translateY(-21%)' }, { t: 15.4, transform: 'translateY(-52%)' }] },
  { id: 'reel-mini', frames: [{ t: 12.3, opacity: 0, transform: 'translateY(26%)', easing: EO }, { t: 13.0, opacity: 1, transform: 'none' }] },
  { id: 'reel-h1', frames: [{ t: 11.1, transform: 'translateY(115%)', easing: EO }, { t: 11.8, transform: 'translateY(0)' }] },
  { id: 'reel-h2', frames: [{ t: 11.3, transform: 'translateY(115%)', easing: EO }, { t: 12.0, transform: 'translateY(0)' }] },
  { id: 'reel-label', frames: [{ t: 10.6, opacity: 0, transform: 'translateY(-40%)', easing: EO }, { t: 11.2, opacity: 1, transform: 'none' }] },

  // ---- Teem ----
  { id: 'teem-a', frames: [{ t: 16.1, opacity: 0, transform: 'scale(1.04)', easing: EO }, { t: 16.7, opacity: 1 }, { t: 18.7, opacity: 1 }, { t: 19.3, opacity: 0, transform: 'scale(1.12)' }] },
  { id: 'teem-b', frames: [{ t: 18.7, opacity: 0, transform: 'scale(1.05)' }, { t: 19.3, opacity: 1 }, { t: 21.1, opacity: 1 }, { t: 21.6, opacity: 0, transform: 'scale(1.12)' }] },
  { id: 'teem-h1', frames: [{ t: 16.7, transform: 'translateY(115%)', easing: EO }, { t: 17.4, transform: 'translateY(0)' }] },
  { id: 'teem-h2', frames: [{ t: 16.9, transform: 'translateY(115%)', easing: EO }, { t: 17.6, transform: 'translateY(0)' }] },
  { id: 'teem-label', frames: [{ t: 16.6, opacity: 0, transform: 'translateY(-40%)', easing: EO }, { t: 17.2, opacity: 1, transform: 'none' }] },

  // ---- Resolve (three accents collapse into the blue dot → the brand lands) ----
  // The three sit close and converge to centre, scaling down + fading as the
  // blue dot grows from the same point — a clean merge (no odd drift).
  { id: 'res-h', frames: [{ t: 22.1, opacity: 0, transform: 'translate(-50%,-50%) scale(.5)', easing: EO }, { t: 22.7, opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }, { t: 23.1, opacity: 1, transform: 'translate(-50%,-50%) scale(1)', easing: EO }, { t: 23.7, opacity: 0, transform: 'translate(-50%,-50%) scale(.18)' }] },
  { id: 'res-i', frames: [{ t: 22.2, opacity: 0, transform: 'translate(-50%,-50%) scale(.5)', easing: EO }, { t: 22.8, opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }, { t: 23.1, opacity: 1, transform: 'translate(-50%,-50%) scale(1)', easing: EO }, { t: 23.7, opacity: 0, transform: 'translate(-50%,-50%) scale(.18)' }] },
  { id: 'res-m', frames: [{ t: 22.3, opacity: 0, transform: 'translate(-50%,-50%) scale(.5)', easing: EO }, { t: 22.9, opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }, { t: 23.1, opacity: 1, transform: 'translate(-50%,-50%) scale(1)', easing: EO }, { t: 23.7, opacity: 0, transform: 'translate(-50%,-50%) scale(.18)' }] },
  { id: 'res-blue', frames: [{ t: 23.35, opacity: 0, transform: 'translate(-50%,-50%) scale(0)', easing: EO }, { t: 23.85, opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }, { t: 24.1, opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }, { t: 24.45, opacity: 0, transform: 'translate(-50%,-50%) scale(1)' }] },
  { id: 'res-mark', frames: [{ t: 24.0, opacity: 0, transform: 'translateY(24%) scale(.92)', easing: EO }, { t: 24.7, opacity: 1, transform: 'translateY(0) scale(1)' }, { t: 27.3, opacity: 1, transform: 'translateY(0) scale(1)' }, { t: 27.8, opacity: 0, transform: 'translateY(0) scale(1.03)' }] },
  { id: 'res-dot', frames: [{ t: 24.65, transform: 'scale(0)' }, { t: 25.0, transform: 'scale(1.25)', easing: EO }, { t: 25.25, transform: 'scale(1)' }] },
  { id: 'res-ring', frames: [{ t: 24.95, opacity: 0, transform: 'scale(.3)' }, { t: 25.15, opacity: 0.9, transform: 'scale(.7)', easing: EO }, { t: 25.8, opacity: 0, transform: 'scale(2.6)' }] },
  { id: 'res-tag', frames: [{ t: 25.3, opacity: 0, transform: 'translateY(40%)', easing: EO }, { t: 25.8, opacity: 1, transform: 'none' }, { t: 27.3, opacity: 1, transform: 'none' }, { t: 27.7, opacity: 0 }] },
  { id: 'res-place', frames: [{ t: 25.7, opacity: 0 }, { t: 26.2, opacity: 0.55 }, { t: 27.3, opacity: 0.55 }, { t: 27.7, opacity: 0 }] },

  // ---- Progress hairline ----
  { id: 'progress', frames: [{ t: 0, transform: 'scaleX(0)' }, { t: 28, transform: 'scaleX(1)' }] },
]

export interface ShowreelFilmHandle {
  /** Jump to a position in the 28s loop (fraction 0–1). */
  seek: (fraction: number) => void
  /** Current position in the loop (fraction 0–1). */
  getProgress: () => number
}

export const ShowreelFilm = forwardRef<ShowreelFilmHandle, { playing: boolean }>(function ShowreelFilm(
  { playing },
  ref,
) {
  const els = useRef(new Map<string, HTMLElement>())
  const anims = useRef<Animation[]>([])
  const playingRef = useRef(playing)
  playingRef.current = playing

  // Every layer shares the same 28s clock, so scrubbing means setting the same
  // currentTime on all of them, and progress is any one of them (mod the loop).
  useImperativeHandle(ref, () => ({
    seek: (fraction) => {
      const t = Math.min(1, Math.max(0, fraction)) * TOTAL
      anims.current.forEach((a) => {
        a.currentTime = t
      })
    },
    getProgress: () => {
      const ct = anims.current[0]?.currentTime
      if (ct == null) return 0
      return (Number(ct) % TOTAL) / TOTAL
    },
  }), [])

  const reg = (id: string) => (el: HTMLElement | null) => {
    if (el) els.current.set(id, el)
    else els.current.delete(id)
  }

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const created: Animation[] = []
    for (const tr of TRACKS) {
      const el = els.current.get(tr.id)
      if (!el) continue
      const keyframes = tr.frames.map((f) => {
        const k: Keyframe = { offset: Math.min(1, Math.max(0, f.t / 28)) }
        if (f.opacity !== undefined) k.opacity = f.opacity
        if (f.transform !== undefined) k.transform = f.transform
        if (f.easing) k.easing = f.easing
        return k
      })
      // Pin the first/last values across the whole 28s loop. Without an explicit
      // offset-0 / offset-1 keyframe, an infinite animation interpolates the gap
      // from the element's base CSS value — which makes fade-in layers (e.g. the
      // second phone / second Teem shot) ghost in at ~25% during the prior shot.
      if ((keyframes[0].offset as number) > 0) keyframes.unshift({ ...keyframes[0], offset: 0 })
      const last = keyframes[keyframes.length - 1]
      if ((last.offset as number) < 1) keyframes.push({ ...last, offset: 1 })
      created.push(el.animate(keyframes, { duration: TOTAL, iterations: Infinity, fill: 'both', easing: 'linear' }))
    }
    anims.current = created
    if (!playingRef.current) created.forEach((a) => a.pause())
    return () => {
      created.forEach((a) => a.cancel())
      anims.current = []
    }
  }, [])

  useEffect(() => {
    anims.current.forEach((a) => (playing ? a.play() : a.pause()))
  }, [playing])

  return (
    <div className={styles.film}>
      {/* Cold open */}
      <div className={styles.scene} ref={reg('cold')}>
        <div className={`${styles.fill} ${styles.cream}`} />
        <div className={styles.mark} ref={reg('cold-mark')}>
          lukas
          <span className={styles.dot} ref={reg('cold-dot')}>
            <span className={styles.ring} ref={reg('cold-ring')} />
          </span>
        </div>
        <div className={styles.kicker} ref={reg('cold-kick')}>
          Lukas Ahlse · Selected Work ’26
        </div>
      </div>

      {/* Act I — EcoTrip */}
      <div className={styles.scene} ref={reg('eco')}>
        <div className={`${styles.fill} ${styles.honey}`} />
        <div className={styles.layer}>
          <img className={styles.phone} style={over} ref={reg('eco-a')} src="/work/ecotrip/onboarding.png" alt="" />
          <img className={styles.phone} style={over} ref={reg('eco-b')} src="/work/ecotrip/explore.png" alt="" />
        </div>
        <div className={styles.scrim} />
        <div className={styles.label} style={{ color: '#3a2a05' }} ref={reg('eco-label')}>
          <i />
          EcoTrip · App
        </div>
        <h3 className={styles.headline} style={{ color: '#241a04' }}>
          <span className={styles.lineMask}><span className={styles.lineInner} ref={reg('eco-h1')}>Travel light.</span></span>
          <span className={styles.lineMask}><span className={styles.lineInner} ref={reg('eco-h2')}>Together.</span></span>
        </h3>
      </div>

      {/* Act II — Reel */}
      <div className={styles.scene} ref={reg('reel')}>
        <div className={`${styles.fill} ${styles.ink}`} />
        <div className={styles.layer}>
          <div className={styles.reelStage}>
            <div className={styles.browser} ref={reg('reel-browser')}>
              <div className={styles.browserBar}>
                <span /><span /><span />
              </div>
              <div className={styles.browserView}>
                <img ref={reg('reel-shot')} src="/work/reel/d-full.webp" alt="" />
              </div>
            </div>
            <div className={styles.miniPhone} ref={reg('reel-mini')}>
              <img src="/work/reel/m-hero.webp" alt="" />
            </div>
          </div>
        </div>
        <div className={styles.scrim} />
        <div className={styles.label} style={{ color: '#cdc8be' }} ref={reg('reel-label')}>
          <i />
          Reel · Website
        </div>
        <h3 className={styles.headline} style={{ color: '#f3f0ea' }}>
          <span className={styles.lineMask}><span className={styles.lineInner} ref={reg('reel-h1')}>Vision.</span></span>
          <span className={styles.lineMask}><span className={styles.lineInner} ref={reg('reel-h2')}>Structure.</span></span>
        </h3>
      </div>

      {/* Act III — Teem */}
      <div className={styles.scene} ref={reg('teem')}>
        <div className={`${styles.fill} ${styles.matcha}`} />
        <div className={styles.layer}>
          <img className={styles.cover} style={over} ref={reg('teem-a')} src="/work/teem/hero.webp" alt="" />
          <img className={styles.cover} style={over} ref={reg('teem-b')} src="/work/teem/packaging.webp" alt="" />
        </div>
        <div className={styles.scrim} />
        <div className={styles.label} style={{ color: '#eaf3df' }} ref={reg('teem-label')}>
          <i />
          Teem · Brand · 抹茶
        </div>
        <h3 className={styles.headline} style={{ color: '#f4f8ef' }}>
          <span className={styles.lineMask}><span className={styles.lineInner} ref={reg('teem-h1')}>A break</span></span>
          <span className={styles.lineMask}><span className={styles.lineInner} ref={reg('teem-h2')}>from screens.</span></span>
        </h3>
      </div>

      {/* Resolve */}
      <div className={styles.scene} ref={reg('res')}>
        <div className={`${styles.fill} ${styles.cream}`} />
        <div className={styles.swatch} style={{ left: '44%', top: '50%', background: '#f5a800' }} ref={reg('res-h')} />
        <div className={styles.swatch} style={{ left: '50%', top: '50%', background: '#14120f' }} ref={reg('res-i')} />
        <div className={styles.swatch} style={{ left: '56%', top: '50%', background: '#3f8a3c' }} ref={reg('res-m')} />
        <div className={styles.blueDot} style={{ left: '50%', top: '50%' }} ref={reg('res-blue')} />
        <div className={styles.mark} ref={reg('res-mark')}>
          lukas<span className={styles.dot} ref={reg('res-dot')}><span className={styles.ring} ref={reg('res-ring')} /></span>
        </div>
        <div className={styles.tag} ref={reg('res-tag')}>
          Apps · Websites · Brands
        </div>
        <div className={styles.place} ref={reg('res-place')}>
          Stockholm — open to work
        </div>
      </div>

      {/* Connective motif + running progress */}
      <div className={styles.wipe} ref={reg('wipe')} />
      <div className={styles.progress} ref={reg('progress')} />
    </div>
  )
})
