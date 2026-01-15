import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface AdminStatePayload {
  loading: boolean
  selectedTimeframe: string
  selectedPage: string
  isActionsOpen: boolean
  isDrawerOpen: boolean

  // Form drawers
  addStaffDrawer: boolean
  announcementDrawer: boolean
}

const initialAdminState: AdminStatePayload = {
  loading: false,
  selectedTimeframe: 'week',
  selectedPage: 'mission-control',
  isActionsOpen: false,
  isDrawerOpen: false,

  addStaffDrawer: false,
  announcementDrawer: false
}

export const adminSlice = createSlice({
  name: 'admin',
  initialState: initialAdminState,
  reducers: {
    setSelectedTimeframe: (state, action) => {
      state.selectedTimeframe = action.payload
    },
    setSelectedPage: (state, action) => {
      state.selectedPage = action.payload
    },
    toggleActionsDropdown: (state) => {
      state.isActionsOpen = !state.isActionsOpen
    },
    setCloseActionsDropdown: (state) => {
      state.isActionsOpen = false
    },
    setOpenActionsDropdown: (state) => {
      state.isActionsOpen = true
    },
    toggleNavigationDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen
    },
    setOpenNavigationDrawer: (state) => {
      state.isDrawerOpen = true
    },
    setCloseNavigationDrawer: (state) => {
      state.isDrawerOpen = false
    }
  }
})

export const adminReducer = adminSlice.reducer as Reducer<AdminStatePayload>

export const {
  setSelectedTimeframe,
  setSelectedPage,
  toggleActionsDropdown,
  setCloseActionsDropdown,
  setOpenActionsDropdown,
  toggleNavigationDrawer,
  setOpenNavigationDrawer,
  setCloseNavigationDrawer
} = adminSlice.actions
