"use client";

import { ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";

interface FacilityType {
    id: string;
    label: string;
}

interface SearchHeaderProps {
    title: string;
    showFilters: boolean;
    onToggleFilters: (open: boolean) => void;
    selectedFilter: string;
    onSelectFilter: (filterId: string) => void;
    facilityTypes: FacilityType[];
}

export default function SearchHeader({
    title,
    showFilters,
    onToggleFilters,
    selectedFilter,
    onSelectFilter,
    facilityTypes,
}: SearchHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
                {title}
            </h2>

            {/* Filter Button */}
            <div className="relative">
                <button
                    onClick={() => onToggleFilters(!showFilters)}
                    className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                    <ListFilter size={18} />
                </button>

                {/* Filter Dropdown */}
                {showFilters && (
                    <div className="absolute right-0 top-12 z-50 w-56 rounded-lg bg-white border border-gray-200">
                        <div className="space-y-2 p-3">
                            {facilityTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => {
                                        onSelectFilter(type.id);
                                        onToggleFilters(false);
                                    }}
                                    className={cn(
                                        "w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors text-left",
                                        selectedFilter === type.id
                                            ? " text-primary"
                                            : "text-gray-900 hover:bg-gray-100"
                                    )}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
