"use client";
import { useEffect, useRef, useState } from "react";
import Map, {
  Marker,
  NavigationControl,
  Source,
  Layer,
} from "react-map-gl/mapbox";
import { MAPBOX_TOKEN } from "@/constants";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { Facility } from "@/types/api-response";

interface SuperAdminMapProps {
  facilities?: Facility[];
  width?: string;
  height?: string;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  showNavigation?: boolean;
  visibleLayers?: {
    hospitals: boolean;
    healthPosts: boolean;
    healthClinics: boolean;
    modelHealthcare: boolean;
  };
  onMarkerClick?: (facility: Facility) => void;
  selectedFacility?: Facility | null;
  className?: string;
}

// Facility type color mapping based on the design
const FACILITY_COLORS = {
  hospital: "#3B82F6", // Blue
  "general hospital": "#3B82F6", // Blue
  "model healthcare": "#F59E0B", // Orange
  "primary health center": "#F59E0B", // Orange
  "health post": "#8B5CF6", // Purple
  "health clinic": "#EF4444", // Red
  cottage: "#EF4444", // Red
  "cottage hospital": "#EF4444", // Red
};

// Helper function to get facility color
const getFacilityColor = (category?: string): string => {
  if (!category) return "#6B7280"; // Gray for unknown

  const lowerCategory = category.toLowerCase();

  // Check exact matches first
  if (FACILITY_COLORS[lowerCategory as keyof typeof FACILITY_COLORS]) {
    return FACILITY_COLORS[lowerCategory as keyof typeof FACILITY_COLORS];
  }

  // Check partial matches
  if (lowerCategory.includes("hospital")) return FACILITY_COLORS.hospital;
  if (lowerCategory.includes("model") || lowerCategory.includes("primary"))
    return FACILITY_COLORS["model healthcare"];
  if (lowerCategory.includes("post")) return FACILITY_COLORS["health post"];
  if (lowerCategory.includes("clinic") || lowerCategory.includes("cottage"))
    return FACILITY_COLORS["health clinic"];

  return "#6B7280"; // Default gray
};

// Helper function to get facility type label
const getFacilityTypeLabel = (category?: string): string => {
  if (!category) return "Unknown";

  const lowerCategory = category.toLowerCase();

  if (lowerCategory.includes("hospital") && !lowerCategory.includes("cottage"))
    return "Hospital";
  if (lowerCategory.includes("model") || lowerCategory.includes("primary"))
    return "Model Healthcare";
  if (lowerCategory.includes("post")) return "Health Post";
  if (lowerCategory.includes("clinic") || lowerCategory.includes("cottage"))
    return "Health Clinic";

  return category;
};

// Check if facility should be visible based on layer settings
const isFacilityVisible = (
  category?: string,
  visibleLayers?: SuperAdminMapProps["visibleLayers"],
): boolean => {
  if (!visibleLayers) return true; // Show all if no filter specified

  const lowerCategory = category?.toLowerCase() || "";

  if (lowerCategory.includes("hospital") && !lowerCategory.includes("cottage"))
    return visibleLayers.hospitals;
  if (lowerCategory.includes("model") || lowerCategory.includes("primary"))
    return visibleLayers.modelHealthcare;
  if (lowerCategory.includes("post")) return visibleLayers.healthPosts;
  if (lowerCategory.includes("clinic") || lowerCategory.includes("cottage"))
    return visibleLayers.healthClinics;

  return true; // Show unknown types by default
};

export default function SuperAdminMap({
  facilities = [],
  width = "80%",
  height = "60vh",
  initialViewState = {
    longitude: 7.0498,
    latitude: 4.8156,
    zoom: 11,
  },
  showNavigation = true,
  visibleLayers,
  onMarkerClick,
  selectedFacility,
  className = "",
}: SuperAdminMapProps) {
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState(initialViewState);

  // Fit map to show all facilities
  useEffect(() => {
    if (facilities.length > 0 && mapRef.current) {
      const bounds = new mapboxgl.LngLatBounds();

      facilities.forEach((facility) => {
        if (facility.lon && facility.lat) {
          bounds.extend([facility.lon, facility.lat]);
        }
      });

      mapRef.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1000,
      });
    }
  }, [facilities]);

  // Zoom to selected facility
  useEffect(() => {
    if (
      selectedFacility &&
      mapRef.current &&
      selectedFacility.lon &&
      selectedFacility.lat
    ) {
      mapRef.current.flyTo({
        center: [selectedFacility.lon, selectedFacility.lat],
        zoom: 16,
        duration: 1500,
        essential: true,
      });
    }
  }, [selectedFacility]);

  // Filter facilities based on visible layers
  const visibleFacilities = facilities.filter((facility) =>
    isFacilityVisible(facility.facility_category, visibleLayers),
  );

  return (
    <div className={className} style={{ width, height }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {/* Facility Markers */}
        {visibleFacilities.map((facility) => {
          if (!facility.lon || !facility.lat) return null;

          const color = getFacilityColor(facility.facility_category);
          const isSelected =
            selectedFacility?.facility_id === facility.facility_id;

          return (
            <Marker
              key={facility.facility_id}
              longitude={facility.lon}
              latitude={facility.lat}
              anchor="bottom"
            >
              <div
                onClick={() => onMarkerClick?.(facility)}
                className="group relative flex cursor-pointer flex-col items-center"
              >
                {/* Facility Name Label (shows on hover) */}
                <div className="pointer-events-none absolute bottom-full mb-2 hidden rounded-md bg-gray-900/90 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white shadow-lg group-hover:block">
                  {facility.facility_name || "Unknown Facility"}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/90"></div>
                </div>

                {/* Marker Pin */}
                <div
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-lg transition-all duration-200 ${
                    isSelected
                      ? "ring-opacity-50 scale-125 ring-4 ring-white"
                      : "group-hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {/* Pulsing effect for selected facility */}
                  {isSelected && (
                    <div
                      className="absolute -inset-2 animate-ping rounded-full opacity-30"
                      style={{ backgroundColor: color }}
                    ></div>
                  )}

                  {/* Icon */}
                  <div className="relative z-10 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  {/* Pin Tail */}
                  <div
                    className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r-4 border-b-4 border-white"
                    style={{ backgroundColor: color }}
                  ></div>
                </div>
              </div>
            </Marker>
          );
        })}

        {/* Navigation Controls */}
        {showNavigation && <NavigationControl position="top-right" />}
      </Map>
    </div>
  );
}
