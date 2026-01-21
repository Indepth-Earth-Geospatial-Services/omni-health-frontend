"use client";

import { create } from "zustand";

const AUTH_STORAGE_KEY = "omni_health_auth";


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
    // Persist to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ token, facilityIds, user })
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
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
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

    // Update localStorage with user
    if (typeof window !== "undefined" && token) {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ token, facilityIds, user })
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
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const { token, facilityIds, user } = JSON.parse(stored);

        // Check if token is expired
        if (token && isTokenExpired(token)) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          set({ ...initialState, isHydrated: true });
          return;
        }

        set({
          token,
          facilityIds,
          user,
          isAuthenticated: !!token,
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
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

// Helper to determine redirect path based on role/facilityIds
export function getRedirectPath(facilityIds: string[] | null): string {
  // If user has facility_ids, they're admin
  if (facilityIds && facilityIds.length > 0) {
    return "/admin/staff";
  }
  return "/user";
}
