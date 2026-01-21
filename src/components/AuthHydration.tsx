"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import HydrationLoader from "./shared/atoms/hydration-loader";

export function AuthHydration({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) return <HydrationLoader />;

  return <>{children}</>;
}
