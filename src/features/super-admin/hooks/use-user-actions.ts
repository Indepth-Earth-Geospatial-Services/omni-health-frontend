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
  const [suspendMode, setSuspendMode] = useState<"suspend" | "unsuspend">("suspend");
  const [isSuspendLoading, setIsSuspendLoading] = useState(false);

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

  const closeAllModals = useCallback(() => {
    setIsProfileModalOpen(false);
    setIsChangeRoleModalOpen(false);
    setIsDeactivateModalOpen(false);
    setIsSuspendModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleAssignToFacility = useCallback(
    async (userId: number, facilityId: string) => {
      try {
        await superAdminService.assignManager({
          user_id: userId,
          facility_id: facilityId,
        });
        toast.success("User assigned to facility successfully!");
        setIsChangeRoleModalOpen(false);
        onSuccess?.();
      } catch (error) {
        console.error("Failed to assign user to facility:", error);
        toast.error("Failed to assign user to facility. Please try again.");
      }
    },
    [onSuccess]
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
    suspendMode,
    isSuspendLoading,
    openProfileModal,
    openChangeRoleModal,
    openDeactivateModal,
    openSuspendModal,
    closeAllModals,
    handleAssignToFacility,
    handleDeactivateUser,
    handleSuspendUser,
  };
}
