// store/searchFilterStore.ts
import { SearchFilterStore } from "@/types/search-filter";
import { create } from "zustand";

export const useSearchFilterStore = create<SearchFilterStore>((set) => ({
  // Initial state
  searchQuery: "",
  isSearchExpanded: false,
  selectedFilters: {
    facilityType: [],
    performanceTier: [],
    serviceAvailability: [],
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

  clearAllFilters: () =>
    set({
      selectedFilters: {
        facilityType: [],
        performanceTier: [],
        serviceAvailability: [],
      },
    }),

  setIsFilterOpen: (open) => set({ isFilterOpen: open }),
}));
