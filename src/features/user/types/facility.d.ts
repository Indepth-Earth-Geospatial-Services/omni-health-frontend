import { Facility } from "./apiResponse";
import { Coordinates } from "./user";

export interface FacilityState {
  selectedFacility: string | null;
  nearUserFacilityCoordinate: Coordinates;
}

export interface FacilityActions {
  setSelectedFacility: (id: string) => void;
  setNearUserFacilityCoordinate: (coordinates: Coordinates) => void;
}

export type FacilityStore = FacilityState & FacilityActions;
