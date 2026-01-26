"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, getRedirectPath } from "@/store/auth-store";
import HydrationLoader from "@/components/shared/atoms/hydration-loader";

interface RouteGuardProps {
    children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isHydrated, facilityIds, user } = useAuthStore();

    useEffect(() => {
        if (!isHydrated) return;

        console.log("🔒 RouteGuard check:", { isAuthenticated, user, pathname });

        // ✅ UPDATED: Protected routes without "super-admin" prefix
        const protectedRoutes = [
            "/user",
            "/admin",
            "/profile",
            "/facilities",
            "/admin/facility-registry", // ✅ Super admin route (no prefix due to route group)
            "/staff" // ✅ Super admin staff route
        ];

        const isProtectedRoute = protectedRoutes.some((route) =>
            pathname.startsWith(route)
        );

        // Redirect to login if not authenticated and on a protected route
        if (!isAuthenticated && isProtectedRoute) {
            console.log("❌ Not authenticated, redirecting to login");
            router.push("/login");
            return;
        }

        // Redirect authenticated users away from login/register
        if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
            const redirectPath = getRedirectPath(user, facilityIds);
            console.log("✅ Authenticated user on auth page, redirecting to:", redirectPath);
            router.push(redirectPath);
            return;
        }

        // ✅ UPDATED: Role-based access control for super-admin routes
        if (isAuthenticated && user) {
            // Prevent non-super_admin from accessing super-admin routes
            // Routes: /facility-registry, /staff (from route group (super-admin))
            const superAdminRoutes = ["/super-admin/facility-registry", "/staff"];
            const isSuperAdminRoute = superAdminRoutes.some(route => pathname.startsWith(route));

            if (isSuperAdminRoute && user.role !== "super_admin") {
                console.log("❌ Non-super_admin trying to access super-admin route");
                router.push("/user");
                return;
            }

            // Prevent non-admin from accessing admin routes
            if (pathname.startsWith("/admin") && user.role !== "admin") {
                console.log("❌ Non-admin trying to access admin route");
                router.push("/user");
                return;
            }
        }
    }, [isAuthenticated, isHydrated, pathname, router, facilityIds, user]);

    if (!isHydrated) return <HydrationLoader />;

    return <>{children}</>;
}