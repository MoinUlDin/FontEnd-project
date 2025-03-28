// src/services/ApiClient.js
import axios from "axios";

class ApiClient {
  constructor() {
    this.client = axios.create({
      // Change URL
      // baseURL: "https://backendrighthire.thevista365.com/",
      baseURL: "http://localhost:8000",
      headers: { "Content-Type": "application/json" },
    });

    // Request interceptor: Attach access token from localStorage .
    this.client.interceptors.request.use(
      (config) => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData?.accessToken) {
          config.headers.Authorization = `Bearer ${userData.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: If a 401 is returned, try to refresh the access token.
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        // If a 401 error occurs and we haven't already retried the request...
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          const userData = JSON.parse(localStorage.getItem("userData"));
          if (userData?.refreshToken) {
            try {
              // Step 2: Send request to refresh the token.
              const refreshResponse = await this.client.post(
                "/api/token/refresh/",
                {
                  refresh: userData.refreshToken,
                }
              );

              const newAccessToken = refreshResponse.data.access;
              // Update localStorage with the new access token.
              const updatedUserData = {
                ...userData,
                accessToken: newAccessToken,
              };
              localStorage.setItem("userData", JSON.stringify(updatedUserData));
              // Update the Authorization header and retry the original request.
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return this.client(originalRequest);
            } catch (refreshError) {
              // Step 3: If refresh fails, remove user info from localStorage.
              localStorage.removeItem("userData");
              return Promise.reject(refreshError);
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // GET method
  get(url, config = {}) {
    return this.client.get(url, config);
  }

  // POST method
  post(url, data, config = {}) {
    return this.client.post(url, data, config);
  }

  // PUT method
  put(url, data, config = {}) {
    return this.client.put(url, data, config);
  }

  // PATCH method
  patch(url, data, config = {}) {
    return this.client.patch(url, data, config);
  }

  // DELETE method
  delete(url, config = {}) {
    return this.client.delete(url, config);
  }
}

export default new ApiClient();
