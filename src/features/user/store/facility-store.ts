import { create } from "zustand";
import { FacilityStore } from "../types";
export const useFacilityStore = create<FacilityStore>((set) => ({
  selectedFacility: null,
  nearestFacility: null,
  allFacilities: [],

  setAllFacilities(facilities) {
    set({ allFacilities: facilities });
  },

  setSelectedFacility(facility) {
    set({ selectedFacility: facility });
  },

  setNearestFacility(facility) {
    set({
      nearestFacility: facility,
    });
  },
}));
