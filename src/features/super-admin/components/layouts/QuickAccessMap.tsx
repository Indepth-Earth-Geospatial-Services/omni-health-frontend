"use client";

import { useState } from "react";
import Link from "next/link";
import SuperAdminMap from "../ui/SuperAdminMap";
import { Facility } from "@/types/api-response";
// TEMP: see src/features/super-admin/TEMP-chunked-facilities/README.md
import { useFacilitiesForMap } from "@/features/super-admin/TEMP-chunked-facilities/useChunkedFacilities";

export default function QuickAccessMap() {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null,
  );

  // Fetch facilities for the map
  const { data, isLoading, isError } = useFacilitiesForMap();

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

      {/* Map Container. The map renders immediately — tiles are ready in about
          a second — with facilities arriving behind a non-blocking chip, rather
          than a spinner standing in for the whole map while they load. */}
      <div className="relative h-[500px] w-full overflow-hidden rounded-xl">
        <SuperAdminMap
          facilities={facilities as unknown as Facility[]}
          width="100%"
          height="100%"
          onMarkerClick={handleMarkerClick}
          selectedFacility={selectedFacility}
        />

        {isLoading && (
          <div className="pointer-events-none absolute top-3 left-1/2 z-10 -translate-x-1/2">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3.5 py-1.5 shadow-md backdrop-blur-sm">
              <div className="border-primary h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-t-transparent" />
              <p className="text-xs font-medium text-slate-600">
                Loading facilities
                {data?.pagination?.total_records
                  ? ` — ${facilities.length} of ${data.pagination.total_records}`
                  : "…"}
              </p>
            </div>
          </div>
        )}

        {isError && (
          <div className="pointer-events-none absolute top-3 left-1/2 z-10 -translate-x-1/2">
            <div className="rounded-full border border-red-200 bg-white/95 px-3.5 py-1.5 shadow-md backdrop-blur-sm">
              <p className="text-xs font-medium text-red-600">
                Could not load facilities
              </p>
            </div>
          </div>
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
