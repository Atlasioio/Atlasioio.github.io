import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'EN' | 'SV'

interface LangContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangContextValue | null>(null)

/**
 * Currently visual-only (copy ships in EN; SV translations are TBD). Holding it
 * in context keeps the nav + footer toggles in sync and gives i18n a single
 * place to hook into later.
 */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('EN')
  const value = useMemo(() => ({ lang, setLang }), [lang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
