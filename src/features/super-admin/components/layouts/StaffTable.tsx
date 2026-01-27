"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MinusSquare,
  Loader2,
  PenIcon,
} from "lucide-react";
import TableHeaders, { FilterState } from "./StaffTableHeader";
import AddStaffModal from "../modals/AddStaffModal";
import { superAdminService } from "@/features/super-admin/services/super-admin.service";

// Helper function to convert text to sentence case
const toSentenceCase = (str: string | undefined | null): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const StaffTables = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedFacility: "all",
    selectedLGA: "all",
    selectedGender: "all",
    selectedStatus: "all",
  });

  // Determine if we should use search or getAllStaff
  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.selectedFacility !== "all" ||
    filters.selectedGender !== "all" ||
    filters.selectedStatus !== "all";

  // Use search API when filters are active and a facility is selected
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["all-staff", page, limit, filters],
    queryFn: async () => {
      // If facility is selected and we have filters, use search endpoint
      if (filters.selectedFacility !== "all" && hasActiveFilters) {
        return await superAdminService.searchStaff({
          facility_id: filters.selectedFacility,
          name: filters.searchQuery || undefined,
          gender:
            filters.selectedGender !== "all"
              ? filters.selectedGender
              : undefined,
          is_active:
            filters.selectedStatus !== "all"
              ? filters.selectedStatus === "true"
              : undefined,
          page,
          limit,
        });
      }

      // Otherwise use the getAllStaff endpoint
      return await superAdminService.getAllStaff({ page, limit });
    },
    // Refetch when filters change
    staleTime: 0,
  });

  const staff = data?.staff ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleAddStaffSuccess = () => {
    // Refetch the staff list after successful addition
    refetch();
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Reset to page 1 when filters change
    setPage(1);
  };

  // Animation Variants
  const rowVars = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  // Gradient colors for avatar
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-cyan-500 to-blue-600",
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-green-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-sky-500 to-cyan-600",
  ];

  const getInitials = (name: string) => {
    const formattedName = toSentenceCase(name);
    return (
      formattedName
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "?"
    );
  };

  if (isLoading) {
    return (
      <>
        <TableHeaders
          title="Staff List"
          searchPlaceholder="Search by name..."
          showLGAFilter={false}
          showFacilitiesFilter={true}
          showGenderFilter={true}
          showStatusFilter={true}
          showDownload={true}
          onDownload={(scope) => console.log("Download:", scope)}
          buttonLabel="Add New Staff"
          onButtonClick={() => setIsAddStaffModalOpen(true)}
          totalRecords={0}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
        <div className="flex h-64 w-full items-center justify-center rounded-xl border border-slate-200 bg-white">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
        <AddStaffModal
          isOpen={isAddStaffModalOpen}
          onClose={() => setIsAddStaffModalOpen(false)}
          onSuccess={handleAddStaffSuccess}
        />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <TableHeaders
          title="Staff List"
          searchPlaceholder="Search by name..."
          showLGAFilter={false}
          showFacilitiesFilter={true}
          showGenderFilter={true}
          showStatusFilter={true}
          showDownload={true}
          onDownload={(scope) => console.log("Download:", scope)}
          buttonLabel="Add New Staff"
          onButtonClick={() => setIsAddStaffModalOpen(true)}
          totalRecords={0}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
        <div className="flex h-64 w-full items-center justify-center rounded-xl border border-slate-200 bg-white">
          <p className="text-red-500">
            Error loading staff:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
        <AddStaffModal
          isOpen={isAddStaffModalOpen}
          onClose={() => setIsAddStaffModalOpen(false)}
          onSuccess={handleAddStaffSuccess}
        />
      </>
    );
  }

  return (
    <>
      <TableHeaders
        title="Staff List"
        searchPlaceholder="Search by name..."
        showLGAFilter={false}
        showFacilitiesFilter={true}
        showGenderFilter={true}
        showStatusFilter={true}
        showDownload={true}
        onDownload={(scope) => console.log("Download:", scope)}
        buttonLabel="Add New Staff"
        onButtonClick={() => setIsAddStaffModalOpen(true)}
        totalRecords={pagination?.total_records ?? 0}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div
          className="relative overflow-x-auto"
          style={{ minHeight: "720px" }}
        >
          <table className="w-full border-collapse text-left">
            {/* Table Header */}
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
              <tr className="text-sm font-medium text-slate-500">
                <th className="w-12 p-4">
                  <MinusSquare
                    size={18}
                    className="bg-primary/10 text-primary rounded"
                  />
                </th>
                <th className="cursor-pointer p-4 transition-colors hover:text-slate-800">
                  <div className="font-inter flex items-center gap-2 text-[11.38px] font-medium text-[#475467]">
                    Staff Name <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="p-4 text-[11.38px] font-medium text-[#475467]">
                  Gender
                </th>
                <th className="p-4 text-[11.38px] font-medium text-[#475467]">
                  Rank/Cadre
                </th>
                <th className="p-4 text-[11.38px] font-medium text-[#475467]">
                  Grade Level
                </th>
                <th className="p-4 text-[11.38px] font-medium text-[#475467]">
                  Phone Number
                </th>
                <th className="p-4 text-[11.38px] font-medium text-[#475467]">
                  Date of 1st Appt
                </th>
                <th className="p-4 text-[11.38px] font-medium text-[#475467]">
                  Date of Birth
                </th>
                <th className="p-4 text-[11.38px] font-medium text-[#475467]">
                  Qualifications
                </th>
                <th className="p-4 text-[11.38px] font-medium text-[#475467]">
                  Status
                </th>
                <th className="sticky right-0 bg-slate-50 p-4 text-center text-[11.38px] font-medium text-[#475467] shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="p-8 text-center text-slate-500"
                    style={{ height: "668px" }}
                  >
                    <div className="flex h-full flex-col items-center justify-center">
                      {hasActiveFilters ? (
                        <>
                          <p className="font-medium">No staff members found</p>
                          <p className="mt-1 text-sm">
                            Try adjusting your filters
                          </p>
                        </>
                      ) : (
                        <p>No staff members found</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                staff.map((item, idx) => {
                  const gradient = gradients[idx % gradients.length];
                  const formattedName = toSentenceCase(item.full_name);
                  const initials = getInitials(item.full_name);

                  return (
                    <motion.tr
                      key={item.staff_id}
                      variants={rowVars}
                      initial="initial"
                      animate="animate"
                      whileHover={{ backgroundColor: "#f8fafc" }}
                      className="group border-b border-slate-100 transition-colors last:border-0"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="text-primary focus:ring-primary h-4 w-4 rounded border-slate-300"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br ${gradient} text-xs font-bold text-white shadow-sm`}
                          >
                            {initials}
                          </div>
                          <div className="flex flex-col justify-center">
                            <p className="text-[13.69px] font-medium text-slate-900">
                              {formattedName}
                            </p>
                            <p className="mt-0.5 text-[12.64px] font-normal text-[#475467]">
                              {item.email || "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-medium ${
                            item.gender?.toLowerCase() === "male"
                              ? "bg-blue-100 text-blue-700"
                              : item.gender?.toLowerCase() === "female"
                                ? "bg-pink-100 text-pink-700"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {toSentenceCase(item.gender) || "-"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {toSentenceCase(item.rank_cadre) || "-"}
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {item.grade_level || "-"}
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {item.phone_number || "-"}
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {item.date_first_appointment || "-"}
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {item.date_of_birth || "-"}
                      </td>
                      <td className="max-w-48 truncate p-4 text-sm text-slate-600">
                        {item.qualifications
                          ? Object.keys(item.qualifications).join(", ")
                          : "-"}
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-medium ${
                            item.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="sticky right-0 bg-white p-4 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] group-hover:bg-slate-50">
                        <div className="flex items-center justify-center gap-2">
                          <button className="hover:text-primary rounded-lg p-2 text-slate-400 transition-all hover:bg-teal-50">
                            <PenIcon size={18} />
                          </button>
                          <button className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="mt-auto flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-4 md:flex-row">
          <button
            onClick={handlePrevPage}
            disabled={page <= 1}
            className={`flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors ${
              page <= 1
                ? "cursor-not-allowed bg-slate-50 text-slate-400"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-slate-500">
              Page {page} of {totalPages}
            </p>
            <p className="text-xs text-slate-400">
              {pagination?.total_records ?? 0} total records
            </p>
          </div>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages}
            className={`flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors ${
              page >= totalPages
                ? "cursor-not-allowed bg-slate-50 text-slate-400"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        onSuccess={handleAddStaffSuccess}
      />
    </>
  );
};

export default StaffTables;
