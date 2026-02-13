"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore, User } from "@/store/auth-store";
import { Facility } from "@/types/api-response";
import {
  User as UserIcon,
  Mail,
  Shield,
  Building2,
  MapPin,
  Phone,
  LogOut,
  Loader2,
  Camera,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, ChangeEvent } from "react";
import { toast } from "sonner";
import {
  useUploadFacilityImages,
  useDeleteFacilityImage,
} from "@/features/admin/hooks/useAdminStaff";
import DeleteImageModal from "./DeleteImageModal";

// --- Image Viewer Component (Unchanged) ---
interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

function ImageViewer({ isOpen, onClose, imageUrl }: ImageViewerProps) {
  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-screen-md border-none bg-transparent p-0 shadow-none"
        aria-describedby={undefined}
      >
        <span className="sr-only">
          <DialogTitle>Profile Image Viewer</DialogTitle>
        </span>
        <div className="relative flex flex-col items-center justify-center">
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
          >
            <X size={24} />
          </button>
          <img
            src={imageUrl}
            alt="Full Profile"
            className="max-h-[80vh] w-full rounded-lg object-contain shadow-2xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Main Profile Modal ---
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility: Facility | undefined;
  isFacilityLoading: boolean;
}

export default function ProfileModal({
  isOpen,
  onClose,
  facility,
  isFacilityLoading,
}: ProfileModalProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const facilityId = facility?.facility_id || "";

  // Hooks
  const uploadMutation = useUploadFacilityImages(facilityId);
  const deleteMutation = useDeleteFacilityImage(facilityId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // NEW: State to track if Delete Modal is active
  const [isDeleteModalActive, setIsDeleteModalActive] = useState(false);

  const serverImage = (facility as any)?.image_urls?.[0] || null;
  const activeImage = previewImage || serverImage;

  // LOGIC: Only show the Profile Dialog if the main prop is open AND we aren't deleting
  // This effectively "hides" the profile modal while the delete modal is open
  const isProfileVisible = isOpen && !isDeleteModalActive;

  const handleClose = () => {
    setPreviewImage(null);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/login");
  };

  const handleViewImage = () => {
    if (activeImage) setIsViewerOpen(true);
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!facilityId) {
      toast.error("Facility info not loaded.");
      return;
    }
    fileInputRef.current?.click();
  };

  // --- 1. User Clicks Remove Button ---
  const handleDeleteImage = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If local preview, just clear it
    if (previewImage) {
      setPreviewImage(null);
      toast.info("Removed preview image");
      return;
    }

    // If server image, Hide Profile Modal -> Show Delete Modal
    if (serverImage) {
      setIsDeleteModalActive(true);
    }
  };

  // --- 2. User Confirms Delete ---
  const confirmDelete = () => {
    if (serverImage) {
      deleteMutation.mutate(serverImage, {
        onSuccess: () => {
          // On success, close Delete Modal, which re-opens Profile Modal automatically
          setIsDeleteModalActive(false);
        },
        onError: () => {
          // Keep Delete Modal open if error, or close it
        },
      });
    }
  };

  // --- 3. User Cancels Delete ---
  const cancelDelete = () => {
    setIsDeleteModalActive(false); // This re-opens the Profile Modal
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      const toastId = toast.loading("Uploading image...");
      uploadMutation.mutate([file], {
        onSuccess: () =>
          toast.success("Image uploaded successfully", { id: toastId }),
        onError: (error: any) => {
          console.error(error);
          toast.error("Failed to upload image", { id: toastId });
          setPreviewImage(null);
        },
      });
    }
    event.target.value = "";
  };

  // UI Helpers
  const getUserInitials = (user: User | null) => {
    if (!user) return "U";
    const first = user.first_name?.[0] || "";
    const last = user.last_name?.[0] || "";
    return (first + last).toUpperCase() || user.email[0].toUpperCase();
  };

  const getUserFullName = (user: User | null) => {
    if (!user) return "Unknown User";
    if (user.first_name || user.last_name)
      return `${user.first_name || ""} ${user.last_name || ""}`.trim();
    return user.email.split("@")[0];
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "admin":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatRole = (role: string) =>
    role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const isLoading = uploadMutation.isPending || deleteMutation.isPending;

  return (
    <>
      {/* PROFILE MODAL
         Notice: open={isProfileVisible}
         It closes when isDeleteModalActive becomes true
      */}
      <Dialog open={isProfileVisible} onOpenChange={handleClose}>
        <DialogContent className="max-w-xl overflow-hidden bg-white p-0">
          <div className="from-primary/90 to-primary relative bg-gradient-to-br px-6 pt-6 pb-20">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-white">
                Profile
              </DialogTitle>
            </DialogHeader>
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
            <div className="absolute bottom-0 left-0 h-20 w-20 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/10" />
          </div>

          <div className="relative z-10 -mt-16 flex flex-col items-center justify-center">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            <div
              onClick={handleViewImage}
              className={`relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-xl transition-all duration-300 ${!isLoading && activeImage ? "cursor-zoom-in hover:scale-105" : ""} ${!activeImage && !isLoading ? "cursor-default" : ""}`}
            >
              {isLoading && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <Loader2 className="h-10 w-10 animate-spin text-white" />
                </div>
              )}
              {activeImage ? (
                <img
                  src={activeImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="from-primary to-primary/80 flex h-full w-full items-center justify-center bg-gradient-to-br text-4xl font-bold text-white">
                  {getUserInitials(user)}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleAvatarClick}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50"
              >
                <Camera size={14} />
                {activeImage ? "Change" : "Upload Photo"}
              </button>
              {activeImage && (
                <button
                  onClick={handleDeleteImage}
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="px-6 pt-3 pb-2 text-center">
            <h3 className="text-xl font-bold text-gray-900">
              {getUserFullName(user)}
            </h3>
            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getRoleBadgeColor(user?.role || "user")}`}
            >
              <Shield size={12} />
              {formatRole(user?.role || "user")}
            </span>
          </div>

          <div className="px-6">
            <div className="border-t border-gray-100" />
          </div>

          <div className="space-y-3 px-6 py-4">
            <h4 className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Account Information
            </h4>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100">
              <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full">
                <Mail size={16} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Email</p>
                <p className="truncate text-sm font-medium text-gray-900">
                  {user?.email || "No email"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                <UserIcon size={16} className="text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-sm font-medium text-green-600">
                  {user?.is_active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6">
            <div className="border-t border-gray-100" />
          </div>

          <div className="space-y-3 px-6 py-4">
            <h4 className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Assigned Facility
            </h4>
            {isFacilityLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="text-primary animate-spin" />
              </div>
            ) : facility ? (
              <div className="space-y-3">
                <div className="from-primary/5 to-primary/10 border-primary/20 flex items-start gap-3 rounded-lg border bg-gradient-to-r p-3">
                  <div className="bg-primary/20 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                    <Building2 size={20} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-tight font-semibold text-gray-900">
                      {facility.facility_name || "Unknown Facility"}
                    </p>
                    <p className="text-primary mt-0.5 text-xs">
                      {facility.facility_category || "Healthcare Facility"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {facility.address && (
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5">
                      <MapPin
                        size={14}
                        className="flex-shrink-0 text-gray-400"
                      />
                      <p className="truncate text-xs text-gray-600">
                        {facility.town || facility.address}
                      </p>
                    </div>
                  )}
                  {facility.contact_info?.phone && (
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5">
                      <Phone
                        size={14}
                        className="flex-shrink-0 text-gray-400"
                      />
                      <p className="truncate text-xs text-gray-600">
                        {facility.contact_info.phone}
                      </p>
                    </div>
                  )}
                  {facility.contact_info?.email && (
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5">
                      <Mail size={14} className="flex-shrink-0 text-gray-400" />
                      <p className="truncate text-xs text-gray-600">
                        {facility.contact_info.email}
                      </p>
                    </div>
                  )}
                  {facility.average_rating !== undefined && (
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5">
                      <p className="text-xs text-gray-600">
                        ★ {facility.average_rating.toFixed(1)} rating
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-gray-500">
                <Building2 size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No facility assigned</p>
              </div>
            )}
          </div>

          <div className="px-6 pt-2 pb-6">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <ImageViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        imageUrl={activeImage}
      />

      {/* DELETE IMAGE MODAL
         This modal becomes visible when isDeleteModalActive is true.
         When it opens, Profile Modal automatically hides because of logic above.
      */}
      <DeleteImageModal
        isOpen={isDeleteModalActive}
        onClose={cancelDelete} // If canceled, this sets active=false, so Profile Modal returns
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
        imageUrl={serverImage}
      />
    </>
  );
}
