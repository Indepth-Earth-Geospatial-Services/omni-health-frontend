import { Marker, Source, Layer } from "react-map-gl/mapbox";
import { Facility } from "@/features/user/types";
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

// --- Route Component ---
export const MapRoute = ({ routeGeometry }: { routeGeometry: any }) => {
  if (!routeGeometry) return null;

  return (
    <Source
      id="route"
      type="geojson"
      lineMetrics={true}
      data={{ type: "Feature", properties: {}, geometry: routeGeometry }}
    >
      {/* Shadow */}
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
      {/* Border */}
      <Layer
        id="route-border"
        type="line"
        layout={{ "line-join": "round", "line-cap": "round" }}
        paint={{ "line-color": "#054A91", "line-width": 9 }}
      />
      {/* Gradient */}
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
            "#00B4DB",
            0.5,
            "#4285F4",
            1,
            "#083D77",
          ],
        }}
      />
    </Source>
  );
};

// --- Marker: User Location ---
export const UserLocationMarker = ({
  coords,
}: {
  coords: { longitude: number; latitude: number };
}) => (
  <Marker
    longitude={coords.longitude}
    latitude={coords.latitude}
    color="#0095FF"
  >
    <div className="relative">
      <div className="absolute -inset-4 animate-ping rounded-full bg-blue-500 opacity-20"></div>
      <div className="relative h-8 w-8 rounded-full border-4 border-white bg-blue-500 shadow-lg"></div>
    </div>
  </Marker>
);

// --- Marker: Destination ---
export const DestinationMarker = ({
  coords,
}: {
  coords: { longitude: number; latitude: number };
}) => (
  <Marker
    longitude={coords.longitude}
    latitude={coords.latitude}
    color="#FF4757"
  >
    <div className="relative">
      <div className="h-8 w-8 rounded-full border-4 border-white bg-red-500 shadow-lg"></div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full text-xs font-bold text-red-500">
        Destination
      </div>
    </div>
  </Marker>
);

// --- Marker: Facility Pin (Near You) ---
export const FacilityPinMarker = ({
  facility,
  onClick,
}: {
  facility: Facility;
  onClick: (e: any, f: Facility) => void;
}) => (
  <Marker
    onClick={(e) => onClick(e, facility)}
    longitude={facility.lon}
    latitude={facility.lat}
    anchor="bottom"
  >
    <div className="group relative flex cursor-pointer flex-col items-center">
      <div className="mt-3 rounded-md bg-white/90 px-2 py-0.5 shadow-sm backdrop-blur-sm transition-all">
        <p className="text-xs font-semibold whitespace-nowrap text-green-700">
          <span className="block text-[10px] tracking-wider uppercase group-hover:hidden">
            Near you !
          </span>
          <span className="hidden italic group-hover:block">
            {facility.facility_name || "Health Centre"}
          </span>
        </p>
      </div>
      <div className="bg-primary relative flex h-9 w-9 items-center justify-center rounded-full border-4 border-white shadow-lg transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
        <span className="text-lg font-bold text-white">+</span>
        <div className="bg-primary absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r-4 border-b-4 border-white"></div>
      </div>
    </div>
  </Marker>
);

// --- Marker: Facility Dot (All/Highlighted) ---
export const FacilityDotMarker = ({
  facility,
  onClick,
  isHighlighted,
}: {
  facility: Facility;
  onClick?: (e: any, f: Facility) => void;
  isHighlighted?: boolean;
}) => (
  <Marker
    onClick={(e) => onClick && onClick(e, facility)}
    longitude={facility.lon}
    latitude={facility.lat}
  >
    <div
      className={`group relative flex ${isHighlighted ? "size-6" : "size-4"} cursor-pointer items-center justify-center rounded-full border-2 border-white bg-red-400 shadow-sm transition-all hover:scale-125 hover:bg-red-500`}
    >
      <span
        className={`${isHighlighted ? "text-[10px]" : "text-[8px]"} font-bold text-white`}
      >
        +
      </span>
      <div className="absolute bottom-full mb-2 hidden rounded bg-gray-900 px-2 py-1 text-[10px] whitespace-nowrap text-white group-hover:block">
        {facility.facility_name || "Health Centre"}
      </div>
    </div>
  </Marker>
);
