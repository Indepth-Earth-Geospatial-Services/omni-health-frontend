"use client";

import { useState } from "react";
import Link from "next/link";
import SuperAdminMap from "../ui/SuperAdminMap";
import { Facility } from "@/types/api-response";
import { useFacilities } from "@/features/super-admin/hooks/useSuperAdminUsers";

export default function QuickAccessMap() {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null,
  );

  // Fetch facilities for the map
  const { data, isLoading, isError } = useFacilities({
    page: 1,
    limit: 1000,
  });

  const facilities = data?.facilities || [];

  // Handle marker click
  const handleMarkerClick = (facility: Facility) => {
    setSelectedFacility(facility);
  };

  return (
    <div className="mt-10 w-full max-w-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header Section */}
      <div className="relative mb-8 flex items-baseline justify-between border-b border-gray-200 pb-2">
        {/* Left Side: Title + Custom Underline */}
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-gray-900">
            Facility Distribution
          </h2>
        </div>
        <Link
          href="/super-admin/map"
          className="font-dmsans relative z-10 text-sm text-[12px] font-medium text-[#525866] hover:underline"
        >
          Open Map
        </Link>
      </div>

      {/* Map Container */}
      <div className="h-[500px] w-full overflow-hidden rounded-xl">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
              <p className="text-sm text-gray-500">Loading map...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <div className="text-center">
              <p className="text-sm font-medium text-red-500">
                Failed to load facilities
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Please try again later
              </p>
            </div>
          </div>
        ) : (
          <SuperAdminMap
            facilities={facilities as unknown as Facility[]}
            width="100%"
            height="100%"
            onMarkerClick={handleMarkerClick}
            selectedFacility={selectedFacility}
          />
        )}
      </div>

      {/* Selected Facility Info */}
      {selectedFacility && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {selectedFacility.facility_name}
              </p>
              {selectedFacility.facility_category && (
                <p className="text-xs text-gray-500">
                  {selectedFacility.facility_category}
                </p>
              )}
            </div>
            <Link
              href={`/super-admin/map?facility_id=${selectedFacility.facility_id}`}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              View Details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
