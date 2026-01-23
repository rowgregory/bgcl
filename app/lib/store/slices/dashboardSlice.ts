import { createSlice } from '@reduxjs/toolkit'

interface DashboardState {
  loading: boolean
  error: string | null
  actionMenu: boolean
  adminSidebar: boolean
  programSidebar: boolean
  itemAction: string | null
}

const initialState: DashboardState = {
  loading: true,
  error: null,
  actionMenu: false,
  adminSidebar: false,
  programSidebar: false,
  itemAction: null
}
export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setOpenActionMenu: (state) => {
      state.actionMenu = true
    },
    setCloseActionMenu: (state) => {
      state.actionMenu = false
    },
    setOpenAdminSidebar: (state) => {
      state.adminSidebar = true
    },
    setCloseAdminSidebar: (state) => {
      state.adminSidebar = false
    },
    setToggleAdminSidebar: (state, { payload }) => {
      state.adminSidebar = !payload
    },
    setOpenProgramSidebar: (state) => {
      state.programSidebar = true
    },
    setCloseProgramSidebar: (state) => {
      state.programSidebar = false
    },
    setToggleProgramSidebar: (state, { payload }) => {
      state.programSidebar = !payload
    },
    setOpenActionDropdownSubmenu: (state, { payload }) => {
      state.itemAction = payload
    },
    setCloseActionDropdownSubmenu: (state) => {
      state.itemAction = null
    }
  }
})

export const {
  setOpenActionMenu,
  setCloseActionMenu,
  setCloseAdminSidebar,
  setOpenAdminSidebar,
  setToggleAdminSidebar,
  setCloseActionDropdownSubmenu,
  setOpenActionDropdownSubmenu,
  setOpenProgramSidebar,
  setCloseProgramSidebar,
  setToggleProgramSidebar
} = dashboardSlice.actions
export const dashboardReducer = dashboardSlice.reducer
