import type { ReactNode } from 'react'
import { useReveal } from '../../hooks/useReveal'

/**
 * One line of a clip-revealing headline. Uses the global `.line-mask` styles;
 * the inner span slides up from the mask once `.is-in` lands on scroll.
 */
export function LineMask({ i, children }: { i?: number; children: ReactNode }) {
  const ref = useReveal<HTMLSpanElement>()
  return (
    <span className="line-mask" ref={ref}>
      <span style={i != null ? ({ '--i': i } as React.CSSProperties) : undefined}>{children}</span>
    </span>
  )
}
