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
import FacilityDetailsModal from "../modals/FacilityDetailsModal";
import { useFacilities } from "../hooks/useFacilities";
import { formatDate, formatRelativeDate } from "@/lib/format-date";

export default function FacilityRegistry() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
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

  const handleRowClick = (facility: any) => {
    setSelectedFacility(facility);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (facility: any, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent row click when clicking edit button
    setSelectedFacility(facility);
    setIsModalOpen(true);
  };

  const handleEditFromDetails = () => {
    setIsDetailsModalOpen(false);
    setIsModalOpen(true);
  };

  const handleDelete = (facilityId: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent row click when clicking delete button
    // TODO: Implement delete functionality
    console.log("Delete facility:", facilityId);
  };

  const categoryClasses = {
    "model healthcare": "bg-yellow-700 rounded-full p-4 text-white",
    hospital: "bg-blue-700 rounded-full p-4 text-white",
    "hospital post": "bg-purple-700 rounded-full p-4 text-white",
    "Health clinic": "bg-red-700 rounded-full p-4 text-white",
  };

  return (
    <>
      <RegistryHeader
        searchPlaceholder="Search facilities..."
        onSearch={handleSearch}
        buttonLabel="Add New Facility"
        onButtonClick={handleAddNew}
      />

      <div className="flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div
          className="relative overflow-x-auto"
          style={{ minHeight: "720px" }}
        >
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
              <tr className="text-sm font-medium text-slate-500">
                <th className="w-12 p-4">
                  <MinusSquare
                    size={18}
                    className="text-primary bg-primary/10 rounded"
                  />
                </th>
                <th className="cursor-pointer p-4">
                  <div className="flex items-center gap-2 text-[11.38px]">
                    Facility Name <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="p-4 text-[11.38px]">Facility ID</th>
                <th className="p-4 text-[11.38px]">Address</th>
                <th className="p-4 text-[11.38px]">LGA</th>
                <th className="p-4 text-[11.38px]">Facility Type</th>
                <th className="p-4 text-[11.38px]">Last Updated</th>
                <th className="sticky right-0 bg-slate-50 p-4 text-center shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={8} className="p-8">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="text-primary h-8 w-8 animate-spin" />
                      <p className="text-sm text-slate-500">
                        Loading facilities...
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={8} className="p-8">
                    <div className="text-center text-red-500">
                      <p className="font-medium">Error loading facilities</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {error instanceof Error
                          ? error.message
                          : "Something went wrong"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && !isError && facilities.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No facilities found
                    {searchQuery && (
                      <p className="mt-2 text-sm">
                        Try adjusting your search query
                      </p>
                    )}
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                facilities.map((facility) => (
                  <tr
                    key={facility.facility_id}
                    onClick={() => handleRowClick(facility)}
                    className="cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50"
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="h-4 w-4 cursor-pointer rounded border-slate-300"
                      />
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-900">
                      {facility.facility_name}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {facility.hfr_id || "N/A"}
                    </td>
                    <td className="max-w-xs truncate p-4 text-sm text-slate-600">
                      {facility.address}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {facility.facility_lga}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {facility.facility_category}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      <div className="flex flex-col gap-0.5">
                        <span>{formatDate(facility.last_updated)}</span>
                        <span className="text-xs text-slate-400">
                          {formatRelativeDate(facility.last_updated)}
                        </span>
                      </div>
                    </td>
                    <td className="sticky right-0 bg-white p-4 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => handleEdit(facility, e)}
                          className="hover:text-primary rounded-lg p-2 text-slate-400 transition hover:bg-teal-50"
                        >
                          <PenIcon size={18} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(facility.facility_id, e)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
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

        <div className="flex items-center justify-between border-t border-slate-100 p-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isLoading}
            className={`flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition ${
              currentPage === 1 || isLoading
                ? "cursor-not-allowed bg-slate-50 text-slate-400"
                : "bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="text-sm text-slate-400">({totalRecords} total)</div>
            {isFetching && (
              <Loader2 className="text-primary h-4 w-4 animate-spin" />
            )}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage >= totalPages || isLoading}
            className={`flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition ${
              currentPage >= totalPages || isLoading
                ? "cursor-not-allowed bg-slate-50 text-slate-400"
                : "bg-white text-slate-700 hover:bg-slate-50"
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

      {/* Facility Details Slide-in Modal */}
      <FacilityDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        facility={selectedFacility}
        onEditFacility={handleEditFromDetails}
      />
    </>
  );
}
