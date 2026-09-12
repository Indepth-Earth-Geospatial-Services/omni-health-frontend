"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore, User } from "@/features/auth/auth-store";
import {
  Mail,
  Shield,
  LogOut,
  Camera,
  Trash2,
  X,
  UserRound,
  MapPin,
  Pencil,
  Check,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, ChangeEvent } from "react";
import { toast } from "sonner";
import {
  useMyProfile,
  useUpdateProfile,
  useUploadAvatar,
  useDeleteAvatar,
} from "../hooks/useProfile";
import { MAX_AVATAR_BYTES } from "@/services/profile.service";

// ── Image Viewer ──────────────────────────────────────────────────────────────
function ImageViewer({
  isOpen,
  onClose,
  imageUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}) {
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

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(first?: string | null, last?: string | null, email?: string) {
  const f = first?.[0] || "";
  const l = last?.[0] || "";
  return (f + l).toUpperCase() || email?.[0]?.toUpperCase() || "U";
}

function roleBadgeClass(role: string) {
  if (role === "super_admin")
    return "bg-purple-100 text-purple-700 border-purple-200";
  if (role === "admin") return "bg-blue-100 text-blue-700 border-blue-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
}

function formatRole(role: string) {
  return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Main modal ────────────────────────────────────────────────────────────────
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility?: unknown;
  isFacilityLoading?: boolean;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // /me is the authoritative source — it carries the picture and the LGA names
  // the store only knows as ids.
  const { data: profile, isLoading: isProfileLoading } = useMyProfile(isOpen);
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const deleteAvatar = useDeleteAvatar();

  const [isEditingName, setIsEditingName] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const displayFirst = profile?.first_name ?? user?.first_name ?? "";
  const displayLast = profile?.last_name ?? user?.last_name ?? "";
  const email = profile?.email ?? user?.email ?? "";
  const role = profile?.role ?? user?.role ?? "user";
  const isActive = profile?.is_active ?? user?.is_active ?? false;
  const avatarUrl =
    profile?.profile_image_url ?? (user as User | null)?.image ?? null;
  const assignedLgas = profile?.assigned_lgas ?? [];

  const fullName =
    `${displayFirst} ${displayLast}`.trim() ||
    email.split("@")[0] ||
    "Unknown User";

  // Seed the inputs as the edit form opens, so a cancelled edit never leaves
  // stale text behind the next time it is opened.
  const startEditingName = () => {
    setFirstName(displayFirst);
    setLastName(displayLast);
    setIsEditingName(true);
  };

  const handleClose = () => {
    setIsEditingName(false);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    onClose();
    router.push("/login");
  };

  const handleSaveName = () => {
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    if (!trimmedFirst || !trimmedLast) {
      toast.error("First and last name are both required.");
      return;
    }
    if (trimmedFirst.length > 100 || trimmedLast.length > 100) {
      toast.error("Names must be 100 characters or fewer.");
      return;
    }
    if (trimmedFirst === displayFirst && trimmedLast === displayLast) {
      setIsEditingName(false);
      return;
    }

    updateProfile.mutate(
      { first_name: trimmedFirst, last_name: trimmedLast },
      { onSuccess: () => setIsEditingName(false) },
    );
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Images must be 5 MB or smaller.");
      return;
    }
    // Uploading replaces any existing picture, so there is no delete first.
    uploadAvatar.mutate(file);
  };

  const isAvatarBusy = uploadAvatar.isPending || deleteAvatar.isPending;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-white p-0">
          {/* Header band */}
          <div className="from-primary/90 to-primary relative bg-gradient-to-br px-6 pt-6 pb-20">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-white">
                My Profile
              </DialogTitle>
            </DialogHeader>
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
            <div className="absolute bottom-0 left-0 h-20 w-20 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/10" />
          </div>

          {/* Avatar */}
          <div className="relative z-10 -mt-16 flex flex-col items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div
              onClick={() => avatarUrl && !isAvatarBusy && setIsViewerOpen(true)}
              className={`relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-xl transition-all duration-300 ${
                avatarUrl && !isAvatarBusy
                  ? "cursor-zoom-in hover:scale-105"
                  : "cursor-default"
              }`}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="from-primary to-primary/80 flex h-full w-full items-center justify-center bg-gradient-to-br text-3xl font-bold text-white">
                  {getInitials(displayFirst, displayLast, email)}
                </div>
              )}

              {isAvatarBusy && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>

            {/* Image action buttons */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAvatarBusy}
                className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50"
              >
                <Camera size={13} />
                {avatarUrl ? "Change" : "Upload Photo"}
              </button>
              {avatarUrl && (
                <button
                  onClick={() => deleteAvatar.mutate()}
                  disabled={isAvatarBusy}
                  className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Name + role */}
          <div className="px-6 pt-3 pb-2 text-center">
            {isEditingName ? (
              <div className="mx-auto max-w-sm text-left">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      htmlFor="profile-first-name"
                      className="mb-1 block text-[10px] tracking-wide text-gray-400 uppercase"
                    >
                      First Name
                    </label>
                    <input
                      id="profile-first-name"
                      type="text"
                      maxLength={100}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={updateProfile.isPending}
                      className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profile-last-name"
                      className="mb-1 block text-[10px] tracking-wide text-gray-400 uppercase"
                    >
                      Last Name
                    </label>
                    <input
                      id="profile-last-name"
                      type="text"
                      maxLength={100}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={updateProfile.isPending}
                      className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="mt-3 flex justify-center gap-2">
                  <button
                    onClick={() => setIsEditingName(false)}
                    disabled={updateProfile.isPending}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveName}
                    disabled={updateProfile.isPending}
                    className="bg-primary hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors disabled:opacity-50"
                  >
                    {updateProfile.isPending ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Check size={12} />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {isProfileLoading && !user ? "…" : fullName}
                  </h3>
                  <button
                    onClick={startEditingName}
                    title="Edit your name"
                    className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  >
                    <Pencil size={13} />
                  </button>
                </div>
                <span
                  className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-medium ${roleBadgeClass(role)}`}
                >
                  <Shield size={11} />
                  {formatRole(role)}
                </span>
              </>
            )}
          </div>

          <div className="mx-6 border-t border-gray-100" />

          {/* Info rows */}
          <div className="space-y-2 px-6 py-4">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full">
                <Mail size={15} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] tracking-wide text-gray-400 uppercase">
                  Email
                </p>
                <p className="truncate text-sm font-medium text-gray-900">
                  {email || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50">
                <UserRound size={15} className="text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] tracking-wide text-gray-400 uppercase">
                  Account Status
                </p>
                <p
                  className={`text-sm font-medium ${isActive ? "text-green-600" : "text-red-500"}`}
                >
                  {isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>

          {/* Assigned LGAs */}
          {assignedLgas.length > 0 && (
            <div className="px-6 pb-3">
              <div className="rounded-lg bg-gray-50 px-3 py-2.5">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <MapPin size={12} className="text-gray-400" />
                  <p className="text-[10px] tracking-wide text-gray-400 uppercase">
                    Assigned LGAs
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {assignedLgas.map((lga) => (
                    <span
                      key={lga}
                      className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                    >
                      {lga}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Logout */}
          <div className="px-6 pb-6">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <ImageViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        imageUrl={avatarUrl}
      />
    </>
  );
}
