"use client";

import { useState } from "react";
import {
    ArrowUpDown,
    MinusSquare,
    ChevronRight,
    ChevronLeft,
    PenIcon,
    Trash2,
    Loader2,
} from "lucide-react";
import RegistryHeader from "../layouts/RegistryHeader";
import AddFacilityModal from "../modals/AddFacilityModal";
import { useFacilities } from "../hooks/useFacilities";
import { formatDate, formatRelativeDate } from "@/lib/format-date";

export default function FacilityRegistry() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState<any>(null);
    const itemsPerPage = 10;

    const { data, isLoading, isError, error, isFetching } = useFacilities({
        page: currentPage,
        limit: itemsPerPage,
        searchQuery,
    });

    const facilities = data?.facilities || [];
    const pagination = data?.pagination;
    const totalPages = pagination?.total_pages || 1;
    const totalRecords = pagination?.total_records || 0;

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleAddNew = () => {
        setSelectedFacility(null);
        setIsModalOpen(true);
    };

    const handleEdit = (facility: any) => {
        setSelectedFacility(facility);
        setIsModalOpen(true);
    };

    const handleDelete = (facilityId: string) => {
        // TODO: Implement delete functionality
        console.log("Delete facility:", facilityId);
    };

    return (
        <>
            <RegistryHeader
                searchPlaceholder="Search facilities..."
                onSearch={handleSearch}
                buttonLabel="Add New Facility"
                onButtonClick={handleAddNew}
            />

            <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
                <div className="overflow-x-auto relative" style={{ minHeight: "720px" }}>
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                            <tr className="text-slate-500 text-sm font-medium">
                                <th className="p-4 w-12">
                                    <MinusSquare size={18} className="text-primary bg-primary/10 rounded" />
                                </th>
                                <th className="p-4 cursor-pointer">
                                    <div className="flex items-center gap-2 text-[11.38px]">
                                        Facility Name <ArrowUpDown size={14} />
                                    </div>
                                </th>
                                <th className="p-4 text-[11.38px]">Facility ID</th>
                                <th className="p-4 text-[11.38px]">Address</th>
                                <th className="p-4 text-[11.38px]">LGA</th>
                                <th className="p-4 text-[11.38px]">Facility Type</th>
                                <th className="p-4 text-[11.38px]">Last Updated</th>
                                <th className="p-4 text-center sticky right-0 bg-slate-50 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={8} className="p-8">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <p className="text-sm text-slate-500">Loading facilities...</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td colSpan={8} className="p-8">
                                        <div className="text-red-500 text-center">
                                            <p className="font-medium">Error loading facilities</p>
                                            <p className="text-sm text-slate-500 mt-1">
                                                {error instanceof Error ? error.message : "Something went wrong"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!isLoading && !isError && facilities.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-slate-500">
                                        No facilities found
                                        {searchQuery && <p className="text-sm mt-2">Try adjusting your search query</p>}
                                    </td>
                                </tr>
                            )}

                            {!isLoading && !isError && facilities.map((facility) => (
                                <tr key={facility.facility_id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 cursor-pointer" />
                                    </td>
                                    <td className="p-4 text-sm font-medium text-slate-900">{facility.facility_name}</td>
                                    <td className="p-4 text-sm text-slate-600">{facility.hfr_id || "N/A"}</td>
                                    <td className="p-4 text-sm text-slate-600 max-w-xs truncate">{facility.address}</td>
                                    <td className="p-4 text-sm text-slate-600">{facility.facility_lga}</td>
                                    <td className="p-4 text-sm text-slate-600">{facility.facility_category}</td>
                                    <td className="p-4 text-sm text-slate-600">
                                        <div className="flex flex-col gap-0.5">
                                            <span>{formatDate(facility.last_updated)}</span>
                                            <span className="text-xs text-slate-400">
                                                {formatRelativeDate(facility.last_updated)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 sticky right-0 bg-white shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(facility)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-teal-50 rounded-lg transition"
                                            >
                                                <PenIcon size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(facility.facility_id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 flex items-center justify-between border-t border-slate-100">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1 || isLoading}
                        className={`px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg flex items-center gap-2 transition ${currentPage === 1 || isLoading
                            ? "text-slate-400 bg-slate-50 cursor-not-allowed"
                            : "text-slate-700 bg-white hover:bg-slate-50"
                            }`}
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-slate-500">Page {currentPage} of {totalPages}</div>
                        <div className="text-sm text-slate-400">({totalRecords} total)</div>
                        {isFetching && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage >= totalPages || isLoading}
                        className={`px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg flex items-center gap-2 transition ${currentPage >= totalPages || isLoading
                            ? "text-slate-400 bg-slate-50 cursor-not-allowed"
                            : "text-slate-700 bg-white hover:bg-slate-50"
                            }`}
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <AddFacilityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                facility={selectedFacility}
            />
        </>
    );
}