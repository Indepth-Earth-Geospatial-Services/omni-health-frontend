"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function AuthHydration({ children }: { children: React.ReactNode }) {
    const hydrate = useAuthStore((state) => state.hydrate);
    const isHydrated = useAuthStore((state) => state.isHydrated);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    // Show loading state while hydrating
    if (!isHydrated) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return <>{children}</>;
}
