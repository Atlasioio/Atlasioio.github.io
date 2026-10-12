import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, type CSSProperties } from 'react'
import { projects, type Project, type ProjectCard } from '../../data/content'
import styles from './ShowreelFilm.module.css'

/**
 * The hero showreel: a looping composition of the four featured projects, cut
 * from the same photos and phone screens as their home-page cards, opened and
 * closed by the brand sting and stitched by the blue-dot wipe. Motion runs on
 * the Web Animations API: every element gets one infinite animation over the
 * shared master clock, so they stay in sync and a single play/pause toggles
 * them all (driven by the `playing` prop).
 */

const TOTAL = 34_000
/** The loop length in seconds — exported so the hero can sync audio to it. */
export const SHOWREEL_SECONDS = TOTAL / 1000
const EO = 'cubic-bezier(.22,1,.36,1)' // ease-out (entrances)
const IO = 'cubic-bezier(.7,0,.3,1)' // ease-in-out (wipes)

type Frame = { t: number; opacity?: number; transform?: string; easing?: string }
type Track = { id: string; frames: Frame[] }

/** Each act's caption, broken into the lines that rise in one by one. They
 *  say the same as the card headlines, so the reel and the cards agree. */
const LINES: Record<ProjectCard['mark'], [string, string]> = {
  time: ['A focus timer that', 'keeps an honest record'],
  sherry: ['A tool library for', 'Malmö’s neighbourhoods'],
  goodreads: ['Goodreads, rebuilt', 'around reading'],
  ecotrip: ['A travel app for', 'protecting the hive'],
}

/** The featured projects that have a card, in home-page order. */
const ACTS = projects
  .filter((p): p is Project & { card: ProjectCard } => Boolean(p.featured && p.card))
  .map((p) => ({ id: p.id, project: p, card: p.card, lines: LINES[p.card.mark] }))

// Timeline (seconds): the cold open, one 6s act per project, then the resolve.
const COLD_END = 3.5
const ACT_LEN = 6
const actStart = (i: number) => COLD_END - 0.2 + i * ACT_LEN
const RES_START = actStart(ACTS.length)

function actTracks(id: string, s: number, lineCount: number): Track[] {
  return [
    { id, frames: [{ t: s, opacity: 0 }, { t: s + 0.6, opacity: 1 }, { t: s + ACT_LEN, opacity: 1 }, { t: s + ACT_LEN + 0.6, opacity: 0 }] },
    // A slow push-in on the photo across the whole act.
    { id: `${id}-bg`, frames: [{ t: s, transform: 'scale(1.1)' }, { t: s + ACT_LEN + 0.6, transform: 'scale(1)' }] },
    // The first phone comes in, then the second takes over halfway.
    { id: `${id}-a`, frames: [{ t: s + 0.5, opacity: 0, transform: 'translateY(6%)', easing: EO }, { t: s + 1.2, opacity: 1, transform: 'none' }, { t: s + 3.3, opacity: 1, transform: 'none' }, { t: s + 3.8, opacity: 0, transform: 'translateY(-2%)' }] },
    { id: `${id}-b`, frames: [{ t: s + 3.3, opacity: 0, transform: 'translateY(4%)', easing: EO }, { t: s + 3.9, opacity: 1, transform: 'none' }, { t: s + ACT_LEN, opacity: 1, transform: 'none' }] },
    { id: `${id}-label`, frames: [{ t: s + 0.8, opacity: 0, transform: 'translateY(40%)', easing: EO }, { t: s + 1.4, opacity: 1, transform: 'none' }] },
    ...Array.from({ length: lineCount }, (_, l) => ({
      id: `${id}-h${l}`,
      frames: [{ t: s + 1.0 + l * 0.18, transform: 'translateY(115%)', easing: EO }, { t: s + 1.7 + l * 0.18, transform: 'translateY(0)' }],
    })),
  ]
}

/** One wipe pulse per cut: into each act, and into the resolve. */
const cuts = [...ACTS.map((_, i) => actStart(i)), RES_START].map((s) => s + 0.2)

