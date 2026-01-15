import { createSlice } from "@reduxjs/toolkit";

interface SettingsState {
  loading: boolean;
  error: string | null;
  settings: {
    name: string;
    location: string;
    meetingDay: string;
    meetingTime: string;
    meetingFrequency: string;
  };
}

const initialState: SettingsState = {
  loading: false,
  error: null,
  settings: {
    name: "",
    location: "",
    meetingDay: "",
    meetingTime: "",
    meetingFrequency: "WEEKKLY",
  },
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    resetSettingsError: (state) => {
      state.error = null;
    },
  },
});

export const { resetSettingsError } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
