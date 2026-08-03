import { create } from 'zustand'
import type { Ticket } from '@prisma/client'

type ToastTicket = Ticket & { eventTitle?: string }

interface AddToCartToastState {
  isOpen: boolean
  ticket: ToastTicket | null
  quantity: number
  show: (ticket: ToastTicket, quantity: number) => void
  hide: () => void
}

export const useAddToCartToast = create<AddToCartToastState>((set) => ({
  isOpen: false,
  ticket: null,
  quantity: 0,
  show: (ticket, quantity) => set({ isOpen: true, ticket, quantity }),
  hide: () => set({ isOpen: false, ticket: null, quantity: 0 })
}))
