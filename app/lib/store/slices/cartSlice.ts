import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Ticket } from '@prisma/client'

export interface CartItem {
  ticketId: string
  ticketName: string
  eventId: string
  eventTitle: string
  price: number
  quantity: number
  maxAvailable: number
}

interface CartState {
  items: CartItem[]
  isCheckingOut: boolean
  lastUpdated: string | null
}

const initialState: CartState = {
  items: [],
  isCheckingOut: false,
  lastUpdated: null
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ ticket: Ticket; quantity: number; eventId: string; eventTitle: string }>
    ) => {
      const { ticket, quantity, eventId, eventTitle } = action.payload
      const existingItem = state.items.find((item) => item.ticketId === ticket.id && item.eventId === eventId)

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
        existingItem.quantity = Math.min(newQuantity, existingItem.maxAvailable)
      } else {
        state.items.push({
          ticketId: ticket.id,
          ticketName: ticket.name,
          eventId,
          eventTitle,
          price: ticket.price,
          quantity,
          maxAvailable: ticket.totalQuantity - ticket.quantitySold
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
    }
  }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, setIsCheckingOut, setIsNotCheckingOut } =
  cartSlice.actions

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartCount = (state: RootState) => state.cart.items.reduce((acc, item) => acc + item.quantity, 0)
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
export const selectIsCheckingOut = (state: RootState) => state.cart.isCheckingOut
export const selectCartItemByTicketId = (ticketId: string) => (state: RootState) =>
  state.cart.items.find((item) => item.ticketId === ticketId)

export const cartReducer = cartSlice.reducer
