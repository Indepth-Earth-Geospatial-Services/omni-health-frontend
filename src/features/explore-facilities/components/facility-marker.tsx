"use client";

import { Facility } from "@/features/user/types";

interface FacilityMarkerProps {
  facility: Facility;
  isSelected: boolean;
  onClick: () => void;
}

function FacilityMarker({ facility, isSelected, onClick }: FacilityMarkerProps) {
  const pinColor = isSelected ? "#51a199" : "#333";
  const pinScale = isSelected ? "scale(1.2)" : "scale(1)";

  return (
    <div
      className="group relative flex cursor-pointer flex-col items-center"
      onClick={onClick}
      style={{ transform: pinScale, transition: 'transform 0.2s ease-in-out' }}
    >
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 hidden rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block whitespace-nowrap">
        {facility.facility_name || "Health Centre"}
      </div>

      {/* Pin Body */}
      <div
        className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-lg"
        style={{ backgroundColor: pinColor }}
      >
        {/* Medical/Facility Icon inside the pin */}
        <span className="text-lg font-bold text-white">+</span>

        {/* The Pointy Tip (Tail) */}
        <div
          className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-white"
          style={{ backgroundColor: pinColor }}
        ></div>
      </div>
    </div>
  );
}

export default FacilityMarker;
