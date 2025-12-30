import { Facility } from "./apiResponse";

export interface FacilityState {
  selectedFacility: string | null;
}

export interface FacilityActions {
  setSelectedFacility: (id: string) => void;
}

export type FacilityStore = FacilityState & FacilityActions;
