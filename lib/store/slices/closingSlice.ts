import { IClosing } from '@/types/entities/closing'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ClosingState {
  closing: IClosing | null
  closings: IClosing[]
  closingDrawer: boolean
}

const initialState: ClosingState = {
  closing: null,
  closings: [],
  closingDrawer: false
}

export const closingSlice = createSlice({
  name: 'closing',
  initialState,
  reducers: {
    setClosing: (state, action: PayloadAction<IClosing | null>) => {
      state.closing = action.payload
    },
    hydrateClosings: (state, action) => {
      state.closings = action.payload
    },
    setOpenClosingDrawer: (state) => {
      state.closingDrawer = true
    },
    setCloseClosingDrawer: (state) => {
      state.closingDrawer = false
    }
  }
})

export const { setClosing, hydrateClosings, setOpenClosingDrawer, setCloseClosingDrawer } = closingSlice.actions
export const closingReducer = closingSlice.reducer
