import { Facility } from "../../../types/api-response";

export interface Coordinates {
  latitude: number;
  longitude: number;
}
export interface UserState {
  userLocation: Coordinates | null;
  lastUpdated: number | null;
  locationError: string | null;
  isLoadingPosition: boolen;
  permissionState: "prompt" | "granted" | "denied" | "unsupported" | null;
}

export interface UserActions {
  setUserLocation: (location: Coordinates) => void;
  setLocationError: (error: string | null) => void;
  setIsLoadingPosition: (state) => void;
  setPermissionState: (state: UserStore["permissionState"]) => void;
}

export type UserStore = UserState & UserActions;
