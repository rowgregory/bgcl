import { create } from 'zustand'

interface ConfettiState {
  isActive: boolean
  show: () => void
  hide: () => void
  /** Fires confetti and clears it after `ms`. */
  burst: (ms?: number) => void
}

export const useConfettiStore = create<ConfettiState>((set) => ({
  isActive: false,
  show: () => set({ isActive: true }),
  hide: () => set({ isActive: false }),
  burst: (ms = 4000) => {
    set({ isActive: true })
    setTimeout(() => set({ isActive: false }), ms)
  }
}))
