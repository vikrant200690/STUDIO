// src/services/tokenService.jsx
import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8077",
  baseURL : import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,  // ✅ Enable cookies
});

// Function to set up interceptor with logout callback
export const setupInterceptors = (logoutCallback) => {
  let isRefreshing = false;

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If access token expired
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          if (!isRefreshing) {
            isRefreshing = true;
            console.log("🔄 Trying to refresh token...");
            await api.post("/api/auth/refresh-token"); // 🍪 backend sets new cookie
            isRefreshing = false;
          }

          // Retry original request
          return api(originalRequest);

        } catch (refreshError) {
          console.log("❌ Refresh failed — logging out");
          logoutCallback();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
// OTP Login - Request OTP
export const loginRequestOTP = async (email, password) => {
  const response = await api.post("/api/auth/login/request-otp", {
    email,
    password,
  });
  return response.data;
};

// OTP Login - Verify OTP (returns cookie)
export const loginVerifyOTP = async (email, otp) => {
  const response = await api.post("/api/auth/login/verify-otp", {
    email,
    otp,
  });
  return response.data;
};

// OTP Signup - Request OTP
export const signupRequestOTP = async (username, email, password) => {
  const response = await api.post("/api/auth/signup/request-otp", {
    username,
    email,
    password,
  });
  return response.data;
};

// OTP Signup - Verify OTP (returns cookie)
export const signupVerifyOTP = async (email, otp) => {
  const response = await api.post("/api/auth/signup/verify-otp", {
    email,
    otp,
  });
  return response.data;
};

// Get profile - FIXED: Changed from /api/profile to /api/auth/profile
export const getProfile = async () => {
  const response = await api.get("/api/auth/profile");  // ✅ FIXED
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await api.post("/api/auth/logout");
  return response.data;
};

// Check Auth - FIXED: Changed from /api/profile to /api/auth/profile
export const checkAuth = async () => {
  try {
    const response = await api.get("/api/auth/profile");  // ✅ FIXED
    return response.data;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
};

export default api;
