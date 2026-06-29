import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface StartModalValue {
  open: boolean
  openModal: () => void
  close: () => void
}

const StartModalContext = createContext<StartModalValue | null>(null)

/**
 * Controls the contact modal — a dialog that opens over the current page (the
 * page behind it is blurred). Locks body scroll and closes on Escape.
 */
export function StartModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  const openModal = useCallback(() => setOpen(true), [])
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    document.body.classList.toggle('modal-open', open)
    return () => document.body.classList.remove('modal-open')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const value = useMemo(() => ({ open, openModal, close }), [open, openModal, close])
  return <StartModalContext.Provider value={value}>{children}</StartModalContext.Provider>
}

export function useStartModal(): StartModalValue {
  const ctx = useContext(StartModalContext)
  if (!ctx) throw new Error('useStartModal must be used within StartModalProvider')
  return ctx
}
