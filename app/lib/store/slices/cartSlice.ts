import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface CartItem {
  ticketId: string
  ticketName: string
  price: number
  quantity: number
  eventId: string
  type: string
}

interface CartState {
  items: CartItem[]
  isCheckingOut: boolean
}

const initialState: CartState = {
  items: [],
  isCheckingOut: false
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, { payload }) => {
      const { ticket, quantity, eventId } = payload
      const existingItem = state.items.find((item) => item.ticketId === ticket.id && item.eventId === eventId)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({
          ticketId: ticket.id,
          ticketName: ticket.name,
          price: ticket.price,
          type: ticket.type,
          quantity,
          eventId
        })
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.ticketId !== action.payload)
    },

    updateQuantity: (state, action: PayloadAction<{ ticketId: string; quantity: number }>) => {
      const item = state.items.find((item) => item.ticketId === action.payload.ticketId)
      if (item) {
        item.quantity = action.payload.quantity
      }
    },

    clearCart: (state) => {
      state.items = []
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
export const cartReducer = cartSlice.reducer

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
export const selectCartCount = (state: RootState) => state.cart.items.reduce((count, item) => count + item.quantity, 0)
