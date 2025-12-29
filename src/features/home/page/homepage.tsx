// "use client";
// import MapComponent from "@/features/home/components/map";
// import ResultsDrawer from "../components/results-drawer";
// import FacilityDetailsDrawer from "../components/facility-details-drawer";
// import { useEffect, useMemo, useState } from "react";
// import { useUserLocation } from "../hooks/useUserLocation";
// import axios from "axios";
// import { NearestFacilityResponse } from "../types/apiResponse";

// export default function HomePage() {
//   // TODO MOVE STATE GLOBAL
//   const [isResultsOpen, setIsResultsOpen] = useState(true);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(
//     null,
//   );
//   const [fetchError, setFetchError] = useState("");
//   const [isFetching, setIsFetching] = useState(true);
//   const [nearestFacilities, setNearestFacilities] =
//     useState<NearestFacilityResponse | null>(null);
//   const [LGAFacilities, setLGAFacilities] = useState<Record<
//     number,
//     NearestFacilityResponse
//   > | null>(null);

//   const { error, isLoading, location, requestLocation } = useUserLocation();

//   const handleViewDetails = (facilityId: string) => {
//     setSelectedFacilityId(facilityId);
//     setIsDetailsOpen(true);
//     setIsResultsOpen(false);
//   };

//   const handleCloseDetails = () => {
//     setIsDetailsOpen(false);
//     setSelectedFacilityId(null);
//     setIsResultsOpen(true);
//   };

//   const limitedLGAFacilities = useMemo(() => {
//     if (!LGAFacilities) return null;

//     const entries = Object.entries(LGAFacilities);
//     // Only take first 20 facilities
//     const limited = entries.slice(0, 80);

//     return Object.fromEntries(limited) as Record<
//       number,
//       NearestFacilityResponse
//     >;
//   }, [LGAFacilities]);

//   useEffect(() => {
//     if (isLoading || !location?.lat || !location?.lng) return;

//     const abortController = new AbortController();

//     async function fetchAllData() {
//       setIsFetching(true);
//       setFetchError("");
//       try {
//         // Fetch both in parallel
//         const [nearestData, lgaData] = await Promise.all([
//           axios.get(
//             `/api/backend/facilities/nearest?lat=${location.lat}&lon=${location.lng}`,
//             { signal: abortController.signal },
//           ),
//           axios.get(
//             `/api/backend/facilities/detect-location?lat=${location.lat}&lon=${location.lng}&limit=20`,
//             { signal: abortController.signal },
//           ),
//         ]);
//         console.log("NEAREST", nearestData);
//         console.log("LGA", lgaData);
//         setNearestFacilities(nearestData.data);
//         setLGAFacilities(lgaData.data);
//       } catch (error: any) {
//         if (error.name === "CanceledError") return;
//         setFetchError(error.message || "An Error Occurred!");
//       } finally {
//         setIsFetching(false);
//       }
//     }

//     fetchAllData();
//     return () => abortController.abort();
//   }, [location?.lat, location?.lng, isLoading]);

//   return (
//     <main className="mx-auto h-full max-h-dvh">
//       <section className="fixed inset-0 h-full sm:left-1/2 sm:max-w-120 sm:-translate-x-1/2">
//         <MapComponent />
//       </section>
//       <section>
//         {isLoading && (
//           <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded bg-white px-4 py-2 shadow">
//             Getting your location...
//           </div>
//         )}
//         {error && !isLoading && (
//           <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded bg-red-100 px-4 py-2 text-red-700 shadow">
//             {error}
//             <button onClick={requestLocation} className="ml-2 underline">
//               Retry
//             </button>
//           </div>
//         )}

//         <ResultsDrawer
//           isOpen={isResultsOpen}
//           onClose={() => setIsResultsOpen(false)}
//           onViewDetails={handleViewDetails}
//           facility={nearestFacilities}
//           isLoading={isFetching}
//           error={fetchError}
//           LGAFacility={limitedLGAFacilities}
//         />
//         <FacilityDetailsDrawer
//           isOpen={isDetailsOpen}
//           onClose={handleCloseDetails}
//           facilityId={selectedFacilityId}
//         />
//       </section>
//     </main>
//   );
// }
"use client";
import MapComponent from "@/features/home/components/map";
import ResultsDrawer from "../components/results-drawer";
import FacilityDetailsDrawer from "../components/facility-details-drawer";
import { useEffect, useState, useMemo } from "react";
import { useUserLocation } from "../hooks/useUserLocation";
import axios from "axios";
import { NearestFacilityResponse } from "../types/apiResponse";

function HomePage() {
  const [isResultsOpen, setIsResultsOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(
    null,
  );
  const [fetchError, setFetchError] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [nearestFacilities, setNearestFacilities] =
    useState<NearestFacilityResponse | null>(null);
  const [LGAFacilities, setLGAFacilities] = useState<Record<
    number,
    NearestFacilityResponse
  > | null>(null);

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

  // SOLUTION 1: Memoize and limit the LGA facilities to first 20
  const limitedLGAFacilities = useMemo(() => {
    if (!LGAFacilities) return null;

    const entries = Object.entries(LGAFacilities);
    // Only take first 20 facilities
    const limited = entries.slice(0, 90);

    return Object.fromEntries(limited) as Record<
      number,
      NearestFacilityResponse
    >;
  }, [LGAFacilities]);

  useEffect(() => {
    if (isLoading || !location?.lat || !location?.lng) return;

    const abortController = new AbortController();

    async function fetchAllData() {
      setIsFetching(true);
      setFetchError("");
      try {
        // SOLUTION 2: Fetch only nearest facility first for faster initial load
        const nearestData = await axios.get(
          `/api/backend/facilities/nearest?lat=${location.lat}&lon=${location.lng}`,
          { signal: abortController.signal },
        );

        setNearestFacilities(nearestData.data);
        setIsFetching(false); // Set to false after first important data loads

        // SOLUTION 3: Fetch LGA data separately (non-blocking)
        const lgaData = await axios.get(
          `/api/backend/facilities/detect-location?lat=${location.lat}&lon=${location.lng}&limit=20`,
          { signal: abortController.signal },
        );

        console.log("NEAREST", nearestData);
        console.log("LGA", lgaData);

        // SOLUTION 4: Limit the data before setting state
        const lgaFacilities = lgaData.data;
        if (lgaFacilities && typeof lgaFacilities === "object") {
          const entries = Object.entries(lgaFacilities);
          const limited = entries.slice(0, 80);
          setLGAFacilities(
            Object.fromEntries(limited) as Record<
              number,
              NearestFacilityResponse
            >,
          );
        } else {
          setLGAFacilities(lgaData.data);
        }
      } catch (error: any) {
        if (error.name === "CanceledError") return;
        setFetchError(error.message || "An Error Occurred!");
        setIsFetching(false);
      }
    }

    fetchAllData();
    return () => abortController.abort();
  }, [location?.lat, location?.lng, isLoading]);

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
          LGAFacility={limitedLGAFacilities}
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
