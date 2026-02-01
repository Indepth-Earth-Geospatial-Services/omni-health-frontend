"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MinusSquare,
  PenIcon,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import TableHeaders from "./TableHeaders";
import AddStaffModal from "./AddStaffModal";
import EditStaffModal from "./EditStaffModal";
import DeleteStaffModal from "./DeleteStaffModal";
import {
  useAdminStaff,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
  type CreateStaffData,
  type StaffMember,
} from "@/features/admin/hooks/use-admin-staff";

interface StaffListProps {
  facilityId: string;
}

/**
 * Converts a string to sentence case (capitalizes first letter of each word)
 * Handles various input formats: ALL CAPS, all lowercase, mixed case
 */
const toSentenceCase = (str: string | undefined | null): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const StaffList = ({ facilityId }: StaffListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    staffData: StaffMember | null;
  }>({
    isOpen: false,
    staffData: null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    staffId: string;
    staffName: string;
  }>({
    isOpen: false,
    staffId: "",
    staffName: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // TanStack Query hooks
  const { data, isLoading, isError, error, isFetching, isPlaceholderData } =
    useAdminStaff(facilityId, currentPage, itemsPerPage);

  const createStaffMutation = useCreateStaff(facilityId);
  const updateStaffMutation = useUpdateStaff(facilityId);
  const deleteStaffMutation = useDeleteStaff(facilityId);

  // Extract data from query response
  const staffs = Array.isArray(data) ? data : (data?.staff ?? []);

  // Get pagination from API response
  const apiPagination = !Array.isArray(data) ? data?.pagination : null;

  // Calculate total records - use API value if available, otherwise we can't know the true total
  // If API doesn't return total_records, we assume there might be more pages if we got a full page
  const totalRecords = apiPagination?.total_records ?? 0;

  // Calculate total pages from API pagination or estimate based on current data
  // If we have API pagination with total_records, use that for calculation
  // Otherwise, if we received a full page of items, assume there might be more
  const hasMorePages =
    staffs.length === itemsPerPage && !apiPagination?.total_records;
  const totalPages = apiPagination?.total_records
    ? Math.ceil(apiPagination.total_records / itemsPerPage)
    : apiPagination?.total_pages
      ? apiPagination.total_pages
      : hasMorePages
        ? currentPage + 1 // Assume at least one more page
        : currentPage; // Current page is the last

  // Pagination handlers
  const handleNextPage = () => {
    if (!isPlaceholderData && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Handle create staff with toast
  const handleAddStaff = (staffData: Record<string, any>) => {
    const loadingToast = toast.loading("Creating staff member...");

    createStaffMutation.mutate(staffData as CreateStaffData, {
      onSuccess: () => {
        toast.success("Staff member created successfully!", {
          id: loadingToast,
          duration: 4000,
        });
        setIsModalOpen(false);
        setCurrentPage(1);
      },
      onError: (err: any) => {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create staff member";
        toast.error(errorMessage, {
          id: loadingToast,
          duration: 5000,
        });
        console.error("Failed to create staff:", err);
      },
    });
  };

  // Handle edit staff
  const handleEditStaff = (staffData: StaffMember) => {
    setEditModal({ isOpen: true, staffData });
  };

  // Handle update staff with toast
  const handleUpdateStaff = (updatedData: Record<string, any>) => {
    if (!editModal.staffData) return;

    const loadingToast = toast.loading("Updating staff member...");

    updateStaffMutation.mutate(
      {
        staffId: editModal.staffData.staff_id,
        data: updatedData,
      },
      {
        onSuccess: () => {
          toast.success("Staff member updated successfully!", {
            id: loadingToast,
            duration: 4000,
          });
          setEditModal({ isOpen: false, staffData: null });
        },
        onError: (err: any) => {
          const errorMessage =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to update staff member";
          toast.error(errorMessage, {
            id: loadingToast,
            duration: 5000,
          });
          console.error("Failed to update staff:", err);
        },
      },
    );
  };

  // Handle delete with toast
  const handleDeleteStaff = (staffId: string, staffName: string) => {
    setDeleteModal({ isOpen: true, staffId, staffName });
  };

  const confirmDelete = () => {
    const loadingToast = toast.loading("Deleting staff member...");

    deleteStaffMutation.mutate(deleteModal.staffId, {
      onSuccess: () => {
        toast.success("Staff member deleted successfully!", {
          id: loadingToast,
          duration: 4000,
        });
        setDeleteModal({ isOpen: false, staffId: "", staffName: "" });
      },
      onError: (err: any) => {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete staff member";
        toast.error(errorMessage, {
          id: loadingToast,
          duration: 5000,
        });
        console.error("Failed to delete staff:", err);
      },
    });
  };

  // Check if any staff has data for each field to show those columns
  const hasGender = staffs.some((s) => s.gender);
  const hasRank = staffs.some((s) => s.rank_cadre);
  const hasGradeLevel = staffs.some((s) => s.grade_level);
  const hasPhone = staffs.some((s) => s.phone_number);
  const hasEmail = staffs.some((s) => s.email);
  const hasDateFirstAppt = staffs.some((s) => s.date_first_appointment);
  const hasDateOfBirth = staffs.some((s) => s.date_of_birth);
  const hasQualifications = staffs.some(
    (s) => s.qualifications && Object.keys(s.qualifications).length > 0,
  );
  const hasStatus = staffs.some((s) => s.is_active !== undefined);

  // Animation Variants
  const rowVars = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        {/* <Toaster position="top-right" /> */}
        <TableHeaders
          title="Staff Management"
          searchPlaceholder="Search staff..."
          onSearch={(value) => console.log(value)}
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

  // Error state
  if (isError) {
    return (
      <>
        {/* <Toaster position="top-right" /> */}
        <TableHeaders
          title="Staff Management"
          searchPlaceholder="Search staff..."
          onSearch={(value) => console.log(value)}
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

  return (
    <>
      {/* Toast Container */}
      {/* <Toaster position="top-right" /> */}

      <TableHeaders
        title="Staff Management"
        searchPlaceholder="Search staff..."
        onSearch={(value) => console.log(value)}
        buttonLabel="Add New Staff"
        onButtonClick={() => setIsModalOpen(true)}
      />
      <div className="flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Loading overlay when fetching new page */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        )}

        {/* Fixed height container for 10 rows - each row ~72px, so 720px total */}
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
                    className="text-primary bg-primary/10 rounded"
                  />
                </th>
                {/* <th className="p-4">S/NO</th> */}
                <th className="cursor-pointer p-4 transition-colors hover:text-slate-800">
                  <div className="font-inter-medium font-inter flex items-center gap-2 text-[11.38px] text-[#475467]">
                    Staff Name <ArrowUpDown size={14} />
                  </div>
                </th>
                {hasGender && (
                  <th className="font-inter-medium font-inter p-4 text-[11.38px] text-[#475467]">
                    Gender
                  </th>
                )}
                {hasRank && (
                  <th className="font-inter-medium font-dmsans p-4 text-[11.38px] text-[#475467]">
                    Rank/Cadre
                  </th>
                )}
                {hasGradeLevel && (
                  <th className="font-inter-medium font-dmsans p-4 text-[11.38px] text-[#475467]">
                    Grade Level
                  </th>
                )}
                {hasPhone && (
                  <th className="font-inter-medium font-dmsans p-4 text-[11.38px] text-[#475467]">
                    Phone Number
                  </th>
                )}
                {/* {hasEmail && <th className="p-4 text-[11.38px] font-inter-medium font-inter text-[#475467]">Email</th>} */}
                {hasDateFirstAppt && (
                  <th className="font-inter-medium font-dmsans p-4 text-[11.38px] text-[#475467]">
                    Date of 1st Appt
                  </th>
                )}
                {hasDateOfBirth && (
                  <th className="font-inter-medium font-dmsans p-4 text-[11.38px] text-[#475467]">
                    Date of Birth
                  </th>
                )}
                {hasQualifications && (
                  <th className="font-inter-medium font-dmsans p-4 text-[11.38px] text-[#475467]">
                    Qualifications
                  </th>
                )}
                {hasStatus && (
                  <th className="font-inter-medium font-dmsans p-4 text-[11.38px] text-[#475467]">
                    Status
                  </th>
                )}
                <th className="font-dmsans sticky right-0 bg-slate-50 p-4 text-center text-[11.38px] text-[#475467] shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {staffs.length === 0 ? (
                <tr>
                  <td
                    colSpan={20}
                    className="p-8 text-center text-slate-500"
                    style={{ height: "668px" }}
                  >
                    <div className="flex h-full flex-col items-center justify-center">
                      <p>No staff members found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                staffs.map((item, idx) => {
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
                  const gradient = gradients[idx % gradients.length];

                  const formattedName = toSentenceCase(item.full_name);
                  const initials =
                    formattedName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase() || "?";

                  return (
                    <motion.tr
                      key={item.staff_id || idx}
                      variants={rowVars}
                      whileHover={{ backgroundColor: "#f8fafc" }}
                      className="group border-b border-slate-100 transition-colors last:border-0"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="text-primary focus:ring-primary h-4 w-4 rounded border-slate-300"
                        />
                      </td>

                      {/* <td className="p-4 text-sm text-slate-600">{idx + 1 + (currentPage - 1) * itemsPerPage}</td> */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-xs font-bold text-white shadow-sm`}
                          >
                            {initials}
                          </div>
                          <div className="flex flex-col justify-center">
                            <p className="font-dmsans text-sm text-[13.69px] font-medium text-slate-900">
                              {formattedName}
                            </p>
                            {hasEmail && (
                              <p className="font-dmsans mt-0.5 text-[12.64px] font-normal text-[#475467]">
                                {item.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      {hasGender && (
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
                      )}
                      {hasRank && (
                        <td className="p-4 text-sm text-slate-600">
                          {toSentenceCase(item.rank_cadre) || "-"}
                        </td>
                      )}
                      {hasGradeLevel && (
                        <td className="p-4 text-sm text-slate-600">
                          {item.grade_level || "-"}
                        </td>
                      )}
                      {hasPhone && (
                        <td className="p-4 text-sm text-slate-600">
                          {item.phone_number || "-"}
                        </td>
                      )}

                      {hasDateFirstAppt && (
                        <td className="p-4 text-sm text-slate-600">
                          {item.date_first_appointment || "-"}
                        </td>
                      )}
                      {hasDateOfBirth && (
                        <td className="p-4 text-sm text-slate-600">
                          {item.date_of_birth || "-"}
                        </td>
                      )}
                      {hasQualifications && (
                        <td className="max-w-48 truncate p-4 text-sm text-slate-600">
                          {item.qualifications
                            ? Object.keys(item.qualifications).join(", ")
                            : "-"}
                        </td>
                      )}
                      {hasStatus && (
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
                      )}
                      <td className="sticky right-0 bg-white p-4 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] group-hover:bg-slate-50">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditStaff(item)}
                            disabled={updateStaffMutation.isPending}
                            className="hover:text-primary rounded-lg p-2 text-slate-400 transition-all hover:bg-teal-50 disabled:opacity-50"
                          >
                            <PenIcon size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteStaff(item.staff_id, formattedName)
                            }
                            disabled={deleteStaffMutation.isPending}
                            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                          >
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

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStaff}
        facilityId={facilityId}
        isSubmitting={createStaffMutation.isPending}
      />

      {/* Edit Staff Modal - key forces re-render with new data */}
      <EditStaffModal
        key={editModal.staffData?.staff_id || "edit-staff-modal"}
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, staffData: null })}
        onSubmit={handleUpdateStaff}
        facilityId={facilityId}
        staffData={editModal.staffData}
        isUpdating={updateStaffMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <DeleteStaffModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, staffId: "", staffName: "" })
        }
        onConfirm={confirmDelete}
        staffName={deleteModal.staffName}
        isDeleting={deleteStaffMutation.isPending}
      />
    </>
  );
};

export default StaffList;
