"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarContentNav } from "@/features/user/components/desktop/sidebar-content";
import { useFacilityStore } from "@/features/user/store/facility-store";
import { FacilityDetailsDesktopView } from "./facility-details-desktop-view";

export function FacilityDetailsDesktopLayout() {
  const router = useRouter();
  const facility = useFacilityStore((state) => state.selectedFacility);

  useEffect(() => {
    if (!facility?.facility_id) {
      router.push("/facilities");
    }
  }, [facility, router]);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  if (!facility?.facility_id) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Redirecting...</div>
      </div>
    );
  }

  return (
    <SidebarProvider
      defaultOpen={false}
      className="!mx-0 !max-w-full h-dvh overflow-hidden"
    >
      <SidebarContentNav />

      <main className="flex flex-1 flex-col overflow-hidden bg-white">
        <FacilityDetailsDesktopView
          facility={facility}
          onClose={handleClose}
        />
      </main>
    </SidebarProvider>
  );
}
