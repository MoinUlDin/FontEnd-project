// features/authslice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  list: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to store all the authentication data
    login(state, action) {
      const {
        access_token,
        user_id,
        refresh_token,
        user_name,
        email,
        company,
        role,
      } = action.payload;
      state.accessToken = access_token;
      state.refreshToken = refresh_token;
      state.user = {
        userName: user_name,
        userId: user_id,
        email,
        company,
        role,
      };
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    setUserList(state, action) {
      state.list = action.payload;
    },
    deleteUser(state, action) {
      state.list = state.list.filter((user) => user.id !== action.payload);
    },
  },
});

export const logoutAndClear = () => (dispatch) => {
  // Clear tokens and user data from localStorage
  localStorage.removeItem("userData");
  // Dispatch the logout action to clear Redux state
  dispatch(logout());
};
export const { login, logout, setUserList, deleteUser } = authSlice.actions;
export default authSlice.reducer;
