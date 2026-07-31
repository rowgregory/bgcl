import { IClubResource } from '@/types/entities/club-resource'
import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface ClubResourceStatePayload {
  // Core data
  clubResources: IClubResource[]
  clubResource: IClubResource | null

  // UI state
  loading: boolean
  hasClubResource: boolean
  clubResourceDrawer: boolean

  selectedClubResourceId: string | null

  // Error handling
  error: string | null
}

const initialClubResourceState: ClubResourceStatePayload = {
  // Core data
  clubResources: [],
  clubResource: null,

  // UI state
  loading: false,
  hasClubResource: false,
  clubResourceDrawer: false,

  selectedClubResourceId: null,

  // Error handling
  error: null
}

export const clubResourceSlice = createSlice({
  name: 'clubResource',
  initialState: initialClubResourceState,
  reducers: {
    hydrateAllClubResource: (state, { payload }) => {
      state.clubResources = payload
    },
    hydrateClubResource: (state, { payload }) => {
      state.clubResource = payload
    },
    resetClubResource: (state) => {
      state.error = null
      state.clubResource = null
    },
    setOpenClubResourceDrawer: (state) => {
      state.clubResourceDrawer = true
    },
    setCloseClubResourceDrawer: (state) => {
      state.clubResourceDrawer = false
    },
    setSelectedClubResource: (state, { payload }) => {
      state.selectedClubResourceId = payload
    }
  }
})

export const clubResourceReducer = clubResourceSlice.reducer as Reducer<ClubResourceStatePayload>

export const {
  hydrateAllClubResource,
  hydrateClubResource,
  resetClubResource,
  setCloseClubResourceDrawer,
  setOpenClubResourceDrawer,
  setSelectedClubResource
} = clubResourceSlice.actions
