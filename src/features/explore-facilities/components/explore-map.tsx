"use client";
import { useEffect, useRef, useState } from "react";
import Map, {
  Marker,
} from "react-map-gl/mapbox";
import { MAPBOX_TOKEN } from "@/constants";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { Facility } from "@/features/user/types";

interface ExploreMapProps {
  allFacilities?: Facility[];
}

function ExploreMap({
  allFacilities = [],
}: ExploreMapProps) {
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState({
    longitude: 7.0498,
    latitude: 4.8156,
    zoom: 6,
    pitch: 0,
    bearing: 0,
  });

  useEffect(() => {
    if (allFacilities.length > 0 && mapRef.current) {
      const bounds = new mapboxgl.LngLatBounds();
      allFacilities.forEach((f) => {
        if (f.lon && f.lat) {
          bounds.extend([f.lon, f.lat]);
        }
      });

      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds, {
          padding: { top: 100, bottom: 100, left: 100, right: 100 },
          duration: 1000,
          maxZoom: 15,
        });
      }
    }
  }, [allFacilities]);

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={(evt) => {
        setViewState(evt.viewState);
      }}
      style={{ width: "100%", height: "100dvh" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {allFacilities.map((facility) => (
        <Marker
          key={facility.facility_id}
          longitude={facility.lon}
          latitude={facility.lat}
        >
          <div className="group relative flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-red-400 shadow-sm transition-all hover:scale-125 hover:bg-red-500">
            <span className="text-[8px] font-bold text-white">+</span>
            <div className="absolute bottom-full mb-2 hidden rounded bg-gray-900 px-2 py-1 text-[10px] whitespace-nowrap text-white group-hover:block">
              {facility.facility_name || "Health Centre"}
            </div>
          </div>
        </Marker>
      ))}
    </Map>
  );
}

export default ExploreMap;
