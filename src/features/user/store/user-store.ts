import { create } from "zustand";
import { UserStore } from "../types";
import { createJSONStorage, persist } from "zustand/middleware";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userLocation: null,
      locationError: null,
      isLoadingPosition: false,
      lastUpdated: null,
      permissionState: null,

      setPermissionState: (state) => set({ permissionState: state }),
      setIsLoadingPosition: (state) => set({ isLoadingPosition: state }),
      setLocationError: (error) => set({ locationError: error }),
      setUserLocation: (location) =>
        set({
          userLocation: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          lastUpdated: Date.now(),
          locationError: null,
        }),
    }),
    {
      name: "user-location-storage",
      // Custom storage engine that checks expiry on READ
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const item = localStorage.getItem(name);
          if (!item) return null;

          try {
            const parsed = JSON.parse(item);
            // Access the state part of the Zustand JSON structure
            const state = parsed.state;

            // CHECK: Is the data expired?
            if (
              state?.lastUpdated &&
              Date.now() - state.lastUpdated > STALE_TIME
            ) {
              // Should we clear it? Usually yes, to keep storage clean.
              localStorage.removeItem(name);
              return null; // Return null to simulate a fresh start
            }
            return item;
          } catch (e) {
            return null;
          }
        },
        setItem: (name, value) => localStorage.setItem(name, value),
        removeItem: (name) => localStorage.removeItem(name),
      })),

      partialize: (state) => ({
        userLocation: state.userLocation,
        lastUpdated: state.lastUpdated,
      }),
    },
  ),
);
