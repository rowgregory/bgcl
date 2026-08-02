import { create } from 'zustand'

interface NavigationState {
  mobileNavigation: boolean
  openMobileNavigation: () => void
  closeMobileNavigation: () => void
  toggleMobileNavigation: () => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  mobileNavigation: false,
  openMobileNavigation: () => set({ mobileNavigation: true }),
  closeMobileNavigation: () => set({ mobileNavigation: false }),
  toggleMobileNavigation: () => set((s) => ({ mobileNavigation: !s.mobileNavigation }))
}))
