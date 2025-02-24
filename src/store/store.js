import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authslice";
import templatesReducer from "../features/templateSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    templates: templatesReducer,
  },
});
