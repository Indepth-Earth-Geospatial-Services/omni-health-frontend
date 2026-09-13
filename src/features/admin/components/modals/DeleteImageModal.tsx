"use client";

import React from "react";
import { createPortal } from "react-dom";
import { X, AlertTriangle, ImageOff, ImageIcon, Loader2 } from "lucide-react";
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
  // We don't need a useEffect/mounted check here — this modal is controlled
  // by a state button click in the parent, so we're already on the client by
  // the time `isOpen` becomes true.
  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  const handleClose = () => {
    if (isDeleting) return;
    onClose();
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
        onClick={(e) => {
          // Stops the click from bubbling up into whatever modal this one
          // was opened from (e.g. ProfileModal).
          e.stopPropagation();
          handleClose();
        }}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 z-[100] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="from-primary to-primary/80 relative overflow-hidden bg-linear-to-r px-6 py-5">
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <AlertTriangle size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  Delete Picture
                </h2>
                <p className="mt-0.5 text-xs text-white/70">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              disabled={isDeleting}
              className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          className="overflow-y-auto px-6 py-5"
          style={{ maxHeight: "calc(100vh - 2rem - 140px)" }}
        >
          {/* Image card */}
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="To delete"
                  className="h-full w-full object-cover opacity-80"
                />
              ) : (
                <ImageIcon className="text-slate-300" size={22} />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <ImageOff size={18} className="text-red-600 drop-shadow-sm" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                Current Profile Photo
              </p>
              <p className="truncate text-xs text-slate-500">
                {imageUrl ? "1 image selected" : "Image reference found"}
              </p>
            </div>
          </div>

          {/* Warning note */}
          <div className="flex gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3.5">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-red-500" />
            <p className="text-xs text-red-700">
              <strong>Warning:</strong> The image will be permanently removed
              from the server. You will revert to the default avatar.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            disabled={isDeleting}
            className="gap-2 bg-red-400 text-white hover:bg-red-400/70 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Deleting…
              </>
            ) : (
              <>Delete Image</>
            )}
          </Button>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default DeleteImageModal;
