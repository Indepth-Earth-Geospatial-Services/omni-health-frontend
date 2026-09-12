"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useFacilityOptions } from "./useFacilityOptions";

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
  /**
   * Whether the facility list is needed. Defaults to false so a page that
   * renders no facility dropdown never pays for the request — All Users was
   * fetching the list on every visit and displaying none of it.
   */
  loadFacilities?: boolean;
  onFiltersChange?: (filters: FilterState) => void;
  onSearch?: (value: string) => void;
  onLGAFilter?: (value: string) => void;
  onFacilitiesFilter?: (value: string) => void;
  onGenderFilter?: (value: string) => void;
  onStatusFilter?: (value: string) => void;
}

export function useStaffFilters({
  initialFilters,
  loadFacilities = false,
  onFiltersChange,
  onSearch,
  onLGAFilter,
  onFacilitiesFilter,
  onGenderFilter,
  onStatusFilter,
}: UseStaffFiltersOptions = {}) {
  // Controlled when the caller supplies `initialFilters` (both current callers
  // do, alongside onFiltersChange), uncontrolled otherwise. Previously the prop
  // was mirrored into state and re-synced from an effect, which meant two
  // sources of truth and a render cascade on every parent update.
  const [uncontrolledFilters, setUncontrolledFilters] =
    useState<FilterState>(DEFAULT_FILTERS);
  const filters = initialFilters ?? uncontrolledFilters;

  // Shared and cached across mounts — see useFacilityOptions for why this no
  // longer reads from GET /facilities.
  const { data: facilities = [], isLoading: loadingFacilities } =
    useFacilityOptions(loadFacilities);

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Refs for click outside handling
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
      setUncontrolledFilters(newFilters);
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
    setUncontrolledFilters(DEFAULT_FILTERS);
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
