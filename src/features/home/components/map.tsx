"use client";
import { useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN } from "@/constants";

interface MapComponentProps {
  mapCenter?: {
    latitude: number;
    longitude: number;
  } | null;
}

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

function MapComponent({ mapCenter }: MapComponentProps) {
  const [viewState, setViewState] = useState<ViewState>({
    longitude: mapCenter?.longitude ?? 7.0498,
    latitude: mapCenter?.latitude ?? 4.8156,
    zoom: mapCenter ? 15 : 13,
  });

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: "100%", height: "100dvh" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {/* Add marker at initial location */}
      <Marker longitude={7.0498} latitude={4.8156} color="red" />

      {/* Add marker at searched location */}
      {mapCenter && (
        <Marker
          longitude={mapCenter.longitude}
          latitude={mapCenter.latitude}
          color="blue"
        />
      )}

      {/* Add navigation controls */}
      <NavigationControl position="top-right" />
    </Map>
  );
}
export default MapComponent;
