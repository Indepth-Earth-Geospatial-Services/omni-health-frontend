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

interface MapComponentProps {
  userLocation?: { longitude: number; latitude: number } | null;
  routeGeometry?: any;
  destination?: { longitude: number; latitude: number } | null;
  onViewportChange?: (viewState: any) => void;
}

function MapComponent({
  userLocation = null,
  routeGeometry = null,
  destination = null,
  onViewportChange,
}: MapComponentProps) {
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState({
    longitude: 7.0498,
    latitude: 4.8156,
    zoom: 15,
    pitch: 0,
    bearing: 0,
  });

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
      {/* User Location Marker */}
      {userLocation && (
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
