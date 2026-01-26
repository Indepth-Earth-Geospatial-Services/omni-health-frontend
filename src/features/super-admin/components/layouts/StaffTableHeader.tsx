"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Plus, Download, Upload } from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import DownloadNominalRollModal from "../modals/DownloadNominalRollModal";

export type ExportFormat = "pdf" | "excel" | "svg";

interface StaffTableHeadersProps {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  showLGAFilter?: boolean;
  onLGAFilter?: () => void;
  showFacilitiesFilter?: boolean;
  onFacilitiesFilter?: () => void;
  showRolesFilter?: boolean;
  onRolesFilter?: () => void;
  showStatusFilter?: boolean;
  onStatusFilter?: () => void;
  showDownload?: boolean;
  onDownload?: (scope: string) => void;
  showExport?: boolean;
  onExport?: () => void;
  totalRecords?: number;
  buttonLabel?: string;
  onButtonClick?: () => void;
  buttonIcon?: React.ReactNode;
}

const StaffTableHeader: React.FC<StaffTableHeadersProps> = ({
  title,
  description,
  searchPlaceholder = "Search",
  onSearch,
  showLGAFilter = false,
  onLGAFilter,
  showFacilitiesFilter = false,
  onFacilitiesFilter,
  showRolesFilter = false,
  onRolesFilter,
  showStatusFilter = false,
  onStatusFilter,
  showDownload = false,
  onDownload,
  showExport = false,
  onExport,
  totalRecords = 25,
  buttonLabel,
  onButtonClick,
  buttonIcon = <Plus size={18} />,
}) => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleDownload = (scope: string) => {
    onDownload?.(scope);
  };
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
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-64 rounded-lg border border-slate-300 bg-white py-2 pr-4 pl-10 text-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
            />
          </div>

          <div className="hidden h-10 w-px bg-gray-200 md:block" />

          {/* All LGAs Filter */}
          {showLGAFilter && (
            <button
              onClick={onLGAFilter}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <span className="text-slate-500">≡</span>
              All LGAs
              <ChevronDown size={16} className="text-slate-500" />
            </button>
          )}

          {/* All Facilities Filter */}
          {showFacilitiesFilter && (
            <button
              onClick={onFacilitiesFilter}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <span className="text-slate-500">⊞</span>
              All Facilities
              <ChevronDown size={16} className="text-slate-500" />
            </button>
          )}

          {/* All Roles Filter */}
          {showRolesFilter && (
            <button
              onClick={onRolesFilter}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              All Roles
              <ChevronDown size={16} className="text-slate-500" />
            </button>
          )}

          {/* All Status Filter */}
          {showStatusFilter && (
            <button
              onClick={onStatusFilter}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              All Status
              <ChevronDown size={16} className="text-slate-500" />
            </button>
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
              size="lg"
              className="flex items-center gap-2"
            >
              {buttonIcon}
              {buttonLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Download Nominal Roll Modal */}
      <DownloadNominalRollModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownload={handleDownload}
        totalRecords={totalRecords}
      />
    </div>
  );
};

export default StaffTableHeader;
