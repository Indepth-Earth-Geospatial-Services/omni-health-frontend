"use client";
import { MAPBOX_TOKEN } from "@/constants";
import { useDrawerStore } from "@/features/user/store/drawer-store";
import { useFacilityStore } from "@/features/user/store/facility-store";
import { Facility } from "@/features/user/types";
import { useMapCamera } from "@/hooks/use-map-camera";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useState } from "react";
import Map from "react-map-gl/mapbox";
import {
  DestinationMarker,
  FacilityDotMarker,
  FacilityPinMarker,
  MapRoute,
  UserLocationMarker,
} from "./map-parts";

interface MapComponentProps {
  userLocation?: { longitude: number; latitude: number } | null;
  routeGeometry?: any;
  destination?: { longitude: number; latitude: number } | null;
  onViewportChange?: (viewState: any) => void;
  showUserPin?: boolean;
  nearYouFacilities?: Facility[];
  highlightedFacility?: Facility | null;
  showNearYouFacilities?: boolean;
  allFacilities?: Facility[];
  showAllFacilities?: boolean;
}

function MapComponent({
  userLocation = null,
  routeGeometry = null,
  destination = null,
  onViewportChange,
  showUserPin = false,
  nearYouFacilities = [],
  showNearYouFacilities = false,
  highlightedFacility = null,
  allFacilities = [],
  showAllFacilities = false,
}: MapComponentProps) {
  const mapRef = useRef<any>(null);

  // -- State --
  const [viewState, setViewState] = useState({
    longitude: 7.0498,
    latitude: 4.8156,
    zoom: 15,
    pitch: 0,
    bearing: 0,
  });

  // -- Store --
  const setSelectedFacility = useFacilityStore(
    (state) => state.setSelectedFacility,
  );
  const selectedFacility = useFacilityStore((state) => state.selectedFacility);
  const openDetails = useDrawerStore((state) => state.openDetails);

  // -- Handlers --
  const handleMarkerClick = (e: any, facility: Facility) => {
    e.originalEvent?.stopPropagation();
    setSelectedFacility(facility);
    openDetails();
  };

  const handleMove = (evt: any) => {
    setViewState(evt.viewState);
    onViewportChange?.(evt.viewState);
  };

  useMapCamera({
    mapRef,
    userLocation,
    routeGeometry,
    nearYouFacilities,
    showNearYouFacilities,
    allFacilities,
    highlightedFacility: selectedFacility,
  });

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={handleMove}
      style={{ width: "100%", height: "100dvh" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {/* 1. Route Layer */}
      <MapRoute routeGeometry={routeGeometry} />

      {/* 2. User Location */}
      {userLocation && showUserPin && (
        <UserLocationMarker coords={userLocation} />
      )}

      {/* 3. Destination */}
      {destination && <DestinationMarker coords={destination} />}

      {/* 4. "Near You" Facilities (Pins) */}
      {!showUserPin &&
        showNearYouFacilities &&
        nearYouFacilities.map((facility) => (
          <FacilityPinMarker
            key={`near-${facility.facility_id}`}
            facility={facility}
            onClick={handleMarkerClick}
          />
        ))}

      {/* 5. All Facilities (Dots) */}
      {showAllFacilities &&
        allFacilities.map((facility) => (
          <FacilityDotMarker
            key={`all-${facility.facility_id}`}
            facility={facility}
            onClick={handleMarkerClick}
          />
        ))}

      {/* 6. Highlighted Facility (Large Dot) */}
      {highlightedFacility && (
        <FacilityDotMarker facility={highlightedFacility} isHighlighted />
      )}
    </Map>
  );
}

export default MapComponent;
