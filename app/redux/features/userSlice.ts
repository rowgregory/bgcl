import { IUser } from "@/types/entities/user";
import { Reducer, createSlice } from "@reduxjs/toolkit";

export interface UserStatePayload {
  // Core data
  users: IUser[];
  user: IUser | null;

  // UI state
  loading: boolean;
  hasUsers: boolean;

  // Error handling
  error: string | null;
}

export const initialUserState: UserStatePayload = {
  // Core data
  users: [],
  user: null,

  // UI state
  loading: false,
  hasUsers: false,

  // Error handling
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    hydrateUsers: (state, { payload }) => {
      state.users = payload;
      state.hasUsers = payload?.length === 0;
    },
    hydrateUser: (state, { payload }) => {
      state.user = payload;
    },
    resetUser: (state) => {
      state.error = null;
      state.user = null;
    },
    addUserToState: (state, { payload }) => {
      state.users.push(payload);
    },
    updateUserInState: (state, { payload }) => {
      const index = state.users.findIndex(
        (p: { id: string }) => p.id === payload.id
      );

      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...payload.data };
      }
    },
    removeUserFromState: (state, action) => {
      state.users = state.users.filter(
        (user: { id: string }) => user?.id !== action.payload
      );
    },
  },
});

export const userReducer = userSlice.reducer as Reducer<UserStatePayload>;

export const {
  hydrateUsers,
  hydrateUser,
  resetUser,
  addUserToState,
  updateUserInState,
  removeUserFromState,
} = userSlice.actions;
