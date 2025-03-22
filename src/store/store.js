import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authslice";
import templatesReducer from "../features/templateSlice";
import assessmentReducer from "../features/assessmentSlice";
import testSubmissionReducer from "../features/testSubmissionSlice";
import categoryReducer from "../features/categorySlice";
import companyReducer from "../features/companySlice";

// Combine all your reducers
const rootReducer = combineReducers({
  auth: authReducer,
  templates: templatesReducer,
  assessment: assessmentReducer,
  testSubmission: testSubmissionReducer,
  category: categoryReducer,
  company: companyReducer,
});

// Configure the store without Redux Persist
export const store = configureStore({
  reducer: rootReducer,
});
