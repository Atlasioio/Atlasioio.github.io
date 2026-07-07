import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { ShowreelFilm, type ShowreelFilmHandle } from './ShowreelFilm'
import { useReelTrack } from '../../hooks/useReelTrack'
import styles from './Showreel.module.css'

/* ---- Inline control icons ------------------------------------------------ */
const ICON = 16
const Play = () => (
  <svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
)
const Pause = () => (
  <svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z" /></svg>
)
const Close = () => (
  <svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
)
const FullscreenIcon = () => (
  <svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
)
const RestartIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
)
const VideoMark = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3z" /></svg>
)
const SoundOn = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16 8.5a4 4 0 0 1 0 7" /></svg>
)
const SoundOff = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M22 9l-5 6M17 9l5 6" /></svg>
)

/**
 * The hero showreel: our own looping, muted composition (ShowreelFilm) cut from
 * the real case studies, wrapped in the floating tile with custom controls that
 * appear on hover (play/pause · drag handle · fullscreen · close). Closing
 * collapses it to a circular button you press to reopen. Hidden on small/touch
 * screens.
 */
export function Showreel() {
  const [open, setOpen] = useState(true)
  const [playing, setPlaying] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const reelRef = useRef<HTMLDivElement>(null)
  const filmRef = useRef<ShowreelFilmHandle>(null)
  const scrubRef = useRef<HTMLInputElement>(null)
  const scrubbing = useRef(false)
  const dragStart = useRef<{ x: number; y: number; bx: number; by: number } | null>(null)

  // A looping song preview, audible only while hovering the playing reel.
  const soundOn = open && playing && hovered
  useReelTrack('/audio/everlasting-light.mp3', soundOn)

  // Keep the scrubber in sync with the 28s composition clock while it plays
  // (skipped while the user is dragging so their thumb doesn't fight the loop).
  useEffect(() => {
    if (!(open && playing)) return
    let raf = 0
    const tick = () => {
      if (!scrubbing.current && scrubRef.current && filmRef.current) {
        scrubRef.current.value = String(Math.round(filmRef.current.getProgress() * 1000))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [open, playing])

  const seek = (fraction: number) => {
    filmRef.current?.seek(fraction)
    if (scrubRef.current) scrubRef.current.value = String(Math.round(fraction * 1000))
  }

  const togglePlay = () => setPlaying((p) => !p)

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else reelRef.current?.requestFullscreen?.()
  }

  const close = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    setOpen(false)
  }

  // Drag the tile around via the top handle (pointer capture keeps it tracking).
  const onPointerDown = (e: ReactPointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragStart.current = { x: e.clientX, y: e.clientY, bx: pos.x, by: pos.y }
  }
  const onPointerMove = (e: ReactPointerEvent) => {
    const d = dragStart.current
    if (!d) return
    setPos({ x: d.bx + (e.clientX - d.x), y: d.by + (e.clientY - d.y) })
  }
  const onPointerUp = (e: ReactPointerEvent) => {
    dragStart.current = null
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }

  const transform = { transform: `translate(${pos.x}px, ${pos.y}px)` }

  if (!open) {
    return (
      <button
        type="button"
        className={styles.collapsed}
        style={transform}
        onClick={() => setOpen(true)}
        aria-label="Open showreel"
        data-cursor
      >
        <VideoMark />
      </button>
    )
  }

  return (
    <div
      className={styles.reel}
      ref={reelRef}
      style={transform}
      data-cursor-quiet
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div className={styles.video}>
        <ShowreelFilm playing={playing} ref={filmRef} />
      </div>

      <div className={styles.controls}>
        <div
          className={styles.dragBar}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          role="presentation"
        >
          <span className={styles.grip} />
        </div>

        <button
          type="button"
          className={styles.restart}
          onClick={() => seek(0)}
          aria-label="Restart from the beginning"
        >
          <RestartIcon />
        </button>

        <button type="button" className={styles.close} onClick={close} aria-label="Close showreel">
          <Close />
        </button>

        <button
          type="button"
          className={styles.play}
          onClick={togglePlay}
          aria-label={playing ? 'Pause showreel' : 'Play showreel'}
        >
          {playing ? <Pause /> : <Play />}
        </button>

        <button
          type="button"
          className={styles.fs}
          onClick={toggleFullscreen}
          aria-label="Toggle fullscreen"
        >
          <FullscreenIcon />
        </button>

        <input
          type="range"
          className={styles.scrub}
          ref={scrubRef}
          min={0}
          max={1000}
          defaultValue={0}
          aria-label="Seek showreel"
          onPointerDown={() => {
            scrubbing.current = true
          }}
          onPointerUp={() => {
            scrubbing.current = false
          }}
          onInput={(e) => filmRef.current?.seek(Number(e.currentTarget.value) / 1000)}
        />
      </div>

      <div className={styles.meta}>
        <span className={styles.rec}>
          <i />
          Showreel
        </span>
        <span className={styles.sound} data-on={soundOn} title={soundOn ? 'Sound on' : 'Hover for sound'}>
          {soundOn ? <SoundOn /> : <SoundOff />}
        </span>
      </div>
    </div>
  )
}
