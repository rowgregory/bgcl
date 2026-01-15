import { Ticket } from '@/types/entities/ticket'
import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface TicketStatePayload {
  // Core data
  tickets: Ticket[]
  ticket: Ticket

  // UI state
  loading: boolean
  hasTickets: boolean
  ticketDrawer: boolean
  ticketSelectionDrawer: boolean

  // Error handling
  error: string | null
}

const initialTicketState: TicketStatePayload = {
  // Core data
  tickets: [],
  ticket: null,

  // UI state
  loading: false,
  hasTickets: false,
  ticketDrawer: false,
  ticketSelectionDrawer: false,

  // Error handling
  error: null
}

export const ticketSlice = createSlice({
  name: 'ticket',
  initialState: initialTicketState,
  reducers: {
    hydrateTicket: (state, { payload }) => {
      state.ticket = payload
    },
    hydrateTickets: (state, { payload }) => {
      state.tickets = payload
    },
    resetTicket: (state) => {
      state.error = null
      state.ticket = null
    },
    setOpenTicketDrawer: (state) => {
      state.ticketDrawer = true
    },
    setCloseTicketDrawer: (state) => {
      state.ticketDrawer = false
    },
    setOpenTicketSelectionDrawer: (state) => {
      state.ticketSelectionDrawer = true
    },
    setCloseTicketSelectionDrawer: (state) => {
      state.ticketSelectionDrawer = false
    }
  }
})

export const ticketReducer = ticketSlice.reducer as Reducer<TicketStatePayload>

export const {
  hydrateTicket,
  hydrateTickets,
  resetTicket,
  setCloseTicketDrawer,
  setOpenTicketDrawer,
  setCloseTicketSelectionDrawer,
  setOpenTicketSelectionDrawer
} = ticketSlice.actions
