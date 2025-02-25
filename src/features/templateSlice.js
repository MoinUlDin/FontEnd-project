import { createSlice } from "@reduxjs/toolkit";

const templatesSlice = createSlice({
  name: "templates",
  initialState: {
    list: [],
    detailedTemplate: {},
  },
  reducers: {
    setTemplates(state, action) {
      state.list = action.payload;
    },
    setDetailedTemplate(state, action) {
      state.detailedTemplate = action.payload;
    },
  },
});

export const { setTemplates, setDetailedTemplate } = templatesSlice.actions;
export default templatesSlice.reducer;
