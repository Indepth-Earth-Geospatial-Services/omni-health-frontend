import axios, { AxiosInstance } from "axios";
import config from "./config";
import { handleApiError } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/auth-store";

class ApiClient {
  public instance: AxiosInstance;
  private isRefreshing = false;
  private refreshQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
  }> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: config.API_BASE_URL,
      headers: { "Content-Type": "application/json" },
    });
    this.setupInterceptors();
  }

  private drainQueue(token: string | null, error: unknown = null): void {
    this.refreshQueue.forEach(({ resolve, reject }) => {
      token ? resolve(token) : reject(error);
    });
    this.refreshQueue = [];
  }

  private setupInterceptors(): void {
    // ── Request ──────────────────────────────────────────────────────────────
    // Attach the current Bearer token to every outgoing request.
    // Do NOT call logout here — the response interceptor handles expired tokens
    // via the refresh flow so the user is never kicked out unnecessarily.
    this.instance.interceptors.request.use((reqConfig) => {
      const token = useAuthStore.getState().token;
      if (token) {
        reqConfig.headers.Authorization = `Bearer ${token}`;
      }
      return reqConfig;
    });

    // ── Response ─────────────────────────────────────────────────────────────
    // On 401: attempt a token refresh and replay the failed request.
    // Multiple concurrent 401s share a single refresh call via the queue.
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config;

        // Skip refresh for: non-401 errors, the refresh endpoint itself,
        // and requests that have already been retried once.
        const shouldRefresh =
          error.response?.status === 401 &&
          !original._retry &&
          !original.url?.includes("/refresh");

        if (!shouldRefresh) {
          return Promise.reject(handleApiError(error));
        }

        // A refresh is already running — queue this request until it finishes
        if (this.isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            this.refreshQueue.push({ resolve, reject });
          }).then((newToken) => {
            original.headers.Authorization = `Bearer ${newToken}`;
            return this.instance(original);
          });
        }

        // First 401 — kick off the refresh
        original._retry = true;
        this.isRefreshing = true;

        try {
          await useAuthStore.getState().refreshToken();
          const newToken = useAuthStore.getState().token!;

          this.isRefreshing = false;
          this.drainQueue(newToken);

          original.headers.Authorization = `Bearer ${newToken}`;
          return this.instance(original);
        } catch (refreshError) {
          this.isRefreshing = false;
          this.drainQueue(null, refreshError);
          // Refresh failed — session is unrecoverable, clear everything
          useAuthStore.getState().logout();
          return Promise.reject(handleApiError(refreshError));
        }
      },
    );
  }
}

export const apiClient = new ApiClient().instance;
