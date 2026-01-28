"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { RouteGuard } from "./route-guard";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const hydrate = useAuthStore((state) => state.hydrate);

  // Hydrate auth state on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <RouteGuard>{children}</RouteGuard>;
}