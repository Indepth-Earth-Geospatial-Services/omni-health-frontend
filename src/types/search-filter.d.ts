export interface FilterOption {
  id: string;
  label: string;
  value: string;
  icon?: any;
}

export interface FilterCategory {
  title: string;
  options: FilterOption[];
  storeKey: string;
}

export interface FilterQuery {
  category?: string[];
  performance_tier?: string[];
  service?: string[];
  lga_name?: string[];
  name?: string;
}

export interface SelectedFilters {
  facilityType?: string[];
  performanceTier?: string[];
  serviceAvailability?: string[];
  lga?: string[];
  name?: string;
}

export interface SearchFilterStore {
  // Search state
  searchQuery: string;
  isSearchExpanded: boolean;

  // Filter state //NOTE YOU CAN ADD MORE
  selectedFilters: SelectedFilters;
  isFilterOpen: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setIsSearchExpanded: (expanded: boolean) => void;
  toggleFilter: (category: string, value: string) => void;
  clearAllFilters: () => void;
  setIsFilterOpen: (open: boolean) => void;
}
