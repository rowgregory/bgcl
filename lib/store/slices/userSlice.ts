import { IUser } from '@/types/entities/user'
import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface UserStatePayload {
  // Core data
  users: IUser[]
  user: IUser | null

  // UI state
  loading: boolean
  hasUsers: boolean
  userDrawer: boolean

  // Error handling
  error: string | null
}

export const initialUserState: UserStatePayload = {
  // Core data
  users: [],
  user: null,

  // UI state
  loading: false,
  hasUsers: false,
  userDrawer: false,

  // Error handling
  error: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    hydrateUsers: (state, { payload }) => {
      state.users = payload
      state.hasUsers = payload?.length === 0
    },
    hydrateUser: (state, { payload }) => {
      state.user = payload
    },
    resetUser: (state) => {
      state.error = null
      state.user = null
    },
    setOpenUserDrawer: (state) => {
      state.userDrawer = true
    },
    setCloseUserDrawer: (state) => {
      state.userDrawer = false
    }
  }
})

export const userReducer = userSlice.reducer as Reducer<UserStatePayload>

export const { hydrateUsers, hydrateUser, resetUser, setCloseUserDrawer, setOpenUserDrawer } = userSlice.actions
