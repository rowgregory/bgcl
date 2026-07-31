import { IProgram } from '@/types/entities/program'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProgramState {
  program: IProgram | null
  programs: IProgram[]
  programDrawer: boolean
}

const initialState: ProgramState = {
  program: null,
  programs: [],
  programDrawer: false
}

export const programSlice = createSlice({
  name: 'program',
  initialState,
  reducers: {
    setProgram: (state, action: PayloadAction<IProgram | null>) => {
      state.program = action.payload
    },
    hydratePrograms: (state, action) => {
      state.programs = action.payload
    },
    setOpenProgramDrawer: (state) => {
      state.programDrawer = true
    },
    setCloseProgramDrawer: (state) => {
      state.programDrawer = false
    }
  }
})

export const { setProgram, hydratePrograms, setOpenProgramDrawer, setCloseProgramDrawer } = programSlice.actions
export const programReducer = programSlice.reducer
