import { useCallback } from "react";
import { useDrawerStore } from "../store/drawer-store";
import { useFacilityStore } from "../store/facility-store";
import { Facility } from "../types";

export function useDrawerActions() {
  const { openDetails, openResults, openDirections } = useDrawerStore();
  const setSelectedFacility = useFacilityStore((s) => s.setSelectedFacility);

  const handleViewDetails = useCallback(
    (facility: Facility) => {
      setSelectedFacility(facility);
      openDetails();
    },
    [setSelectedFacility, openDetails],
  );

  const handleCloseDetails = useCallback(() => {
    setSelectedFacility(null);
    openResults();
  }, [setSelectedFacility, openResults]);

  const handleShowDirections = useCallback(() => {
    openDirections();
  }, [openDirections]);

  const handleCloseDirections = useCallback(() => {
    openResults();
  }, [openResults]);

  return {
    handleViewDetails,
    handleCloseDetails,
    handleShowDirections,
    handleCloseDirections,
  };
}
