"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronDown,
  ArrowRight,
  Building2,
  Check,
  Loader2,
  Search,
  MapPin,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import { apiClient } from "@/lib/client";

interface Facility {
  facility_id: string;
  facility_name: string;
}

// LGA data for Rivers State
const LGAs = [
  { value: "1", label: "Port Harcourt" },
  { value: "2", label: "Obio/Akpor" },
  { value: "3", label: "Eleme" },
  { value: "4", label: "Ikwerre" },
  { value: "5", label: "Emohua" },
  { value: "6", label: "Ahoada East" },
  { value: "7", label: "Ahoada West" },
  { value: "8", label: "Ogba/Egbema/Ndoni" },
  { value: "9", label: "Okrika" },
  { value: "10", label: "Ogu/Bolo" },
  { value: "11", label: "Tai" },
  { value: "12", label: "Gokana" },
  { value: "13", label: "Khana" },
  { value: "14", label: "Oyigbo" },
  { value: "15", label: "Etche" },
  { value: "16", label: "Omuma" },
  { value: "17", label: "Abua/Odual" },
  { value: "18", label: "Akuku-Toru" },
  { value: "19", label: "Asari-Toru" },
  { value: "20", label: "Degema" },
  { value: "21", label: "Bonny" },
  { value: "22", label: "Andoni" },
];

const FILE_FORMATS = [
  { value: "CSV", label: "CSV", icon: FileText },
  { value: "EXCEL", label: "Excel", icon: FileSpreadsheet },
];

interface DownloadNominalRollModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalRecords?: number;
}

