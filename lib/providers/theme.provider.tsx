'use client'

import { useEffect, ReactNode } from 'react'
import { usePreferencesStore } from '@/stores/usePreferencesStore'

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const checkTheme = () => {
      const dark =
        document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches
      usePreferencesStore.getState().setIsDark(dark)
    }

    checkTheme()

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => checkTheme()

    mediaQuery.addEventListener('change', handleChange)

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
      observer.disconnect()
    }
  }, [])

  return <>{children}</>
}
