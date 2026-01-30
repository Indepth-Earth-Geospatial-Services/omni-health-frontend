"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Download,
  Upload,
  Check,
  Building2,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import DownloadNominalRollModal from "../modals/DownloadNominalRollModal";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/client";

export type ExportFormat = "pdf" | "excel" | "svg";

interface Facility {
  facility_id: string;
  facility_name: string;
}

// LGA data for super admin filter
const LGAs = [
  { value: "all", label: "All LGAs" },
  { value: "port-harcourt", label: "Port Harcourt" },
  { value: "obio-akpor", label: "Obio/Akpor" },
  { value: "eleme", label: "Eleme" },
  { value: "ikwerre", label: "Ikwerre" },
  { value: "emohua", label: "Emohua" },
  { value: "ahoada-east", label: "Ahoada East" },
  { value: "ahoada-west", label: "Ahoada West" },
  { value: "ogba-egbema-ndoni", label: "Ogba/Egbema/Ndoni" },
  { value: "okrika", label: "Okrika" },
  { value: "ogu-bolo", label: "Ogu/Bolo" },
  { value: "tai", label: "Tai" },
  { value: "gokana", label: "Gokana" },
  { value: "khana", label: "Khana" },
  { value: "oyigbo", label: "Oyigbo" },
  { value: "etche", label: "Etche" },
  { value: "omuma", label: "Omuma" },
  { value: "abua-odual", label: "Abua/Odual" },
  { value: "akuku-toru", label: "Akuku-Toru" },
  { value: "asari-toru", label: "Asari-Toru" },
  { value: "degema", label: "Degema" },
  { value: "bonny", label: "Bonny" },
  { value: "andoni", label: "Andoni" },
];

