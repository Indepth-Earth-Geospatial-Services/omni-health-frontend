"use client";

import React from "react";
import {
  Search,
  //   SlidersHorizontal,
  Plus,
  //   Download,
  //   FileSpreadsheet,
  //   FileText,
  //   FileImage,
} from "lucide-react";
import { Button } from "../ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

export type ExportFormat = "pdf" | "excel" | "svg";

interface TableHeadersProps {
  title: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  showSortBy?: boolean;
  onSortBy?: () => void;
  showFilters?: boolean;
  onFilters?: () => void;
  showExport?: boolean;
  onExport?: (format: ExportFormat) => void;
  buttonLabel?: string;
  onButtonClick?: () => void;
  buttonIcon?: React.ReactNode;
}

const TableHeaders: React.FC<TableHeadersProps> = ({
  title,
  searchPlaceholder = "Search",
  onSearch,
  //   showSortBy = true,
  //   onSortBy,
  //   showFilters = true,
  //   onFilters,
  //   showExport = true,
  //   onExport,
  buttonLabel,
  onButtonClick,
  buttonIcon = <Plus size={18} />,
}) => {
  return (
    <div className="w-full bg-white p-4">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        {/* Left side - Title */}
        <div>
          <h2 className="text-sm font-bold text-gray-600">{title}</h2>
        </div>

        {/* Right side - Search, Sort, Filters, and Optional Button */}
        <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:flex-initial">
            <Search
              size={18}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch?.(e.target.value)}
              className="focus:ring-primary w-full rounded-lg border border-slate-200 py-2 pr-4 pl-10 text-sm transition-all focus:border-transparent focus:ring-2 focus:outline-none md:w-64"
            />
          </div>

          {/* Sort By Button */}
          {/* {showSortBy && (
            <button
              onClick={onSortBy}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <SlidersHorizontal size={16} />
              Sort By
            </button>
          )} */}

          {/* Filters Button */}
          {/* {showFilters && (
            <button
              onClick={onFilters}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          )} */}

          {/* Export Button with Dropdown */}
          {/* {showExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
                  <Download size={16} />
                  Export
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white">
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onExport?.("pdf")}
                  className="cursor-pointer"
                >
                  <FileText size={16} className="text-red-500" />
                  <span>PDF Document</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onExport?.("excel")}
                  className="cursor-pointer"
                >
                  <FileSpreadsheet size={16} className="text-green-600" />
                  <span>Excel Spreadsheet</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onExport?.("svg")}
                  className="cursor-pointer"
                >
                  <FileImage size={16} className="text-blue-500" />
                  <span>SVG Image</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )} */}

          {/* Optional Action Button (e.g., "Add Staff") */}
          {buttonLabel && (
            <Button
              onClick={onButtonClick}
              variant="default"
              size="xl"
              className="text-lg"
            >
              {buttonIcon}
              {buttonLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableHeaders;
