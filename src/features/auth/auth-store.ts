"use client";

import { create } from "zustand";
import { isTokenExpired } from "@/lib/token";
import {
  AUTH_STORAGE_KEY,
  AUTH_COOKIE_NAME,
  AUTH_DATA_COOKIE_NAME,
} from "@/lib/auth-constants";

function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

export interface User {
  user_id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: "admin" | "super_admin" | "user";
  is_active: boolean;
  created_at: string;
  phone?: string | number;
  image?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  facilityIds: string[] | null;
  currentFacilityId: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  pendingFacilitySelection: boolean;
}

interface AuthActions {
  login: (token: string, facilityIds: string[], user?: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setCurrentFacilityId: (id: string) => void;
  setPendingFacilitySelection: (pending: boolean) => void;
  hydrate: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  token: null,
  user: null,
  facilityIds: null,
  currentFacilityId: null,
  isAuthenticated: false,
  isHydrated: false,
  pendingFacilitySelection: false,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  login: (token: string, facilityIds: string[], user?: User) => {
    // If Admin has multiple facilities, we flag it as pending so the modal shows
    const isMultiFacilityAdmin =
      user?.role === "admin" && facilityIds && facilityIds.length > 1;

    // Default to the first facility only if they aren't forced to choose via modal
    const currentFacilityId = isMultiFacilityAdmin
      ? null
      : facilityIds?.[0] || null;

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token,
          facilityIds,
          user,
          currentFacilityId,
          pendingFacilitySelection: isMultiFacilityAdmin,
        }),
      );

      // Write cookies so the proxy (middleware) can enforce route protection.
      // No expiry = session cookies — cleared when the browser closes.
      document.cookie = `${AUTH_COOKIE_NAME}=${token};path=/;SameSite=Strict`;
      // Role is taken from the API response body (not the JWT), so we store it
      // in a separate cookie for the proxy to read.
      document.cookie = `${AUTH_DATA_COOKIE_NAME}=${encodeURIComponent(JSON.stringify({ role: user?.role }))};path=/;SameSite=Strict`;
    }

    set({
      token,
      facilityIds,
      currentFacilityId,
      user: user || null,
      isAuthenticated: true,
      isHydrated: true,
      pendingFacilitySelection: isMultiFacilityAdmin,
    });
  },

  setPendingFacilitySelection: (pending: boolean) => {
    const { token, facilityIds, user, currentFacilityId } = get();

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token,
          facilityIds,
          user,
          currentFacilityId,
          pendingFacilitySelection: pending,
        }),
      );
    }
    set({ pendingFacilitySelection: pending });
  },

  setCurrentFacilityId: (id: string) => {
    const { facilityIds, token, user } = get();

    if (!facilityIds?.includes(id)) return;

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token,
          facilityIds,
          user,
          currentFacilityId: id,
          pendingFacilitySelection: false, // Crucial: clear pending state here
        }),
      );
    }

    set({
      currentFacilityId: id,
      pendingFacilitySelection: false,
    });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      deleteCookie(AUTH_COOKIE_NAME);
      deleteCookie(AUTH_DATA_COOKIE_NAME);
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
    const { token, facilityIds, currentFacilityId, pendingFacilitySelection } =
      get();

    if (typeof window !== "undefined" && token) {
      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token,
          facilityIds,
          user,
          currentFacilityId,
          pendingFacilitySelection,
        }),
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
        const data = JSON.parse(stored);

        if (data.token && isTokenExpired(data.token)) {
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
          deleteCookie(AUTH_COOKIE_NAME);
          deleteCookie(AUTH_DATA_COOKIE_NAME);
          set({ ...initialState, isHydrated: true });
          return;
        }

        set({
          ...data,
          isAuthenticated: !!data.token,
          isHydrated: true,
        });
      } else {
        set({ ...initialState, isHydrated: true });
      }
    } catch {
      set({ ...initialState, isHydrated: true });
    }
  },
}));

export const useCurrentFacilityId = (): string => {
  const { currentFacilityId, facilityIds } = useAuthStore();
  return (
    currentFacilityId ||
    (facilityIds && facilityIds.length > 0 ? facilityIds[0] : "")
  );
};

