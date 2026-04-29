"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { superAdminService } from "../services/super-admin.service";
import type { User, GetUsersResponse } from "../services/super-admin.service";

interface UseUserActionsOptions {
  onSuccess?: () => void | Promise<unknown>;
}

export function useUserActions({ onSuccess }: UseUserActionsOptions = {}) {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isAssignFacilityModalOpen, setIsAssignFacilityModalOpen] = useState(false);
  const [isUnassignLgaModalOpen, setIsUnassignLgaModalOpen] = useState(false);
  const [suspendMode, setSuspendMode] = useState<"suspend" | "unsuspend">("suspend");
  const [isSuspendLoading, setIsSuspendLoading] = useState(false);
  const [isChangeRoleLoading, setIsChangeRoleLoading] = useState(false);

  const openProfileModal = useCallback((user: User) => {
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  }, []);

  const openChangeRoleModal = useCallback((user: User) => {
    setSelectedUser(user);
    setIsChangeRoleModalOpen(true);
  }, []);

  const openDeactivateModal = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDeactivateModalOpen(true);
  }, []);

  const openSuspendModal = useCallback((user: User, mode: "suspend" | "unsuspend") => {
    setSelectedUser(user);
    setSuspendMode(mode);
    setIsSuspendModalOpen(true);
  }, []);

  const openAssignFacilityModal = useCallback((user: User) => {
    setSelectedUser(user);
    setIsAssignFacilityModalOpen(true);
  }, []);

  const openUnassignLgaModal = useCallback((user: User) => {
    setSelectedUser(user);
    setIsUnassignLgaModalOpen(true);
  }, []);

  const closeAllModals = useCallback(() => {
    setIsProfileModalOpen(false);
    setIsChangeRoleModalOpen(false);
    setIsDeactivateModalOpen(false);
    setIsSuspendModalOpen(false);
    setIsAssignFacilityModalOpen(false);
    setIsUnassignLgaModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleAssignToFacility = useCallback(
    async (userId: number, lgaIds: number[]) => {
      try {
        await superAdminService.assignManager({
          user_id: userId,
          lga_ids: lgaIds,
        });
        toast.success("User assigned to LGA(s) and promoted to Admin!");
        setIsAssignFacilityModalOpen(false);
        onSuccess?.();
      } catch (error) {
        console.error("Failed to assign user:", error);
        toast.error("Failed to assign user. Please try again.");
      }
    },
    [onSuccess]
  );

  const handleChangeUserRole = useCallback(
    async (userId: string, role: string) => {
      setIsChangeRoleLoading(true);
      try {
        await superAdminService.changeUserRole(userId, role);
        toast.success("User role updated successfully!");
        setIsChangeRoleModalOpen(false);
        await onSuccess?.();
        queryClient.setQueriesData<GetUsersResponse>(
          { queryKey: ["super-admin-users"] },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              users: old.users.map((u) =>
                u.user_id === userId ? { ...u, role } : u,
              ),
            };
          },
        );
      } catch (error) {
        console.error("Failed to change user role:", error);
        const message =
          error instanceof Error
            ? error.message
            : "Failed to change role. Please try again.";
        toast.error(message);
      } finally {
        setIsChangeRoleLoading(false);
      }
    },
    [onSuccess, queryClient],
  );

  const handleDeactivateUser = useCallback(
    async (_userId: string, password: string) => {
      try {
        await superAdminService.deactivateAccount(password);
        toast.success("User deactivated successfully!");
        setIsDeactivateModalOpen(false);
      } catch (error) {
        console.error("Failed to deactivate user:", error);
        toast.error("Failed to deactivate user. Please try again.");
      }
    },
    []
  );

  const handleSuspendUser = useCallback(
    async (userId: string, reason: string, mode: "suspend" | "unsuspend") => {
      setIsSuspendLoading(true);
      try {
        if (mode === "suspend") {
          await superAdminService.suspendUser(userId, reason);
          toast.success("User account suspended successfully!");
        } else {
          await superAdminService.unsuspendUser(userId);
          toast.success("User account unsuspended successfully!");
        }

        setIsSuspendModalOpen(false);

        // Refetch first so we get fresh data from the API
        await onSuccess?.();

        // Optimistically patch both is_active and is_suspended in cache after
        // refetch — the endpoints return a plain string so the refetch may lag.
        const isNowSuspended = mode === "suspend";
        queryClient.setQueriesData<GetUsersResponse>(
          { queryKey: ["super-admin-users"] },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              users: old.users.map((u) =>
                u.user_id === userId
                  ? { ...u, is_active: !isNowSuspended, is_suspended: isNowSuspended }
                  : u
              ),
            };
          }
        );
      } catch (error) {
        console.error(`Failed to ${mode} user:`, error);
        const message = error instanceof Error ? error.message : `Failed to ${mode} user. Please try again.`;
        toast.error(message);
      } finally {
        setIsSuspendLoading(false);
      }
    },
    [onSuccess, queryClient]
  );

  return {
    selectedUser,
    isProfileModalOpen,
    isChangeRoleModalOpen,
    isDeactivateModalOpen,
    isSuspendModalOpen,
    isAssignFacilityModalOpen,
    isUnassignLgaModalOpen,
    suspendMode,
    isSuspendLoading,
    isChangeRoleLoading,
    openProfileModal,
    openChangeRoleModal,
    openDeactivateModal,
    openSuspendModal,
    openAssignFacilityModal,
    openUnassignLgaModal,
    closeAllModals,
    handleAssignToFacility,
    handleChangeUserRole,
    handleDeactivateUser,
    handleSuspendUser,
  };
}
