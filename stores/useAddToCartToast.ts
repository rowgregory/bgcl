import { create } from 'zustand'
import { ITicket } from '@/types/entities/ticket'

interface AddToCartToastState {
  isOpen: boolean
  ticket: ITicket | null
  quantity: number
  show: (ticket: ITicket, quantity: number) => void
  hide: () => void
}

export const useAddToCartToast = create<AddToCartToastState>((set) => ({
  isOpen: false,
  ticket: null,
  quantity: 0,
  show: (ticket, quantity) => set({ isOpen: true, ticket, quantity }),
  hide: () => set({ isOpen: false, ticket: null, quantity: 0 })
}))
