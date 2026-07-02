import axios from "axios";

// Create custom axios client pointing to Node.js backend API gateway
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// Request Interceptor: Automatically append JWT Bearer tokens to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error logging and Auth cache purges
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Auto-logout user on expired/invalid auth states (HTTP 401)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth-changed")); // Notify AuthContext
    }
    
    console.error("API Gateway error:", error.response?.data?.error || error.message);
    return Promise.reject(error);
  }
);

export default api;
