import { useState, useMemo } from "react";
import { Facility } from "@/types/api-response";

export function useCompareFacilities() {
  const [facilities, setFacilities] = useState<(Facility | null)[]>([
    null,
    null,
  ]);

  const addFacility = (facility: Facility, index: number) => {
    if (index >= 0 && index < 2) {
      const newFacilities = [...facilities];
      newFacilities[index] = facility;
      setFacilities(newFacilities);
    }
  };

  const removeFacility = (index: number) => {
    if (index >= 0 && index < 2) {
      const newFacilities = [...facilities];
      newFacilities[index] = null;
      setFacilities(newFacilities);
    }
  };

  const clearAll = () => {
    setFacilities([null, null]);
  };

  const isReadyToCompare = useMemo(
    () => facilities.filter(Boolean).length === 2,
    [facilities],
  );

  return {
    facilities,
    addFacility,
    removeFacility,
    clearAll,
    isReadyToCompare,
    selectedFacilitiesCount: facilities.filter(Boolean).length,
  };
}
