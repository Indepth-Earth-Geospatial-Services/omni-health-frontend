"use client";

import React, { useState, useEffect } from "react";
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
import AssignFacilityModal from "../modals/AssignFacility";
import UnassignLgaModal from "../modals/UnassignLgaModal";
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
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [expandedFacilities, setExpandedFacilities] = useState<Set<string>>(
    new Set(),
  );

  const toggleFacilities = (userId: string) => {
    setExpandedFacilities((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  // Fetch users with proper pagination (limit 50 for reasonable performance)
  const { data, isLoading, isError, error, isFetching, refetch } =
    useSuperAdminUsers({ page: currentPage, limit: 50 });

  const userActions = useUserActions({ onSuccess: refetch });

  // Extract data from query response
  const users = data?.users ?? [];
  const pagination = data?.pagination ?? { total_records: 0, total_pages: 1, current_page: 1 };

  // Client-side filtering (on the page's current batch)
  const filteredUsers = users.filter((user) => {
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

  // Use server-side pagination
  const totalRecords = pagination.total_records;
  const totalPages = pagination.total_pages;
  const effectivePage = currentPage;
  const startIndex = (effectivePage - 1) * 50;

  // Close dropdown when clicking anywhere
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    if (openDropdownId) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
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
      <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
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
                  <MinusSquare
                    size={18}
                    className="rounded bg-teal-50 text-teal-500"
                  />
                </th>
                <th className="w-12 p-4 text-[11.38px] font-medium text-[#475467]">
                  S/NO
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <React.Fragment key={user.user_id}>
                    {/* ── Main row ── */}
                    <tr className="group border-b border-slate-100 transition-colors">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {startIndex + idx + 1}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br ${AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]} text-xs font-bold text-white shadow-sm`}
                          >
                            {getInitials(user.full_name)}
                          </div>
                          <div>
                            <p className="font-dmsans text-[13.69px] font-medium text-slate-900">
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
                            {user.managed_facilities.slice(0, 2).map((f) => (
                              <div
                                key={f.facility_id}
                                className="flex items-center gap-2 text-xs text-slate-600"
                              >
                                <Building2
                                  size={12}
                                  className="shrink-0 text-slate-400"
                                />
                                <span className="max-w-45 truncate">
                                  {f.facility_name}
                                </span>
                              </div>
                            ))}
                            {user.managed_facilities.length > 2 && (
                              <button
                                onClick={() => toggleFacilities(user.user_id)}
                                className="mt-1 w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
                              >
                                {expandedFacilities.has(user.user_id)
                                  ? "Hide facilities"
                                  : `+${user.managed_facilities.length - 2} more`}
                              </button>
                            )}
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
                        {user.is_active ? (
                          <span className="bg-primary rounded-full border px-4 py-1 text-xs font-medium text-white">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full border bg-[#E2E4E9] px-4 py-1 text-xs font-medium text-gray-600">
                            Not Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="relative flex items-center justify-center gap-1">
                          <UserActionsDropdown
                            user={user}
                            isOpen={openDropdownId === user.user_id}
                            onToggle={() =>
                              setOpenDropdownId(
                                openDropdownId === user.user_id
                                  ? null
                                  : user.user_id,
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
                            onAssignLga={() => {
                              userActions.openAssignFacilityModal(user);
                              setOpenDropdownId(null);
                            }}
                            onUnassignLga={() => {
                              userActions.openUnassignLgaModal(user);
                              setOpenDropdownId(null);
                            }}
                          />
                        </div>
                      </td>
                    </tr>

                    {/* ── Expanded facilities row ── */}
                    {expandedFacilities.has(user.user_id) &&
                      user.managed_facilities.length > 2 && (
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <td colSpan={8} className="px-6 py-4">
                            <p className="mb-2 text-[12px] font-semibold tracking-wide text-slate-400 uppercase">
                              All assigned facilities (
                              {user.managed_facilities.length})
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {user.managed_facilities.map((f) => (
                                <span
                                  key={f.facility_id}
                                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600"
                                >
                                  <Building2
                                    size={10}
                                    className="text-slate-400"
                                  />
                                  {f.facility_name}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-4 md:flex-row">
          <button
            onClick={() =>
              effectivePage > 1 && setCurrentPage(effectivePage - 1)
            }
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
                ? `Showing ${startIndex + 1}-${Math.min(startIndex + 50, totalRecords)} of ${totalRecords} users`
                : `Showing ${filteredUsers.length} users`}
            </p>
          </div>
          <button
            onClick={() =>
              effectivePage < totalPages && setCurrentPage(effectivePage + 1)
            }
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
        onSubmit={userActions.handleChangeUserRole}
        isLoading={userActions.isChangeRoleLoading}
      />
      <DeactivateUserModal
        isOpen={userActions.isDeactivateModalOpen}
        onClose={userActions.closeAllModals}
        user={userActions.selectedUser}
        onSubmit={userActions.handleDeactivateUser}
        isLoading={userActions.isDeactivateLoading}
      />
      <SuspendUserModal
        isOpen={userActions.isSuspendModalOpen}
        onClose={userActions.closeAllModals}
        user={userActions.selectedUser}
        onSubmit={userActions.handleSuspendUser}
        isLoading={userActions.isSuspendLoading}
        mode={userActions.suspendMode}
      />
      <AssignFacilityModal
        isOpen={userActions.isAssignFacilityModalOpen}
        onClose={userActions.closeAllModals}
        user={userActions.selectedUser}
        onSuccess={refetch}
      />
      {/* ✅ UnassignLgaModal — fully wired with onSuccess={refetch} */}
      <UnassignLgaModal
        isOpen={userActions.isUnassignLgaModalOpen}
        onClose={userActions.closeAllModals}
        user={userActions.selectedUser}
        onSuccess={refetch}
      />
    </>
  );
}
