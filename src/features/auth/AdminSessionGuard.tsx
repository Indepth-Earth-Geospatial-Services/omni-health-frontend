"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/auth-store";
import { isTokenExpired } from "@/lib/token";
import HydrationLoader from "@/components/shared/atoms/hydration-loader";

const ADMIN_ROLES = ["admin", "super_admin"] as const;

/**
 * Validates the restored session on every admin route load.
 *
 * The server-side middleware handles unauthenticated requests via cookies, but
 * it cannot defend against a tab-restore scenario where the browser brings back
 * sessionStorage (and possibly old cookies) while the actual session is stale,
 * expired, or missing a required facility selection.
 *
 * This guard runs client-side after AuthHydration has read sessionStorage and
 * performs the following checks before allowing the admin dashboard to render:
 *
 *   1. Token exists and has not expired.
 *   2. User object is present and has an admin-level role.
 *   3. For `admin` role: currentFacilityId is set (facility must be selected).
 *      super_admin is exempt — they do not need a facility to access /admin.
 *
 * On any failure the store is cleared (logout) and the user is sent to /login
 * with a `?reason=` param so the login page can display a contextual message.
 */
export function AdminSessionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, user, currentFacilityId, isHydrated, logout } = useAuthStore();
  const router = useRouter();
  const redirecting = useRef(false);

  const validate = (): { valid: boolean; reason: string } => {
    if (!token || isTokenExpired(token))
      return { valid: false, reason: "session_expired" };

    if (!user || !ADMIN_ROLES.includes(user.role as (typeof ADMIN_ROLES)[number]))
      return { valid: false, reason: "unauthorized" };

    if (user.role === "admin" && !currentFacilityId)
      return { valid: false, reason: "no_facility" };

    return { valid: true, reason: "" };
  };

  useEffect(() => {
    if (!isHydrated || redirecting.current) return;

    const { valid, reason } = validate();
    if (!valid) {
      redirecting.current = true;
      logout().then(() => router.replace(`/login?reason=${reason}`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  // Block rendering until hydrated
  if (!isHydrated) return <HydrationLoader />;

  // If validation fails, keep showing the loader while the redirect resolves
  const { valid } = validate();
  if (!valid) return <HydrationLoader />;

  return <>{children}</>;
}
