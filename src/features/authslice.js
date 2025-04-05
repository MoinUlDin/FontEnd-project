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
      // Expecting the payload to be in camelCase, as converted by UserService.
      const {
        accessToken,
        refreshToken,
        userName,
        userId,
        email,
        company,
        companyId,
        role,
      } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = { userName, userId, email, company, companyId, role };
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
  // Clear all data from localStorage at once.
  localStorage.clear();
  // Dispatch the logout action to clear Redux state.
  dispatch(authSlice.actions.logout());
};

export const { login, logout, setUserList, deleteUser } = authSlice.actions;
export default authSlice.reducer;
