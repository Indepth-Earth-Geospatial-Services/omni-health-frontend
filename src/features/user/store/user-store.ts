import { create } from "zustand";
import { UserStore } from "../types";
import { createJSONStorage, persist } from "zustand/middleware";

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userLocation: null,
      locationError: null,
      isLoadingPosition: false,
      lastUpdated: null,
      permissionState: "prompt",

      setPermissionState(state) {
        set({ permissionState: state });
      },

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
          lastUpdated: Date.now(),
          locationError: null,
        });
      },
    }),
    {
      name: "user-location-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userLocation: state.userLocation,
        lastUpdated: state.lastUpdated,
        permissionState: state.permissionState,
      }),
    },
  ),
);
