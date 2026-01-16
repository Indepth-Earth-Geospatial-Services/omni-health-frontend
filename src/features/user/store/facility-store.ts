import { create } from "zustand";
import { FacilityStore } from "../types";
export const useFacilityStore = create<FacilityStore>((set) => ({
  selectedFacility: null,
  nearestFacility: null,
  allFacilities: [],

  setAllFacilities(facilities) {
    set({ allFacilities: facilities });
  },

  setSelectedFacility(id) {
    set({ selectedFacility: id });
  },

  setNearestFacility(facility) {
    set({
      nearestFacility: facility,
    });
  },
}));
