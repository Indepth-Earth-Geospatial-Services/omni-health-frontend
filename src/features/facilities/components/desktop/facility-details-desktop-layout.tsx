"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarContentNav } from "@/features/user/components/desktop/sidebar-content";
import FacilityDetailsBase from "@/components/shared/organisms/facility-details-base";
import { useFacilityStore } from "@/features/user/store/facility-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function FacilityDetailsDesktopLayout() {
  const router = useRouter();
  const facility = useFacilityStore((state) => state.selectedFacility);

  useEffect(() => {
    if (Object.values(facility || {}).length === 0) {
      router.push("/facilities");
    }
  }, [facility, router]);

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

      <main className="flex flex-1 flex-col overflow-hidden">
        <FacilityDetailsBase
          facility={facility}
          onClose={() => router.back()}
          variant="page"
        />
      </main>
    </SidebarProvider>
  );
}
