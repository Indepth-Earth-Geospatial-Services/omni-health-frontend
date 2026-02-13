"use client";

import React from "react";
import { createPortal } from "react-dom";
import {
  X,
  AlertTriangle,
  Trash2,
  ImageOff,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";

interface DeleteImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  imageUrl?: string | null;
}

const DeleteImageModal: React.FC<DeleteImageModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  imageUrl,
}) => {
  // Fix 1: We don't need the useEffect/mounted check here.
  // Since this modal is controlled by a state button click in the parent,
  // we know we are already on the client when isOpen becomes true.
  if (!isOpen) return null;

  // Fix 2: Ensure document exists (for safety) before portaling
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="animate-in fade-in absolute inset-0 bg-black/60 transition-opacity duration-200"
        onClick={(e) => {
          // Fix 3: STOP PROPAGATION
          // This prevents the click from bubbling up to the ProfileModal
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Modal */}
      <div
        className="animate-in zoom-in-95 relative mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl duration-200"
        onClick={(e) => e.stopPropagation()} // Stop clicks inside modal from closing anything
      >
        {/* Header with gradient */}
        <div className="flex items-center justify-between bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <AlertTriangle size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Delete Picture</h2>
              <p className="mt-0.5 text-sm text-red-100">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
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
              Are you sure you want to delete this{" "}
              <span className="font-semibold text-red-600">
                Profile Picture?
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              The image will be permanently removed from the server. You will
              revert to the default avatar.
            </p>
          </div>

          {/* Image Preview Card */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="To delete"
                    className="h-full w-full object-cover opacity-80"
                  />
                ) : (
                  <ImageIcon className="text-slate-300" size={24} />
                )}
                {/* Overlay Icon */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <ImageOff size={20} className="text-red-600 drop-shadow-sm" />
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-800">
                  Current Profile Photo
                </p>
                <p className="text-xs text-slate-500">
                  {imageUrl ? "1 image selected" : "Image reference found"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              disabled={isDeleting}
              className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onConfirm();
              }}
              disabled={isDeleting}
              className="flex-1 bg-red-500 text-white hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" />
                  Delete Image
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default DeleteImageModal;
