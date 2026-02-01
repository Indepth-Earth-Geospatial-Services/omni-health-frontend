// useStaffList.ts
import { useState } from "react";
import toast from "react-hot-toast";
import {
  useAdminStaff,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
  type CreateStaffData,
  type StaffMember,
} from "@/features/admin/hooks/use-admin-staff";

export const useStaffList = (facilityId: string) => {
  // --- State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    staffData: StaffMember | null;
  }>({ isOpen: false, staffData: null });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    staffId: string;
    staffName: string;
  }>({ isOpen: false, staffId: "", staffName: "" });

  // --- API Hooks ---
  const { data, isLoading, isError, error, isFetching, isPlaceholderData } =
    useAdminStaff(facilityId, currentPage, itemsPerPage);

  const createStaffMutation = useCreateStaff(facilityId);
  const updateStaffMutation = useUpdateStaff(facilityId);
  const deleteStaffMutation = useDeleteStaff(facilityId);

  // --- Computed Data ---
  const staffs = Array.isArray(data) ? data : (data?.staff ?? []);
  const apiPagination = !Array.isArray(data) ? data?.pagination : null;
  const totalRecords = apiPagination?.total_records ?? 0;

  const hasMorePages =
    staffs.length === itemsPerPage && !apiPagination?.total_records;
  const totalPages = apiPagination?.total_records
    ? Math.ceil(apiPagination.total_records / itemsPerPage)
    : apiPagination?.total_pages
      ? apiPagination.total_pages
      : hasMorePages
        ? currentPage + 1
        : currentPage;

  // Calculate dynamic column visibility based on data
  const columnVisibility = {
    hasGender: staffs.some((s) => s.gender),
    hasRank: staffs.some((s) => s.rank_cadre),
    hasGradeLevel: staffs.some((s) => s.grade_level),
    hasPhone: staffs.some((s) => s.phone_number),
    hasEmail: staffs.some((s) => s.email),
    hasDateFirstAppt: staffs.some((s) => s.date_first_appointment),
    hasDateOfBirth: staffs.some((s) => s.date_of_birth),
    hasQualifications: staffs.some(
      (s) => s.qualifications && Object.keys(s.qualifications).length > 0,
    ),
    hasStatus: staffs.some((s) => s.is_active !== undefined),
  };

  // --- Handlers ---
  const handleNextPage = () => {
    if (!isPlaceholderData && currentPage < totalPages)
      setCurrentPage((p) => p + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleAddStaff = (staffData: Record<string, any>) => {
    const loadingToast = toast.loading("Creating staff member...");
    createStaffMutation.mutate(staffData as CreateStaffData, {
      onSuccess: () => {
        toast.success("Staff member created successfully!", {
          id: loadingToast,
        });
        setIsModalOpen(false);
        setCurrentPage(1);
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message || err?.message || "Failed to create";
        toast.error(msg, { id: loadingToast });
      },
    });
  };

  const handleUpdateStaff = (updatedData: Record<string, any>) => {
    if (!editModal.staffData) return;
    const loadingToast = toast.loading("Updating staff member...");
    updateStaffMutation.mutate(
      { staffId: editModal.staffData.staff_id, data: updatedData },
      {
        onSuccess: () => {
          toast.success("Updated successfully!", { id: loadingToast });
          setEditModal({ isOpen: false, staffData: null });
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message || err?.message || "Failed to update";
          toast.error(msg, { id: loadingToast });
        },
      },
    );
  };

  const confirmDelete = () => {
    const loadingToast = toast.loading("Deleting staff member...");
    deleteStaffMutation.mutate(deleteModal.staffId, {
      onSuccess: () => {
        toast.success("Deleted successfully!", { id: loadingToast });
        setDeleteModal({ isOpen: false, staffId: "", staffName: "" });
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message || err?.message || "Failed to delete";
        toast.error(msg, { id: loadingToast });
      },
    });
  };

  return {
    // Data & State
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

    // Modal States
    isModalOpen,
    setIsModalOpen,
    editModal,
    setEditModal,
    deleteModal,
    setDeleteModal,

    // Actions
    handleNextPage,
    handlePreviousPage,
    handleAddStaff,
    handleUpdateStaff,
    confirmDelete,

    // Mutation States
    isCreating: createStaffMutation.isPending,
    isUpdating: updateStaffMutation.isPending,
    isDeleting: deleteStaffMutation.isPending,
  };
};
