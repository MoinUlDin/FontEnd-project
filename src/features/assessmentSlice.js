import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assessments: {}, // Store assessments by ID for quick lookup
  selectedAssessment: null,
  details: {},
  testData: null,
  difficultyLevels: [],
};

const assessmentSlice = createSlice({
  name: "assessment",
  initialState: initialState,
  reducers: {
    setAssessments: (state, action) => {
      const assessments = action.payload.reduce((acc, assessment) => {
        acc[assessment.id] = assessment;
        return acc;
      }, {});
      state.assessments = assessments;
    },
    setAssessmentDetail: (state, action) => {
      state.details = action.payload;
    },
    selectAssessment: (state, action) => {
      state.selectedAssessment = action.payload;
    },
    setTestData: (state, action) => {
      state.testData = action.payload;
    },
    deleteAssessment: (state, action) => {
      const { id } = action.payload;
      delete state.assessments[id]; // Remove the assessment from the object
    },
    setDifficultyLevels: (state, action) => {
      state.difficultyLevels = action.payload;
    },
  },
});

export const {
  setAssessments,
  selectAssessment,
  setTestData,
  deleteAssessment,
  setAssessmentDetail,
  setDifficultyLevels,
} = assessmentSlice.actions;
export default assessmentSlice.reducer;
