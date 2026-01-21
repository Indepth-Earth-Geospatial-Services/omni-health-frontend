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
  const [viewState, setViewState] = useState({
    longitude: 7.0498,
    latitude: 4.8156,
    zoom: 15,
    pitch: 0,
    bearing: 0,
  });

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
        padding: {
          top: 40,
          bottom: 450,
          left: 50,
          right: 50,
        },
        duration: 1000,
      });
    }
  }, [routeGeometry]);

  // Update viewport when user location changes
  useEffect(() => {
    if (userLocation && mapRef.current) {
      // eslint-disable-next-line
      setViewState((prev) => ({
        ...prev,
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
      }));
    }
  }, [userLocation]);

  useEffect(() => {
    if (highlightedFacility && mapRef.current) {
      mapRef.current.flyTo({
        center: [highlightedFacility.lon, highlightedFacility.lat],
        zoom: 16, // Set a comfortable zoom level for viewing a facility
        duration: 1500,
        padding: { top: 40, bottom: 350, left: 50, right: 50 }, // Respect your drawer offset
        essential: true, // Ensures animation runs even if user prefers reduced motion
      });
    }
  }, [highlightedFacility]);
  console.log("HIGHLIGHTED FACILITY FROM MAP COMPONENT", highlightedFacility);
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
            <div className="group relative flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-red-400 shadow-sm transition-all hover:scale-125 hover:bg-red-500">
              <span className="text-[8px] font-bold text-white">+</span>
              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-2 hidden rounded bg-gray-900 px-2 py-1 text-[10px] whitespace-nowrap text-white group-hover:block">
                {facility.facility_name || "Health Centre"}
              </div>
            </div>
          </Marker>
        ))}

      {/* Highlighted Facility - Small dot markers with + cross */}
      {highlightedFacility && (
        <Marker
          key={highlightedFacility.facility_id}
          longitude={highlightedFacility.lon}
          latitude={highlightedFacility.lat}
        >
          <div className="group relative flex size-6 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-red-400 shadow-sm transition-all hover:scale-125 hover:bg-red-500">
            <span className="text-[10px] font-bold text-white">+</span>
            {/* Tooltip on hover */}
            <div className="absolute bottom-full mb-2 hidden rounded bg-gray-900 px-2 py-1 text-[10px] whitespace-nowrap text-white group-hover:block">
              {highlightedFacility.facility_name || "Health Centre"}
            </div>
          </div>
        </Marker>
      )}

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
        // <Source
        //   id="route"
        //   type="geojson"
        //   lineMetrics={true} // Essential for the line-gradient to render
        //   data={{
        //     type: "Feature",
        //     properties: {},
        //     geometry: routeGeometry,
        //   }}
        // >
        //   {/* 1. LAYER: SOFT OUTER SHADOW */}
        //   <Layer
        //     id="route-shadow"
        //     type="line"
        //     layout={{ "line-join": "round", "line-cap": "round" }}
        //     paint={{
        //       "line-color": "#000000",
        //       "line-width": 12,
        //       "line-opacity": 0.2,
        //       "line-blur": 8,
        //       "line-translate": [2, 4], // Creates the 3D depth effect
        //     }}
        //   />

        //   {/* 2. LAYER: DARK BORDER (The "Casing") */}
        //   <Layer
        //     id="route-border"
        //     type="line"
        //     layout={{ "line-join": "round", "line-cap": "round" }}
        //     paint={{
        //       "line-color": "#00243D", // Your requested border color
        //       "line-width": 10, // Must be wider than the gradient line
        //     }}
        //   />

        //   {/* 3. LAYER: THE GRADIENT FILL */}
        //   <Layer
        //     id="route-line"
        //     type="line"
        //     layout={{ "line-join": "round", "line-cap": "round" }}
        //     paint={{
        //       "line-width": 6,
        //       "line-gradient": [
        //         "interpolate",
        //         ["linear"],
        //         ["line-progress"],
        //         0,
        //         "#C6F1F8", // Start color
        //         0.5,
        //         "#FFFFFF", // Center highlight
        //         1,
        //         "#C6F1F8", // End color
        //       ],
        //     }}
        //   />
        // </Source>

        <Source
          id="route"
          type="geojson"
          lineMetrics={true}
          data={{
            type: "Feature",
            properties: {},
            geometry: routeGeometry,
          }}
        >
          {/* 1. SOFT DEPTH SHADOW - Uses a subtle blur to lift the route off the map */}
          <Layer
            id="route-shadow"
            type="line"
            layout={{ "line-join": "round", "line-cap": "round" }}
            paint={{
              "line-color": "#000000",
              "line-width": 12,
              "line-opacity": 0.12,
              "line-blur": 6,
              "line-translate": [1.5, 3],
            }}
          />

          {/* 2. OUTER CASING - Creates a sharp "border" effect for high contrast */}
          <Layer
            id="route-border"
            type="line"
            layout={{ "line-join": "round", "line-cap": "round" }}
            paint={{
              "line-color": "#054A91", // Deep Navy Blue
              "line-width": 9,
            }}
          />

          {/* 3. PREMIUM GRADIENT LINE - Vibrant blue with a subtle inner glow */}
          <Layer
            id="route-line"
            type="line"
            layout={{ "line-join": "round", "line-cap": "round" }}
            paint={{
              "line-width": 5.5,
              "line-gradient": [
                "interpolate",
                ["linear"],
                ["line-progress"],
                0,
                "#00B4DB", // Start: Bright Cyan-Blue (at User)
                0.5,
                "#4285F4", // Middle: Google Blue (Standard focus)
                1,
                "#083D77", // End: Royal Blue (at Destination)
              ],
            }}
          />
        </Source>
      )}

      {/* Controls */}
      {/* <GeolocateControl
        position="top-right"
        trackUserLocation
        showUserLocation
      /> */}
      {/* <NavigationControl position="top-right" /> */}
    </Map>
  );
}

export default MapComponent;
