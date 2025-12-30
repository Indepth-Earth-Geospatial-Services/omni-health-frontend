"use client";
import MapComponent from "@/features/home/components/map";
import { useState } from "react";
import FacilityDetailsDrawer from "../components/facility-details-drawer";
import ResultsDrawer from "../components/results-drawer";
import { useUserLocation } from "../hooks/useUserLocation";
import { useFacilityStore } from "../store/facilityStore";
import { useUserStore } from "../store/userStore";

export default function HomePage() {
  const [isResultsOpen, setIsResultsOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const setSelectedFacilityId = useFacilityStore(
    (state) => state.setSelectedFacility,
  );
  const selectedFacilityId = useFacilityStore(
    (state) => state.selectedFacility,
  );

  const { error, isLoading, location, requestLocation } = useUserLocation();

  const handleViewDetails = (facilityId: string) => {
    setSelectedFacilityId(facilityId);
    setIsDetailsOpen(true);
    setIsResultsOpen(false);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedFacilityId(null);
    setIsResultsOpen(true);
  };

  // const limitedLGAFacilities = useMemo(() => {
  //   if (!LGAFacilities) return null;

  //   const entries = Object.entries(LGAFacilities);
  //   // Only take first 20 facilities
  //   const limited = entries.slice(0, 80);

  //   return Object.fromEntries(limited) as Record<
  //     number,
  //     NearestFacilityResponse
  //   >;
  // }, [LGAFacilities]);

  return (
    <main className="mx-auto h-full max-h-dvh">
      <section className="fixed inset-0 h-full sm:left-1/2 sm:max-w-120 sm:-translate-x-1/2">
        <MapComponent />
      </section>
      <section>
        {isLoading && (
          <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded bg-white px-4 py-2 shadow">
            Getting your location...
          </div>
        )}
        {error && !isLoading && (
          <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded bg-red-100 px-4 py-2 text-red-700 shadow">
            {error}
            <button onClick={requestLocation} className="ml-2 underline">
              Retry
            </button>
          </div>
        )}

        <ResultsDrawer
          isOpen={isResultsOpen}
          onClose={() => setIsResultsOpen(false)}
          onViewDetails={handleViewDetails}
        />
        <FacilityDetailsDrawer
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
          facilityId={selectedFacilityId}
        />
      </section>
    </main>
  );
}
