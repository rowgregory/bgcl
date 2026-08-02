import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ITicket } from '@/types/entities/ticket'
import { TicketType } from '@prisma/client'

export interface CartItem {
  ticketId: string
  ticketName: string
  eventId: string
  eventTitle: string
  price: number
  quantity: number
  maxAvailable: number
  ticketDescription: string | null
  ticketType: TicketType
  isRaffleTicket: boolean
  ticketSalesStartDate: Date
  ticketSalesEndDate: Date
  guestCount: number
}

interface CartState {
  items: CartItem[]
  isCheckingOut: boolean
  lastUpdated: string | null

  addToCart: (ticket: ITicket, quantity: number) => void
  removeFromCart: (ticketId: string) => void
  updateQuantity: (ticketId: string, quantity: number) => void
  clearCart: () => void
  setIsCheckingOut: (checkingOut: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isCheckingOut: false,
      lastUpdated: null,

      addToCart: (ticket, quantity) =>
        set((s) => {
          const existing = s.items.find((i) => i.ticketId === ticket.id && i.eventId === ticket.eventId)

          const items = existing
            ? s.items.map((i) =>
                i.ticketId === ticket.id && i.eventId === ticket.eventId
                  ? { ...i, quantity: Math.min(i.quantity + quantity, i.maxAvailable) }
                  : i
              )
            : [
                ...s.items,
                {
                  ticketId: ticket.id,
                  ticketName: ticket.name,
                  ticketDescription: ticket.description ?? null,
                  ticketType: ticket.ticketType ?? 'GENERAL',
                  isRaffleTicket: ticket.isRaffleTicket ?? false,
                  eventId: ticket.eventId,
                  eventTitle: ticket.eventTitle,
                  price: ticket.price,
                  quantity,
                  maxAvailable: ticket.totalQuantity - ticket.quantitySold,
                  ticketSalesStartDate: ticket.ticketSalesStartDate,
                  ticketSalesEndDate: ticket.ticketSalesEndDate,
                  guestCount: ticket.guestCount
                }
              ]

          return { items, lastUpdated: new Date().toISOString() }
        }),

      removeFromCart: (ticketId) =>
        set((s) => ({
          items: s.items.filter((i) => i.ticketId !== ticketId),
          lastUpdated: new Date().toISOString()
        })),

      updateQuantity: (ticketId, quantity) =>
        set((s) => {
          const qty = Number(quantity)
          if (Number.isNaN(qty)) return s
          return {
            items: s.items.map((i) =>
              i.ticketId === ticketId ? { ...i, quantity: Math.max(1, Math.min(qty, i.maxAvailable)) } : i
            ),
            lastUpdated: new Date().toISOString()
          }
        }),

      clearCart: () => set({ items: [], isCheckingOut: false, lastUpdated: new Date().toISOString() }),

      setIsCheckingOut: (isCheckingOut) => set({ isCheckingOut })
    }),
    {
      name: 'bgcl-cart',
      partialize: (s) => ({ items: s.items, lastUpdated: s.lastUpdated })
    }
  )
)

// ── Derived values (call as hooks in components) ──────────────────────────────
export const useCartCount = () => useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0))

export const useCartTotal = () => useCartStore((s) => s.items.reduce((acc, i) => acc + i.price * i.quantity, 0))

export const useCartItemByTicketId = (ticketId: string) =>
  useCartStore((s) => s.items.find((i) => i.ticketId === ticketId))
