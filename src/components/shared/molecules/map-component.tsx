"use client";
import { useEffect, useRef, useState } from "react";
import Map, {
  Marker,
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
} from "react-map-gl/mapbox";
import { MAPBOX_TOKEN } from "@/constants";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { Facility } from "@/features/user/types";

interface MapComponentProps {
  userLocation?: { longitude: number; latitude: number } | null;
  routeGeometry?: any;
  destination?: { longitude: number; latitude: number } | null;
  onViewportChange?: (viewState: any) => void;
  showUserPin?: boolean;
  nearYouFacilities?: Facility[];
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
  allFacilities = [],
  showAllFacilities = false,
}: MapComponentProps) {
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState({
    longitude: 7.0498,
    latitude: 4.8156,
    zoom: 15,
    pitch: 0,
    bearing: 0,
  });
  console.log(
    "FROM MAP COMPONENT",
    nearYouFacilities[0]?.lat,
    nearYouFacilities[0]?.lat,
  );
  useEffect(() => {
    if (
      showNearYouFacilities &&
      nearYouFacilities.length > 0 &&
      mapRef.current
    ) {
      const bounds = new mapboxgl.LngLatBounds();

      nearYouFacilities.forEach((f) => bounds.extend([f.lon, f.lat]));
      allFacilities.forEach((f) => bounds.extend([f.lon, f.lat]));

      if (userLocation)
        bounds.extend([userLocation.longitude, userLocation.latitude]);

      mapRef.current.fitBounds(bounds, {
        padding: { top: 40, bottom: 350, left: 50, right: 50 }, // 350px cleared for drawer
        duration: 1000,
      });
    }
  }, [showNearYouFacilities, nearYouFacilities, userLocation, allFacilities]);

  // Fit map to route when route changes
  useEffect(() => {
    if (routeGeometry && mapRef.current) {
      const coordinates = routeGeometry.coordinates;
      const bounds = coordinates.reduce(
        (bounds: any, coord: [number, number]) => {
          return bounds.extend(coord);
        },
        new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]),
      );

      mapRef.current.fitBounds(bounds, {
        padding: 50,
        duration: 1000,
      });
    }
  }, [routeGeometry]);

  // Update viewport when user location changes
  useEffect(() => {
    if (userLocation && mapRef.current) {
      setViewState((prev) => ({
        ...prev,
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
      }));
    }
  }, [userLocation]);

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={(evt) => {
        setViewState(evt.viewState);
        onViewportChange?.(evt.viewState);
      }}
      style={{ width: "100%", height: "100dvh" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {/* User Location Marker - Only show when showUserPin is true */}
      {userLocation && showUserPin && (
        <Marker
          longitude={userLocation.longitude}
          latitude={userLocation.latitude}
          color="#0095FF"
        >
          <div className="relative">
            <div className="absolute -inset-4 animate-ping rounded-full bg-blue-500 opacity-20"></div>
            <div className="relative h-8 w-8 rounded-full border-4 border-white bg-blue-500 shadow-lg"></div>
          </div>
        </Marker>
      )}

      {/* Near You Facilities - Only show when showNearYouFacilities is true and showUserPin is false */}
      {!showUserPin &&
        showNearYouFacilities &&
        nearYouFacilities.map((facility, i) => (
          <Marker
            key={i}
            longitude={facility.lon}
            latitude={facility.lat}
            anchor="bottom" // Ensures the tip of the pin is on the coordinate
          >
            <div className="group relative flex cursor-pointer flex-col items-center">
              {/* Label Container */}
              <div className="mt-3 rounded-md bg-white/90 px-2 py-0.5 shadow-sm backdrop-blur-sm transition-all">
                <p className="text-xs font-semibold whitespace-nowrap text-green-700">
                  {/* Show name on hover/click, otherwise show "Near you" */}
                  <span className="block text-[10px] tracking-wider uppercase group-hover:hidden">
                    Near you !
                  </span>
                  <span className="hidden italic group-hover:block">
                    {facility.facility_name || "Health Centre"}
                  </span>
                </p>
              </div>

              {/* The Pin Body */}
              <div className="bg-primary relative flex h-9 w-9 items-center justify-center rounded-full border-4 border-white shadow-lg transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
                {/* Medical/Facility Icon inside the pin */}
                <span className="text-lg font-bold text-white">+</span>

                {/* The Pointy Tip (Tail) */}
                <div className="bg-primary absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r-4 border-b-4 border-white"></div>
              </div>
            </div>
          </Marker>
        ))}

      {/* All Facilities Around User - Small dot markers with + cross */}
      {showAllFacilities &&
        allFacilities.map((facility) => (
          <Marker
            key={facility.facility_id}
            longitude={facility.lon}
            latitude={facility.lat}
          >
            <div className="group relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-red-500 shadow-sm transition-all hover:scale-125 hover:bg-red-600">
              <span className="text-[10px] font-bold text-white">+</span>
              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-2 hidden rounded bg-gray-900 px-2 py-1 text-[10px] whitespace-nowrap text-white group-hover:block">
                {facility.facility_name || "Health Centre"}
              </div>
            </div>
          </Marker>
        ))}

      {/* Destination Marker */}
      {destination && (
        <Marker
          longitude={destination.longitude}
          latitude={destination.latitude}
          color="#FF4757"
        >
          <div className="relative">
            <div className="h-8 w-8 rounded-full border-4 border-white bg-red-500 shadow-lg"></div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full text-xs font-bold text-red-500">
              Destination
            </div>
          </div>
        </Marker>
      )}

      {/* Route Layer */}
      {routeGeometry && (
        <Source
          id="route"
          type="geojson"
          data={{
            type: "Feature",
            properties: {},
            geometry: routeGeometry,
          }}
        >
          <Layer
            id="route-line"
            type="line"
            paint={{
              "line-color": "#0095FF",
              "line-width": 4,
              "line-opacity": 0.8,
            }}
          />
          <Layer
            id="route-outline"
            type="line"
            paint={{
              "line-color": "#FFFFFF",
              "line-width": 6,
              "line-opacity": 0.3,
            }}
          />
        </Source>
      )}

      {/* Controls */}
      <GeolocateControl
        position="bottom-right"
        trackUserLocation
        showUserLocation
      />
      <NavigationControl position="bottom-right" />
    </Map>
  );
}

export default MapComponent;
