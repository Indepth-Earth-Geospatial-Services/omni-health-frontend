import { create } from "zustand";
import { UserStore } from "../types";
export const useUserStore = create<UserStore>((set) => ({
  userLocation: null,
  locationError: null,
  isLoadingPosition: false,

  setIsLoadingPosition(state) {
    set({ isLoadingPosition: state });
  },

  setLocationError(error) {
    set({ locationError: error });
  },

  setUserLocation(location) {
    set({
      userLocation: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
  },
}));
