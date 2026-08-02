import { create } from 'zustand'

interface DrawerStore<T> {
  isOpen: boolean
  data: T | null
  open: (data?: T) => void
  close: () => void
}

export function createDrawerStore<T = void>() {
  return create<DrawerStore<T>>((set) => ({
    isOpen: false,
    data: null,
    open: (data) => set({ isOpen: true, data: data ?? null }),
    close: () => set({ isOpen: false, data: null })
  }))
}
