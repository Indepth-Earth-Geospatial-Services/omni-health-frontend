import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useUserStore } from "../store/user-store";
import { useFacilityStore } from "../store/facility-store";
import { useLGAFacilities, useNearestFacility } from "@/hooks/use-facilities";

export function useDrawerData(isGettingLocation: boolean) {
  const [activeFilter, setActiveFilter] = useState("Distance");
  const userLocation = useUserStore((state) => state.userLocation);

  // Store Setters
  const setNearestFacility = useFacilityStore((s) => s.setNearestFacility);
  const setAllFacilities = useFacilityStore((s) => s.setAllFacilities);

  // 1. Fetching
  const nearestQuery = useNearestFacility(userLocation);
  const lgaQuery = useLGAFacilities(userLocation);

  // 2. Infinite Scroll Logic
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "50px",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inView && lgaQuery.hasNextPage && !lgaQuery.isFetchingNextPage) {
        lgaQuery.fetchNextPage();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [inView, lgaQuery]);

  // 3. Derived Data
  const nearestFacility = nearestQuery.data?.facility;

  const allFacilities = useMemo(() => {
    return lgaQuery.data?.pages?.flatMap((p) => p.facilities) || [];
  }, [lgaQuery.data]);

  const sortedFacilities = useMemo(() => {
    const filtered = allFacilities.filter(
      (f) => f.facility_id !== nearestFacility?.facility_id,
    );
    return filtered.sort((a, b) => {
      if (activeFilter === "Distance")
        return (a.road_distance_meters || 0) - (b.road_distance_meters || 0);
      return (b.average_rating || 0) - (a.average_rating || 0);
    });
  }, [allFacilities, nearestFacility, activeFilter]);

  // 4. Store Synchronization (Side Effects)
  useEffect(() => {
    if (nearestFacility) setNearestFacility(nearestFacility);
  }, [nearestFacility, setNearestFacility]);

  useEffect(() => {
    if (allFacilities.length > 0) setAllFacilities(allFacilities);
  }, [allFacilities, setAllFacilities]);

  // 5. Status Flags
  const isLoading =
    nearestQuery.isLoading || lgaQuery.isLoading || isGettingLocation;
  const showEmptyState =
    !isLoading && !lgaQuery.error && sortedFacilities.length === 0;

  return {
    // Data
    nearestFacility,
    sortedFacilities,
    // Status
    isLoading,
    showEmptyState,
    hasLocation: !!userLocation,
    // Errors
    nearestError: nearestQuery.error,
    lgaError: lgaQuery.error,
    // Actions
    refetchNearest: nearestQuery.refetch,
    refetchLGA: lgaQuery.refetch,
    loadMoreRef,
    isFetchingNextPage: lgaQuery.isFetchingNextPage,
    hasNextPage: lgaQuery.hasNextPage,
    // Filter
    activeFilter,
    setActiveFilter,
  };
}
