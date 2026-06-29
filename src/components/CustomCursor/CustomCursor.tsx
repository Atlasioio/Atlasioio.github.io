import { useCustomCursor } from '../../hooks/useCustomCursor'
import './CustomCursor.css'

/**
 * The dot + ring elements. Positioning/state is driven imperatively by
 * useCustomCursor via stable ids + global classes (hence plain CSS, not a
 * module). Hidden on touch / coarse pointers and under reduced motion by CSS.
 */
export function CustomCursor() {
  useCustomCursor()
  return (
    <>
      <div className="cur-dot" id="cur-dot" aria-hidden="true" />
      <div className="cur-ring" id="cur-ring" aria-hidden="true">
        <span className="cur-label">View</span>
      </div>
    </>
  )
}
