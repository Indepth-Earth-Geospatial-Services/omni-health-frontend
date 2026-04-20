"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ArrowUpDown,
  ChevronRight,
  ChevronLeft,
  PenIcon,
  Loader2,
} from "lucide-react";
import RegistryHeader from "../layouts/RegistryHeader";
import {
  type FacilityFilterState,
  type ExportFormat,
  INITIAL_FILTER_STATE,
} from "@/features/super-admin/components/types/types";
import AddFacilityModal from "../modals/AddFacilityModal";
import FacilityDetailsModal from "../modals/FacilityDetailsModal";
import { useFacilities } from "../../hooks/useSuperAdminUsers";
import { formatDate, formatRelativeDate } from "@/lib/format-date";
import {
  superAdminService,
  type Facility,
} from "../../services/super-admin.service";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function FacilityRegistry() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] =
    useState<FacilityFilterState>(INITIAL_FILTER_STATE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => superAdminService.bulkDeleteFacilities(ids),
    onSuccess: (_data, ids) => {
      const label = ids.length === 1 ? "1 facility" : `${ids.length} facilities`;
      toast.success(`${label} deleted`);
      setSelectedIds(new Set());
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
    onError: (error: unknown) => {
      const detail = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Failed to delete facilities");
    },
  });

  // When sorting is active, we need to fetch ALL data to sort properly
  const isSorting = !!filters.sortBy;

  const searchParams = useMemo(
    () => ({
      page: isSorting ? 1 : currentPage,
      limit: isSorting ? 1000 : itemsPerPage,
      name: filters.searchQuery || undefined,
      category:
        filters.selectedCategory !== "all"
          ? filters.selectedCategory
          : undefined,
      lga_name: filters.selectedLGA !== "all" ? filters.selectedLGA : undefined,
    }),
    [
      currentPage,
      filters.searchQuery,
      filters.selectedCategory,
      filters.selectedLGA,
      isSorting,
    ],
  );

  const { data, isLoading, isError, error, isFetching } =
    useFacilities(searchParams);

  const rawFacilities = useMemo(
    () => data?.facilities || [],
    [data?.facilities],
  );
  const pagination = data?.pagination;

  const sortedFacilities = useMemo(() => {
    if (!filters.sortBy) return rawFacilities;

    const sorted = [...rawFacilities];
    sorted.sort((a, b) => {
      switch (filters.sortBy) {
        case "name_asc":
          return (a.facility_name || "").localeCompare(b.facility_name || "");
        case "name_desc":
          return (b.facility_name || "").localeCompare(a.facility_name || "");
        case "lga_asc":
          return (a.facility_lga || "").localeCompare(b.facility_lga || "");
        case "category_asc":
          return (a.facility_category || "").localeCompare(
            b.facility_category || "",
          );
        case "updated_desc":
          return (
            new Date(b.last_updated || 0).getTime() -
            new Date(a.last_updated || 0).getTime()
          );
        case "updated_asc":
          return (
            new Date(a.last_updated || 0).getTime() -
            new Date(b.last_updated || 0).getTime()
          );
        default:
          return 0;
      }
    });
    return sorted;
  }, [rawFacilities, filters.sortBy]);

  // When sorting, handle pagination client-side
  const facilities = useMemo(() => {
    if (!isSorting) return sortedFacilities;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedFacilities.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedFacilities, isSorting, currentPage]);

  const totalRecords = isSorting
    ? sortedFacilities.length
    : pagination?.total_records || 0;
  const totalPages = isSorting
    ? Math.ceil(sortedFacilities.length / itemsPerPage)
    : pagination?.total_pages || 1;

  // ── Selection handlers (declared after `facilities`) ──────────────────────
  const allOnPageSelected =
    facilities.length > 0 && facilities.every((f) => selectedIds.has(f.facility_id));

  const handleCheckboxToggle = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [],
  );

  const handleSelectAll = useCallback(() => {
    if (allOnPageSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(facilities.map((f) => f.facility_id)));
    }
  }, [allOnPageSelected, facilities]);

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    bulkDeleteMutation.mutate(Array.from(selectedIds));
  }, [selectedIds, bulkDeleteMutation]);

  // ── Other handlers ────────────────────────────────────────────────────────
  const handleSearch = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: value }));
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sortValue: string) => {
    setFilters((prev) => ({ ...prev, sortBy: sortValue }));
  }, []);

  const handleFilterChange = useCallback(
    (partial: Partial<FacilityFilterState>) => {
      setFilters((prev) => ({ ...prev, ...partial }));
      setCurrentPage(1);
    },
    [],
  );

  const handleExport = useCallback(async (format: ExportFormat) => {
    try {
      toast.loading("Exporting facilities...", { id: "export-facilities" });
      const blob = await superAdminService.exportFacilities({ format });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `facilities_export.${format === "CSV" ? "csv" : "xlsx"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Facilities exported successfully", {
        id: "export-facilities",
      });
    } catch {
      toast.error("Failed to export facilities", { id: "export-facilities" });
    }
  }, []);

  const handleAddNew = () => {
    setSelectedFacility(null);
    setIsModalOpen(true);
  };

  const handleRowClick = (facility: Facility) => {
    setSelectedFacility(facility);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (facility: Facility, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedFacility(facility);
    setIsModalOpen(true);
  };

  const handleEditFromDetails = () => {
    setIsDetailsModalOpen(false);
    setIsModalOpen(true);
  };

  return (
    <>
      <RegistryHeader
        searchPlaceholder="Search facilities..."
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
        filters={filters}
        buttonLabel="Add New Facility"
        onButtonClick={handleAddNew}
        selectedCount={selectedIds.size}
        onDeleteSelected={handleBulkDelete}
        isDeleting={bulkDeleteMutation.isPending}
      />

      <div className="flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div
          className="relative overflow-x-auto"
          style={{ minHeight: "720px" }}
        >
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 border-b border-slate-200 bg-slate-50">
              <tr className="text-sm font-medium text-slate-500">
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-teal-600"
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
                    {filters.searchQuery && (
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
                    className={`cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50 ${
                      selectedIds.has(facility.facility_id) ? "bg-teal-50/50" : ""
                    }`}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(facility.facility_id)}
                        onChange={(e) =>
                          handleCheckboxToggle(facility.facility_id, e as unknown as React.MouseEvent)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-teal-600"
                      />
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-900">
                      {facility.facility_name || "-"}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {facility.hfr_id || "-"}
                    </td>
                    <td className="max-w-xs truncate p-4 text-sm text-slate-600">
                      {facility.address &&
                      typeof facility.address === "string" &&
                      facility.address !== "NaN" &&
                      facility.address.trim() !== ""
                        ? facility.address
                        : "-"}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {facility.facility_lga || "-"}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {facility.facility_category || "-"}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      <div className="flex flex-col gap-0.5">
                        <span>{formatDate(facility.last_updated || "-")}</span>
                        <span className="text-xs text-slate-400">
                          {formatRelativeDate(facility.last_updated || "-")}
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

      <AddFacilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        facility={selectedFacility}
      />

      <FacilityDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        facility={selectedFacility}
        onEditFacility={handleEditFromDetails}
      />
    </>
  );
}
