"use client";

import { useRef, useState, useEffect, ChangeEvent } from "react";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useUploadFacilityImages,
  useDeleteFacilityImage,
} from "@/features/admin/hooks/useAdminStaff";

interface FacilityImageButtonProps {
  facilityId: string;
  facilityName?: string;
  imageUrl: string | null;
}

export default function FacilityImageButton({
  facilityId,
  facilityName,
  imageUrl,
}: FacilityImageButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadFacilityImages(facilityId);
  const deleteMutation = useDeleteFacilityImage(facilityId);

  useEffect(() => {
    setPreviewUrl(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const initials = facilityName
    ? facilityName
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "F";

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    uploadMutation.mutate(
      [file],
      {
        onSuccess: () => {
          toast.success("Facility image uploaded successfully.");
          setIsOpen(false);
        },
        onError: () => {
          toast.error("Failed to upload image. Please try again.");
          setPreviewUrl(imageUrl);
        },
      },
    );
    e.target.value = "";
  };

  const handleDelete = () => {
    if (!previewUrl) return;
    deleteMutation.mutate(
      previewUrl,
      {
        onSuccess: () => {
          setPreviewUrl(null);
          toast.success("Facility image removed.");
          setIsOpen(false);
        },
        onError: () => {
          toast.error("Failed to delete image. Please try again.");
        },
      },
    );
  };

  const isBusy = uploadMutation.isPending || deleteMutation.isPending;

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Avatar trigger */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-lg ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/50 focus:outline-none"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Facility"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="from-primary to-primary/80 flex h-full w-full items-center justify-center bg-gradient-to-br text-xl font-bold text-white">
            {initials}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition-opacity hover:opacity-100">
          <Camera size={18} className="text-white" />
        </div>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-86 min-h-[86px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Image preview */}
          <div className="flex h-48 w-full items-center justify-center bg-slate-100">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Facility preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Camera size={36} />
                <p className="text-xs">No image yet</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 p-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {uploadMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Camera size={14} />
              )}
              Upload Image
            </button>

            {previewUrl && (
              <button
                onClick={handleDelete}
                disabled={isBusy}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60"
              >
                {deleteMutation.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Delete Image
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
