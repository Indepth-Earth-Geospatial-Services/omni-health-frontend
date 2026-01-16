"use client";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN } from "@/constants";

function MapComponent() {
  return (
    <Map
      initialViewState={{
        longitude: 7.0498,
        latitude: 4.8156,
        zoom: 15,
      }}
      style={{ width: "100%", height: "100dvh" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {/* Add marker */}
      <Marker longitude={7.0498} latitude={4.8156} color="red" />

      {/* Add navigation controls */}
      <NavigationControl position="bottom-right" />
    </Map>
  );
}
export default MapComponent;
