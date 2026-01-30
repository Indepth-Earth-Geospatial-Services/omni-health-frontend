"use client";
import { useState, useEffect } from "react";
import {
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MinusSquare,
  Building2,
  Pen,
  Eye,
  Mail,
  Ban,
  ArrowLeftRight,
} from "lucide-react";
import { toast } from "sonner";
import { useSuperAdminUsers } from "../../hooks/useSuperAdminUsers";
import UserProfileModal from "../modals/UserProfileModal";
import ChangeUserRoleModal from "../modals/ChangeUserRoleModal";
import DeactivateUserModal from "../modals/DeactivateUserModal";
import type { User } from "../../services/super-admin.service";
import { superAdminService } from "../../services/super-admin.service";

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper function to get role badge color
const getRoleBadgeColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "super_admin":
      return "bg-blue-400 text-white";
    case "admin":
      return "bg-red-400 text-white";
    default:
      return "border-gray-200 bg-gray-50 text-gray-600";
  }
};

interface UserAndRoleListProps {
  searchQuery?: string;
  statusFilter?: string;
}

export default function UserAndRoleList({
  searchQuery = "",
  statusFilter = "all",
}: UserAndRoleListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch ALL users (large limit for client-side filtering)
  const { data, isLoading, isError, error, isFetching, refetch } =
    useSuperAdminUsers({ page: 1, limit: 100 });

  // Extract data from query response
  const allUsers = data?.users ?? [];

  // Client-side filtering
  const filteredUsers = allUsers.filter((user) => {
    // Search filter - match name or email
    const matchesSearch =
      !searchQuery ||
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "true" && user.is_active) ||
      (statusFilter === "false" && !user.is_active);

    return matchesSearch && matchesStatus;
  });

  // Client-side pagination
  const totalRecords = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));

  // Clamp current page to valid range (handles case when filters reduce results)
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * itemsPerPage;
  const users = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Close dropdown when clicking anywhere
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownId(null);
    };

    if (openDropdownId) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdownId]);

  // Handle assigning user to facility (promotes to admin)
  const handleAssignToFacility = async (userId: number, facilityId: string) => {
    try {
      await superAdminService.assignManager({
        user_id: userId,
        facility_id: facilityId,
      });

      toast.success("User assigned to facility successfully!");
      setIsChangeRoleModalOpen(false);
      // Optionally refetch the users list here
      // window.location.reload();
      refetch();
    } catch (error) {
      console.error("Failed to assign user to facility:", error);
      toast.error("Failed to assign user to facility. Please try again.");
    }
  };

  // Handle user deactivation
  const handleDeactivateUser = async (_userId: string, password: string) => {
    try {
      await superAdminService.deactivateAccount(password);

      toast.success("User deactivated successfully!");
      setIsDeactivateModalOpen(false);
      // Optionally refetch the users list here
      // window.location.reload();
      // refetch();
    } catch (error) {
      console.error("Failed to deactivate user:", error);
      toast.error("Failed to deactivate user. Please try again.");
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (effectivePage < totalPages) {
      setCurrentPage(effectivePage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (effectivePage > 1) {
      setCurrentPage(effectivePage - 1);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white p-12">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-slate-500">Loading users...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex w-full items-center justify-center rounded-xl border border-red-200 bg-white p-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-medium text-red-600">
            Failed to load users
          </p>
          <p className="text-xs text-slate-500">
            {error?.message || "An error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Loading overlay when fetching new page */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            {/* Table Header */}
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr className="text-sm font-medium text-slate-500">
                <th className="w-12 p-4">
                  <MinusSquare
                    size={18}
                    className="rounded bg-teal-50 text-teal-500"
                  />
                </th>
                <th className="cursor-pointer p-4 transition-colors hover:text-slate-800">
                  <div className="font-inter-medium font-inter flex items-center gap-2 text-[11.38px] text-[#475467]">
                    Full Name <ArrowUpDown size={14} />
                  </div>
                </th>
                {/* <th className="p-4">Email</th> */}
                <th className="font-inter-medium font-inter p-4 text-center text-[11.38px] text-[#475467]">
                  Role
                </th>
                <th className="font-inter-medium font-inter p-4 text-[11.38px] text-[#475467]">
                  Managed Facilities
                </th>
                <th className="font-inter-medium font-inter p-4 text-[11.38px] text-[#475467]">
                  Created Date
                </th>
                <th className="font-inter-medium font-inter p-4 text-center text-[11.38px] text-[#475467]">
                  Status
                </th>
                <th className="font-inter-medium font-inter p-4 text-center text-[11.38px] text-[#475467]">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => {
                  const gradients = [
                    "from-blue-500 to-indigo-600",
                    "from-purple-500 to-pink-600",
                    "from-green-500 to-teal-600",
                    "from-orange-500 to-red-600",
                    "from-cyan-500 to-blue-600",
                  ];
                  const gradient = gradients[idx % gradients.length];
                  const initials = user.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={user.user_id}
                      className="group border-b border-slate-100 transition-colors last:border-0"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-xs font-bold text-white shadow-sm`}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-dmsans text-sm text-[13.69px] font-medium text-slate-900">
                              {user.full_name}
                            </p>
                            <p className="font-dmsans mt-0.5 text-[12.64px] font-normal text-[#475467]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* <td className="p-4 text-sm text-slate-600">
                        {user.email}
                      </td> */}
                      <td className="p-4 text-center">
                        <span
                          className={`rounded-full border px-4 py-1 text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                        >
                          {user.role.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        {user.managed_facilities.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {user.managed_facilities.map((facility) => (
                              <div
                                key={facility.facility_id}
                                className="flex items-center gap-2 text-xs text-slate-600"
                              >
                                <Building2
                                  size={14}
                                  className="text-slate-400"
                                />
                                <span>{facility.facility_name}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            No facilities
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-600">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`rounded-full border px-4 py-1 text-xs font-medium ${
                            user.is_active
                              ? "bg-primary text-white"
                              : "bg-[#E2E4E9] text-gray-600"
                          }`}
                        >
                          {user.is_active ? "Active" : "Not Active"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="relative flex items-center justify-center gap-1">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(
                                  openDropdownId === user.user_id
                                    ? null
                                    : user.user_id,
                                );
                              }}
                              className="hover:text-primary rounded-lg p-2 text-slate-400 transition-all hover:bg-teal-50"
                            >
                              <Pen size={18} />
                            </button>

                            {/* Dropdown Menu */}
                            {openDropdownId === user.user_id && (
                              <div
                                className="absolute top-full right-0 z-50 mt-1 w-48 rounded-lg border border-slate-200 bg-white shadow-lg"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUser(user);
                                    setIsProfileModalOpen(true);
                                    setOpenDropdownId(null);
                                  }}
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                  <Eye size={16} className="text-slate-400" />
                                  View Profile
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Edit User", user.user_id);
                                    setOpenDropdownId(null);
                                  }}
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                  <Pen size={16} className="text-slate-400" />
                                  Edit User
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUser(user);
                                    setIsChangeRoleModalOpen(true);
                                    setOpenDropdownId(null);
                                  }}
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                  <ArrowLeftRight
                                    size={16}
                                    className="text-slate-400"
                                  />
                                  Change Role
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Send Email", user.user_id);
                                    setOpenDropdownId(null);
                                  }}
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                  <Mail size={16} className="text-slate-400" />
                                  Send Email
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUser(user);
                                    setIsDeactivateModalOpen(true);
                                    setOpenDropdownId(null);
                                  }}
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                  <Ban size={16} className="text-slate-400" />
                                  Deactivate
                                </button>
                              </div>
                            )}
                          </div>

                          <button className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-4 md:flex-row">
          <button
            onClick={handlePreviousPage}
            disabled={effectivePage === 1 || isFetching}
            className={`flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors ${
              effectivePage === 1 || isFetching
                ? "cursor-not-allowed bg-slate-50 text-slate-400"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-slate-500 italic">
              Page {effectivePage} {totalRecords > 0 ? `of ${totalPages}` : ""}
            </p>
            <p className="text-xs text-slate-400">
              {totalRecords > 0
                ? `Showing ${(effectivePage - 1) * itemsPerPage + 1}-${Math.min(effectivePage * itemsPerPage, totalRecords)} of ${totalRecords} users`
                : `Showing ${users.length} users`}
            </p>
          </div>
          <button
            onClick={handleNextPage}
            disabled={effectivePage === totalPages || isFetching}
            className={`flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors ${
              effectivePage === totalPages || isFetching
                ? "cursor-not-allowed bg-slate-50 text-slate-400"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* Change User Role Modal */}
      <ChangeUserRoleModal
        isOpen={isChangeRoleModalOpen}
        onClose={() => {
          setIsChangeRoleModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={handleAssignToFacility}
      />

      {/* Deactivate User Modal */}
      <DeactivateUserModal
        isOpen={isDeactivateModalOpen}
        onClose={() => {
          setIsDeactivateModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={handleDeactivateUser}
      />
    </>
  );
}
