import { useEffect, useRef, useState } from 'react'
import { Marker } from '../ui/Marker'
import { Reveal } from '../ui/Reveal'
import { STUDIO_ART } from './StudioArt'
import styles from './Studio.module.css'

const CX = 240
const CY = 230
const R = 162

/** How Lukas works in each discipline — shown beside the motif in the hover card. */
const NODE_DESC: Record<string, string> = {
  AI: 'I use AI to close the gap between design and code — pushing an idea from sketch to a clickable prototype I can feel and refine. I care more about where it earns a place than the hype.',
  Research: 'I start from evidence, not assumptions — user interviews, competitor and desk research, and a clear read on what success looks like before a single pixel.',
  'UX/UI': 'Flows to pixels — interfaces that hold up under real, daily use. Systems keep them consistent; the product decides where to break the mould.',
  Build: 'I prototype in code — React or Framer — turning ideas into clickable, functional demos that test a feature or direction, well beyond static mockups.',
  Brand: 'Identity as a system: type, colour, and a visual language that holds together across every surface, from a logo to a full screen.',
  Motion: 'Motion with intent — transitions and micro-interactions that guide attention and make a product feel alive, never decorative.',
}

const NODES = (
  [
    { a: -90, label: 'AI' },
    { a: -30, label: 'Research' },
    { a: 30, label: 'UX/UI' },
    { a: 90, label: 'Build' },
    { a: 150, label: 'Brand' },
    { a: 210, label: 'Motion' },
  ] as const
).map((n) => {
  const rad = (n.a * Math.PI) / 180
  const x = CX + R * Math.cos(rad)
  const y = CY + R * Math.sin(rad)
  const dx = x - CX
  let anchor: 'start' | 'middle' | 'end' = 'middle'
  let lx = x
  let ly = y + 5
  if (Math.abs(dx) < 6) {
    ly = y < CY ? y - 16 : y + 26
  } else if (dx > 0) {
    anchor = 'start'
    lx = x + 14
  } else {
    anchor = 'end'
    lx = x - 14
  }
  // Hover card sits well outside the ring, on the node's own radial line (the
  // angle the word pokes out) so it reads as belonging to that node.
  const CARD_OUT = 104
  const cardX = x + Math.cos(rad) * CARD_OUT
  const cardY = y + Math.sin(rad) * CARD_OUT
  return { ...n, rad, x, y, lx, ly, anchor, cardX, cardY }
})

/**
 * "One point of contact" — lukas at the centre, every discipline radiating out.
 * On hover the axis tracks the cursor: a blue beam reaches from the core toward
 * the pointer with a light pulse travelling outward, and the nearest discipline
 * (node + label) lights up.
 */
