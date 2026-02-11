"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "@/lib/client";

export interface FilterState {
  searchQuery: string;
  selectedFacility: string;
  selectedLGA: string;
  selectedGender: string;
  selectedStatus: string;
}

export interface Facility {
  facility_id: string;
  facility_name: string;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: "",
  selectedFacility: "all",
  selectedLGA: "all",
  selectedGender: "all",
  selectedStatus: "all",
};

interface UseStaffFiltersOptions {
  initialFilters?: FilterState;
  onFiltersChange?: (filters: FilterState) => void;
  onSearch?: (value: string) => void;
  onLGAFilter?: (value: string) => void;
  onFacilitiesFilter?: (value: string) => void;
  onGenderFilter?: (value: string) => void;
  onStatusFilter?: (value: string) => void;
}

export function useStaffFilters({
  initialFilters,
  onFiltersChange,
  onSearch,
  onLGAFilter,
  onFacilitiesFilter,
  onGenderFilter,
  onStatusFilter,
}: UseStaffFiltersOptions = {}) {
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || DEFAULT_FILTERS
  );
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Refs for click outside handling
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Fetch facilities on mount
  useEffect(() => {
    const fetchFacilities = async () => {
      setLoadingFacilities(true);
      try {
        const response = await apiClient.get("/facilities", {
          params: { limit: 100 },
        });
        setFacilities(response.data.facilities || response.data || []);
      } catch (error) {
        console.error("Failed to fetch facilities:", error);
        setFacilities([]);
      } finally {
        setLoadingFacilities(false);
      }
    };
    fetchFacilities();
  }, []);

  // Sync with parent filters
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openDropdown) {
        const ref = dropdownRefs.current[openDropdown];
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    }

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const updateFilter = useCallback(
    (key: keyof FilterState, value: string) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      onFiltersChange?.(newFilters);

      // Call individual handlers for backward compatibility
      if (key === "searchQuery") onSearch?.(value);
      if (key === "selectedLGA") onLGAFilter?.(value);
      if (key === "selectedFacility") onFacilitiesFilter?.(value);
      if (key === "selectedGender") onGenderFilter?.(value);
      if (key === "selectedStatus") onStatusFilter?.(value);
    },
    [
      filters,
      onFiltersChange,
      onSearch,
      onLGAFilter,
      onFacilitiesFilter,
      onGenderFilter,
      onStatusFilter,
    ]
  );

  const clearSearch = useCallback(() => {
    updateFilter("searchQuery", "");
  }, [updateFilter]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    onFiltersChange?.(DEFAULT_FILTERS);
  }, [onFiltersChange]);

  const toggleDropdown = useCallback((dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  }, []);

  const closeDropdown = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  const setDropdownRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      dropdownRefs.current[id] = el;
    },
    []
  );

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => key !== "searchQuery" && value !== "all"
  ).length;

  return {
    filters,
    facilities,
    loadingFacilities,
    openDropdown,
    activeFiltersCount,
    updateFilter,
    clearSearch,
    resetFilters,
    toggleDropdown,
    closeDropdown,
    setDropdownRef,
  };
}
