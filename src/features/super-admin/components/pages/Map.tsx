"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Switch } from "@/features/admin/components/ui/switch";
import SuperAdminMap from "../ui/SuperAdminMap";
import { Facility } from "@/types/api-response";
// TEMP: see src/features/super-admin/TEMP-chunked-facilities/README.md
import { useFacilitiesForMap } from "@/features/super-admin/TEMP-chunked-facilities/useChunkedFacilities";
import {
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  Building2,
  X,
  Users,
  Stethoscope,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/features/admin/components/ui/button";

export default function Map() {
  const searchParams = useSearchParams();
  const facilityIdFromUrl = searchParams.get("facility_id");

  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null,
  );

  // Track if we've already auto-selected from URL to prevent re-selection
  const hasAutoSelected = useRef(false);

  // Fetch all facilities for the map.
  // gcTime: 30 min — data stays in memory across navigations so revisiting the
  //   map page shows instantly from cache instead of re-fetching.
  // refetchInterval: 5 min — background poll keeps pins up-to-date silently.
  // refetchIntervalInBackground: false — stops polling when the tab is hidden.
  //
  // TEMP: these options apply in production, which still makes the single
  // limit=1000 request. Local dev pages through in chunks instead, because the
  // dev server's rewrite proxy times out at 30 s where Vercel's does not.
  // See src/features/super-admin/TEMP-chunked-facilities/README.md
  const { data, isLoading, isError } = useFacilitiesForMap({
    gcTime: 1000 * 60 * 30,
    refetchInterval: 1000 * 60 * 5,
    refetchIntervalInBackground: false,
  });

  // Auto-select facility from URL query param when data loads
  // Using queueMicrotask to defer state update and avoid cascading render warning
  useEffect(() => {
    if (facilityIdFromUrl && data?.facilities && !hasAutoSelected.current) {
      const facility = data.facilities.find(
        (f) => f.facility_id === facilityIdFromUrl,
      );
      if (facility) {
        hasAutoSelected.current = true;
        queueMicrotask(() => {
          setSelectedFacility(facility as unknown as Facility);
        });
      }
    }
  }, [facilityIdFromUrl, data?.facilities]);

  // Layer visibility state
  const [visibleLayers, setVisibleLayers] = useState({
    hospitals: true,
    healthPosts: true,
    healthClinics: true,
    modelHealthcare: true,
  });

  // Handle layer toggle
  const handleLayerToggle = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  // Handle marker click
  const handleMarkerClick = (facility: Facility) => {
    setSelectedFacility(facility);
    // console.log("Facility clicked:", facility);
  };

  // Extract facilities from API response
  const facilities = data?.facilities || [];
  const pagination = data?.pagination;

  // Calculate statistics for debugging
  const facilitiesWithCoords = facilities.filter((f) => f.lat && f.lon);
  const facilitiesWithoutCoords = facilities.filter((f) => !f.lat || !f.lon);

  // Loading and error no longer short-circuit the page. Map tiles come from
  // Mapbox and are ready in about a second, so the map, layer toggles and
  // statistics render straight away while facilities arrive behind them —
  // rather than replacing the whole screen with a spinner for the ~54 s the
  // facility request takes.

  return (
    <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-6">
      {/* Stacks below lg so the map keeps full width on phones and tablets,
          where a side panel would squeeze both into unusable columns. */}
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Map container. Viewport-relative on small screens; on lg it fills
            the space left by the 64px header and the page padding, so the
            layout fits without the page itself scrolling. */}
        <div className="relative h-[55vh] min-h-80 w-full overflow-hidden rounded-2xl border border-slate-200 sm:h-[65vh] lg:h-[calc(100vh-7rem)] lg:min-w-0 lg:flex-1">
          <SuperAdminMap
            facilities={facilities as unknown as Facility[]}
            width="100%"
            height="100%"
            visibleLayers={visibleLayers}
            onMarkerClick={handleMarkerClick}
            selectedFacility={selectedFacility}
          />

          {/* Non-blocking status chip. The map stays pannable underneath, and
              the count makes it obvious that pins are still arriving so a
              half-populated map is not mistaken for a complete one. */}
          {isLoading && (
            <div className="pointer-events-none absolute top-3 left-1/2 z-10 w-max max-w-[calc(100%-1.5rem)] -translate-x-1/2 sm:top-4">
              <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-sm sm:px-4 sm:py-2">
                <div className="border-primary h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-t-transparent" />
                <p className="truncate text-xs font-medium text-slate-600">
                  Loading facilities
                  {pagination?.total_records
                    ? ` — ${facilities.length} of ${pagination.total_records}`
                    : "…"}
                </p>
              </div>
            </div>
          )}

          {isError && (
            <div className="absolute top-3 left-1/2 z-10 w-max max-w-[calc(100%-1.5rem)] -translate-x-1/2 sm:top-4">
              <div className="flex items-center gap-2.5 rounded-full border border-red-200 bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-sm sm:px-4 sm:py-2">
                <AlertTriangle size={15} className="shrink-0 text-red-500" />
                <p className="truncate text-xs font-medium text-red-600">
                  <span className="hidden sm:inline">
                    Could not load facilities — the map is empty
                  </span>
                  <span className="sm:hidden">Could not load facilities</span>
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="text-primary shrink-0 text-xs font-semibold hover:underline"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Layers Panel. Full width beneath the map on small screens; a fixed
            column that scrolls independently once there is room beside it. */}
        <div className="w-full bg-white lg:h-[calc(100vh-7rem)] lg:w-80 lg:shrink-0 lg:overflow-y-auto xl:w-96">
          <div className="rounded-lg border border-gray-200 px-4 py-4 sm:px-6">
            <h2 className="mb-4 text-base font-semibold text-slate-900 sm:mb-6">
              Layers
            </h2>
            {/* Side by side on wider phones/tablets to save vertical space,
                back to a single column once the panel is narrow again. */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {/* Hospitals Layer */}
              {/* <div className="flex items-center justify-between">
                <p className="text-sm text-slate-700">Hospitals</p>
                <Switch
                  checked={visibleLayers.hospitals}
                  onCheckedChange={() => handleLayerToggle("hospitals")}
                />
              </div> */}

              {/* Health Posts Layer */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-700">Health Posts</p>
                <Switch
                  checked={visibleLayers.healthPosts}
                  onCheckedChange={() => handleLayerToggle("healthPosts")}
                />
              </div>

              {/* Health Clinics Layer */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-700">Health Clinics</p>
                <Switch
                  checked={visibleLayers.healthClinics}
                  onCheckedChange={() => handleLayerToggle("healthClinics")}
                />
              </div>

              {/* Model Healthcare Layer */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-700">Model Healthcare</p>
                <Switch
                  checked={visibleLayers.modelHealthcare}
                  onCheckedChange={() => handleLayerToggle("modelHealthcare")}
                />
              </div>
            </div>
          </div>
          {/* Facility Statistics */}
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Map Statistics
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs lg:grid-cols-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Loaded:</span>
                <span className="font-medium text-slate-700">
                  {facilities.length}
                </span>
              </div>
              {pagination && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Total in Database:</span>
                  <span className="font-medium text-slate-700">
                    {pagination.total_records}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">With Coordinates:</span>
                <span className="font-medium text-green-600">
                  {facilitiesWithCoords.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Missing Coordinates:</span>
                <span className="font-medium text-amber-600">
                  {facilitiesWithoutCoords.length}
                </span>
              </div>
            </div>
          </div>

          {/* Selected Facility Info (if any) */}
          {selectedFacility && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
              {/* Header with close button */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                    <Building2 size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    Facility Details
                  </span>
                </div>
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Facility Image */}
              <div className="relative h-40 w-full bg-gradient-to-br from-slate-100 to-slate-200">
                {selectedFacility.image_urls &&
                selectedFacility.image_urls.length > 0 ? (
                  <Image
                    src={selectedFacility.image_urls[0]}
                    alt={selectedFacility.facility_name || "Facility"}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <Building2 size={48} className="text-slate-300" />
                    <span className="mt-2 text-xs text-slate-400">
                      No image available
                    </span>
                  </div>
                )}
                {/* Category Badge */}
                {selectedFacility.facility_category && (
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm">
                      {selectedFacility.facility_category}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Facility Name */}
                <h3 className="text-base font-bold text-slate-900">
                  {selectedFacility.facility_name}
                </h3>

                {/* Rating */}
                {(selectedFacility.average_rating !== undefined ||
                  selectedFacility.total_reviews !== undefined) && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star
                        size={14}
                        className="fill-amber-400 text-amber-400"
                      />
                      <span className="text-sm font-semibold text-slate-700">
                        {selectedFacility.average_rating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      ({selectedFacility.total_reviews || 0} reviews)
                    </span>
                  </div>
                )}

                {/* Address */}
                {selectedFacility.address && (
                  <div className="mt-3 flex items-start gap-2">
                    <MapPin
                      size={14}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />
                    <p className="text-xs leading-relaxed text-slate-600">
                      {selectedFacility.address}
                    </p>
                  </div>
                )}

                {/* LGA/Town */}
                {(selectedFacility.town || selectedFacility.facility_lga) && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="text-xs text-slate-500">
                      {selectedFacility.town || selectedFacility.facility_lga}
                    </span>
                  </div>
                )}

                {/* Divider */}
                <div className="my-4 border-t border-slate-100" />

                {/* Contact Info */}
                <div className="space-y-2">
                  {selectedFacility.contact_info?.phone && (
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50">
                        <Phone size={12} className="text-green-600" />
                      </div>
                      <span className="text-xs text-slate-600">
                        {selectedFacility.contact_info.phone}
                      </span>
                    </div>
                  )}
                  {selectedFacility.contact_info?.email && (
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                        <Mail size={12} className="text-blue-600" />
                      </div>
                      <span className="truncate text-xs text-slate-600">
                        {selectedFacility.contact_info.email}
                      </span>
                    </div>
                  )}
                </div>

                {/* Specialists Preview */}
                {selectedFacility.specialists &&
                  selectedFacility.specialists.length > 0 && (
                    <div className="mt-4">
                      <div className="mb-2 flex items-center gap-1.5">
                        <Users size={12} className="text-slate-400" />
                        <span className="text-xs font-medium text-slate-600">
                          Specialists
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedFacility.specialists
                          .slice(0, 3)
                          .map((spec, idx) => (
                            <span
                              key={idx}
                              className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700"
                            >
                              {spec
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                          ))}
                        {selectedFacility.specialists.length > 3 && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            +{selectedFacility.specialists.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                {/* Services Preview */}
                {selectedFacility.services_list &&
                  selectedFacility.services_list.length > 0 && (
                    <div className="mt-3">
                      <div className="mb-2 flex items-center gap-1.5">
                        <Stethoscope size={12} className="text-slate-400" />
                        <span className="text-xs font-medium text-slate-600">
                          Services
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedFacility.services_list
                          .slice(0, 3)
                          .map((service, idx) => (
                            <span
                              key={idx}
                              className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700"
                            >
                              {service
                                .replace(/["""']/g, "")
                                .trim()
                                .toLowerCase()
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </span>
                          ))}
                        {selectedFacility.services_list.length > 3 && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            +{selectedFacility.services_list.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                {/* Working Hours (if emergency available) */}
                {selectedFacility.working_hours?.emergency && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
                    <Clock size={14} className="text-red-500" />
                    <div>
                      <span className="text-[10px] font-medium text-red-700">
                        Emergency:
                      </span>
                      <span className="ml-1 text-[10px] text-red-600">
                        {selectedFacility.working_hours.emergency}
                      </span>
                    </div>
                  </div>
                )}

                {/* View Details Button */}
                {/* <a href="/super-admin/facility">
                  <button className="bg-primary mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg">
                    View Full Details
                    <ExternalLink size={14} />
                  </button>
                </a> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
