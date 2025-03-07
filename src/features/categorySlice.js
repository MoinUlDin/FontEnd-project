import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  details: {},
  selected: [],
  copiedQuestions: {}, // new property to store the copy result
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
    addSelectedQuestion: (state, action) => {
      if (!state.selected.includes(action.payload)) {
        state.selected.push(action.payload);
      }
    },
    removeSelectedQuestion: (state, action) => {
      state.selected = state.selected.filter((id) => id !== action.payload);
    },
    clearSelectedQuestion: (state, action) => {
      state.selected = [];
    },
    deleteFromCopiedQuestins: (state, action) => {
      const { name } = action.payload;
      delete state.copiedQuestions[name];
    },

    // New reducer: store the copied category along with the actual question objects
    setCopiedCategory(state, action) {
      const { category, questions } = action.payload;
      const key = category.name.trim().toLowerCase();
      if (state.copiedQuestions[key]) {
        // Append new questions if needed
        state.copiedQuestions[key] = [
          ...state.copiedQuestions[key],
          ...questions,
        ];
      } else {
        // Create a new entry with the questions array
        state.copiedQuestions[key] = questions;
      }
    },
  },
});

export default categorySlice.reducer;
export const {
  setCategoryList,
  setDetailedCategory,
  addSelectedQuestion,
  removeSelectedQuestion,
  setCopiedCategory,
  clearSelectedQuestion,
  deleteFromCopiedQuestins,
} = categorySlice.actions;
