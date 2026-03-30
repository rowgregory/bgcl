import { IAddress } from '@/types/entities/address.types'
import { IJobApplication } from '@/types/entities/job-application'
import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface UiStatePayload {
  partnerDrawer: boolean
  jobApplicationDrawer: boolean
  application: IJobApplication | null
  addressModal: boolean
  address: IAddress | null
  confetti: boolean
  paymentMethodModal: boolean
  soundOn: boolean
}

const initialUiState: UiStatePayload = {
  partnerDrawer: false,
  jobApplicationDrawer: false,
  application: null,
  addressModal: false,
  address: null,
  confetti: false,
  paymentMethodModal: false,
  soundOn: false
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
    },
    setOpenUpdateAddressModal: (state, { payload }) => {
      state.addressModal = true
      state.address = payload
    },
    setCloseUpdateAddressModal: (state) => {
      state.addressModal = false
      state.address = null
    },
    setShowConfetti: (state) => {
      state.confetti = true
    },
    setHideConfetti: (state) => {
      state.confetti = false
    },
    setOpenPaymentMethodModal: (state) => {
      state.paymentMethodModal = true
    },
    setClosePaymentMethodModal: (state) => {
      state.paymentMethodModal = false
    },
    setSoundOn: (state, { payload }) => {
      state.soundOn = payload
    }
  }
})

export const uiReducer = uiSlice.reducer as Reducer<UiStatePayload>

export const {
  setClosePartnerDrawer,
  setOpenPartnerDrawer,
  setCloseJobApplicationDrawer,
  setOpenJobApplicationDrawer,
  setCloseUpdateAddressModal,
  setOpenUpdateAddressModal,
  setHideConfetti,
  setShowConfetti,
  setClosePaymentMethodModal,
  setOpenPaymentMethodModal,
  setSoundOn
} = uiSlice.actions
