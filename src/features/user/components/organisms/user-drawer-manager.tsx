import { Facility } from "@/types";
import ResultsDrawer from "../drawers/results-drawer";
import FacilityDetailsDrawer from "../drawers/facility-details-drawer";
import DirectionDrawer from "../drawers/direction-drawer";

interface UserDrawerManagerProps {
  activeDrawer: string | null;
  selectedFacility: Facility | null;
  isLoadingPosition: boolean;
  actions: {
    handleViewDetails: (f: Facility) => void;
    handleCloseDetails: () => void;
    handleShowDirections: () => void;
    handleCloseDirections: () => void;
  };
}

export function UserDrawerManager({
  activeDrawer,
  selectedFacility,
  isLoadingPosition,
  actions,
}: UserDrawerManagerProps) {
  if (activeDrawer === "results") {
    return (
      <ResultsDrawer
        isOpen={true}
        onViewDetails={actions.handleViewDetails}
        isGettingLocation={isLoadingPosition}
      />
    );
  }

  if (activeDrawer === "details") {
    return (
      <FacilityDetailsDrawer
        isOpen={true}
        onClose={actions.handleCloseDetails}
        facility={selectedFacility}
        onShowDirections={actions.handleShowDirections}
      />
    );
  }

  if (activeDrawer === "directions") {
    return (
      <DirectionDrawer isOpen={true} onClose={actions.handleCloseDirections} />
    );
  }

  return null;
}
