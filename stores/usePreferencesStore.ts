import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PreferencesState {
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
      isDark: false,
      isSpanish: false,
      soundOn: true,

      setIsDark: (isDark) => set({ isDark }),
      toggleDark: () => set((s) => ({ isDark: !s.isDark })),

      setIsSpanish: (isSpanish) => set({ isSpanish }),
      toggleLanguage: () => set((s) => ({ isSpanish: !s.isSpanish })),

      setSoundOn: (soundOn) => set({ soundOn }),
      toggleSound: () => set((s) => ({ soundOn: !s.soundOn }))
    }),
    { name: 'bgcl-preferences' }
  )
)
