import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  details: {},
};
const categorySlice = createSlice({
  name: "categories",
  initialState: initialState,
  reducers: {
    setCategoryList(state, action) {
      state.list = action.payload;
    },
    setDetailedCategory(state, action) {
      const { id, data } = action.payload;
      state.details[id] = data;
    },
  },
});

export default categorySlice.reducer;
export const { setCategoryList, setDetailedCategory } = categorySlice.actions;
