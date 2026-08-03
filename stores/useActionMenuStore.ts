import { create } from 'zustand'

interface ActionMenuState {
  isOpen: boolean
  /** id of the expanded submenu, or null when none is open */
  openSubmenu: string | null

  open: () => void
  close: () => void
  toggle: () => void
  setOpenSubmenu: (id: string | null) => void
  toggleSubmenu: (id: string) => void
}

export const useActionMenuStore = create<ActionMenuState>((set) => ({
  isOpen: false,
  openSubmenu: null,

  open: () => set({ isOpen: true }),
  // closing the menu collapses any expanded submenu with it
  close: () => set({ isOpen: false, openSubmenu: null }),
  toggle: () => set((s) => (s.isOpen ? { isOpen: false, openSubmenu: null } : { isOpen: true })),

  setOpenSubmenu: (id) => set({ openSubmenu: id }),
  toggleSubmenu: (id) => set((s) => ({ openSubmenu: s.openSubmenu === id ? null : id }))
}))
