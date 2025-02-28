import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authslice";
import templatesReducer from "../features/templateSlice";
import assessmentReducer from "../features/assessmentSlice";
import testSubmissionReducer from "../features/testSubmissionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    templates: templatesReducer,
    assessment: assessmentReducer,
    testSubmission: testSubmissionReducer,
  },
});
