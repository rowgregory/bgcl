import { EventWithTickets } from '@/types/entities/event'
import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface EventStatePayload {
  // Core data
  events: EventWithTickets[]
  event: EventWithTickets | null

  // UI state
  loading: boolean
  hasEvents: boolean
  eventDrawer: boolean
  eventTicketDrawer: boolean

  // Error handling
  error: string | null
}

const initialEventState: EventStatePayload = {
  // Core data
  events: [],
  event: null,

  // UI state
  loading: false,
  hasEvents: false,
  eventDrawer: false,
  eventTicketDrawer: false,

  // Error handling
  error: null
}

export const eventSlice = createSlice({
  name: 'event',
  initialState: initialEventState,
  reducers: {
    // Add a new ticket to an event
    addEventTicketToState: (state, { payload }) => {
      const event = state.events.find((e) => e.id === payload.eventId)
      if (event) {
        event.tickets.push(payload.ticket)
      }
    },
    addEventToState: (state, { payload }) => {
      state.events.push(payload)
    },
    // Delete a ticket from an event
    deleteEventTicket: (state, { payload }) => {
      const event = state.events.find((e) => e.id === payload.eventId)
      if (event) {
        event.tickets = event.tickets.filter((t) => t.id !== payload.ticketId)
      }
    },
    hydrateEvent: (state, { payload }) => {
      state.event = payload
    },
    hydrateEvents: (state, { payload }) => {
      state.events = payload
    },
    removeEventFromState: (state, { payload }) => {
      state.events = state.events.filter((event: { id: string }) => event?.id !== payload)
    },
    resetEvent: (state) => {
      state.error = null
      state.event = null
    },
    setOpenEventDrawer: (state) => {
      state.eventDrawer = true
    },
    setCloseEventDrawer: (state) => {
      state.eventDrawer = false
    },
    setOpenEventTicketDrawer: (state) => {
      state.eventTicketDrawer = true
    },
    setCloseEventTicketDrawer: (state) => {
      state.eventTicketDrawer = false
    },
    updateEventInState: (state, { payload }) => {
      console.log('payload: ', payload)
      const index = state.events.findIndex((p: { id: string }) => p.id === payload.id)

      if (index !== -1) {
        state.events[index] = { ...state.events[index], ...payload }
      }
    },
    // Update an existing ticket
    updateEventTicketInState: (state, { payload }) => {
      const event = state.events.find((e) => e.id === payload.eventId)
      if (event) {
        const ticketIndex = event.tickets.findIndex((t) => t.id === payload.ticketId)
        if (ticketIndex !== -1) {
          event.tickets[ticketIndex] = {
            ...event.tickets[ticketIndex],
            ...payload.updates
          }
        }
      }
    }
  }
})

export const eventReducer = eventSlice.reducer as Reducer<EventStatePayload>

export const {
  addEventTicketToState,
  addEventToState,
  deleteEventTicket,
  hydrateEvent,
  hydrateEvents,
  removeEventFromState,
  resetEvent,
  setCloseEventDrawer,
  setOpenEventDrawer,
  setOpenEventTicketDrawer,
  setCloseEventTicketDrawer,
  updateEventInState,
  updateEventTicketInState
} = eventSlice.actions
