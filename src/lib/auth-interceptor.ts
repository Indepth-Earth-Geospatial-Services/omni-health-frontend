import axios from "axios";
import { useAuthStore } from "@/features/auth/auth-store";

/**
 * Setup axios interceptor to automatically refresh token on 401 response
 * This prevents users from being logged out when their token expires mid-session
 * 
 * Should be called once at app startup (in _app.tsx or root layout)
 */
export function setupAuthInterceptor() {
  // Response interceptor to handle 401 errors
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // ✅ If 401 and not already retrying, attempt token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const authStore = useAuthStore.getState();
          
          // ✅ Call refresh endpoint to get new token
          await authStore.refreshToken();

          // ✅ Retry original request with new token
          const newToken = useAuthStore.getState().token;
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed in interceptor:", refreshError);
          
          // ✅ Refresh failed, logout user
          const authStore = useAuthStore.getState();
          await authStore.logout();
          
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
}

/**
 * Setup request interceptor to add Bearer token to all requests
 * Should be called once at app startup
 */
export function setupTokenInterceptor() {
  axios.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
}

/**
 * Initialize all auth interceptors
 * Call this once in your app's root (e.g., in _app.tsx or root layout)
 */
export function initializeAuthInterceptors() {
  setupTokenInterceptor();
  setupAuthInterceptor();
}