const centred = 'translate(-50%,-50%)'
const TRACKS: Track[] = [
  // ---- Cold open (brand sting: wordmark rises, then the dot pops with a ring) ----
  { id: 'cold', frames: [{ t: 0, opacity: 0 }, { t: 0.45, opacity: 1 }, { t: 3.0, opacity: 1 }, { t: 3.5, opacity: 0 }] },
  { id: 'cold-mark', frames: [{ t: 0.2, opacity: 0, transform: 'translateY(26%) scale(.92)', easing: EO }, { t: 1.0, opacity: 1, transform: 'translateY(0) scale(1)' }, { t: 2.9, opacity: 1, transform: 'translateY(0) scale(1)' }, { t: 3.4, opacity: 0, transform: 'translateY(0) scale(1.04)' }] },
  { id: 'cold-dot', frames: [{ t: 0.95, transform: 'scale(0)' }, { t: 1.3, transform: 'scale(1.25)', easing: EO }, { t: 1.55, transform: 'scale(1)' }] },
  { id: 'cold-ring', frames: [{ t: 1.25, opacity: 0, transform: 'scale(.3)' }, { t: 1.45, opacity: 0.9, transform: 'scale(.7)', easing: EO }, { t: 2.1, opacity: 0, transform: 'scale(2.6)' }] },
  { id: 'cold-kick', frames: [{ t: 1.4, opacity: 0 }, { t: 2.0, opacity: 0.7 }, { t: 2.9, opacity: 0.7 }, { t: 3.3, opacity: 0 }] },

  // ---- The four acts ----
  ...ACTS.flatMap((a, i) => actTracks(a.id, actStart(i), a.lines.length)),

  // ---- Blue-dot wipe at every cut ----
  {
    id: 'wipe',
    frames: [
      { t: 0, transform: 'scale(0)' },
      ...cuts.flatMap((c) => [
        { t: c - 0.32, transform: 'scale(0)', easing: IO },
        { t: c, transform: 'scale(1.06)', easing: IO },
        { t: c + 0.36, transform: 'scale(0)' },
      ]),
      { t: SHOWREEL_SECONDS, transform: 'scale(0)' },
    ],
  },

  // ---- Resolve (the four project colours collapse into the blue dot, then the brand lands) ----
  { id: 'res', frames: [{ t: RES_START, opacity: 0 }, { t: RES_START + 0.6, opacity: 1 }, { t: SHOWREEL_SECONDS - 0.6, opacity: 1 }, { t: SHOWREEL_SECONDS - 0.1, opacity: 0 }] },
  ...ACTS.map((a, i) => ({
    id: `res-${a.id}`,
    frames: [
      { t: RES_START + 0.6 + i * 0.1, opacity: 0, transform: `${centred} scale(.5)`, easing: EO },
      { t: RES_START + 1.2 + i * 0.1, opacity: 1, transform: `${centred} scale(1)` },
      { t: RES_START + 1.6, opacity: 1, transform: `${centred} scale(1)`, easing: EO },
      { t: RES_START + 2.2, opacity: 0, transform: `${centred} scale(.18)` },
    ],
  })),
  { id: 'res-blue', frames: [{ t: RES_START + 1.85, opacity: 0, transform: `${centred} scale(0)`, easing: EO }, { t: RES_START + 2.35, opacity: 1, transform: `${centred} scale(1)` }, { t: RES_START + 2.6, opacity: 1, transform: `${centred} scale(1)` }, { t: RES_START + 2.95, opacity: 0, transform: `${centred} scale(1)` }] },
  { id: 'res-mark', frames: [{ t: RES_START + 2.5, opacity: 0, transform: 'translateY(24%) scale(.92)', easing: EO }, { t: RES_START + 3.2, opacity: 1, transform: 'translateY(0) scale(1)' }, { t: SHOWREEL_SECONDS - 0.7, opacity: 1, transform: 'translateY(0) scale(1)' }, { t: SHOWREEL_SECONDS - 0.2, opacity: 0, transform: 'translateY(0) scale(1.03)' }] },
  { id: 'res-dot', frames: [{ t: RES_START + 3.15, transform: 'scale(0)' }, { t: RES_START + 3.5, transform: 'scale(1.25)', easing: EO }, { t: RES_START + 3.75, transform: 'scale(1)' }] },
  { id: 'res-ring', frames: [{ t: RES_START + 3.45, opacity: 0, transform: 'scale(.3)' }, { t: RES_START + 3.65, opacity: 0.9, transform: 'scale(.7)', easing: EO }, { t: RES_START + 4.3, opacity: 0, transform: 'scale(2.6)' }] },
  { id: 'res-tag', frames: [{ t: RES_START + 3.8, opacity: 0, transform: 'translateY(40%)', easing: EO }, { t: RES_START + 4.3, opacity: 1, transform: 'none' }, { t: SHOWREEL_SECONDS - 0.7, opacity: 1, transform: 'none' }, { t: SHOWREEL_SECONDS - 0.3, opacity: 0 }] },
  { id: 'res-place', frames: [{ t: RES_START + 4.2, opacity: 0 }, { t: RES_START + 4.7, opacity: 0.72 }, { t: SHOWREEL_SECONDS - 0.7, opacity: 0.72 }, { t: SHOWREEL_SECONDS - 0.3, opacity: 0 }] },
]

