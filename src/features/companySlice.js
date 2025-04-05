import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
};
const companySlice = createSlice({
  name: "company",
  initialState: initialState,
  reducers: {
    fetchList(state, action) {
      state.list = [];
      state.list = action.payload;
    },
  },
});

export default companySlice.reducer;

export const { fetchList } = companySlice.actions;
