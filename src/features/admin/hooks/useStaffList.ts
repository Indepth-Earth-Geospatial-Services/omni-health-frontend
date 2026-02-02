// useStaffList.ts
import { useState } from "react";
import { toast } from "sonner";
import {
  useAdminStaff,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
  type CreateStaffData,
  type StaffMember,
} from "@/features/admin/hooks/useAdminStaff";

/**
 * Custom Hook: useStaffList
 * -------------------------
 * This hook encapsulates all the logic required for the Staff Management page.
 * It separates the "business logic" (state, data fetching, handlers) from the "UI" (JSX).
 *
 * @param facilityId - The ID of the facility to fetch staff for.
 */
export const useStaffList = (facilityId: string) => {
  // ============================================================================
  // 1. LOCAL STATE MANAGEMENT
  // ============================================================================

  // Controls the visibility of the "Add Staff" modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stores the current search input value (maps to 'name' in the API)
  const [searchQuery, setSearchQuery] = useState("");

  // Tracks the current page number for pagination (starts at 1)
  const [currentPage, setCurrentPage] = useState(1);

  // Constant: Number of items to show per page
  const itemsPerPage = 10;

  // Stores state for the Edit Modal
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    staffData: StaffMember | null; // Holds the data of the staff being edited
  }>({ isOpen: false, staffData: null });

  // Stores state for the Delete Confirmation Modal
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    staffId: string;
    staffName: string; // Used to show the name in the confirmation message
  }>({ isOpen: false, staffId: "", staffName: "" });

  // ============================================================================
  // 2. API HOOKS (TanStack Query)
  // ============================================================================

  // Fetch Staff Data
  // We pass 'searchQuery' as 'name'. If it's empty, we pass undefined to ignore it.
  const { data, isLoading, isError, error, isFetching, isPlaceholderData } =
    useAdminStaff(facilityId, {
      page: currentPage,
      limit: itemsPerPage,
      name: searchQuery || undefined, // Only filter by name if user typed something
    });

  // Mutation Hooks (for Create, Update, Delete operations)
  const createStaffMutation = useCreateStaff(facilityId);
  const updateStaffMutation = useUpdateStaff(facilityId);
  const deleteStaffMutation = useDeleteStaff(facilityId);

  // ============================================================================
  // 3. COMPUTED DATA (Derived State)
  // ============================================================================

  // Safely extract the staff array.
  // The API might return an array directly OR an object with a 'staff' property.
  const staffs = Array.isArray(data) ? data : (data?.staff ?? []);

  // Safely extract pagination metadata from the API response.
  const apiPagination = !Array.isArray(data) ? data?.pagination : null;
  const totalRecords = apiPagination?.total_records ?? 0;

  // Calculate Total Pages
  // 1. Try to use 'total_records' from API.
  // 2. Fallback: If we have a full page of items but no total count, assume there's a next page.
  const hasMorePages =
    staffs.length === itemsPerPage && !apiPagination?.total_records;
  const totalPages = apiPagination?.total_records
    ? Math.ceil(apiPagination.total_records / itemsPerPage)
    : apiPagination?.total_pages
      ? apiPagination.total_pages
      : hasMorePages
        ? currentPage + 1
        : currentPage;

  /**
   * Dynamic Column Visibility
   * Checks the current data to decide which columns to show.
   * Example: If no staff member has a "gender" field, hide the Gender column.
   */
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

  // ============================================================================
  // 4. ACTION HANDLERS
  // ============================================================================

  /**
   * Handle Search
   * Updates the search query and resets pagination to Page 1.
   */
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Always go back to page 1 when filtering
  };

  /**
   * Handle Next Page
   * Moves to the next page if available.
   */
  const handleNextPage = () => {
    // 'isPlaceholderData' checks if we are currently showing cached data while fetching new data
    if (!isPlaceholderData && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  /**
   * Handle Previous Page
   * Moves to the previous page if we are not on page 1.
   */
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  /**
   * Handle Create Staff
   * 1. Shows a loading toast.
   * 2. Calls the create mutation.
   * 3. On success: Updates toast, closes modal, and resets to Page 1 (to see the new item).
   */
  const handleAddStaff = (staffData: Record<string, any>) => {
    const toastId = toast.loading("Creating staff member...");
    createStaffMutation.mutate(staffData as CreateStaffData, {
      onSuccess: () => {
        toast.success("Staff member created successfully!", { id: toastId });
        setIsModalOpen(false);
        setCurrentPage(1);
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message || err?.message || "Failed to create";
        toast.error(msg, { id: toastId });
      },
    });
  };

  /**
   * Handle Update Staff
   * 1. Checks if we have valid staff data to edit.
   * 2. Calls the update mutation.
   * 3. On success: Updates toast and closes the edit modal.
   */
  const handleUpdateStaff = (updatedData: Record<string, any>) => {
    if (!editModal.staffData) return;
    const toastId = toast.loading("Updating staff member...");

    updateStaffMutation.mutate(
      { staffId: editModal.staffData.staff_id, data: updatedData },
      {
        onSuccess: () => {
          toast.success("Updated successfully!", { id: toastId });
          setEditModal({ isOpen: false, staffData: null });
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message || err?.message || "Failed to update";
          toast.error(msg, { id: toastId });
        },
      },
    );
  };

  /**
   * Handle Delete Staff
   * 1. Calls the delete mutation with the ID from state.
   * 2. On success: Updates toast and closes the confirmation modal.
   */
  const confirmDelete = () => {
    const toastId = toast.loading("Deleting staff member...");
    deleteStaffMutation.mutate(deleteModal.staffId, {
      onSuccess: () => {
        toast.success("Deleted successfully!", { id: toastId });
        setDeleteModal({ isOpen: false, staffId: "", staffName: "" });
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message || err?.message || "Failed to delete";
        toast.error(msg, { id: toastId });
      },
    });
  };

  // ============================================================================
  // 5. RETURN VALUES
  // ============================================================================
  return {
    // Data & API State
    staffs,
    isLoading,
    isError,
    error,
    isFetching,
    isPlaceholderData,

    // Pagination Data
    currentPage,
    itemsPerPage,
    totalRecords,
    totalPages,

    // UI State
    columnVisibility,
    searchQuery,

    // Modal Controls (Exposed to be used by the UI)
    isModalOpen,
    setIsModalOpen,
    editModal,
    setEditModal,
    deleteModal,
    setDeleteModal,

    // Action Methods
    handleSearch,
    handleNextPage,
    handlePreviousPage,
    handleAddStaff,
    handleUpdateStaff,
    confirmDelete,

    // Loading Indicators for Buttons (e.g., disable button while submitting)
    isCreating: createStaffMutation.isPending,
    isUpdating: updateStaffMutation.isPending,
    isDeleting: deleteStaffMutation.isPending,
  };
};
