"use client";
import { MAPBOX_TOKEN } from "@/constants";
import { useFacilityStore } from "@/features/user/store/facility-store";
import { Facility } from "@/features/user/types";
import { Plus } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Map, { Layer, Marker, Popup, Source } from "react-map-gl/mapbox";
import riversLgas from "../data/rivers-lgas.json";
import riversLGA from "../data/boundary.json";
import FacilityInfoCard from "./facility-info-card";

interface ExploreMapProps {
  allFacilities?: Facility[];
}

const facilityColors = {
  "Primary Health Center": "#2ECC71",        // fresh green – community-level care
  "Primary": "#27AE60",                      // deeper green – same tier, slight contrast

  "Health Post": "#1ABC9C",                  // teal – basic outreach facilities
  "Primary Health Clinic": "#16A085",        // darker teal – related but distinct

  "Secondary Health Care Centre": "#3498DB", // blue – mid-level care
  "Secondary": "#2980B9",                    // deeper blue – same tier

  "General Hospital": "#9B59B6",             // purple – advanced/general care
  "Cottage Hospital": "#8E44AD",             // deeper purple – related category
};

function ExploreMap({ allFacilities = [] }: ExploreMapProps) {
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState({
    longitude: 7.0498,
    latitude: 4.8156,
    zoom: 8,
    pitch: 0,
    bearing: 0,
  });

  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null,
  );
  const setSelectedFacilityInStore = useFacilityStore(
    (state) => state.setSelectedFacility,
  );
  const onViewDetails = () => {
    setSelectedFacilityInStore(selectedFacility);
    router.push(`/facilities/${selectedFacility.facility_id}`);
  };

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
      <Source id="lga-boundaries" type="geojson" data={riversLGA as any}>
        <Layer
          id="lga-fill"
          type="fill"
          paint={{
            "fill-color": "#51a199",
            "fill-opacity": 0.1,
          }}
        />
        <Layer
          id="lga-outline"
          type="line"
          paint={{
            "line-color": "#51a199",
            "line-width": 1,
          }}
        />
      </Source>
      {allFacilities.map((facility) => (
        <Marker
          key={facility.facility_id}
          longitude={facility.lon}
          latitude={facility.lat}
          onClick={() => setSelectedFacility(facility)}
        >
          <div className="group relative flex cursor-pointer flex-col items-center">
            <div
              className="group relative flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-sm transition-all hover:scale-125"
              style={{
                backgroundColor:
                  facilityColors[
                    facility.facility_category as keyof typeof facilityColors
                  ] || "#51a199",
              }}
            >
              <Plus className="h-3 w-3 text-white" />
            </div>
            <div className="absolute bottom-full mb-2 hidden rounded bg-white/90 px-2 py-1 text-xs font-semibold whitespace-nowrap text-green-700 shadow-sm backdrop-blur-sm transition-all group-hover:block">
              {facility.facility_name || "Health Centre"}
            </div>
          </div>
        </Marker>
      ))}

      {selectedFacility && (
        <Popup
          longitude={selectedFacility.lon!}
          latitude={selectedFacility.lat!}
          onClose={() => setSelectedFacility(null)}
          closeOnClick={false}
          anchor="top"
          offset={10}
          className="facility-popup"
        >
          <FacilityInfoCard
            handleOnViewDetails={onViewDetails}
            facility={selectedFacility}
          />
        </Popup>
      )}
    </Map>
  );
}

export default ExploreMap;
