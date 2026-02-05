import { useMemo } from "react";
import { useFacilityStore } from "../store/facility-store";
import { useDebounce } from "@/hooks/use-debounce";

export function useFacilityData() {
  const nearestFacility = useFacilityStore((s) => s.nearestFacility);
  const allFacilities = useFacilityStore((s) => s.allFacilities);

  const debouncedNearest = useDebounce(nearestFacility, 800);
  const debouncedAll = useDebounce(allFacilities, 200);

  const nearYouFacilities = useMemo(
    () => (debouncedNearest ? [debouncedNearest] : []),
    [debouncedNearest],
  );

  const otherFacilities = useMemo(
    () =>
      debouncedAll
        ? debouncedAll.filter(
            (f) => f.facility_id !== debouncedNearest?.facility_id,
          )
        : [],
    [debouncedAll, debouncedNearest],
  );

  return { nearYouFacilities, otherFacilities };
}
