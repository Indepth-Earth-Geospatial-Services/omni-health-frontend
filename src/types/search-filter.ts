export interface FilterOption {
  id: string;
  label: string;
  value: string;
  icon?: any;
}

export interface FilterCategory {
  title: string;
  options: FilterOption[];
}

export interface SearchFilterStore {
  // Search state
  searchQuery: string;
  isSearchExpanded: boolean;

  // Filter state
  selectedFilters: Record<string, string[]>;
  isFilterOpen: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setIsSearchExpanded: (expanded: boolean) => void;
  toggleFilter: (category: string, value: string) => void;
  clearAllFilters: () => void;
  setIsFilterOpen: (open: boolean) => void;
}
