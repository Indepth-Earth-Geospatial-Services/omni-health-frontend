import { Facility } from "./apiResponse";

export interface FacilityState {
  selectedFacility: string | null;
  nearestFacility: Facility | null;
  allFacilities: Facility[];
}

export interface FacilityActions {
  setSelectedFacility: (id: string) => void;
  setNearestFacility: (facility: Facility) => void;
  setAllFacilities: (allFacilities) => void;
}

export type FacilityStore = FacilityState & FacilityActions;
