"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/auth-store";
import HydrationLoader from "@/components/shared/atoms/hydration-loader";

/**
 * AuthHydration bootstraps each tab's Zustand auth store from its own
 * sessionStorage on every page load.
 *
 * Session isolation guarantee:
 *   sessionStorage is tab-scoped — each browser tab owns a completely
 *   independent store. Any number of tabs can be open simultaneously with
 *   different accounts logged in; closing or logging out of one tab has
 *   zero effect on any other tab's session.
 *
 * Auth cookies are intentionally NOT written on login. Cookies are
 * domain-scoped (shared across all tabs), so writing auth data to them at
 * login time would mean the last tab to log in overwrites every other tab's
 * cookie — breaking multi-tab independence. Auth state lives exclusively in
 * sessionStorage. Cookies are only cleared on explicit logout so that any
 * cookies written by older versions of this app are cleaned up.
 */
export function AuthHydration({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) return <HydrationLoader />;

  return <>{children}</>;
}