const genderOptions = [
  { value: "all", label: "All Genders" },
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export interface FilterState {
  searchQuery: string;
  selectedFacility: string;
  selectedLGA: string;
  selectedGender: string;
  selectedStatus: string;
}

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
  filters,
  onFiltersChange,
}) => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isLGADropdownOpen, setIsLGADropdownOpen] = useState(false);
  const [isFacilitiesDropdownOpen, setIsFacilitiesDropdownOpen] =
    useState(false);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const [localFilters, setLocalFilters] = useState<FilterState>(
    filters || {
      searchQuery: "",
      selectedFacility: "all",
      selectedLGA: "all",
      selectedGender: "all",
      selectedStatus: "all",
    },
  );

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);

  const lgaDropdownRef = useRef<HTMLDivElement>(null);
  const facilitiesDropdownRef = useRef<HTMLDivElement>(null);
  const genderDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch facilities on mount
  useEffect(() => {
    fetchFacilities();
  }, []);

  // Sync with parent filters
  useEffect(() => {
    if (filters) {
      setLocalFilters(filters);
    }
  }, [filters]);

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

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        lgaDropdownRef.current &&
        !lgaDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLGADropdownOpen(false);
      }
      if (
        facilitiesDropdownRef.current &&
        !facilitiesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFacilitiesDropdownOpen(false);
      }
      if (
        genderDropdownRef.current &&
        !genderDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGenderDropdownOpen(false);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
    }

    if (
      isLGADropdownOpen ||
      isFacilitiesDropdownOpen ||
      isGenderDropdownOpen ||
      isStatusDropdownOpen
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isLGADropdownOpen,
    isFacilitiesDropdownOpen,
    isGenderDropdownOpen,
    isStatusDropdownOpen,
  ]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange?.(newFilters);

    // Call individual handlers for backward compatibility
    if (key === "searchQuery") onSearch?.(value);
    if (key === "selectedLGA") onLGAFilter?.(value);
    if (key === "selectedFacility") onFacilitiesFilter?.(value);
    if (key === "selectedGender") onGenderFilter?.(value);
    if (key === "selectedStatus") onStatusFilter?.(value);
  };

  const clearSearch = () => {
    updateFilter("searchQuery", "");
  };

  const activeFiltersCount = Object.entries(localFilters).filter(
    ([key, value]) => key !== "searchQuery" && value !== "all",
  ).length;

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
              value={localFilters.searchQuery}
              onChange={(e) => updateFilter("searchQuery", e.target.value)}
              className="w-64 rounded-lg border border-slate-300 bg-white py-2 pr-10 pl-10 text-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
            />
            {localFilters.searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="hidden h-10 w-px bg-gray-200 md:block" />

          {/* All LGAs Filter */}
          {showLGAFilter && (
            <div className="relative" ref={lgaDropdownRef}>
              <button
                onClick={() => setIsLGADropdownOpen(!isLGADropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
              >
                {
                  LGAs.find((lga) => lga.value === localFilters.selectedLGA)
                    ?.label
                }
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {isLGADropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border-2 border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-200 px-4 py-3">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Filter by LGA
                    </h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {LGAs.map((lga) => (
                      <button
                        key={lga.value}
                        onClick={() => {
                          updateFilter("selectedLGA", lga.value);
                          setIsLGADropdownOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                          localFilters.selectedLGA === lga.value &&
                            "bg-primary/5 text-primary font-medium",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{lga.label}</span>
                          {localFilters.selectedLGA === lga.value && (
                            <Check size={16} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* All Facilities Filter */}
          {showFacilitiesFilter && (
            <div className="relative" ref={facilitiesDropdownRef}>
              <button
                onClick={() =>
                  setIsFacilitiesDropdownOpen(!isFacilitiesDropdownOpen)
                }
                disabled={loadingFacilities}
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50",
                  localFilters.selectedFacility !== "all" &&
                    "border-primary bg-primary/5",
                )}
              >
                {loadingFacilities ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Building2 size={16} className="text-slate-500" />
                    {localFilters.selectedFacility === "all"
                      ? "All Facilities"
                      : facilities.find(
                          (f) =>
                            f.facility_id === localFilters.selectedFacility,
                        )?.facility_name || "All Facilities"}
                    <ChevronDown size={16} className="text-gray-400" />
                  </>
                )}
              </button>

              {isFacilitiesDropdownOpen && !loadingFacilities && (
                <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border-2 border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-200 px-4 py-3">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Filter by Facility
                    </h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        updateFilter("selectedFacility", "all");
                        setIsFacilitiesDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                        localFilters.selectedFacility === "all" &&
                          "bg-primary/5 text-primary font-medium",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>All Facilities</span>
                        {localFilters.selectedFacility === "all" && (
                          <Check size={16} />
                        )}
                      </div>
                    </button>
                    {facilities.map((facility) => (
                      <button
                        key={facility.facility_id}
                        onClick={() => {
                          updateFilter(
                            "selectedFacility",
                            facility.facility_id,
                          );
                          setIsFacilitiesDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                          localFilters.selectedFacility ===
                            facility.facility_id &&
                            "bg-primary/5 text-primary font-medium",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Building2 size={14} className="text-slate-400" />
                            {facility.facility_name}
                          </span>
                          {localFilters.selectedFacility ===
                            facility.facility_id && <Check size={16} />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Gender Filter */}
          {showGenderFilter && (
            <div className="relative" ref={genderDropdownRef}>
              <button
                onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50",
                  localFilters.selectedGender !== "all" &&
                    "border-primary bg-primary/5",
                )}
              >
                {
                  genderOptions.find(
                    (g) => g.value === localFilters.selectedGender,
                  )?.label
                }
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {isGenderDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border-2 border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-200 px-4 py-3">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Filter by Gender
                    </h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {genderOptions.map((gender) => (
                      <button
                        key={gender.value}
                        onClick={() => {
                          updateFilter("selectedGender", gender.value);
                          setIsGenderDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                          localFilters.selectedGender === gender.value &&
                            "bg-primary/5 text-primary font-medium",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{gender.label}</span>
                          {localFilters.selectedGender === gender.value && (
                            <Check size={16} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Filter */}
          {showStatusFilter && (
            <div className="relative" ref={statusDropdownRef}>
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50",
                  localFilters.selectedStatus !== "all" &&
                    "border-primary bg-primary/5",
                )}
              >
                {
                  statusOptions.find(
                    (s) => s.value === localFilters.selectedStatus,
                  )?.label
                }
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border-2 border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-200 px-4 py-3">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Filter by Status
                    </h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {statusOptions.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => {
                          updateFilter("selectedStatus", status.value);
                          setIsStatusDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
                          localFilters.selectedStatus === status.value &&
                            "bg-primary/5 text-primary font-medium",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{status.label}</span>
                          {localFilters.selectedStatus === status.value && (
                            <Check size={16} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
            {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}{" "}
            active
          </span>
          <button
            onClick={() => {
              const resetFilters = {
                searchQuery: "",
                selectedFacility: "all",
                selectedLGA: "all",
                selectedGender: "all",
                selectedStatus: "all",
              };
              setLocalFilters(resetFilters);
              onFiltersChange?.(resetFilters);
            }}
            className="text-primary hover:underline"
          >
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
