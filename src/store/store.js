import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage for web
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

// Create a persist configuration.
// Whitelist the slices you want to persist.
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // Optionally, add middleware configuration here if needed.
});

// Create the persistor which will be used in your application entry point.
export const persistor = persistStore(store);
