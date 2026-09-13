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
  /** Every image the backend has on file for this facility (up to 5 — it's
   *  a gallery API). This button only shows one photo, so all but the most
   *  recent upload get cleaned up rather than left orphaned server-side. */
  imageUrls: string[];
  /** Used to cache-bust the displayed URL as a defensive extra — see
   *  `withCacheBust` below. */
  lastUpdated?: string;
}

/** Blob URLs are opaque, per-object references — appending a query string
 *  to one breaks it, so only real server URLs get cache-busted. */
function withCacheBust(url: string, token: string): string {
  if (!token || url.startsWith("blob:")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_cb=${encodeURIComponent(token)}`;
}

export default function FacilityImageButton({
  facilityId,
  facilityName,
  imageUrls,
  lastUpdated,
}: FacilityImageButtonProps) {
  // The backend appends new uploads to the end of the list, so the newest
  // photo — the one this button just saved — is always the last entry, not
  // the first. Reading `[0]` is what made a re-upload look like it "did
  // nothing": it kept showing whichever image was uploaded first.
  const currentUrl = imageUrls.length > 0 ? imageUrls[imageUrls.length - 1] : null;

  const [isOpen, setIsOpen] = useState(false);
  // previewUrl: optimistic local display (may be a blob: URL after upload)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl);
  // serverUrl: the last known URL confirmed to exist on the server (from prop)
  const [serverUrl, setServerUrl] = useState<string | null>(currentUrl);
  // Bumped on every successful upload/delete so the same-session view is
  // guaranteed fresh even if the backend doesn't advance `lastUpdated`.
  const [bumpCount, setBumpCount] = useState(0);
  const cacheBustToken = `${lastUpdated ?? ""}:${bumpCount}`;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadFacilityImages(facilityId);
  const deleteMutation = useDeleteFacilityImage(facilityId);

  useEffect(() => {
    setPreviewUrl(currentUrl);
    setServerUrl(currentUrl);
  }, [currentUrl]);

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
    // Captured before the upload — this is what has to be cleaned up once
    // the new photo is confirmed, so the gallery never grows past one image.
    const urlsToReplace = imageUrls;
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    uploadMutation.mutate([file], {
      onSuccess: () => {
        setBumpCount((n) => n + 1);
        toast.success("Facility image uploaded successfully.");
        setIsOpen(false);
        urlsToReplace.forEach((url) => deleteMutation.mutate(url));
      },
      onError: () => {
        toast.error("Failed to upload image. Please try again.");
        setPreviewUrl(currentUrl);
      },
    });
    e.target.value = "";
  };

  const handleDelete = () => {
    if (imageUrls.length === 0) return;
    setPreviewUrl(null);
    setServerUrl(null);
    setBumpCount((n) => n + 1);
    setIsOpen(false);
    // Clears every stored image, not just the one on screen — the same
    // "this button owns a single photo" assumption applies here too.
    imageUrls.forEach((url, idx) => {
      deleteMutation.mutate(url, {
        onSuccess: () => {
          if (idx === 0) toast.success("Facility image removed.");
        },
        onError: () => {
          if (idx === 0) toast.error("Failed to delete image. Please try again.");
        },
      });
    });
  };

  const isBusy = uploadMutation.isPending || deleteMutation.isPending;
  const displayUrl = previewUrl
    ? withCacheBust(previewUrl, cacheBustToken)
    : null;

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
        className="ring-primary/20 hover:ring-primary/50 relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-lg ring-2 transition-all duration-200 focus:outline-none"
      >
        {displayUrl ? (
          <img
            src={displayUrl}
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
        <div className="absolute top-[calc(100%+8px)] right-0 z-50 min-h-[86px] w-86 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Image preview */}
          <div className="flex h-48 w-full items-center justify-center bg-slate-100">
            {displayUrl ? (
              <img
                src={displayUrl}
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
              className="bg-primary hover:bg-primary/90 flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-60"
            >
              {uploadMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Camera size={14} />
              )}
              Upload Image
            </button>

            {serverUrl && (
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
