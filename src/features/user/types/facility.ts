import { Facility } from "../../../types/api-response";

export interface FacilityState {
  selectedFacility: Facility | null;
  nearestFacility: Facility | null;
  allFacilities: Facility[];
}

export interface FacilityActions {
  setSelectedFacility: (facility: Facility) => void;
  setNearestFacility: (facility: Facility) => void;
  setAllFacilities: (allFacilities) => void;
}

export type FacilityStore = FacilityState & FacilityActions;
