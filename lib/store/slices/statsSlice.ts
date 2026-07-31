// store/slices/statsSlice.ts
import { AdminStats } from '@/types/admin'
import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit'

interface StatsStatePayload {
  stats: AdminStats | null
  isLoading: boolean
  error: string | null
  lastUpdated: string | null // Track when stats were last refreshed
}

const initialState: StatsStatePayload = {
  stats: null,
  isLoading: false,
  error: null,
  lastUpdated: null
}

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    hydrateStats: (state, action: PayloadAction<AdminStats>) => {
      state.stats = action.payload
      state.error = null
      state.lastUpdated = new Date().toISOString()
    },
    setStats: (state, action: PayloadAction<AdminStats>) => {
      state.stats = action.payload
      state.error = null
      state.lastUpdated = new Date().toISOString()
    },
    clearStats: (state) => {
      state.stats = null
      state.error = null
      state.lastUpdated = null
    }
  }
})

export const statsReducer = statsSlice.reducer as Reducer<StatsStatePayload>

export const { hydrateStats, setStats, clearStats } = statsSlice.actions
