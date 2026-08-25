import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

interface PreferencesState {
  theme: ThemeMode
  isDark: boolean
  isSpanish: boolean
  soundOn: boolean
  setIsDark: (isDark: boolean) => void
  toggleDark: () => void
  setIsSpanish: (isSpanish: boolean) => void
  toggleLanguage: () => void
  setSoundOn: (soundOn: boolean) => void
  toggleSound: () => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      isDark: false,
      isSpanish: false,
      soundOn: true,

      setTheme: (theme) => set({ theme }),
      setIsDark: (isDark) => set({ isDark }),
      toggleDark: () => set((s) => ({ isDark: !s.isDark })),

      setIsSpanish: (isSpanish) => set({ isSpanish }),
      toggleLanguage: () => set((s) => ({ isSpanish: !s.isSpanish })),

      setSoundOn: (soundOn) => set({ soundOn }),
      toggleSound: () => set((s) => ({ soundOn: !s.soundOn }))
    }),
    {
      name: 'bgcl-preferences',
      version: 1,
      // isDark is derived on every load, so persisting it would fight the resolver
      partialize: ({ theme, isSpanish, soundOn }) => ({ theme, isSpanish, soundOn }),
      migrate: (persisted, version) => {
        if (version === 0) {
          const { isDark, ...rest } = (persisted ?? {}) as { isDark?: boolean }
          return { ...rest, theme: 'system' as ThemeMode }
        }
        return persisted
      }
    }
  )
)
