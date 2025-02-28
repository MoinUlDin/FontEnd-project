import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assessments: {}, // Store assessments by ID for quick lookup
  selectedAssessment: null,
  testData: null,
};

const assessmentSlice = createSlice({
  name: "assessment",
  initialState: initialState,
  reducers: {
    setAssessments: (state, action) => {
      // Convert array to object with IDs as keys
      const assessments = action.payload.reduce((acc, assessment) => {
        acc[assessment.id] = assessment;
        return acc;
      }, {});
      state.assessments = assessments;
    },
    selectAssessment: (state, action) => {
      state.selectedAssessment = action.payload;
    },
    // Add more reducers as needed
    setTestData: (state, action) => {
      state.testData = action.payload;
    },
  },
});

export const { setAssessments, selectAssessment, setTestData } =
  assessmentSlice.actions;
export default assessmentSlice.reducer;
