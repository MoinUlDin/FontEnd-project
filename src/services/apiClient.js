// src/services/ApiClient.js
import axios from "axios";

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: "http://127.0.0.1:8000/",
      headers: { "Content-Type": "application/json" },
    });

    // Request interceptor to add access token
    this.client.interceptors.request.use(
      (config) => {
        // Get userData from localStorage
        const userData = JSON.parse(localStorage.getItem("userData"));

        // Add token to headers if available
        if (userData?.accessToken) {
          config.headers.Authorization = `Bearer ${userData.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  get(url, config = {}) {
    return this.client.get(url, config);
  }

  post(url, data, config = {}) {
    return this.client.post(url, data, config);
  }

  // Add other HTTP methods (put, delete, etc.) as needed.
}

export default new ApiClient();
