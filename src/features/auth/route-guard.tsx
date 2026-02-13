"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import HydrationLoader from "@/components/shared/atoms/hydration-loader";

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  // Added pendingFacilitySelection to the destructured store
  const {
    isAuthenticated,
    isHydrated,
    facilityIds,
    user,
    pendingFacilitySelection,
    hydrate,
  } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [pathname, hydrate]);

  useEffect(() => {
    if (!isHydrated) return;

    const protectedRoutes = [
      "/user",
      "/admin",
      "/super-admin",
      "/profile",
      "/facilities",
    ];

    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route),
    );

    // 1. Handle Unauthenticated Access
    if (!isAuthenticated && isProtectedRoute) {
      router.push("/login");
      return;
    }

    // 2. Handle Authenticated Redirects (The logic you needed fixed)
    if (
      isAuthenticated &&
      (pathname === "/login" || pathname === "/register")
    ) {
      // IF an admin still needs to select a facility, STOP HERE.
      // This prevents the "flash" or immediate redirect away from the login page/modal.
      if (pendingFacilitySelection) {
        return;
      }

      // If we reach here, it means they are authenticated AND
      // have either selected a facility or don't need to.
      if (user?.role === "super_admin") {
        router.push("/super-admin/dashboard");
        return;
      }

      if (user?.role === "admin" && facilityIds && facilityIds.length > 0) {
        router.push("/admin/staff");
        return;
      }

      router.push("/user");
      return;
    }
  }, [
    isAuthenticated,
    isHydrated,
    pathname,
    router,
    facilityIds,
    user,
    pendingFacilitySelection, // Added dependency
  ]);

  if (!isHydrated) return <HydrationLoader />;

  return <>{children}</>;
}
