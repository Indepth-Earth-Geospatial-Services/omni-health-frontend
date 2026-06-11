"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarContentNav } from "@/features/user/components/desktop/sidebar-content";
import ExploreFacilitiesMap from "../explore-facilities-map";

export function ExploreFacilitiesDesktopLayout() {
  return (
    <SidebarProvider
      defaultOpen={false}
      className="!mx-0 !max-w-full h-dvh overflow-hidden"
    >
      <SidebarContentNav />

      <main className="flex-1 overflow-hidden">
        <ExploreFacilitiesMap />
      </main>
    </SidebarProvider>
  );
}
