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
  const { isAuthenticated, isHydrated, facilityIds, user, hydrate } =
    useAuthStore();

  // Re-hydrate on pathname change to sync with localStorage
  useEffect(() => {
    hydrate();
  }, [pathname, hydrate]);

  useEffect(() => {
    // Wait for auth state to hydrate from localStorage
    if (!isHydrated) return;

    // Define protected routes
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

    // Redirect to login if not authenticated and on protected route
    if (!isAuthenticated && isProtectedRoute) {
      router.push("/login");
      return;
    }

    // Redirect authenticated users away from login/register pages
    if (
      isAuthenticated &&
      (pathname === "/login" || pathname === "/register")
    ) {
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
  }, [isAuthenticated, isHydrated, pathname, router, facilityIds, user]);

  // Show loading spinner while checking auth
  if (!isHydrated) return <HydrationLoader />;

  return <>{children}</>;
}