export interface ShowreelFilmHandle {
  /** Jump to a position in the loop (fraction 0–1). */
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

  // Every layer shares the same clock, so scrubbing means setting the same
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
        const k: Keyframe = { offset: Math.min(1, Math.max(0, f.t / SHOWREEL_SECONDS)) }
        if (f.opacity !== undefined) k.opacity = f.opacity
        if (f.transform !== undefined) k.transform = f.transform
        if (f.easing) k.easing = f.easing
        return k
      })
      // Pin the first/last values across the whole loop. Without an explicit
      // offset-0 / offset-1 keyframe, an infinite animation interpolates the gap
      // from the element's base CSS value — which makes fade-in layers (e.g. the
      // second phone) ghost in during the prior shot.
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
          Lukas Ahlse · Selected work
        </div>
      </div>

      {/* One act per featured project: its card photo, its two phones, its headline */}
      {ACTS.map(({ id, project, card, lines }) => (
        <div className={styles.scene} ref={reg(id)} key={id}>
          <div
            className={styles.photo}
            ref={reg(`${id}-bg`)}
            style={{ backgroundImage: `url('${card.bg}')`, backgroundPosition: card.posSm ?? card.pos ?? 'center' } as CSSProperties}
          />
          <div className={styles.scrim} />
          <div className={styles.phones}>
            <img className={styles.phone} ref={reg(`${id}-a`)} src={card.phones[0]} alt="" />
            <img className={styles.phone} ref={reg(`${id}-b`)} src={card.phones[1]} alt="" />
          </div>
          <div className={styles.caption}>
            <div className={styles.label} ref={reg(`${id}-label`)}>
              <i />
              {project.name} · {project.tag.split(' · ')[0]}
            </div>
            <h3 className={styles.headline}>
              {lines.map((line, l) => (
                <span className={styles.lineMask} key={line}>
                  <span className={styles.lineInner} ref={reg(`${id}-h${l}`)}>{line}</span>
                </span>
              ))}
            </h3>
          </div>
        </div>
      ))}

      {/* Resolve */}
      <div className={styles.scene} ref={reg('res')}>
        <div className={`${styles.fill} ${styles.cream}`} />
        {ACTS.map(({ id, project }, i) => (
          <div
            key={id}
            className={styles.swatch}
            style={{ left: `${50 + (i - (ACTS.length - 1) / 2) * 6}%`, top: '50%', background: project.accent }}
            ref={reg(`res-${id}`)}
          />
        ))}
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

      {/* Connective motif (the blue-dot wipe between acts) */}
      <div className={styles.wipe} ref={reg('wipe')} />
    </div>
  )
})
