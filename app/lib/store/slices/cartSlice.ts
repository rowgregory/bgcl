import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
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
  ticketDescription: string
  ticketType: TicketType
  isRaffleTicket: boolean
  ticketSalesStartDate: Date
  ticketSalesEndDate: Date
  guestCount: number
}

interface AddToCartToastProps {
  ticket: {
    id: string
    name: string
    eventId: string
    eventTitle: string
    price: number
    totalQuantity: number
    quantitySold: number
    description?: string | null
    ticketType?: 'GENERAL' | 'RAFFLE' | 'TOURNAMENT' | 'SPONSORSHIP' | null
    isRaffleTicket?: boolean
  } | null
  quantity: number
  visible: boolean
  onClose: () => void
  cartCount: number
}

interface CartState {
  items: CartItem[] | null
  isCheckingOut: boolean
  lastUpdated: string | null
  addToCartToast: boolean
  item: AddToCartToastProps | null
}

const initialState: CartState = {
  items: [],
  isCheckingOut: false,
  lastUpdated: null,
  addToCartToast: false,
  item: null
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ ticket: ITicket; quantity: number }>) => {
      const { ticket, quantity } = action.payload
      if (!state.items) state.items = []
      const existingItem = state.items.find((item) => item.ticketId === ticket.id && item.eventId === ticket.eventId)

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
        existingItem.quantity = Math.min(newQuantity, existingItem.maxAvailable)
      } else {
        state.items.push({
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
        })
      }

      state.lastUpdated = new Date().toISOString()
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.ticketId !== action.payload)
      state.lastUpdated = new Date().toISOString()
    },

    updateQuantity: (state, action: PayloadAction<{ ticketId: string; quantity: number }>) => {
      const item = state.items.find((item) => item.ticketId === action.payload.ticketId)
      if (item) {
        const qty = Number(action.payload.quantity)
        if (isNaN(qty)) return
        const clamped = Math.max(1, Math.min(qty, item.maxAvailable))
        item.quantity = clamped
        state.lastUpdated = new Date().toISOString()
      }
    },

    clearCart: (state) => {
      state.items = []
      state.isCheckingOut = false
      state.lastUpdated = new Date().toISOString()
    },

    setIsCheckingOut: (state) => {
      state.isCheckingOut = true
    },

    setIsNotCheckingOut: (state) => {
      state.isCheckingOut = false
    },
    setOpenAddToCartToast: (state, { payload }) => {
      state.addToCartToast = true
      state.item = payload
    },
    setCloseAddToCartToast: (state) => {
      state.addToCartToast = true
      state.item = null
    }
  }
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setIsCheckingOut,
  setIsNotCheckingOut,
  setCloseAddToCartToast,
  setOpenAddToCartToast
} = cartSlice.actions

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartCount = (state: RootState) => state.cart.items.reduce((acc, item) => acc + item.quantity, 0)
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
export const selectIsCheckingOut = (state: RootState) => state.cart.isCheckingOut
export const selectCartItemByTicketId = (ticketId: string) => (state: RootState) =>
  state.cart.items.find((item) => item.ticketId === ticketId)

export const cartReducer = cartSlice.reducer
