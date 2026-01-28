import { createSlice } from '@reduxjs/toolkit'

interface DashboardState {
  loading: boolean
  error: string | null
  actionMenu: boolean
  adminSidebar: boolean
  programSidebar: boolean
  itemAction: string | null
  failedPaymentDrawer: boolean
  failedPayments: null | any
  donationDrawer: boolean
  donation: any | null
}

const initialState: DashboardState = {
  loading: true,
  error: null,
  actionMenu: false,
  adminSidebar: false,
  programSidebar: false,
  itemAction: null,
  failedPaymentDrawer: false,
  failedPayments: null,
  donationDrawer: false,
  donation: null
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
    },
    setOpenFailedPaymentDrawer: (state, { payload }) => {
      state.failedPaymentDrawer = true
      state.failedPayments = payload
    },
    setCloseFailedPaymentDrawer: (state) => {
      state.failedPaymentDrawer = false
      state.failedPayments = null
    },
    setOpenDonationDrawer: (state, { payload }) => {
      state.donationDrawer = true
      state.donation = payload
    },
    setCloseDonationDrawer: (state) => {
      state.donationDrawer = false
      state.donation = null
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
  setToggleProgramSidebar,
  setCloseFailedPaymentDrawer,
  setOpenFailedPaymentDrawer,
  setCloseDonationDrawer,
  setOpenDonationDrawer
} = dashboardSlice.actions

export const dashboardReducer = dashboardSlice.reducer
