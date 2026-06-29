import { createElement, type ElementType, type ReactNode } from 'react'
import { useReveal } from '../../hooks/useReveal'

interface RevealProps {
  /** Element/tag to render (default 'div'). */
  as?: ElementType
  /** Stagger index → --i (≈90ms steps). */
  i?: number
  className?: string
  children: ReactNode
  [key: string]: unknown
}

/**
 * Wraps the global `[data-reveal]` reveal primitive with its own
 * IntersectionObserver, so any element fades/slides in on scroll with an
 * optional `--i` stagger.
 */
export function Reveal({ as = 'div', i, className, children, ...rest }: RevealProps) {
  const ref = useReveal<HTMLElement>()
  return createElement(
    as,
    {
      ref,
      'data-reveal': true,
      className,
      style: i != null ? ({ '--i': i } as React.CSSProperties) : undefined,
      ...rest,
    },
    children,
  )
}
