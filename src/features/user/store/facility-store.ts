import { create } from "zustand";
import { FacilityStore } from "../types";
export const useFacilityStore = create<FacilityStore>((set) => ({
  selectedFacility: null,
  setSelectedFacility(id) {
    return set({ selectedFacility: id });
  },
}));
