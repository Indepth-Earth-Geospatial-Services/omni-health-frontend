"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Switch } from "@/features/admin/components/ui/switch";
import SuperAdminMap from "../ui/SuperAdminMap";
import { Facility } from "@/types/api-response";
import { useFacilities } from "@/features/super-admin/hooks/useSuperAdminUsers";
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

  // Fetch all facilities with a large limit to show on map
  // Note: API maximum limit is 100
  const { data, isLoading, isError } = useFacilities({
    page: 1,
    limit: 1000,
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
        <div className="h-[100vh] flex-1 overflow-hidden rounded-2xl border border-slate-200">
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
        <div className="w-full max-w-25 overflow-y-auto bg-white md:max-w-37.5 lg:max-w-sm">
          <div className="rounded-lg border border-gray-200 px-6 py-4">
            <h2 className="mb-6 text-base font-semibold text-slate-900">
              Layers
            </h2>
            <div className="space-y-4">
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
