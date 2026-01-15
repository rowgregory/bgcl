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

  selectedEventId: string | null

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

  selectedEventId: null,

  // Error handling
  error: null
}

export const eventSlice = createSlice({
  name: 'event',
  initialState: initialEventState,
  reducers: {
    hydrateEvent: (state, { payload }) => {
      state.event = payload
    },
    hydrateEvents: (state, { payload }) => {
      state.events = payload
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
    setSelectedEvent: (state, { payload }) => {
      state.selectedEventId = payload
    }
  }
})

export const eventReducer = eventSlice.reducer as Reducer<EventStatePayload>

export const { hydrateEvent, hydrateEvents, resetEvent, setCloseEventDrawer, setOpenEventDrawer, setSelectedEvent } =
  eventSlice.actions
