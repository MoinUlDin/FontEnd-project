// services/userServices.js
import { ErrorOutline } from "@mui/icons-material";
import apiClient from "./apiClient"; // Assuming apiClient is set up with Axios
import { setUserList, deleteUser } from "../features/authslice";
class UserService {
  // Login Method
  static async loginUser(formData) {
    try {
      const response = await apiClient.post("users/login/", formData);
      const data = response.data;
      const userData = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        userName: data.user_name,
        email: data.email,
        company: data.company,
        role: data.role,
      };

      localStorage.setItem("userData", JSON.stringify(userData));

      return response.data; // Return data to the component
    } catch (error) {
      // Handle both network errors and server errors
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      throw new Error(errorMessage);
    }
  }
  static async inviteUser(payload) {
    try {
      const response = await apiClient.post("users/invite/", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async completeRegistration(payload) {
    try {
      // Here we use the token from payload as part of the URL.
      // Your URL pattern is: 'invitation/confirm/<str:token>'
      const response = await apiClient.post(
        `users/invitation/confirm/${payload.token}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async verifyInvitation(token) {
    try {
      const response = await apiClient.get(`users/invitation/confirm/${token}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async registerUser(payload) {
    try {
      const response = await apiClient.post("users/register/", payload);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      let errorMessage = "Registration failed. Please try again.";
      if (errorData) {
        // Convert each error message array into a single string and join them
        errorMessage += Object.keys(errorData)
          .map((field) => `${field}: ${errorData[field].join(", ")}`)
          .join(" | ");
      }
      throw new Error(errorMessage);
    }
  }
  static async deleteUser(id, dispatch) {
    try {
      const response = await apiClient.delete(`users/delete/${id}/`);
      dispatch(deleteUser(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async fetchUserList(dispatch) {
    try {
      const response = await apiClient.get("users/");
      dispatch(setUserList(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async inviteUser(dispatch) {}
}

export default UserService;
