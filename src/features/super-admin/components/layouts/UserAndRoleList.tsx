"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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
import type { User } from "../../services/super-admin.service";

interface UserAndRoleListProps {
  searchQuery?: string;
  statusFilter?: string;
  suspensionFilter?: "all" | "active" | "suspended";
}

/** Shared base classes so every header cell lines up the same way — same
 *  font, size, and color; only the alignment modifier differs per column. */
const TH_BASE =
  "font-inter-medium font-inter p-4 text-[11.38px] text-[#475467]";

interface UserRowProps {
  user: User;
  rowNumber: number;
  avatarGradient: string;
  isDropdownOpen: boolean;
  onDropdownOpenChange: (userId: string, open: boolean) => void;
  onViewProfile: (user: User) => void;
  onSuspend: (user: User, mode: "suspend" | "unsuspend") => void;
  onChangeRole: (user: User) => void;
  onDeactivate: (user: User) => void;
  onAssignLga: (user: User) => void;
  onUnassignLga: (user: User) => void;
}

/**
 * Its own component, wrapped in `memo`, so that toggling one row's actions
 * dropdown (or any other row's) doesn't re-render every other row — before
 * this, `openDropdownId` lived in the parent and every state change there
 * re-ran the whole `.map()`, rebuilding every row's JSX regardless of
 * whether that row's own props actually changed. All callback props are
 * stable references from the parent (`useCallback`/`useState` setters), so
 * `memo`'s shallow comparison actually has a chance to skip work.
 */
const UserRow = memo(function UserRow({
  user,
  rowNumber,
  avatarGradient,
  isDropdownOpen,
  onDropdownOpenChange,
  onViewProfile,
  onSuspend,
  onChangeRole,
  onDeactivate,
  onAssignLga,
  onUnassignLga,
}: UserRowProps) {
  return (
    <tr className="group border-b border-slate-100 transition-colors">
      <td className="p-4 text-sm whitespace-nowrap text-slate-600">{rowNumber}</td>
      <td className="p-4">
        <div className="flex items-center gap-3 whitespace-nowrap">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${avatarGradient} text-xs font-bold text-white shadow-sm`}
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
      <td className="p-4 text-center whitespace-nowrap">
        <span
          className={`rounded-full border px-4 py-1 text-xs font-medium ${getRoleBadgeColor(user.role)}`}
        >
          {user.role.replace("_", " ").toUpperCase()}
        </span>
      </td>
      <td className="p-4 text-sm font-medium whitespace-nowrap text-slate-600">
        {formatDate(user.created_at)}
      </td>
      <td className="p-4 text-center whitespace-nowrap">
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
      <td className="p-4 text-center whitespace-nowrap">
        <div className="relative flex items-center justify-center gap-1">
          <UserActionsDropdown
            user={user}
            isOpen={isDropdownOpen}
            onOpenChange={(open) => onDropdownOpenChange(user.user_id, open)}
            onViewProfile={() => onViewProfile(user)}
            onSuspend={() => onSuspend(user, "suspend")}
            onUnsuspend={() => onSuspend(user, "unsuspend")}
            onChangeRole={() => onChangeRole(user)}
            onDeactivate={() => onDeactivate(user)}
            onAssignLga={() => onAssignLga(user)}
            onUnassignLga={() => onUnassignLga(user)}
          />
        </div>
      </td>
    </tr>
  );
});

export default function UserAndRoleList({
  searchQuery = "",
  statusFilter = "all",
  suspensionFilter = "all",
}: UserAndRoleListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Fetch users with proper pagination (limit 50 for reasonable performance)
  const { data, isLoading, isError, error, isFetching, refetch } =
    useSuperAdminUsers({ page: currentPage, limit: 50 });

  const userActions = useUserActions({ onSuccess: refetch });
  const {
    openProfileModal,
    openSuspendModal,
    openChangeRoleModal,
    openDeactivateModal,
    openAssignFacilityModal,
    openUnassignLgaModal,
  } = userActions;

  // Extract data from query response
  const users = useMemo(() => data?.users ?? [], [data?.users]);
  const pagination = data?.pagination ?? {
    total_records: 0,
    total_pages: 1,
    current_page: 1,
  };

  // Client-side filtering (on the page's current batch) — memoized so it
  // only reruns when the inputs actually change, not on every render this
  // component's parent (or an unrelated row's dropdown) triggers.
  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
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
      }),
    [users, searchQuery, statusFilter, suspensionFilter],
  );

  // Use server-side pagination
  const totalRecords = pagination.total_records;
  const totalPages = pagination.total_pages;
  const effectivePage = currentPage;
  const startIndex = (effectivePage - 1) * 50;

  // Stable callbacks handed down to every row — defined once here (not
  // inline in the .map() below) so `UserRow`'s memo comparison sees the same
  // function reference across renders instead of a fresh closure every time.
  const handleDropdownOpenChange = useCallback((userId: string, open: boolean) => {
    setOpenDropdownId(open ? userId : null);
  }, []);
  const handleViewProfile = useCallback(
    (user: User) => {
      openProfileModal(user);
      setOpenDropdownId(null);
    },
    [openProfileModal],
  );
  const handleSuspend = useCallback(
    (user: User, mode: "suspend" | "unsuspend") => {
      openSuspendModal(user, mode);
      setOpenDropdownId(null);
    },
    [openSuspendModal],
  );
  const handleChangeRole = useCallback(
    (user: User) => {
      openChangeRoleModal(user);
      setOpenDropdownId(null);
    },
    [openChangeRoleModal],
  );
  const handleDeactivate = useCallback(
    (user: User) => {
      openDeactivateModal(user);
      setOpenDropdownId(null);
    },
    [openDeactivateModal],
  );
  const handleAssignLga = useCallback(
    (user: User) => {
      openAssignFacilityModal(user);
      setOpenDropdownId(null);
    },
    [openAssignFacilityModal],
  );
  const handleUnassignLga = useCallback(
    (user: User) => {
      openUnassignLgaModal(user);
      setOpenDropdownId(null);
    },
    [openUnassignLgaModal],
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl border border-slate-200 bg-white">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr className="text-sm font-medium text-slate-500">
                <th className={`w-12 whitespace-nowrap ${TH_BASE}`}>S/NO</th>
                <th className={`cursor-pointer transition-colors hover:text-slate-800 ${TH_BASE}`}>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    Full Name <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className={`text-center whitespace-nowrap ${TH_BASE}`}>Role</th>
                <th className={`whitespace-nowrap ${TH_BASE}`}>Created Date</th>
                <th className={`text-center whitespace-nowrap ${TH_BASE}`}>Status</th>
                <th className={`text-center whitespace-nowrap ${TH_BASE}`}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <UserRow
                    key={user.user_id}
                    user={user}
                    rowNumber={startIndex + idx + 1}
                    avatarGradient={AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]}
                    isDropdownOpen={openDropdownId === user.user_id}
                    onDropdownOpenChange={handleDropdownOpenChange}
                    onViewProfile={handleViewProfile}
                    onSuspend={handleSuspend}
                    onChangeRole={handleChangeRole}
                    onDeactivate={handleDeactivate}
                    onAssignLga={handleAssignLga}
                    onUnassignLga={handleUnassignLga}
                  />
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
