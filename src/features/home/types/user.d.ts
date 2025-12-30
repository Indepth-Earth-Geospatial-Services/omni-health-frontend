import { Facility } from "./apiResponse";

export interface Coordinates {
  latitude: number;
  longitude: number;
}
export interface UserState {
  userLocation: Coordinates | null;
}

export interface UserActions {
  setUserLocation: (location: Coordinates) => void;
}

export type UserStore = UserState & UserActions;
