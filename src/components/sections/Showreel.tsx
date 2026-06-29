import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { ShowreelFilm } from './ShowreelFilm'
import { useAmbientPad } from '../../hooks/useAmbientPad'
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
  const dragStart = useRef<{ x: number; y: number; bx: number; by: number } | null>(null)

  // Ambient pad: audible only while hovering the playing reel.
  const soundOn = open && playing && hovered
  useAmbientPad(soundOn)

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
        <ShowreelFilm playing={playing} />
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
