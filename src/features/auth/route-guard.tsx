"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

interface RouteGuardProps {
    children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isHydrated, facilityIds } = useAuthStore();

    useEffect(() => {
        // Wait for auth state to hydrate from localStorage
        if (!isHydrated) return;

        // Define protected routes
        const protectedRoutes = ["/user", "/admin", "/profile", "/facilities"];
        const isProtectedRoute = protectedRoutes.some((route) =>
            pathname.startsWith(route)
        );

        // Redirect to login if not authenticated and on protected route
        if (!isAuthenticated && isProtectedRoute) {
            router.push("/login");
            return;
        }

        // Redirect authenticated users away from login/register pages
        if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
            const redirectPath = facilityIds && facilityIds.length > 0 ? "/admin/staff" : "/user";
            router.push(redirectPath);
            return;
        }
    }, [isAuthenticated, isHydrated, pathname, router, facilityIds]);

    // Show loading spinner while checking auth
    if (!isHydrated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
