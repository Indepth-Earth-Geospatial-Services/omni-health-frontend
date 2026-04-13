/**
 * Shared auth storage key names — single source of truth.
 *
 * Intentionally has NO "use client" directive so it can be safely imported
 * from the Next.js Edge runtime (middleware) as well as client components
 * and server utilities.
 */

/** Key used to persist auth state in sessionStorage (per-tab, cleared on tab close). */
export const AUTH_STORAGE_KEY = "omni_health_auth";

/** Cookie that carries the raw JWT for middleware route protection. */
export const AUTH_COOKIE_NAME = "omni_health_token";

/** Cookie that carries serialised role + facilityIds for middleware RBAC. */
export const AUTH_DATA_COOKIE_NAME = "omni_health_auth_data";

/**
 * Single source of truth for role → dashboard path mapping.
 * Import this in auth-store, middleware, and RouteGuard so all three
 * always agree on where each role lands after login.
 */
export function getRoleDashboard(role?: string): string {
  if (role === "super_admin") return "/super-admin/dashboard";
  if (role === "admin") return "/admin";
  return "/user";
}
