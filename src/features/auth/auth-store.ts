"use client";

import { create } from "zustand";
import { isTokenExpired } from "@/lib/token";
import {
  AUTH_STORAGE_KEY,
  AUTH_COOKIE_NAME,
  AUTH_DATA_COOKIE_NAME,
} from "@/lib/auth-constants";
import { authService } from "@/services/auth.service";

function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

export type UserRole = "admin" | "super_admin" | "user";

export interface User {
  user_id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  phone?: string; // ✅ Fixed: use string only (backend returns string)
  image?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  facilityIds: string[] | null;
  assigned_lgas: string[] | null;
  currentFacilityId: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  pendingFacilitySelection: boolean;
}

interface AuthActions {
  login: (token: string, facilityIds: string[], user: User, assigned_lgas?: string[] | null) => void; // ✅ user is now required, assigned_lgas optional
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateToken: (newToken: string) => void;
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
  assigned_lgas: null,
  currentFacilityId: null,
  isAuthenticated: false,
  isHydrated: false,
  pendingFacilitySelection: false,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  login: (token: string, facilityIds: string[], user: User, assigned_lgas?: string[] | null) => {
    if (!token || !user) {
      console.error("Invalid login parameters", { token, user, facilityIds });
      return;
    }

    const isMultiFacilityAdmin = user.role === "admin" && facilityIds.length > 1;

    const currentFacilityId = isMultiFacilityAdmin ? null : (facilityIds[0] ?? null);

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token,
          facilityIds,
          assigned_lgas: assigned_lgas || null,
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
      assigned_lgas: assigned_lgas || null,
      user: user || null,
      isAuthenticated: true,
      isHydrated: true,
      pendingFacilitySelection: isMultiFacilityAdmin,
    });
  },

  setPendingFacilitySelection: (pending: boolean) => {
    const { token, facilityIds, assigned_lgas, user, currentFacilityId } = get();

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token,
          facilityIds,
          assigned_lgas,
          user,
          currentFacilityId,
          pendingFacilitySelection: pending,
        }),
      );
    }
    set({ pendingFacilitySelection: pending });
  },

  setCurrentFacilityId: (id: string) => {
    const { facilityIds, assigned_lgas, token, user } = get();

    // ✅ Validate facility ID exists in user's facilities
    if (!facilityIds?.includes(id)) {
      console.warn(
        `Attempted to set invalid facility ID: ${id}. Available: ${facilityIds?.join(", ")}`,
      );
      return;
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token,
          facilityIds,
          assigned_lgas,
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

  logout: async () => {
    const { token } = get();
    try {
      await authService.logout(token ?? undefined);
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // ✅ Clear local storage and cookies
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
    }
  },

  refreshToken: async () => {
    const { token } = get();
    if (!token) throw new Error("No token available to refresh");

    // Throws on failure — callers (e.g. the apiClient interceptor) handle logout
    const { access_token } = await authService.refreshToken(token);

    const { facilityIds, assigned_lgas, user, currentFacilityId, pendingFacilitySelection } = get();

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token: access_token,
          facilityIds,
          assigned_lgas,
          user,
          currentFacilityId,
          pendingFacilitySelection,
        }),
      );
      document.cookie = `${AUTH_COOKIE_NAME}=${access_token};path=/;SameSite=Strict`;
    }

    set({ token: access_token });
  },

  updateToken: (newToken: string) => {
    const { facilityIds, assigned_lgas, user, currentFacilityId, pendingFacilitySelection } = get();

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token: newToken,
          facilityIds,
          assigned_lgas,
          user,
          currentFacilityId,
          pendingFacilitySelection,
        }),
      );

      // ✅ Update token cookie
      document.cookie = `${AUTH_COOKIE_NAME}=${newToken};path=/;SameSite=Strict`;
    }

    set({ token: newToken });
  },

  setUser: (user: User) => {
    const { token, facilityIds, assigned_lgas, currentFacilityId, pendingFacilitySelection } =
      get();

    if (typeof window !== "undefined" && token) {
      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token,
          facilityIds,
          assigned_lgas,
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

/**
 * Hook to access user's assigned LGAs
 * Primarily used for ADMIN role to know which Local Government Areas they manage
 */
export const useAssignedLgas = (): string[] => {
  const { assigned_lgas } = useAuthStore();
  return assigned_lgas || [];
};
