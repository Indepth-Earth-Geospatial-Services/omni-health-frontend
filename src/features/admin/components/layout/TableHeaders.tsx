"use client";

import React from 'react';
import { Search, SlidersHorizontal, Plus, Download, FileSpreadsheet, FileText, FileImage } from 'lucide-react';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type ExportFormat = 'pdf' | 'excel' | 'svg';

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
    showSortBy = true,
    onSortBy,
    showFilters = true,
    onFilters,
    showExport = true,
    onExport,
    buttonLabel,
    onButtonClick,
    buttonIcon = <Plus size={18} />
}) => {
    return (
        <div className="w-full bg-white p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Left side - Title */}
                <div>
                    <h2 className="text-sm font-bold text-gray-600">{title}</h2>
                </div>

                {/* Right side - Search, Sort, Filters, and Optional Button */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-1 md:flex-initial">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            onChange={(e) => onSearch?.(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full md:w-64 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Sort By Button */}
                    {showSortBy && (
                        <button
                            onClick={onSortBy}
                            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                            <SlidersHorizontal size={16} />
                            Sort By
                        </button>
                    )}

                    {/* Filters Button */}
                    {showFilters && (
                        <button
                            onClick={onFilters}
                            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>
                    )}

                    {/* Export Button with Dropdown */}
                    {showExport && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                                >
                                    <Download size={16} />
                                    Export
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white">
                                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => onExport?.('pdf')}
                                    className="cursor-pointer"
                                >
                                    <FileText size={16} className="text-red-500" />
                                    <span>PDF Document</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onExport?.('excel')}
                                    className="cursor-pointer"
                                >
                                    <FileSpreadsheet size={16} className="text-green-600" />
                                    <span>Excel Spreadsheet</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onExport?.('svg')}
                                    className="cursor-pointer"
                                >
                                    <FileImage size={16} className="text-blue-500" />
                                    <span>SVG Image</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Optional Action Button (e.g., "Add Staff") */}
                    {buttonLabel && (
                        <Button
                            onClick={onButtonClick}
                            variant="default"
                            size="xl" className='text-lg'
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
