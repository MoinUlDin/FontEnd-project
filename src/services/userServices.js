// services/userServices.js
import apiClient from "./apiClient"; // set up with Axios
import { setUserList, deleteUser } from "../features/authslice";

// Helper to convert a string from snake_case to camelCase.
const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

// Recursively convert all keys in an object (or array) to camelCase.
const convertKeysToCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      acc[toCamelCase(key)] = convertKeysToCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

class UserService {
  // Login Method
  static async loginUser(formData) {
    try {
      const response = await apiClient.post("users/login/", formData);
      // Convert the response data to camelCase.
      const data = convertKeysToCamelCase(response.data);
      // Store the entire object in localStorage.
      localStorage.setItem("userData", JSON.stringify(data));
      return data; // Return data to the component
    } catch (error) {
      const errorMessage =
        error.response?.data?.non_field_errors ||
        "Login failed. Please try again.";
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
  static async toggleInactive(payload, dispatch) {
    try {
      console.log("We are in");
      const response = await apiClient.patch("users/inactive/", payload);
      UserService.fetchUserList(dispatch);
      console.log("Response", response.data);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message;
      throw new Error(message);
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
      const errorMessage =
        error.response?.data?.non_field_errors ||
        error.response?.data?.email ||
        "Registrations Failed.";
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

  static async updateProfile(payload) {
    try {
      const response = await apiClient.patch("users/profile/update/", payload);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Profile update failed. Please try again.";
      throw new Error(errorMessage);
    }
  }
}

export default UserService;
