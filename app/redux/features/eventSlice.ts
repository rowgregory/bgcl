import { IEvent } from "@/types/entities/event";
import { Reducer, createSlice } from "@reduxjs/toolkit";

export interface EventStatePayload {
  // Core data
  events: IEvent[];
  event: IEvent | null;

  // UI state
  loading: boolean;
  hasEvents: boolean;
  eventDrawer: boolean;

  // Error handling
  error: string | null;
}

const initialEventState: EventStatePayload = {
  // Core data
  events: [],
  event: null,

  // UI state
  loading: false,
  hasEvents: false,
  eventDrawer: false,

  // Error handling
  error: null,
};

export const eventSlice = createSlice({
  name: "event",
  initialState: initialEventState,
  reducers: {
    addEventToState: (state, { payload }) => {
      state.events.push(payload);
    },
    hydrateEvent: (state, { payload }) => {
      state.event = payload;
    },
    hydrateEvents: (state, { payload }) => {
      state.events = payload;
    },
    removeEventFromState: (state, action) => {
      state.events = state.events.filter(
        (event: { id: string }) => event?.id !== action.payload
      );
    },
    resetEvent: (state) => {
      state.error = null;
      state.event = null;
    },
    setOpenEventDrawer: (state) => {
      state.eventDrawer = true;
    },
    setCloseEventDrawer: (state) => {
      state.eventDrawer = false;
    },
    updateEventInState: (state, { payload }) => {
      const index = state.events.findIndex(
        (p: { id: string }) => p.id === payload.id
      );

      if (index !== -1) {
        state.events[index] = { ...state.events[index], ...payload.data };
      }
    },
  },
});

export const eventReducer = eventSlice.reducer as Reducer<EventStatePayload>;

export const {
  addEventToState,
  hydrateEvent,
  hydrateEvents,
  removeEventFromState,
  resetEvent,
  setCloseEventDrawer,
  setOpenEventDrawer,
  updateEventInState,
} = eventSlice.actions;
