import { ITeamMember } from '@/types/entities/team-member'
import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface TeamMemberStatePayload {
  // Core data
  teamMembers: ITeamMember[]
  teamMember: ITeamMember | null

  // UI state
  loading: boolean
  hasTeamMembers: boolean
  teamMemberDrawer: boolean

  selectedTeamMemberId: string | null

  // Error handling
  error: string | null
}

const initialTeamMemberState: TeamMemberStatePayload = {
  // Core data
  teamMembers: [],
  teamMember: null,

  // UI state
  loading: false,
  hasTeamMembers: false,
  teamMemberDrawer: false,

  selectedTeamMemberId: null,

  // Error handling
  error: null
}

export const teamMemberSlice = createSlice({
  name: 'teamMember',
  initialState: initialTeamMemberState,
  reducers: {
    hydrateTeamMember: (state, { payload }) => {
      state.teamMember = payload
    },
    hydrateTeamMembers: (state, { payload }) => {
      state.teamMembers = payload
    },
    resetTeamMember: (state) => {
      state.error = null
      state.teamMember = null
    },
    setOpenTeamMemberDrawer: (state) => {
      state.teamMemberDrawer = true
    },
    setCloseTeamMemberDrawer: (state) => {
      state.teamMemberDrawer = false
    },
    setSelectedTeamMember: (state, { payload }) => {
      state.selectedTeamMemberId = payload
    }
  }
})

export const teamMemberReducer = teamMemberSlice.reducer as Reducer<TeamMemberStatePayload>

export const {
  hydrateTeamMember,
  hydrateTeamMembers,
  resetTeamMember,
  setCloseTeamMemberDrawer,
  setOpenTeamMemberDrawer,
  setSelectedTeamMember
} = teamMemberSlice.actions
