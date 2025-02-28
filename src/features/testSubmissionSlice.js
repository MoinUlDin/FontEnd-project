// features/testSubmissionSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  answers: {},
  loading: false,
  error: null,
};

const testSubmissionSlice = createSlice({
  name: "testSubmission",
  initialState,
  reducers: {
    saveAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
    },
    submitTestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    submitTestSuccess: (state) => {
      state.loading = false;
      state.answers = {};
    },
    submitTestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  saveAnswer,
  submitTestStart,
  submitTestSuccess,
  submitTestFailure,
} = testSubmissionSlice.actions;

export default testSubmissionSlice.reducer;
