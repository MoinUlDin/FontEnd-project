import { createSlice } from "@reduxjs/toolkit";

const templatesSlice = createSlice({
  name: "templates",
  initialState: {
    list: [],
  },
  reducers: {
    setTemplates(state, action) {
      state.list = action.payload;
    },
  },
});

export const { setTemplates } = templatesSlice.actions;
export default templatesSlice.reducer;
