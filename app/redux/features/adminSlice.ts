import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface AdminStatePayload {
  loading: boolean
  selectedTimeframe: string
  selectedPage: string
  isActionsOpen: boolean
  isDrawerOpen: boolean

  // View drawers
  familiesViewDrawer: boolean
  enrollmentsViewDrawer: boolean
  attendanceViewDrawer: boolean
  programsManagerDrawer: boolean
  eventsManagerDrawer: boolean
  donationReportsDrawer: boolean

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

  familiesViewDrawer: false,
  enrollmentsViewDrawer: false,
  attendanceViewDrawer: false,
  programsManagerDrawer: false,
  eventsManagerDrawer: false,
  donationReportsDrawer: false,

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
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },

    // Families View
    setOpenFamiliesViewDrawer: (state) => {
      state.familiesViewDrawer = true
    },
    setCloseFamiliesViewDrawer: (state) => {
      state.familiesViewDrawer = false
    },

    // Enrollments View
    setOpenEnrollmentsViewDrawer: (state) => {
      state.enrollmentsViewDrawer = true
    },
    setCloseEnrollmentsViewDrawer: (state) => {
      state.enrollmentsViewDrawer = false
    },

    // Attendance View
    setOpenAttendanceViewDrawer: (state) => {
      state.attendanceViewDrawer = true
    },
    setCloseAttendanceViewDrawer: (state) => {
      state.attendanceViewDrawer = false
    },

    // Programs Manager
    setOpenProgramsManagerDrawer: (state) => {
      state.programsManagerDrawer = true
    },
    setCloseProgramsManagerDrawer: (state) => {
      state.programsManagerDrawer = false
    },

    // Events Manager
    setOpenEventsManagerDrawer: (state) => {
      state.eventsManagerDrawer = true
    },
    setCloseEventsManagerDrawer: (state) => {
      state.eventsManagerDrawer = false
    },

    // Donation Reports
    setOpenDonationReportsDrawer: (state) => {
      state.donationReportsDrawer = true
    },
    setCloseDonationReportsDrawer: (state) => {
      state.donationReportsDrawer = false
    },

    // Add Staff
    setOpenAddStaffDrawer: (state) => {
      state.addStaffDrawer = true
    },
    setCloseAddStaffDrawer: (state) => {
      state.addStaffDrawer = false
    },

    // Announcement
    setOpenAnnouncementDrawer: (state) => {
      state.announcementDrawer = true
    },
    setCloseAnnouncementDrawer: (state) => {
      state.announcementDrawer = false
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
  setCloseNavigationDrawer,
  setLoading,

  setOpenFamiliesViewDrawer,
  setCloseFamiliesViewDrawer,
  setOpenEnrollmentsViewDrawer,
  setCloseEnrollmentsViewDrawer,
  setOpenAttendanceViewDrawer,
  setCloseAttendanceViewDrawer,
  setOpenProgramsManagerDrawer,
  setCloseProgramsManagerDrawer,
  setOpenEventsManagerDrawer,
  setCloseEventsManagerDrawer,
  setOpenDonationReportsDrawer,
  setCloseDonationReportsDrawer,
  setOpenAddStaffDrawer,
  setCloseAddStaffDrawer,
  setOpenAnnouncementDrawer,
  setCloseAnnouncementDrawer
} = adminSlice.actions
