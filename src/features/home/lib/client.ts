import axios, { AxiosInstance } from "axios";
import config from "./config";
import { handleApiError } from "@/lib/utils";

class ApiClient {
  public instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: config.API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      // withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    //   // Request interceptor - Add token to all requests
    //   this.instance.interceptors.request.use((config) => {
    //     const token = useAuthStore.getState().token;

    //     if (token) {
    //       if (this.isTokenExpired(token)) {
    //         this.clearAuth();
    //         throw new ApiError("Token expired", 401, "TOKEN_EXPIRED");
    //       }
    //       config.headers.Authorization = `Bearer ${token}`;
    //     }

    //     return config;
    //   });

    // Response interceptor - Handle errors globally
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // if (error.response?.status === 401) {
        //   this.clearAuth();
        //   window.dispatchEvent(new Event("auth:logout"));
        // }
        return Promise.reject(handleApiError(error));
      },
    );
  }

  // private isTokenExpired(token: string): boolean {
  //   try {
  //     const base64Url = token.split(".")[1];
  //     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  //     const payload = JSON.parse(atob(base64));

  //     return Date.now() >= payload.exp * 1000 - 5000;
  //   } catch {
  //     return true;
  //   }
  // }

  // private clearAuth(): void {
  //   localStorage.removeItem(AUTH_CONFIG.PERSIST_KEY);
  // }
}

export const apiClient = new ApiClient().instance;
