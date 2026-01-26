"use client";

import { create } from "zustand";
import { ApiClient } from "@/lib/client";

const AUTH_STORAGE_KEY = "omni_health_auth";
const apiClient = new ApiClient();

export interface User {
  user_id?: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string;
  role: "user" | "admin" | "super_admin";
  is_active?: boolean;
  created_at?: string;
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
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    set({
      ...initialState,
      isHydrated: true,
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:logout"));
    }
  },

  setUser: (user: User) => {
    const { token, facilityIds } = get();

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

        if (token && apiClient.isTokenExpired(token)) {
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
    } catch (error) {
      console.error("Error hydrating auth state:", error);
      set({ isHydrated: true });
    }
  },
}));

// ✅ UPDATED: Routes without "super-admin" prefix (route group removes it)
export function getRedirectPath(user: User | null, facilityIds: string[] | null): string {
  // Priority 1: Check role - super_admin takes precedence
  if (user?.role === "super_admin") {
    return "/super-admin/facility-registry"; // ✅ No "/super-admin" prefix
  }
  
  // Priority 2: If user is admin, go to admin dashboard
  if (user?.role === "admin") {
    return "/admin/staff";
  }
  
  // Priority 3: Default to user dashboard
  return "/user";
}