import { SearchFilterStore } from "@/types/search-filter";
import { create } from "zustand";

export const useSearchFilterStore = create<SearchFilterStore>((set) => ({
  searchQuery: "",
  isSearchExpanded: false,

  selectedFilters: {
    facilityType: [],
    performanceTier: [],
    serviceAvailability: [],
    lga: [],
  },

  isFilterOpen: false,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsSearchExpanded: (expanded) => set({ isSearchExpanded: expanded }),

  toggleFilter: (category, value) =>
    set((state) => {
      const currentValues = state.selectedFilters[category] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        selectedFilters: {
          ...state.selectedFilters,
          [category]: newValues,
        },
      };
    }),
  setIsFilterOpen: (open) => set({ isFilterOpen: open }),

  clearAllFilters: () =>
    set({
      searchQuery: "",
      isSearchExpanded: false,

      selectedFilters: {
        facilityType: [],
        performanceTier: [],
        serviceAvailability: [],
        lga: [],
      },

      isFilterOpen: false,
    }),
}));
