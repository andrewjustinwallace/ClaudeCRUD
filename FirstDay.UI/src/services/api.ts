import axios from "axios";
import { appConfig } from "../config/appConfig";

// Create axios instance with common configuration
const api = axios.create({
  baseURL: appConfig.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(
      `Received response from: ${response.config.url}`,
      response.status
    );
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
      return Promise.reject(new Error("Request timed out. Please try again."));
    }

    if (!error.response) {
      console.error("Network error:", error);
      return Promise.reject(
        new Error(
          "Unable to connect to the server. Please check if the API is running."
        )
      );
    }

    console.error(
      "Response error:",
      error.response.status,
      error.response.data
    );

    switch (error.response.status) {
      case 401:
        console.error("Unauthorized request");
        break;
      case 404:
        console.error("Resource not found");
        break;
      case 500:
        console.error("Server error");
        break;
    }

    return Promise.reject(error);
  }
);

export default api;
