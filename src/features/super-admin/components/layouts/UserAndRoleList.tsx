"use client";

import { useState, useEffect } from "react";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MinusSquare,
  Building2,
} from "lucide-react";
import { useSuperAdminUsers } from "../../hooks/useSuperAdminUsers";
import { useUserActions } from "../../hooks/use-user-actions";
import { UserActionsDropdown } from "../ui/UserActionsDropdown";
import UserProfileModal from "../modals/UserProfileModal";
import ChangeUserRoleModal from "../modals/ChangeUserRoleModal";
import DeactivateUserModal from "../modals/DeactivateUserModal";
import SuspendUserModal from "../modals/SuspendUserModal";
import {
  formatDate,
  getRoleBadgeColor,
  getInitials,
  AVATAR_GRADIENTS,
} from "../../utils/user-helpers";

interface UserAndRoleListProps {
  searchQuery?: string;
  statusFilter?: string;
  suspensionFilter?: "all" | "active" | "suspended";
}

export default function UserAndRoleList({
  searchQuery = "",
  statusFilter = "all",
  suspensionFilter = "all",
}: UserAndRoleListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Fetch ALL users (large limit for client-side filtering)
  const { data, isLoading, isError, error, isFetching, refetch } =
    useSuperAdminUsers({ page: 1, limit: 100 });

  const userActions = useUserActions({ onSuccess: refetch });

  // Extract data from query response
  const allUsers = data?.users ?? [];

  // Client-side filtering
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "true" && user.is_active) ||
      (statusFilter === "false" && !user.is_active);

    const matchesSuspension =
      suspensionFilter === "all" ||
      (suspensionFilter === "active" && !user.is_suspended) ||
      (suspensionFilter === "suspended" && user.is_suspended);

    return matchesSearch && matchesStatus && matchesSuspension;
  });

  // Client-side pagination
  const totalRecords = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * itemsPerPage;
  const users = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Close dropdown when clicking anywhere
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    if (openDropdownId) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdownId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white p-12">
        <p className="text-sm text-slate-500">Loading users...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex w-full items-center justify-center rounded-xl border border-red-200 bg-white p-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-medium text-red-600">Failed to load users</p>
          <p className="text-xs text-slate-500">{error?.message || "An error occurred"}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr className="text-sm font-medium text-slate-500">
                <th className="w-12 p-4">
                  <MinusSquare size={18} className="rounded bg-teal-50 text-teal-500" />
                </th>
                <th className="cursor-pointer p-4 transition-colors hover:text-slate-800">
                  <div className="font-inter-medium font-inter flex items-center gap-2 text-[11.38px] text-[#475467]">
                    Full Name <ArrowUpDown size={14} />
                  </div>
                </th>
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

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
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
                          className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]} text-xs font-bold text-white shadow-sm`}
                        >
                          {getInitials(user.full_name)}
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
                              <Building2 size={14} className="text-slate-400" />
                              <span>{facility.facility_name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">No facilities</span>
                      )}
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`rounded-full border px-4 py-1 text-xs font-medium ${
                            user.is_active
                              ? "bg-primary text-white"
                              : "bg-[#E2E4E9] text-gray-600"
                          }`}
                        >
                          {user.is_active ? "Active" : "Not Active"}
                        </span>
                        {user.is_suspended && (
                          <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                            Suspended
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="relative flex items-center justify-center gap-1">
                        <UserActionsDropdown
                          user={user}
                          isOpen={openDropdownId === user.user_id}
                          onToggle={() =>
                            setOpenDropdownId(
                              openDropdownId === user.user_id ? null : user.user_id
                            )
                          }
                          onViewProfile={() => {
                            userActions.openProfileModal(user);
                            setOpenDropdownId(null);
                          }}
                          onSuspend={() => {
                            userActions.openSuspendModal(user, "suspend");
                            setOpenDropdownId(null);
                          }}
                          onUnsuspend={() => {
                            userActions.openSuspendModal(user, "unsuspend");
                            setOpenDropdownId(null);
                          }}
                          onChangeRole={() => {
                            userActions.openChangeRoleModal(user);
                            setOpenDropdownId(null);
                          }}
                          onDeactivate={() => {
                            userActions.openDeactivateModal(user);
                            setOpenDropdownId(null);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-4 md:flex-row">
          <button
            onClick={() => effectivePage > 1 && setCurrentPage(effectivePage - 1)}
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
                ? `Showing ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, totalRecords)} of ${totalRecords} users`
                : `Showing ${users.length} users`}
            </p>
          </div>
          <button
            onClick={() => effectivePage < totalPages && setCurrentPage(effectivePage + 1)}
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

      {/* Modals */}
      <UserProfileModal
        isOpen={userActions.isProfileModalOpen}
        onClose={userActions.closeAllModals}
        user={userActions.selectedUser}
      />
      <ChangeUserRoleModal
        isOpen={userActions.isChangeRoleModalOpen}
        onClose={userActions.closeAllModals}
        user={userActions.selectedUser}
        onSubmit={userActions.handleAssignToFacility}
      />
      <DeactivateUserModal
        isOpen={userActions.isDeactivateModalOpen}
        onClose={userActions.closeAllModals}
        user={userActions.selectedUser}
        onSubmit={userActions.handleDeactivateUser}
      />
      <SuspendUserModal
        isOpen={userActions.isSuspendModalOpen}
        onClose={userActions.closeAllModals}
        user={userActions.selectedUser}
        onSubmit={userActions.handleSuspendUser}
        isLoading={userActions.isSuspendLoading}
        mode={userActions.suspendMode}
      />
    </>
  );
}
