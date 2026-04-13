import axios, { AxiosInstance } from "axios";
import config from "./config";
import { handleApiError, ApiError } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/auth-store";
import { isTokenExpired } from "@/lib/token";

class ApiClient {
  public instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: config.API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor — attach token, reject if expired before the request
    this.instance.interceptors.request.use((config) => {
      const token = useAuthStore.getState().token;

      if (token) {
        if (isTokenExpired(token)) {
          // logout() clears sessionStorage, cookies, Zustand state, and
          // dispatches the "auth:logout" event — no extra work needed here.
          useAuthStore.getState().logout();
          throw new ApiError("Token expired", 401, "TOKEN_EXPIRED");
        }
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    // Response interceptor — handle 401s from the backend
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // logout() handles everything: storage, cookies, state, and the
          // "auth:logout" event — no need to dispatch it separately.
          useAuthStore.getState().logout();
        }
        return Promise.reject(handleApiError(error));
      },
    );
  }
}

export const apiClient = new ApiClient().instance;
