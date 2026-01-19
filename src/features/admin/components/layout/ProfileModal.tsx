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
    Clock,
    Star,
    LogOut,
    Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

    const handleLogout = () => {
        logout();
        onClose();
        router.push("/login");
    };

    const getUserInitials = (user: User | null) => {
        if (!user) return "U";
        const first = user.first_name?.[0] || "";
        const last = user.last_name?.[0] || "";
        return (first + last).toUpperCase() || user.email[0].toUpperCase();
    };

    const getUserFullName = (user: User | null) => {
        if (!user) return "Unknown User";
        if (user.first_name || user.last_name) {
            return `${user.first_name || ""} ${user.last_name || ""}`.trim();
        }
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

    const formatRole = (role: string) => {
        return role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white p-0 overflow-hidden">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-br from-primary/90 to-primary px-6 pt-6 pb-12 relative">
                    <DialogHeader>
                        <DialogTitle className="text-white text-lg font-semibold">
                            Profile
                        </DialogTitle>
                    </DialogHeader>

                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>

                {/* Profile Avatar - Overlapping the header */}
                <div className="flex justify-center -mt-10 relative z-10">
                    <div className="h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
                        <div className="h-full w-full rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-2xl font-bold">
                            {getUserInitials(user)}
                        </div>
                    </div>
                </div>

                {/* User Info Section */}
                <div className="px-6 pt-3 pb-2 text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {getUserFullName(user)}
                    </h3>
                    <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 mt-2 text-xs font-medium rounded-full border ${getRoleBadgeColor(user?.role || "user")}`}
                    >
                        <Shield size={12} />
                        {formatRole(user?.role || "user")}
                    </span>
                </div>

                {/* Divider */}
                <div className="px-6">
                    <div className="border-t border-gray-100" />
                </div>

                {/* User Details */}
                <div className="px-6 py-4 space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                        Account Information
                    </h4>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <Mail size={16} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.email || "No email"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                            <UserIcon size={16} className="text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500">Status</p>
                            <p className="text-sm font-medium text-green-600">
                                {user?.is_active ? "Active" : "Inactive"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="px-6">
                    <div className="border-t border-gray-100" />
                </div>

                {/* Facility Section */}
                <div className="px-6 py-4 space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                        Assigned Facility
                    </h4>

                    {isFacilityLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 size={24} className="animate-spin text-primary" />
                        </div>
                    ) : facility ? (
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <Building2 size={20} className="text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                                        {facility.facility_name || "Unknown Facility"}
                                    </p>
                                    <p className="text-xs text-primary mt-0.5">
                                        {facility.facility_category || "Healthcare Facility"}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {facility.address && (
                                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50">
                                        <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                        <p className="text-xs text-gray-600 truncate">
                                            {facility.town || facility.address}
                                        </p>
                                    </div>
                                )}

                                {facility.contact_info?.phone && (
                                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50">
                                        <Phone size={14} className="text-gray-400 flex-shrink-0" />
                                        <p className="text-xs text-gray-600 truncate">
                                            {facility.contact_info.phone}
                                        </p>
                                    </div>
                                )}

                                {facility.contact_info?.email && (
                                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50">
                                        <Mail size={14} className="text-gray-400 flex-shrink-0" />
                                        <p className="text-xs text-gray-600 truncate">
                                            {facility.contact_info.email}
                                        </p>
                                    </div>
                                )}

                                {facility.average_rating !== undefined && (
                                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50">
                                        <Star size={14} className="text-yellow-500 flex-shrink-0" />
                                        <p className="text-xs text-gray-600">
                                            {facility.average_rating.toFixed(1)} rating
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500">
                            <Building2 size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No facility assigned</p>
                        </div>
                    )}
                </div>

                {/* Footer with Logout */}
                <div className="px-6 pb-6 pt-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium text-sm"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
