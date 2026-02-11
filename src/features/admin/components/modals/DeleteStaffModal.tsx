"use client";

import React from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface DeleteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  staffName: string;
  isDeleting?: boolean;
}

const DeleteStaffModal: React.FC<DeleteStaffModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  staffName,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header with gradient */}
        <div className="flex items-center justify-between bg-red-500 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <AlertTriangle size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
              <p className="mt-0.5 text-sm text-red-100">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-2 transition-colors hover:bg-white/20 disabled:opacity-50"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          {/* Warning Message */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="text-sm text-slate-700">
              Are you sure you want to delete{" "}
              <p className="font-semibold text-red-600">{staffName} ?</p>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              All associated records and data will be permanently removed from
              the system.
            </p>
          </div>

          {/* Staff Info Card */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600">
                <span className="text-sm font-bold text-white">
                  {staffName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">{staffName}</p>
                <p className="text-xs text-slate-500">Staff Member</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-500 text-white hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <span className="mr-2 animate-spin">⏳</span>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete Staff
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteStaffModal;
