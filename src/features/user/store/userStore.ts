import { create } from "zustand";
import { UserStore } from "../types";
export const useUserStore = create<UserStore>((set) => ({
  userLocation: null,

  setUserLocation(location) {
    return set({
      userLocation: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
  },
}));