const DownloadNominalRollModal: React.FC<DownloadNominalRollModalProps> = ({
  isOpen,
  onClose,
  totalRecords = 25,
}) => {
  const [selectedScope, setSelectedScope] = useState("All Facilities");
  const [selectedFormat, setSelectedFormat] = useState("CSV");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const [isFacilityDropdownOpen, setIsFacilityDropdownOpen] = useState(false);
  const [isLGADropdownOpen, setIsLGADropdownOpen] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedLGAs, setSelectedLGAs] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [facilitySearch, setFacilitySearch] = useState("");
  const [lgaSearch, setLgaSearch] = useState("");

  const facilityDropdownRef = useRef<HTMLDivElement>(null);
  const scopeDropdownRef = useRef<HTMLDivElement>(null);
  const lgaDropdownRef = useRef<HTMLDivElement>(null);
  const formatDropdownRef = useRef<HTMLDivElement>(null);

  const scopeOptions = ["All Facilities", "Selected Facilities", "By LGA"];

  // Fetch facilities on mount
  useEffect(() => {
    if (isOpen) {
      fetchFacilities();
    }
  }, [isOpen]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        facilityDropdownRef.current &&
        !facilityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFacilityDropdownOpen(false);
      }
      if (
        scopeDropdownRef.current &&
        !scopeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        lgaDropdownRef.current &&
        !lgaDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLGADropdownOpen(false);
      }
      if (
        formatDropdownRef.current &&
        !formatDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFormatDropdownOpen(false);
      }
    }

    if (
      isFacilityDropdownOpen ||
      isDropdownOpen ||
      isLGADropdownOpen ||
      isFormatDropdownOpen
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isFacilityDropdownOpen,
    isDropdownOpen,
    isLGADropdownOpen,
    isFormatDropdownOpen,
  ]);

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

  const handleFacilityToggle = (facilityId: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityId)
        ? prev.filter((id) => id !== facilityId)
        : [...prev, facilityId],
    );
  };

  const handleSelectAll = () => {
    if (selectedFacilities.length === facilities.length) {
      setSelectedFacilities([]);
    } else {
      setSelectedFacilities(facilities.map((f) => f.facility_id));
    }
  };

  const handleLGAToggle = (lgaValue: string) => {
    setSelectedLGAs((prev) =>
      prev.includes(lgaValue)
        ? prev.filter((id) => id !== lgaValue)
        : [...prev, lgaValue],
    );
  };

  const handleSelectAllLGAs = () => {
    if (selectedLGAs.length === LGAs.length) {
      setSelectedLGAs([]);
    } else {
      setSelectedLGAs(LGAs.map((lga) => lga.value));
    }
  };

  const filteredFacilities = facilities.filter((f) =>
    f.facility_name.toLowerCase().includes(facilitySearch.toLowerCase()),
  );

  const filteredLGAs = LGAs.filter((lga) =>
    lga.label.toLowerCase().includes(lgaSearch.toLowerCase()),
  );

  const getSelectedFacilityNames = () => {
    if (selectedFacilities.length === 0) return "Select facilities...";
    if (selectedFacilities.length === 1) {
      return facilities.find((f) => f.facility_id === selectedFacilities[0])
        ?.facility_name;
    }
    return `${selectedFacilities.length} facilities selected`;
  };

  const getSelectedLGANames = () => {
    if (selectedLGAs.length === 0) return "Select LGAs...";
    if (selectedLGAs.length === 1) {
      return LGAs.find((lga) => lga.value === selectedLGAs[0])?.label;
    }
    return `${selectedLGAs.length} LGAs selected`;
  };

  const getSelectedFormatIcon = () => {
    const format = FILE_FORMATS.find((f) => f.value === selectedFormat);
    return format ? format.icon : FileText;
  };

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Build query parameters manually to ensure proper array formatting
      const queryParams = new URLSearchParams();
      queryParams.append("format", selectedFormat);

      // Add filters based on selected scope
      if (
        selectedScope === "Selected Facilities" &&
        selectedFacilities.length > 0
      ) {
        selectedFacilities.forEach((id) => {
          queryParams.append("facility_ids", id);
        });
      } else if (selectedScope === "By LGA" && selectedLGAs.length > 0) {
        selectedLGAs.forEach((id) => {
          queryParams.append("lga_ids", id);
        });
      }

      const response = await apiClient.get(
        `/admin/export/staff?${queryParams.toString()}`,
        {
          responseType: "blob",
        },
      );

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Set filename based on format and scope
      const extension = selectedFormat === "CSV" ? "csv" : "xlsx";
      const timestamp = new Date().toISOString().split("T")[0];
      const scopeLabel =
        selectedScope === "All Facilities"
          ? "all"
          : selectedScope === "Selected Facilities"
            ? `${selectedFacilities.length}_facilities`
            : `${selectedLGAs.length}_lgas`;

      link.setAttribute(
        "download",
        `nominal_roll_${scopeLabel}_${timestamp}.${extension}`,
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      handleClose();
    } catch (error: any) {
      console.error("Download failed:", error);

      // Show user-friendly error message
      let errorMessage = "Failed to download nominal roll. Please try again.";

      if (error.response?.status === 422) {
        errorMessage =
          "Invalid parameters. Please check your selection and try again.";
      } else if (error.response?.status === 404) {
        errorMessage = "No staff records found matching your criteria.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message?.includes("Network Error")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      alert(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClose = () => {
    setSelectedScope("All Facilities");
    setSelectedFormat("CSV");
    setSelectedFacilities([]);
    setSelectedLGAs([]);
    setFacilitySearch("");
    setLgaSearch("");
    setIsDropdownOpen(false);
    setIsFacilityDropdownOpen(false);
    setIsLGADropdownOpen(false);
    setIsFormatDropdownOpen(false);
    onClose();
  };

  const isDownloadDisabled =
    isDownloading ||
    (selectedScope === "Selected Facilities" &&
      selectedFacilities.length === 0) ||
    (selectedScope === "By LGA" && selectedLGAs.length === 0);

  const SelectedIcon = getSelectedFormatIcon();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Download Nominal Roll
          </h2>
          <button
            onClick={handleClose}
            disabled={isDownloading}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-slate-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* File Format Section */}
          <div className="mb-4" ref={formatDropdownRef}>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              File Format
            </label>
            <div className="relative">
              <button
                onClick={() => setIsFormatDropdownOpen(!isFormatDropdownOpen)}
                disabled={isDownloading}
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  <SelectedIcon size={16} className="text-gray-500" />
                  {selectedFormat}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform ${
                    isFormatDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Format Dropdown Menu */}
              {isFormatDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                  {FILE_FORMATS.map((format) => {
                    const Icon = format.icon;
                    return (
                      <button
                        key={format.value}
                        onClick={() => {
                          setSelectedFormat(format.value);
                          setIsFormatDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${
                          selectedFormat === format.value
                            ? "bg-teal-50 font-medium text-teal-700"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon size={16} className="text-gray-500" />
                          {format.label}
                        </span>
                        {selectedFormat === format.value && (
                          <Check size={16} className="text-teal-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Download Scope Section */}
          <div className="mb-4" ref={scopeDropdownRef}>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Download Scope
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isDownloading}
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {selectedScope}
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Scope Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                  {scopeOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedScope(option);
                        setIsDropdownOpen(false);
                        // Reset selections when changing scope
                        if (option !== "Selected Facilities") {
                          setSelectedFacilities([]);
                        }
                        if (option !== "By LGA") {
                          setSelectedLGAs([]);
                        }
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${
                        selectedScope === option
                          ? "bg-teal-50 font-medium text-teal-700"
                          : "text-gray-700"
                      }`}
                    >
                      {option}
                      {selectedScope === option && (
                        <Check size={16} className="text-teal-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Facility Selection - Only show when "Selected Facilities" is chosen */}
          {selectedScope === "Selected Facilities" && (
            <div className="mb-4" ref={facilityDropdownRef}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Select Facilities <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  onClick={() =>
                    setIsFacilityDropdownOpen(!isFacilityDropdownOpen)
                  }
                  disabled={loadingFacilities || isDownloading}
                  className={`flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 ${
                    selectedFacilities.length > 0
                      ? "border-teal-500 text-gray-700"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {loadingFacilities ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Loading facilities...
                      </>
                    ) : (
                      <>
                        <Building2 size={16} className="text-slate-400" />
                        {getSelectedFacilityNames()}
                      </>
                    )}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform ${
                      isFacilityDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Facility Dropdown with Checkboxes */}
                {isFacilityDropdownOpen && !loadingFacilities && (
                  <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                    {/* Search Input */}
                    <div className="border-b border-gray-200 p-2">
                      <div className="relative">
                        <Search
                          size={16}
                          className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="Search facilities..."
                          value={facilitySearch}
                          onChange={(e) => setFacilitySearch(e.target.value)}
                          className="w-full rounded-md border border-gray-200 py-2 pr-3 pl-9 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Select All Option */}
                    <button
                      onClick={handleSelectAll}
                      className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          selectedFacilities.length === facilities.length &&
                          facilities.length > 0
                            ? "border-teal-500 bg-teal-500"
                            : selectedFacilities.length > 0
                              ? "border-teal-500 bg-teal-100"
                              : "border-gray-300"
                        }`}
                      >
                        {selectedFacilities.length === facilities.length &&
                          facilities.length > 0 && (
                            <Check size={12} className="text-white" />
                          )}
                        {selectedFacilities.length > 0 &&
                          selectedFacilities.length < facilities.length && (
                            <div className="h-2 w-2 rounded-sm bg-teal-500" />
                          )}
                      </div>
                      Select All ({facilities.length})
                    </button>

                    {/* Facility List */}
                    <div className="max-h-48 overflow-y-auto">
                      {filteredFacilities.length === 0 ? (
                        <p className="px-4 py-3 text-center text-sm text-gray-500">
                          No facilities found
                        </p>
                      ) : (
                        filteredFacilities.map((facility) => (
                          <button
                            key={facility.facility_id}
                            onClick={() =>
                              handleFacilityToggle(facility.facility_id)
                            }
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            <div
                              className={`flex h-4 w-4 items-center justify-center rounded border ${
                                selectedFacilities.includes(
                                  facility.facility_id,
                                )
                                  ? "border-teal-500 bg-teal-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedFacilities.includes(
                                facility.facility_id,
                              ) && <Check size={12} className="text-white" />}
                            </div>
                            <span className="flex items-center gap-2">
                              <Building2 size={14} className="text-slate-400" />
                              {facility.facility_name}
                            </span>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Footer showing selection count */}
                    {selectedFacilities.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
                        {selectedFacilities.length} of {facilities.length}{" "}
                        selected
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Facilities Pills */}
              {selectedFacilities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedFacilities.slice(0, 3).map((facilityId) => {
                    const facility = facilities.find(
                      (f) => f.facility_id === facilityId,
                    );
                    return (
                      <span
                        key={facilityId}
                        className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700"
                      >
                        {facility?.facility_name}
                        <button
                          onClick={() => handleFacilityToggle(facilityId)}
                          className="ml-0.5 rounded-full p-0.5 hover:bg-teal-100"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })}
                  {selectedFacilities.length > 3 && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                      +{selectedFacilities.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* LGA Selection - Only show when "By LGA" is chosen */}
          {selectedScope === "By LGA" && (
            <div className="mb-4" ref={lgaDropdownRef}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Select LGAs <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsLGADropdownOpen(!isLGADropdownOpen)}
                  disabled={isDownloading}
                  className={`flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 ${
                    selectedLGAs.length > 0
                      ? "border-teal-500 text-gray-700"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400" />
                    {getSelectedLGANames()}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform ${
                      isLGADropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* LGA Dropdown with Checkboxes */}
                {isLGADropdownOpen && (
                  <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                    {/* Search Input */}
                    <div className="border-b border-gray-200 p-2">
                      <div className="relative">
                        <Search
                          size={16}
                          className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="Search LGAs..."
                          value={lgaSearch}
                          onChange={(e) => setLgaSearch(e.target.value)}
                          className="w-full rounded-md border border-gray-200 py-2 pr-3 pl-9 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Select All Option */}
                    <button
                      onClick={handleSelectAllLGAs}
                      className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          selectedLGAs.length === LGAs.length && LGAs.length > 0
                            ? "border-teal-500 bg-teal-500"
                            : selectedLGAs.length > 0
                              ? "border-teal-500 bg-teal-100"
                              : "border-gray-300"
                        }`}
                      >
                        {selectedLGAs.length === LGAs.length &&
                          LGAs.length > 0 && (
                            <Check size={12} className="text-white" />
                          )}
                        {selectedLGAs.length > 0 &&
                          selectedLGAs.length < LGAs.length && (
                            <div className="h-2 w-2 rounded-sm bg-teal-500" />
                          )}
                      </div>
                      Select All ({LGAs.length})
                    </button>

                    {/* LGA List */}
                    <div className="max-h-48 overflow-y-auto">
                      {filteredLGAs.length === 0 ? (
                        <p className="px-4 py-3 text-center text-sm text-gray-500">
                          No LGAs found
                        </p>
                      ) : (
                        filteredLGAs.map((lga) => (
                          <button
                            key={lga.value}
                            onClick={() => handleLGAToggle(lga.value)}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            <div
                              className={`flex h-4 w-4 items-center justify-center rounded border ${
                                selectedLGAs.includes(lga.value)
                                  ? "border-teal-500 bg-teal-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedLGAs.includes(lga.value) && (
                                <Check size={12} className="text-white" />
                              )}
                            </div>
                            <span className="flex items-center gap-2">
                              <MapPin size={14} className="text-slate-400" />
                              {lga.label}
                            </span>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Footer showing selection count */}
                    {selectedLGAs.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
                        {selectedLGAs.length} of {LGAs.length} selected
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected LGAs Pills */}
              {selectedLGAs.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedLGAs.slice(0, 3).map((lgaValue) => {
                    const lga = LGAs.find((l) => l.value === lgaValue);
                    return (
                      <span
                        key={lgaValue}
                        className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700"
                      >
                        {lga?.label}
                        <button
                          onClick={() => handleLGAToggle(lgaValue)}
                          className="ml-0.5 rounded-full p-0.5 hover:bg-teal-100"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })}
                  {selectedLGAs.length > 3 && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                      +{selectedLGAs.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Records Count */}
          <p className="mb-6 text-sm text-gray-600">
            {selectedScope === "Selected Facilities" &&
            selectedFacilities.length > 0
              ? `Staff records from ${selectedFacilities.length} facility(ies) will be included`
              : selectedScope === "By LGA" && selectedLGAs.length > 0
                ? `Staff records from ${selectedLGAs.length} LGA(s) will be included`
                : `All staff records will be included`}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleClose}
              variant="outline"
              size="lg"
              className="flex-1"
              disabled={isDownloading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isDownloadDisabled}
              size="lg"
              className="flex flex-1 items-center justify-center gap-2"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  Download ({selectedFormat})
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadNominalRollModal;
