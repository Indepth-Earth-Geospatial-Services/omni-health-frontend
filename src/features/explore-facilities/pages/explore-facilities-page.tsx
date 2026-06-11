"use client";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { ExploreFacilitiesDesktopLayout } from "../components/desktop/explore-facilities-desktop-layout";
import ExploreFacilitiesMap from "../components/explore-facilities-map";

function ExploreFacilitiesPage() {
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return <ExploreFacilitiesDesktopLayout />;
  }
  return <ExploreFacilitiesMap />;
}

export default ExploreFacilitiesPage;
