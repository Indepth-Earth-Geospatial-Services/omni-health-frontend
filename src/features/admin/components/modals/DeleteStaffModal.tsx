"use client";

import ConfirmationModal from "@/components/shared/modals/ConfirmationModal";

interface DeleteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  staffName: string;
  isDeleting?: boolean;
}

export default function DeleteStaffModal({
  isOpen,
  onClose,
  onConfirm,
  staffName,
  isDeleting = false,
}: DeleteStaffModalProps) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Staff Member"
      message={`Are you sure you want to delete ${staffName}?`}
      description="All associated records and data will be permanently removed from the system."
      confirmLabel="Delete Staff"
      cancelLabel="Cancel"
      isLoading={isDeleting}
      variant="danger"
      itemName={staffName}
      itemDetails="Staff Member"
    />
  );
}
