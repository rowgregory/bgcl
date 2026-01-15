import { createSlice } from '@reduxjs/toolkit'

interface DashboardState {
  loading: boolean
  error: string | null
  actionMenu: boolean
  sidebar: boolean
  itemAction: string | null
}

const initialState: DashboardState = {
  loading: true,
  error: null,
  actionMenu: false,
  sidebar: false,
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
    setOpenSidebar: (state) => {
      state.sidebar = true
    },
    setCloseSidebar: (state) => {
      state.sidebar = false
    },
    setToggleAdminSidebar: (state, { payload }) => {
      state.sidebar = !payload
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
  setCloseSidebar,
  setOpenSidebar,
  setToggleAdminSidebar,
  setCloseActionDropdownSubmenu,
  setOpenActionDropdownSubmenu
} = dashboardSlice.actions
export const dashboardReducer = dashboardSlice.reducer
