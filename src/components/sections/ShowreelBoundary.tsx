import { Component, type ReactNode } from 'react'

/**
 * Isolates the third-party YouTube embed: if the player ever throws, the hero
 * keeps rendering instead of the whole tree unmounting. Renders nothing on
 * failure (the showreel is decorative).
 */
export class ShowreelBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
