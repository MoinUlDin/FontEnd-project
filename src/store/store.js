import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authslice";
import templatesReducer from "../features/templateSlice";
import assessmentReducer from "../features/assessmentSlice";
import testSubmissionReducer from "../features/testSubmissionSlice";
import categoryReducer from "../features/categorySlice";
import companyReducer from "../features/companySlice";
import settingsReducer from "../features/settingsSlice";

// Combine all your reducers.
const appReducer = combineReducers({
  auth: authReducer,
  templates: templatesReducer,
  assessment: assessmentReducer,
  testSubmission: testSubmissionReducer,
  category: categoryReducer,
  company: companyReducer,
  settings: settingsReducer,
});

// Create a root reducer that resets state on logout.
const rootReducer = (state, action) => {
  // Check if the logout action is dispatched.
  if (action.type === "auth/logout") {
    state = undefined; // This resets all state to initial values.
  }
  return appReducer(state, action);
};

// Configure the store using the root reducer.
export const store = configureStore({
  reducer: rootReducer,
});
