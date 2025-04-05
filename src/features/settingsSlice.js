// src/features/settingsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settings: null,
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    fetchSettingsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSettingsSuccess(state, action) {
      state.settings = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchSettingsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateSettingsSuccess(state, action) {
      state.settings = action.payload;
    },
    clearSettings(state) {
      state.settings = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchSettingsStart,
  fetchSettingsSuccess,
  fetchSettingsFailure,
  updateSettingsSuccess,
  clearSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
