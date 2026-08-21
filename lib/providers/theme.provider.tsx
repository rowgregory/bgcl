'use client'

import { useEffect, ReactNode } from 'react'
import { usePreferencesStore } from '@/stores/usePreferencesStore'

const STORAGE_KEY = 'bgcl-preferences'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const isDark = usePreferencesStore((s) => s.isDark)

  // Seed from the system preference only when the user has never chosen
  useEffect(() => {
    const hasStoredPreference = (() => {
      try {
        return Boolean(localStorage.getItem(STORAGE_KEY))
      } catch {
        return false
      }
    })()

    if (hasStoredPreference) return

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    usePreferencesStore.getState().setIsDark(prefersDark)
  }, [])

  // The store drives the class, not the other way around
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return <>{children}</>
}
