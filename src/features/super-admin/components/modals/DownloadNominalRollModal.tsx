"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ArrowRight,
  Building2,
  Loader2,
  MapPin,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import { apiClient } from "@/lib/client";
import { useMultiSelect } from "../../hooks/use-multi-select";
import { useFileDownload } from "../../hooks/use-file-download";
import { MultiSelectDropdown } from "../ui/MultiSelectDropdown";
import { SelectDropdown } from "../ui/SelectDropdown";
import { RIVERS_STATE_LGAS } from "../../constants/lga";

// Types
interface Facility {
  facility_id: string;
  facility_name: string;
}

type DownloadScope = "All Facilities" | "Selected Facilities" | "By LGA";

// Constants
const FILE_FORMATS = [
  { value: "CSV", label: "CSV", icon: FileText },
  { value: "EXCEL", label: "Excel", icon: FileSpreadsheet },
];

const SCOPE_OPTIONS = [
  { value: "All Facilities", label: "All Facilities" },
  { value: "Selected Facilities", label: "Selected Facilities" },
  { value: "By LGA", label: "By LGA" },
];

// Props
interface DownloadNominalRollModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalRecords?: number;
}

const DownloadNominalRollModal: React.FC<DownloadNominalRollModalProps> = ({
  isOpen,
  onClose,
}) => {
  // State
  const [selectedScope, setSelectedScope] = useState<DownloadScope>("All Facilities");
  const [selectedFormat, setSelectedFormat] = useState("CSV");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);

  // Custom Hooks
  const facilitiesSelect = useMultiSelect({
    items: facilities,
    getItemId: (f) => f.facility_id,
    getItemLabel: (f) => f.facility_name,
  });

  const lgasSelect = useMultiSelect({
    items: [...RIVERS_STATE_LGAS],
    getItemId: (lga) => lga.value,
    getItemLabel: (lga) => lga.label,
  });

  const { isDownloading, download } = useFileDownload();

  // Fetch facilities on open
  useEffect(() => {
    if (isOpen) {
      fetchFacilities();
    }
  }, [isOpen]);

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

  const handleScopeChange = (value: string) => {
    setSelectedScope(value as DownloadScope);
    // Reset selections when changing scope
    if (value !== "Selected Facilities") {
      facilitiesSelect.deselectAll();
    }
    if (value !== "By LGA") {
      lgasSelect.deselectAll();
    }
  };

  const handleDownload = async () => {
    const params: Record<string, string | string[]> = {
      format: selectedFormat,
    };

    if (selectedScope === "Selected Facilities" && facilitiesSelect.selectedCount > 0) {
      params.facility_ids = facilitiesSelect.selectedIds;
    } else if (selectedScope === "By LGA" && lgasSelect.selectedCount > 0) {
      params.lga_ids = lgasSelect.selectedIds;
    }

    const extension = selectedFormat === "CSV" ? "csv" : "xlsx";
    const timestamp = new Date().toISOString().split("T")[0];
    const scopeLabel =
      selectedScope === "All Facilities"
        ? "all"
        : selectedScope === "Selected Facilities"
          ? `${facilitiesSelect.selectedCount}_facilities`
          : `${lgasSelect.selectedCount}_lgas`;

    await download({
      endpoint: "/admin/export/staff",
      params,
      filename: `nominal_roll_${scopeLabel}_${timestamp}.${extension}`,
      onSuccess: handleClose,
      onError: (err) => alert(err.message),
    });
  };

  const handleClose = () => {
    setSelectedScope("All Facilities");
    setSelectedFormat("CSV");
    facilitiesSelect.deselectAll();
    lgasSelect.deselectAll();
    onClose();
  };

  if (!isOpen) return null;

  const isDownloadDisabled =
    isDownloading ||
    (selectedScope === "Selected Facilities" && facilitiesSelect.selectedCount === 0) ||
    (selectedScope === "By LGA" && lgasSelect.selectedCount === 0);

  const getRecordsText = () => {
    if (selectedScope === "Selected Facilities" && facilitiesSelect.selectedCount > 0) {
      return `Staff records from ${facilitiesSelect.selectedCount} facility(ies) will be included`;
    }
    if (selectedScope === "By LGA" && lgasSelect.selectedCount > 0) {
      return `Staff records from ${lgasSelect.selectedCount} LGA(s) will be included`;
    }
    return "All staff records will be included";
  };

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
          {/* File Format */}
          <div className="mb-4">
            <SelectDropdown
              label="File Format"
              options={FILE_FORMATS}
              value={selectedFormat}
              onChange={setSelectedFormat}
              disabled={isDownloading}
            />
          </div>

          {/* Download Scope */}
          <div className="mb-4">
            <SelectDropdown
              label="Download Scope"
              options={SCOPE_OPTIONS}
              value={selectedScope}
              onChange={handleScopeChange}
              disabled={isDownloading}
            />
          </div>

          {/* Facility Selection */}
          {selectedScope === "Selected Facilities" && (
            <div className="mb-4">
              <MultiSelectDropdown
                items={facilities}
                selectedIds={facilitiesSelect.selectedIds}
                getItemId={(f) => f.facility_id}
                getItemLabel={(f) => f.facility_name}
                onToggle={facilitiesSelect.toggle}
                onSelectAll={
                  facilitiesSelect.isAllSelected
                    ? facilitiesSelect.deselectAll
                    : facilitiesSelect.selectAll
                }
                isAllSelected={facilitiesSelect.isAllSelected}
                isPartiallySelected={facilitiesSelect.isPartiallySelected}
                label="Select Facilities"
                required
                placeholder="Select facilities..."
                searchPlaceholder="Search facilities..."
                isLoading={loadingFacilities}
                loadingText="Loading facilities..."
                emptyText="No facilities found"
                disabled={isDownloading}
                icon={<Building2 size={16} className="text-slate-400" />}
                renderItemIcon={() => <Building2 size={14} className="text-slate-400" />}
              />
            </div>
          )}

          {/* LGA Selection */}
          {selectedScope === "By LGA" && (
            <div className="mb-4">
              <MultiSelectDropdown
                items={[...RIVERS_STATE_LGAS]}
                selectedIds={lgasSelect.selectedIds}
                getItemId={(lga) => lga.value}
                getItemLabel={(lga) => lga.label}
                onToggle={lgasSelect.toggle}
                onSelectAll={
                  lgasSelect.isAllSelected
                    ? lgasSelect.deselectAll
                    : lgasSelect.selectAll
                }
                isAllSelected={lgasSelect.isAllSelected}
                isPartiallySelected={lgasSelect.isPartiallySelected}
                label="Select LGAs"
                required
                placeholder="Select LGAs..."
                searchPlaceholder="Search LGAs..."
                emptyText="No LGAs found"
                disabled={isDownloading}
                icon={<MapPin size={16} className="text-slate-400" />}
                renderItemIcon={() => <MapPin size={14} className="text-slate-400" />}
              />
            </div>
          )}

          {/* Records Count */}
          <p className="mb-6 text-sm text-gray-600">{getRecordsText()}</p>

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
