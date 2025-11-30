// store/slices/statsSlice.ts
import { AdminStats } from "@/types/admin";
import { createSlice, PayloadAction, Reducer } from "@reduxjs/toolkit";

interface StatsStatePayload {
  stats: AdminStats | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null; // Track when stats were last refreshed
}

const initialState: StatsStatePayload = {
  stats: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    hydrateStats: (state, action: PayloadAction<AdminStats>) => {
      state.stats = action.payload;
      state.error = null;
      state.lastUpdated = new Date().toISOString();
    },
    setStats: (state, action: PayloadAction<AdminStats>) => {
      state.stats = action.payload;
      state.error = null;
      state.lastUpdated = new Date().toISOString();
    },
    // Incremental updates for specific stat changes
    incrementUserCount: (state) => {
      if (state.stats) {
        state.stats.users.total += 1;
      }
    },
    decrementUserCount: (state) => {
      if (state.stats) {
        state.stats.users.total -= 1;
      }
    },
    incrementEventCount: (state) => {
      if (state.stats) {
        state.stats.events.total += 1;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearStats: (state) => {
      state.stats = null;
      state.error = null;
      state.lastUpdated = null;
    },
  },
});

export const statsReducer = statsSlice.reducer as Reducer<StatsStatePayload>;

export const {
  hydrateStats,
  setStats,
  incrementUserCount,
  decrementUserCount,
  incrementEventCount,
  setLoading,
  setError,
  clearStats,
} = statsSlice.actions;
