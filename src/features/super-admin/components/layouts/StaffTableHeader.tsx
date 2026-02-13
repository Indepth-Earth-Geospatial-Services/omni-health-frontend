"use client";

import React, { useState } from "react";
import { Search, Plus, Download, Upload, Building2, X } from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import DownloadNominalRollModal from "../modals/DownloadNominalRollModal";
import { FilterDropdown } from "../ui/FilterDropdown";
import {
  useStaffFilters,
  type FilterState,
} from "@/features/super-admin/hooks/use-staff-filters";
import {
  LGA_FILTER_OPTIONS,
  GENDER_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from "@/features/super-admin/constants/lga";

export type { FilterState };
export type ExportFormat = "pdf" | "excel" | "svg";

interface StaffTableHeadersProps {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  showLGAFilter?: boolean;
  onLGAFilter?: (value: string) => void;
  showFacilitiesFilter?: boolean;
  onFacilitiesFilter?: (value: string) => void;
  showGenderFilter?: boolean;
  onGenderFilter?: (value: string) => void;
  showStatusFilter?: boolean;
  onStatusFilter?: (value: string) => void;
  showDownload?: boolean;
  showExport?: boolean;
  onExport?: () => void;
  totalRecords?: number;
  buttonLabel?: string;
  onButtonClick?: () => void;
  buttonIcon?: React.ReactNode;
  filters?: FilterState;
  onFiltersChange?: (filters: FilterState) => void;
}

const StaffTableHeader: React.FC<StaffTableHeadersProps> = ({
  title,
  description,
  searchPlaceholder = "Search by name...",
  onSearch,
  showLGAFilter = false,
  onLGAFilter,
  showFacilitiesFilter = false,
  onFacilitiesFilter,
  showGenderFilter = false,
  onGenderFilter,
  showStatusFilter = false,
  onStatusFilter,
  showDownload = false,
  showExport = false,
  onExport,
  totalRecords = 25,
  buttonLabel,
  onButtonClick,
  buttonIcon = <Plus size={18} />,
  filters: externalFilters,
  onFiltersChange,
}) => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const {
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
  } = useStaffFilters({
    initialFilters: externalFilters,
    onFiltersChange,
    onSearch,
    onLGAFilter,
    onFacilitiesFilter,
    onGenderFilter,
    onStatusFilter,
  });

  // Build facility options for dropdown
  const facilityOptions = [
    { value: "all", label: "All Facilities" },
    ...facilities.map((f) => ({
      value: f.facility_id,
      label: f.facility_name,
      icon: <Building2 size={14} className="text-slate-400" />,
    })),
  ];

  return (
    <div className="w-full bg-white py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Title and Description */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-gray-500">{description}</p>
          )}
        </div>

        {/* Right side - Search and Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search
              size={18}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={filters.searchQuery}
              onChange={(e) => updateFilter("searchQuery", e.target.value)}
              className="w-64 rounded-lg border border-slate-300 bg-white py-2 pr-10 pl-10 text-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
            />
            {filters.searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="hidden h-10 w-px bg-gray-200 md:block" />

          {/* LGA Filter */}
          {showLGAFilter && (
            <FilterDropdown
              title="Filter by LGA"
              options={LGA_FILTER_OPTIONS}
              selectedValue={filters.selectedLGA}
              onSelect={(value) => updateFilter("selectedLGA", value)}
              isOpen={openDropdown === "lga"}
              onToggle={() => toggleDropdown("lga")}
              onClose={closeDropdown}
              dropdownRef={setDropdownRef("lga")}
              dropdownWidth="w-56"
            />
          )}

          {/* Facilities Filter */}
          {showFacilitiesFilter && (
            <FilterDropdown
              title="Filter by Facility"
              options={facilityOptions}
              selectedValue={filters.selectedFacility}
              onSelect={(value) => updateFilter("selectedFacility", value)}
              isOpen={openDropdown === "facilities"}
              onToggle={() => toggleDropdown("facilities")}
              onClose={closeDropdown}
              dropdownRef={setDropdownRef("facilities")}
              loading={loadingFacilities}
              icon={<Building2 size={16} className="text-slate-500" />}
              dropdownWidth="w-64"
            />
          )}

          {/* Gender Filter */}
          {showGenderFilter && (
            <FilterDropdown
              title="Filter by Gender"
              options={GENDER_FILTER_OPTIONS}
              selectedValue={filters.selectedGender}
              onSelect={(value) => updateFilter("selectedGender", value)}
              isOpen={openDropdown === "gender"}
              onToggle={() => toggleDropdown("gender")}
              onClose={closeDropdown}
              dropdownRef={setDropdownRef("gender")}
            />
          )}

          {/* Status Filter */}
          {showStatusFilter && (
            <FilterDropdown
              title="Filter by Status"
              options={STATUS_FILTER_OPTIONS}
              selectedValue={filters.selectedStatus}
              onSelect={(value) => updateFilter("selectedStatus", value)}
              isOpen={openDropdown === "status"}
              onToggle={() => toggleDropdown("status")}
              onClose={closeDropdown}
              dropdownRef={setDropdownRef("status")}
            />
          )}

          {/* Export Button */}
          {showExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Upload size={16} />
              Export
            </button>
          )}

          {/* Download Nominal Role Button */}
          {showDownload && (
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Download size={16} />
              Download Nominal Role
            </button>
          )}

          {/* Add New Staff Button */}
          {buttonLabel && (
            <Button
              onClick={onButtonClick}
              size="xl"
              className="flex items-center gap-2"
            >
              {buttonIcon}
              {buttonLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Indicator */}
      {activeFiltersCount > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
          <span className="font-medium">
            {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
          </span>
          <button onClick={resetFilters} className="text-primary hover:underline">
            Clear all
          </button>
        </div>
      )}

      {/* Download Nominal Roll Modal */}
      <DownloadNominalRollModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        totalRecords={totalRecords}
      />
    </div>
  );
};

export default StaffTableHeader;
