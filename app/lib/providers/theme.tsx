'use client'

import { useEffect, ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Check localStorage or system preference
    const storedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const isDark = storedTheme === 'dark' || (storedTheme === null && prefersDark)

    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return <>{children}</>
}
