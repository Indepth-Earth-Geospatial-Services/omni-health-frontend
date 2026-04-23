"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAuthStore,
  useAssignedLgas,
  User,
} from "@/features/auth/auth-store";
import { RIVERS_STATE_LGAS } from "@/features/super-admin/constants/lga";
import {
  Mail,
  Shield,
  LogOut,
  Camera,
  Trash2,
  X,
  UserRound,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, ChangeEvent } from "react";
import { toast } from "sonner";

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
function getInitials(user: User | null) {
  if (!user) return "U";
  const f = user.first_name?.[0] || "";
  const l = user.last_name?.[0] || "";
  return (f + l).toUpperCase() || user.email[0].toUpperCase();
}

function getFullName(user: User | null) {
  if (!user) return "Unknown User";
  if (user.first_name || user.last_name)
    return `${user.first_name || ""} ${user.last_name || ""}`.trim();
  return user.email.split("@")[0];
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
  const assignedLgaIds = useAssignedLgas();
  const assignedLgas = assignedLgaIds.map((id) => {
    const match = RIVERS_STATE_LGAS.find((l) => l.value === String(id));
    return match?.label ?? String(id);
  });
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const serverImage = (user as { image?: string })?.image || null;
  const activeImage = previewImage || serverImage;

  const handleClose = () => {
    setPreviewImage(null);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/login");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    setPreviewImage(URL.createObjectURL(file));
    toast.info("Profile photo update coming soon.");
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    if (previewImage) {
      setPreviewImage(null);
      return;
    }
    toast.info("Profile photo removal coming soon.");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg overflow-hidden bg-white p-0">
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
              onClick={() => activeImage && setIsViewerOpen(true)}
              className={`relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-xl transition-all duration-300 ${activeImage ? "cursor-zoom-in hover:scale-105" : "cursor-default"}`}
            >
              {activeImage ? (
                <img
                  src={activeImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="from-primary to-primary/80 flex h-full w-full items-center justify-center bg-gradient-to-br text-3xl font-bold text-white">
                  {getInitials(user)}
                </div>
              )}
            </div>

            {/* Image action buttons */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                <Camera size={13} />
                {activeImage ? "Change" : "Upload Photo"}
              </button>
              {activeImage && (
                <button
                  onClick={handleRemoveImage}
                  className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Name + role */}
          <div className="px-6 pt-3 pb-2 text-center">
            <h3 className="text-lg font-bold text-gray-900">
              {getFullName(user)}
            </h3>
            <span
              className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-medium ${roleBadgeClass(user?.role || "user")}`}
            >
              <Shield size={11} />
              {formatRole(user?.role || "user")}
            </span>
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
                  {user?.email || "—"}
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
                  className={`text-sm font-medium ${user?.is_active ? "text-green-600" : "text-red-500"}`}
                >
                  {user?.is_active ? "Active" : "Inactive"}
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
        imageUrl={activeImage}
      />
    </>
  );
}
