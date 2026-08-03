import { IAddress } from '@/types/entities/address.types'
import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface UiStatePayload {
  partnerDrawer: boolean
  jobApplicationDrawer: boolean
  addressModal: boolean
  address: IAddress | null
  confetti: boolean
  paymentMethodModal: boolean
  soundOn: boolean
  cartDropdown: boolean
  contactSubmissionDrawer: boolean
  contactSubmission: any | null
}

const initialUiState: UiStatePayload = {
  partnerDrawer: false,
  jobApplicationDrawer: false,
  addressModal: false,
  address: null,
  confetti: false,
  paymentMethodModal: false,
  soundOn: true,
  cartDropdown: false,
  contactSubmissionDrawer: false,
  contactSubmission: null
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
    },
    setOpenCartDropdown: (state) => {
      state.cartDropdown = true
    },
    setCloseCartDropdown: (state) => {
      state.cartDropdown = false
    },
    setOpenContactSubmissionDrawer: (state, { payload }) => {
      state.contactSubmissionDrawer = true
      state.contactSubmission = payload
    },
    setCloseContactSubmissionDrawer: (state) => {
      state.contactSubmissionDrawer = false
      state.contactSubmission = null
    }
  }
})

export const uiReducer = uiSlice.reducer as Reducer<UiStatePayload>

export const {
  setClosePartnerDrawer,
  setOpenPartnerDrawer,
  setCloseUpdateAddressModal,
  setOpenUpdateAddressModal,
  setHideConfetti,
  setShowConfetti,
  setClosePaymentMethodModal,
  setOpenPaymentMethodModal,
  setSoundOn,
  setCloseCartDropdown,
  setOpenCartDropdown,
  setCloseContactSubmissionDrawer,
  setOpenContactSubmissionDrawer
} = uiSlice.actions
