// StaffTables.tsx
"use client";

import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUpDown, MinusSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import TableHeaders, { FilterState } from "./StaffTableHeader";
import AddStaffModal from "../modals/AddStaffModal";
import DownloadNominalRollModal from "../modals/DownloadNominalRollModal";
import ConfirmationModal from "@/components/shared/modals/ConfirmationModal";
import { superAdminService } from "@/features/super-admin/services/super-admin.service";
import type { StaffMember } from "@/services/admin.service";
import { useStaffQuery } from "../../hooks/seStaffQuery";
import { StaffRow } from "../layouts/StaffRow";
import { StaffPagination } from "../layouts/Staff.Pagination";

const StaffTables = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedFacility: "all",
    selectedLGA: "all",
    selectedGender: "all",
    selectedStatus: "all",
  });

  // --- Data Fetching ---
  const { data, isLoading, isError, error, refetch } = useStaffQuery(
    page,
    limit,
    filters,
  );

  const pagination = data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  // --- Client-side filtering ---
  const staff = useMemo(() => {
    const rawStaff = data?.staff ?? [];

    if (filters.selectedFacility !== "all") {
      return rawStaff;
    }

    return rawStaff.filter((member) => {
      // Name Search
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const nameMatch = member.full_name?.toLowerCase().includes(query);
        const emailMatch = member.email?.toLowerCase().includes(query);
        if (!nameMatch && !emailMatch) return false;
      }
      // Gender
      if (
        filters.selectedGender !== "all" &&
        member.gender?.toLowerCase() !== filters.selectedGender.toLowerCase()
      ) {
        return false;
      }
      // Status
      if (filters.selectedStatus !== "all") {
        const isActive = filters.selectedStatus === "true";
        if (member.is_active !== isActive) return false;
      }
      return true;
    });
  }, [data?.staff, filters]);

  // --- Mutations ---
  const deleteStaffMutation = useMutation({
    mutationFn: (staffId: string) => superAdminService.deleteStaff(staffId),
    onSuccess: () => {
      toast.success("Staff member deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["all-staff"] });
      setIsDeleteModalOpen(false);
      setStaffToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete staff: ${error.message}`);
    },
  });

  // --- Handlers ---
  const handleDeleteClick = (staff: StaffMember) => {
    setStaffToDelete(staff);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (staffToDelete) {
      deleteStaffMutation.mutate(staffToDelete.staff_id);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!deleteStaffMutation.isPending) {
      setIsDeleteModalOpen(false);
      setStaffToDelete(null);
    }
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  // --- Render ---
  if (isLoading) {
    return (
      <TableWrapper
        filters={filters}
        onFiltersChange={handleFiltersChange}
        setIsAddStaffModalOpen={setIsAddStaffModalOpen}
      >
        <div className="flex h-64 w-full items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      </TableWrapper>
    );
  }

  if (isError) {
    return (
      <TableWrapper
        filters={filters}
        onFiltersChange={handleFiltersChange}
        setIsAddStaffModalOpen={setIsAddStaffModalOpen}
      >
        <div className="flex h-64 w-full items-center justify-center">
          <p className="text-red-500">
            Error loading staff:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </TableWrapper>
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

            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="p-8 text-center text-slate-500"
                    style={{ height: "668px" }}
                  >
                    <div className="flex h-full flex-col items-center justify-center">
                      <p>No staff members found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                staff.map((item, idx) => (
                  <StaffRow
                    key={item.staff_id}
                    item={item}
                    index={idx}
                    onDelete={handleDeleteClick}
                    onEdit={() => {}} // Placeholder
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <StaffPagination
          page={page}
          totalPages={totalPages}
          totalRecords={pagination?.total_records ?? 0}
          onPrevPage={() => page > 1 && setPage(page - 1)}
          onNextPage={() => page < totalPages && setPage(page + 1)}
        />
      </div>

      {/* Modals */}
      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        onSuccess={() => refetch()}
      />
      <DownloadNominalRollModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        totalRecords={pagination?.total_records ?? 0}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={deleteStaffMutation.isPending}
        variant="danger"
        itemName={staffToDelete?.full_name}
        itemDetails={staffToDelete?.email}
      />
    </>
  );
};

// Helper wrapper to reduce duplication in Loading/Error states
const TableWrapper = ({
  children,
  filters,
  onFiltersChange,
  setIsAddStaffModalOpen,
}: any) => (
  <>
    <TableHeaders
      title="Staff List"
      searchPlaceholder="Search by name..."
      showLGAFilter={false}
      showFacilitiesFilter={true}
      showGenderFilter={true}
      showStatusFilter={true}
      showDownload={true}
      buttonLabel="Add New Staff"
      onButtonClick={() => setIsAddStaffModalOpen(true)}
      totalRecords={0}
      filters={filters}
      onFiltersChange={onFiltersChange}
    />
    <div className="w-full rounded-xl border border-slate-200 bg-white">
      {children}
    </div>
  </>
);

export default StaffTables;