function StudioVisual() {
  const svgRef = useRef<SVGSVGElement>(null)
  const pulseRef = useRef<SVGCircleElement>(null)
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    const svg = svgRef.current
    // Desktop-only flourish: skip on reduced-motion and on touch devices (where
    // tap-fired pointer events would pop the wide hover card off-screen).
    if (
      !svg ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none)').matches
    )
      return

    const cur = { vis: 0, pulse: 0 }
    const target = { on: 0 }
    let activeIdx = -1
    let raf = 0
    let running = false
    let last = 0

    const onMove = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect()
      const vx = ((e.clientX - rect.left) / rect.width) * 480
      const vy = ((e.clientY - rect.top) / rect.height) * 460
      const ang = Math.atan2(vy - CY, vx - CX)
      let best = -1
      let bestD = Infinity
      NODES.forEach((n, i) => {
        const d = Math.abs(Math.atan2(Math.sin(ang - n.rad), Math.cos(ang - n.rad)))
        if (d < bestD) {
          bestD = d
          best = i
        }
      })
      if (best !== activeIdx) {
        activeIdx = best
        setActive(best)
      }
      start()
    }
    const onEnter = () => {
      target.on = 1
      start()
    }
    const onLeave = () => {
      target.on = 0
      activeIdx = -1
      setActive(null)
    }

    // Only the pulse is driven imperatively now — it travels outward along the
    // lit spoke (the nearest node's own line). The spoke/node/label highlight is
    // handled declaratively by the `active` state + CSS.
    const frame = (ts: number) => {
      const dt = last ? Math.min(48, ts - last) : 16
      last = ts
      cur.vis += (target.on - cur.vis) * 0.12
      const pulse = pulseRef.current
      if (pulse) {
        if (activeIdx >= 0) {
          const dir = NODES[activeIdx].rad
          cur.pulse += dt / 1100
          if (cur.pulse > 1) cur.pulse -= 1
          const p = cur.pulse
          const pr = 30 + (R - 42) * p
          pulse.setAttribute('cx', String(CX + Math.cos(dir) * pr))
          pulse.setAttribute('cy', String(CY + Math.sin(dir) * pr))
          pulse.setAttribute('r', String(2.5 + 5 * p))
          pulse.setAttribute('opacity', String((1 - p) * cur.vis))
        } else {
          pulse.setAttribute('opacity', '0')
        }
      }
      if (target.on === 0 && cur.vis < 0.004) {
        running = false
        return
      }
      raf = requestAnimationFrame(frame)
    }
    function start() {
      if (running) return
      running = true
      last = 0
      raf = requestAnimationFrame(frame)
    }

    svg.addEventListener('pointermove', onMove)
    svg.addEventListener('pointerenter', onEnter)
    svg.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      svg.removeEventListener('pointermove', onMove)
      svg.removeEventListener('pointerenter', onEnter)
      svg.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  const card = active === null ? null : NODES[active]
  const CardArt = card ? STUDIO_ART[card.label] : null

  return (
    <div className={styles.visualWrap}>
      {card && (
        <div
          key={card.label}
          className={styles.hoverCard}
          style={{
            // Anchored on the node's outward radial point, lightly clamped so the
            // wide landscape card points outward from its node and can spill into
            // the surrounding gutters without clipping off-screen.
            left: `${Math.min(82, Math.max(18, (card.cardX / 480) * 100))}%`,
            top: `${Math.min(88, Math.max(12, (card.cardY / 460) * 100))}%`,
          }}
          aria-hidden="true"
        >
          <div className={styles.hoverMedia}>{CardArt && <CardArt />}</div>
          <div className={styles.hoverText}>
            <span className={styles.hoverName}>{card.label}</span>
            <p className={styles.hoverDesc}>{NODE_DESC[card.label]}</p>
          </div>
        </div>
      )}
      <svg ref={svgRef} className={styles.visualSvg} viewBox="0 0 480 460" fill="none" aria-hidden="true">
      <circle className={styles.hubRing} cx={CX} cy={CY} r={R} />
      {NODES.map((n, i) => (
        <line
          key={`spoke-${n.label}`}
          className={`${styles.hubSpoke} ${active === i ? styles.hubSpokeOn : ''}`}
          x1={CX}
          y1={CY}
          x2={n.x}
          y2={n.y}
        />
      ))}

      {/* Outward pulse along the lit spoke (driven imperatively above). */}
      <circle ref={pulseRef} className={styles.pulse} cx={CX} cy={CY} r={3} opacity={0} />

      {NODES.map((n, i) => (
        <g key={n.label}>
          <circle className={`${styles.hubNode} ${active === i ? styles.hubNodeOn : ''}`} cx={n.x} cy={n.y} r={5.5} />
          <text className={`${styles.hubLabel} ${active === i ? styles.hubLabelHidden : ''}`} x={n.lx} y={n.ly} textAnchor={n.anchor}>
            {n.label}
          </text>
        </g>
      ))}
      <circle className={styles.hubPulse} cx={CX} cy={CY} r={33} />
      <circle className={styles.hubCore} cx={CX} cy={CY} r={33} />
      <text className={styles.hubCoreText} x={CX} y={CY + 5} textAnchor="middle">
        lukas
      </text>
      </svg>
    </div>
  )
}

/** 01 — Studio. Positioning copy on the left, an outcomes visual on the right. */
export function Studio() {
  return (
    <section className={`section wrap ${styles.section}`} id="studio">
      <Marker num="01" label="About" />
      <div className={styles.grid}>
        <div className={styles.copy}>
          <Reveal as="h2" className={styles.lead}>
            A product designer who treats research, interface, motion, and the build as{' '}
            <em>one continuous craft.</em>
          </Reveal>
          <div className={styles.body}>
            <Reveal as="p" i={1}>
              I'm Lukas Ahlse, a product designer based in Stockholm. Most recently at{' '}
              <strong>Sony Nimway</strong>, I designed smart-office products deployed
              internationally — across web, app, and large-format screens.
            </Reveal>
            <Reveal as="p" i={2}>
              I'm curious by default — I like understanding <em>why</em> a product should work a
              certain way, then sweating the details until it feels right for the people using it. I
              love owning my work and pushing it forward independently, and I'm every bit as happy
              building alongside a team. Lately I've been more hands-on in code, learning where AI
              actually helps.
            </Reveal>
          </div>
        </div>

        <Reveal className={styles.visual} i={2}>
          <StudioVisual />
        </Reveal>
      </div>
    </section>
  )
}
