"use client";
import MapComponent from "@/features/home/components/map";
import ResultsDrawer from "../components/results-drawer";
import FacilityDetailsDrawer from "../components/facility-details-drawer";
import { useEffect, useState } from "react";
import { useUserLocation } from "../hooks/useUserLocation";
import axios from "axios";
import { NearestFacilityResponse } from "../types/apiResponse";

function HomePage() {
  // TODO MOVE STATE GLOBAL
  const [isResultsOpen, setIsResultsOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(
    null,
  );
  const [fetchError, setFetchError] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [nearestFacilities, setNearestFacilities] =
    useState<NearestFacilityResponse | null>(null);
  const [LGAFacilities, setLGAFacilities] =
    useState<Array<NearestFacilityResponse> | null>(null);

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

  useEffect(() => {
    // Skip if still loading location or no location yet
    if (isLoading) {
      console.log("⏳ Still loading location...");
      return;
    }

    if (!location?.lat || !location?.lng) {
      console.log("❌ No location available yet");
      return;
    }

    console.log("✅ Location available, fetching facilities...");

    const abortController = new AbortController();

    async function fetchNearestFacilities() {
      setIsFetching(true);
      setFetchError("");

      try {
        const { data } = await axios.get(
          `/api/backend/facilities/nearest?lat=${location?.lat}&lon=${location?.lng}`,
          {
            signal: abortController.signal,
          },
        );

        console.log("✅ Facilities fetched:", data);
        setNearestFacilities(data);
      } catch (error: any) {
        if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          console.log("🚫 Request cancelled");
          return;
        }

        console.error("❌ Fetch error:", error);
        setFetchError(
          error.message || "An Error Occurred! Please refresh and try again",
        );
      } finally {
        setIsFetching(false);
      }
    }

    fetchNearestFacilities();

    return () => {
      abortController.abort();
    };
  }, [location?.lat, location?.lng, isLoading]);

  // useEffect(() => {
  //   // Skip if still loading location or no location yet
  //   if (isLoading) {
  //     console.log("⏳ Still loading location...");
  //     return;
  //   }

  //   if (!location?.lat || !location?.lng) {
  //     console.log("❌ No location available yet");
  //     return;
  //   }

  //   console.log("✅ Location available,  fetching LGA facilities...");

  //   const abortController = new AbortController();

  //   async function fetchLGAFacilities() {
  //     setIsFetching(true);
  //     setFetchError("");

  //     try {
  //       // const { data } = await axios.get(
  //       //   `/api/backend/facilities/detect-location?lat=${location?.lat}&lon=${location?.lng}`,
  //       //   {
  //       //     signal: abortController.signal,
  //       //   },
  //       // );
  //       const { data } = await axios.get(
  //         `/api/backend/facilities`,
  //         {
  //           signal: abortController.signal,
  //         },
  //       );

  //       console.log("✅ LGAFACILITIES fetched:", data);
  //       setLGAFacilities(data);
  //     } catch (error: any) {
  //       if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
  //         console.log("🚫 Request cancelled");
  //         return;
  //       }

  //       console.error("❌ Fetch error:", error);
  //       setFetchError(
  //         error.message || "An Error Occurred! Please refresh and try again",
  //       );
  //     } finally {
  //       setIsFetching(false);
  //     }
  //   }

  //   fetchLGAFacilities();

  //   return () => {
  //     abortController.abort();
  //   };
  // }, [location?.lat, location?.lng, isLoading]);

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
          facility={nearestFacilities}
          isLoading={isFetching}
          error={fetchError}
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

export default HomePage;
