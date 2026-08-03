import { create } from 'zustand'

interface SidebarState {
  adminSidebar: boolean
  programSidebar: boolean
  toggleAdminSidebar: () => void
  closeAdminSidebar: () => void
  toggleProgramSidebar: () => void
  closeProgramSidebar: () => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  adminSidebar: false,
  programSidebar: false,
  toggleAdminSidebar: () => set((s) => ({ adminSidebar: !s.adminSidebar })),
  closeAdminSidebar: () => set({ adminSidebar: false }),
  toggleProgramSidebar: () => set((s) => ({ programSidebar: !s.programSidebar })),
  closeProgramSidebar: () => set({ programSidebar: false })
}))
