import { createSlice } from "@reduxjs/toolkit";

interface DashboardState {
  loading: boolean;
  error: string | null;
  actionMenu: boolean;
}

const initialState: DashboardState = {
  loading: true,
  error: null,
  actionMenu: false,
};
export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setOpenActionMenu: (state) => {
      state.actionMenu = true;
    },
    setCloseActionMenu: (state) => {
      state.actionMenu = false;
    },
  },
});

export const { setOpenActionMenu, setCloseActionMenu } = dashboardSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;
