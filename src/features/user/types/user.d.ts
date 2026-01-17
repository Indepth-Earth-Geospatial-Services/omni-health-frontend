import { Facility } from "../../../types/api-response";

export interface Coordinates {
  latitude: number;
  longitude: number;
}
export interface UserState {
  userLocation: Coordinates | null;
  locationError: string | null;
  isLoadingPosition: boolen;
}

export interface UserActions {
  setUserLocation: (location: Coordinates) => void;
  setLocationError: (error: string | null) => void;
  setIsLoadingPosition: (state) => void;
}

export type UserStore = UserState & UserActions;
