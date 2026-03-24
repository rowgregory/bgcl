import { IJobApplication } from '@/types/entities/job-application'
import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface UiStatePayload {
  partnerDrawer: boolean
  jobApplicationDrawer: boolean
  application: IJobApplication | null
}

const initialUiState: UiStatePayload = {
  partnerDrawer: false,
  jobApplicationDrawer: false,
  application: null
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUiState,
  reducers: {
    setClosePartnerDrawer: (state) => {
      state.partnerDrawer = false
    },
    setOpenPartnerDrawer: (state) => {
      state.partnerDrawer = true
    },
    setOpenJobApplicationDrawer: (state, { payload }) => {
      state.jobApplicationDrawer = true
      state.application = payload
    },
    setCloseJobApplicationDrawer: (state) => {
      state.jobApplicationDrawer = false
      state.application = null
    }
  }
})

export const uiReducer = uiSlice.reducer as Reducer<UiStatePayload>

export const {
  setClosePartnerDrawer,
  setOpenPartnerDrawer,
  setCloseJobApplicationDrawer,
  setOpenJobApplicationDrawer
} = uiSlice.actions
