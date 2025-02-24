// services/userServices.js
import apiClient from "./apiClient"; // Assuming apiClient is set up with Axios

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
}

export default UserService;
