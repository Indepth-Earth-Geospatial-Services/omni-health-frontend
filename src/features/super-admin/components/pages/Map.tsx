"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Switch } from "@/features/admin/components/ui/switch";
import SuperAdminMap from "../ui/SuperAdminMap";
import { Facility } from "@/types/api-response";
import { useFacilities } from "@/features/super-admin/hooks/useSuperAdminUsers";

export default function Map() {
  const searchParams = useSearchParams();
  const facilityIdFromUrl = searchParams.get("facility_id");

  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null,
  );

  // Fetch all facilities with a large limit to show on map
  // Note: API maximum limit is 100
  const { data, isLoading, isError } = useFacilities({
    page: 1,
    limit: 1000,
  });

  // Auto-select facility from URL query param
  useEffect(() => {
    if (facilityIdFromUrl && data?.facilities) {
      const facility = data.facilities.find(
        (f) => f.facility_id === facilityIdFromUrl,
      );
      if (facility) {
        setSelectedFacility(facility as unknown as Facility);
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
    console.log("Facility clicked:", facility);
  };

  // Extract facilities from API response
  const facilities = data?.facilities || [];
  const pagination = data?.pagination;

  // Calculate statistics for debugging
  const facilitiesWithCoords = facilities.filter((f) => f.lat && f.lon);
  const facilitiesWithoutCoords = facilities.filter((f) => !f.lat || !f.lon);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-sm text-slate-500">Loading facilities map...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-red-100 p-3">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-red-600">
            Failed to load facilities
          </p>
          <p className="text-xs text-slate-500">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white p-6">
      <div className="flex gap-4">
        {/* Map container - fixed height using viewport units */}
        <div className="h-[70vh] flex-1 overflow-hidden rounded-2xl border border-slate-200">
          <SuperAdminMap
            facilities={facilities as unknown as Facility[]}
            width="100%"
            height="100%"
            visibleLayers={visibleLayers}
            onMarkerClick={handleMarkerClick}
            selectedFacility={selectedFacility}
          />
        </div>

        {/* Layers Panel */}
        <div className="overflow-y-auto border-slate-200 bg-white p-6">
          <div className="rounded-lg border border-gray-200 px-6 py-4">
            <h2 className="mb-6 text-base font-semibold text-slate-900">
              Layers
            </h2>
            <div className="space-y-4">
              {/* Hospitals Layer */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-700">Hospitals</p>
                <Switch
                  checked={visibleLayers.hospitals}
                  onCheckedChange={() => handleLayerToggle("hospitals")}
                />
              </div>

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
            <div className="space-y-2 text-xs">
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
            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                Selected Facility
              </h3>
              <p className="text-sm font-medium text-slate-700">
                {selectedFacility.facility_name}
              </p>
              {selectedFacility.facility_category && (
                <p className="mt-1 text-xs text-slate-500">
                  {selectedFacility.facility_category}
                </p>
              )}
              {selectedFacility.address && (
                <p className="mt-2 text-xs text-slate-600">
                  {selectedFacility.address}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
