import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface UiStatePayload {
  partnerDrawer: boolean
}

const initialUiState: UiStatePayload = {
  partnerDrawer: false
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
    }
  }
})

export const uiReducer = uiSlice.reducer as Reducer<UiStatePayload>

export const { setClosePartnerDrawer, setOpenPartnerDrawer } = uiSlice.actions
