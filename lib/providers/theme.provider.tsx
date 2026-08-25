'use client'

import { useEffect, useState, ReactNode } from 'react'
import { usePreferencesStore } from '@/stores/usePreferencesStore'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = usePreferencesStore((s) => s.theme)
  const setIsDark = usePreferencesStore((s) => s.setIsDark)

  const [systemPrefersDark, setSystemPrefersDark] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemPrefersDark(query.matches)

    const onChange = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const isDark = theme === 'system' ? systemPrefersDark : theme === 'dark'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    setIsDark(isDark)
  }, [isDark, setIsDark])

  return <>{children}</>
}
