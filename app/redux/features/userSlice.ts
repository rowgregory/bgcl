import { IUser, Role } from "@/types/entities";
import { Reducer, createSlice } from "@reduxjs/toolkit";

export interface UserState {
  // Core data
  users: IUser[];
  user: IUser | null;
  success: boolean;

  // UI state
  loading: boolean;
  submitting: boolean;
  addUserDrawer: boolean;
  editUserDrawer: boolean;
  viewUserDrawer: boolean;
  noUsers: boolean;

  searchQuery: string;

  // Error handling
  error: string | null;
}

export const initialUserState: UserState = {
  // Core data
  users: [],
  user: {
    id: "",
    email: "",
    role: Role.PARENT,
    createdAt: new Date(),
    updatedAt: new Date(),
    hasLoginAccess: false,
  },
  success: false,

  // UI state
  loading: false,
  submitting: false,
  addUserDrawer: false,
  editUserDrawer: false,
  viewUserDrawer: false,
  noUsers: false,
  searchQuery: "",

  // Error handling
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setOpenAddUserDrawer: (state) => {
      state.addUserDrawer = true;
    },
    setCloseAddUserDrawer: (state) => {
      state.addUserDrawer = false;
    },
    resetUser: (state) => {
      state.error = null;
      state.user = null;
    },
    setUsers: (state, { payload }) => {
      state.users = payload;
      state.noUsers = payload?.length === 0;
    },
    setUser: (state, { payload }) => {
      state.user = payload;
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
    setHydrateUsers: (state, { payload }) => {
      state.users = payload;
    },
  },
});

export const userReducer = userSlice.reducer as Reducer<UserState>;

export const {
  setOpenAddUserDrawer,
  setCloseAddUserDrawer,
  resetUser,
  setUsers,
  setUser,
  addUserToState,
  updateUserInState,
  removeUserFromState,
  setHydrateUsers,
} = userSlice.actions;
