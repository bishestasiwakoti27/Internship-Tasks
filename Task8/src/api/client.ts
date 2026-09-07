import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Centralized error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const message =
        error.response.data?.message ||
        `Request failed with status ${error.response.status}`;

      return Promise.reject(new Error(message));
    }

    if (error.request) {
      return Promise.reject(
        new Error("No response from server. Please check your connection."),
      );
    }

    return Promise.reject(
      new Error(error.message || "Something went wrong."),
    );
  },
);

export default apiClient;