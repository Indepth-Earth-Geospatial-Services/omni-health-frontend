"use client";

import React from "react";
import {
    Search,
    SlidersHorizontal,
    Plus,
    Download,
    FileSpreadsheet,
    FileText,
    FileImage,
} from "lucide-react";
import { Button } from "@/features/admin/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ExportFormat = "pdf" | "excel" | "svg";

interface TableHeadersProps {
    title?: string;
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

const RegistryHeader: React.FC<TableHeadersProps> = ({
    searchPlaceholder = "Search",
    onSearch,
    showSortBy = true,
    onSortBy,
    showFilters = true,
    onFilters,
    showExport = true,
    onExport,
    buttonLabel,
    onButtonClick,
    buttonIcon = <Plus size={18} />,
}) => {
    return (
        <div className="w-full bg-white pb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                {/* Search Input (flexes) */}
                <div className="relative flex-1">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        onChange={(e) => onSearch?.(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Actions (do not stretch) */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="hidden md:block h-10 w-px bg-gray-200" />

                    {showSortBy && (
                        <button
                            onClick={onSortBy}
                            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2"
                        >
                            <SlidersHorizontal size={16} />
                            Sort By
                        </button>
                    )}

                    {showFilters && (
                        <button
                            onClick={onFilters}
                            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2"
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>
                    )}

                    {showExport && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                                    <Download size={16} />
                                    Export
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white">
                                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onExport?.("pdf")}>
                                    <FileText size={16} className="text-red-500" />
                                    PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onExport?.("excel")}>
                                    <FileSpreadsheet size={16} className="text-green-600" />
                                    Excel
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onExport?.("svg")}>
                                    <FileImage size={16} className="text-blue-500" />
                                    SVG
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {buttonLabel && (
                        <Button onClick={onButtonClick} size="xl">
                            {buttonIcon}
                            {buttonLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegistryHeader;
