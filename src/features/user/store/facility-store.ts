import { create } from "zustand";
import { FacilityStore } from "../types";
export const useFacilityStore = create<FacilityStore>((set) => ({
  selectedFacility: null,
  nearUserFacilityCoordinate: null,
  setSelectedFacility(id) {
    set({ selectedFacility: id });
  },
  setNearUserFacilityCoordinate(coordinates) {
    set({
      nearUserFacilityCoordinate: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    });
  },
}));
