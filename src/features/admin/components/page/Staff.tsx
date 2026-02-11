// StaffList.tsx
"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// Components
import TableHeaders from "../layout/TableHeaders";
import AddStaffModal from "../modals/AddStaffModal";
import EditStaffModal from "../modals/EditStaffModal";
import DeleteStaffModal from "../modals/DeleteStaffModal";
import StaffTable from "../layout/StaffTable"; // Import the separated table

// Logic Hook
import { useStaffList } from "../../hooks/useStaffList";

interface StaffListProps {
  facilityId: string;
}

const StaffList = ({ facilityId }: StaffListProps) => {
  // Use our custom hook to get all data and handlers
  const {
    staffs,
    isLoading,
    isError,
    error,
    isFetching,
    isPlaceholderData,
    columnVisibility,
    currentPage,
    itemsPerPage,
    totalRecords,
    totalPages,
    isModalOpen,
    setIsModalOpen,
    editModal,
    setEditModal,
    deleteModal,
    setDeleteModal,
    handleSearch,
    handleNextPage,
    handlePreviousPage,
    handleAddStaff,
    handleUpdateStaff,
    confirmDelete,
    isCreating,
    isUpdating,
    isDeleting,
  } = useStaffList(facilityId);

  // --- Loading State ---
  if (isLoading) {
    return (
      <>
        <TableHeaders
          title="Staff Management"
          searchPlaceholder="Search staff..."
          onSearch={handleSearch}
          buttonLabel="Add New Staff"
          onButtonClick={() => setIsModalOpen(true)}
        />
        <div className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white p-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <p className="text-sm text-slate-500">Loading staff data...</p>
          </div>
        </div>
      </>
    );
  }

  // --- Error State ---
  if (isError) {
    return (
      <>
        <TableHeaders
          title="Staff Management"
          searchPlaceholder="Search staff..."
          onSearch={handleSearch}
          buttonLabel="Add New Staff"
          onButtonClick={() => setIsModalOpen(true)}
        />
        <div className="flex w-full items-center justify-center rounded-xl border border-red-200 bg-white p-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm font-medium text-red-600">
              Failed to load staff data
            </p>
            <p className="text-xs text-slate-500">
              {error?.message || "An error occurred"}
            </p>
          </div>
        </div>
      </>
    );
  }

  // --- Main Content ---
  return (
    <>
      <TableHeaders
        title="Staff Management"
        searchPlaceholder="Search staff..."
        onSearch={handleSearch}
        buttonLabel="Add New Staff"
        onButtonClick={() => setIsModalOpen(true)}
      />

      <div className="relative flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Loading overlay for refetching */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        )}

        {/* Separated Table Component */}
        <StaffTable
          staffs={staffs}
          columnVisibility={columnVisibility}
          onEdit={(staff) => setEditModal({ isOpen: true, staffData: staff })}
          onDelete={(id, name) =>
            setDeleteModal({ isOpen: true, staffId: id, staffName: name })
          }
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />

        {/* Pagination Footer */}
        <div className="mt-auto flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-4 md:flex-row">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || isFetching}
            className={`flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors ${
              currentPage === 1 || isFetching
                ? "cursor-not-allowed bg-slate-50 text-slate-400"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-slate-500 italic">
              Page {currentPage} {totalRecords > 0 ? `of ${totalPages}` : ""}
            </p>
            <p className="text-xs text-slate-400">
              {totalRecords > 0
                ? `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalRecords)} of ${totalRecords} records`
                : `Showing ${staffs.length} records`}
            </p>
          </div>

          <button
            onClick={handleNextPage}
            disabled={
              currentPage === totalPages || isPlaceholderData || isFetching
            }
            className={`flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors ${
              currentPage === totalPages || isPlaceholderData || isFetching
                ? "cursor-not-allowed bg-slate-50 text-slate-400"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* --- Modals --- */}
      <AddStaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStaff}
        facilityId={facilityId}
        isSubmitting={isCreating}
      />

      <EditStaffModal
        key={editModal.staffData?.staff_id || "edit-staff-modal"}
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, staffData: null })}
        onSubmit={handleUpdateStaff}
        facilityId={facilityId}
        staffData={editModal.staffData}
        isUpdating={isUpdating}
      />

      <DeleteStaffModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, staffId: "", staffName: "" })
        }
        onConfirm={confirmDelete}
        staffName={deleteModal.staffName}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default StaffList;
