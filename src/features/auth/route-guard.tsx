"use client";

import { useAuthStore } from "@/features/auth/auth-store";
import HydrationLoader from "@/components/shared/atoms/hydration-loader";

interface RouteGuardProps {
  children: React.ReactNode;
}

/**
 * RouteGuard's only job is to block rendering until sessionStorage has been
 * read and Zustand hydrated. All route-protection redirects are handled by
 * the Next.js middleware (proxy.ts / middleware.ts) which runs server-side
 * before any page is served — this avoids client/server conflicts and the
 * race conditions caused by re-running hydrate() on every pathname change.
 */
export function RouteGuard({ children }: RouteGuardProps) {
  const isHydrated = useAuthStore((state) => state.isHydrated);

  if (!isHydrated) return <HydrationLoader />;

  return <>{children}</>;
}
