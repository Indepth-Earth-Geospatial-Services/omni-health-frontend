"use client";

import { create } from "zustand";

const AUTH_STORAGE_KEY = "omni_health_auth";
const AUTH_COOKIE_NAME = "omni_health_token";
const AUTH_DATA_COOKIE_NAME = "omni_health_auth_data";

// Cookie helper functions for middleware access
function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

export interface User {
  user_id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: "user" | "admin" | "super_admin";
  is_active: boolean;
  created_at: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  facilityIds: string[] | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

interface AuthActions {
  login: (token: string, facilityIds: string[], user?: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  hydrate: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  token: null,
  user: null,
  facilityIds: null,
  isAuthenticated: false,
  isHydrated: false,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  login: (token: string, facilityIds: string[], user?: User) => {
    // Persist to sessionStorage (clears when browser/tab closes)
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ token, facilityIds, user }),
      );

      // Set cookies for middleware access (server-side route protection)
      setCookie(AUTH_COOKIE_NAME, token, 7);
      setCookie(
        AUTH_DATA_COOKIE_NAME,
        JSON.stringify({ role: user?.role, facilityIds }),
        7
      );
    }

    set({
      token,
      facilityIds,
      user: user || null,
      isAuthenticated: true,
      isHydrated: true,
    });
  },

  logout: () => {
    // Clear sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);

      // Clear auth cookies
      deleteCookie(AUTH_COOKIE_NAME);
      deleteCookie(AUTH_DATA_COOKIE_NAME);
    }

    set({
      ...initialState,
      isHydrated: true,
    });

    // Dispatch logout event for API client to handle
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:logout"));
    }
  },

  setUser: (user: User) => {
    const { token, facilityIds } = get();

    // Update sessionStorage with user
    if (typeof window !== "undefined" && token) {
      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ token, facilityIds, user }),
      );

      // Update auth data cookie with new role
      setCookie(
        AUTH_DATA_COOKIE_NAME,
        JSON.stringify({ role: user.role, facilityIds }),
        7
      );
    }

    set({ user });
  },

  hydrate: () => {
    if (typeof window === "undefined") {
      set({ isHydrated: true });
      return;
    }

    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);

      if (stored) {
        const { token, facilityIds, user } = JSON.parse(stored);

        // Check if token is expired
        if (token && isTokenExpired(token)) {
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
          // Clear cookies as well
          deleteCookie(AUTH_COOKIE_NAME);
          deleteCookie(AUTH_DATA_COOKIE_NAME);
          set({ ...initialState, isHydrated: true });
          return;
        }

        // Sync cookies for middleware access (in case they were cleared)
        if (token) {
          setCookie(AUTH_COOKIE_NAME, token, 7);
          setCookie(
            AUTH_DATA_COOKIE_NAME,
            JSON.stringify({ role: user?.role, facilityIds }),
            7
          );
        }

        set({
          token,
          facilityIds,
          user,
          isAuthenticated: !!token,
          isHydrated: true,
        });
      } else {
        // No stored data - explicitly reset to unauthenticated state
        // Also clear any stale cookies
        deleteCookie(AUTH_COOKIE_NAME);
        deleteCookie(AUTH_DATA_COOKIE_NAME);
        set({
          ...initialState,
          isHydrated: true,
        });
      }
    } catch {
      // Error parsing - reset to unauthenticated state
      deleteCookie(AUTH_COOKIE_NAME);
      deleteCookie(AUTH_DATA_COOKIE_NAME);
      set({
        ...initialState,
        isHydrated: true,
      });
    }
  },
}));

// Helper to check if JWT token is expired
function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));

    // Check if token expires in the next 5 seconds
    return Date.now() >= payload.exp * 1000 - 5000;
  } catch {
    return true;
  }
}

// Helper to determine redirect path based on role
export function getRedirectPath(
  facilityIds: string[] | null,
  userRole?: string,
): string {
  if (userRole === "super_admin") {
    return "/super-admin/staff";
  }

  if (userRole === "admin" && facilityIds && facilityIds.length > 0) {
    return "/admin";
  }

  return "/user";
}
