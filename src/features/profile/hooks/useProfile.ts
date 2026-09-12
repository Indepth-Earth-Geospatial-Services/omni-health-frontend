"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  profileService,
  MAX_AVATAR_BYTES,
  type MyProfile,
  type UpdateProfileRequest,
} from "@/services/profile.service";
import { useAuthStore, type User } from "@/features/auth/auth-store";

export const profileKeys = {
  me: ["profile", "me"] as const,
};

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

/**
 * Merge fresh profile fields into the auth store so the sidebar, header and
 * anything else reading `user` update without a reload.
 */
function useSyncAuthUser() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  return (patch: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...patch });
  };
}

/**
 * The one place to read the whole profile. Worth refetching after a super
 * admin changes someone's LGA coverage mid-session — login returns that data
 * only once, so the sidebar otherwise keeps showing stale areas.
 */
export function useMyProfile(enabled = true) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: profileKeys.me,
    queryFn: () => profileService.getMe(),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && isAuthenticated,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const syncAuthUser = useSyncAuthUser();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileService.updateMe(data),
    onSuccess: (res) => {
      queryClient.setQueryData<MyProfile>(profileKeys.me, res.profile);
      syncAuthUser({
        first_name: res.profile.first_name,
        last_name: res.profile.last_name,
      });
      toast.success(res.message ?? "Profile updated successfully");
    },
    onError: (error) => {
      toast.error(
        errorMessage(error, "Could not update your profile. Please try again."),
      );
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const syncAuthUser = useSyncAuthUser();

  return useMutation({
    mutationFn: (file: File) => {
      // Checked here as well as server-side so an oversized file fails
      // instantly instead of after a slow upload that ends in a 413.
      if (!file.type.startsWith("image/")) {
        throw new Error("That file is not an image.");
      }
      if (file.size > MAX_AVATAR_BYTES) {
        throw new Error("Images must be 5 MB or smaller.");
      }
      return profileService.uploadAvatar(file);
    },
    onSuccess: (res) => {
      queryClient.setQueryData<MyProfile>(profileKeys.me, (old) =>
        old ? { ...old, profile_image_url: res.profile_image_url } : old,
      );
      syncAuthUser({ image: res.profile_image_url });
      toast.success(res.message ?? "Profile picture updated");
    },
    onError: (error) => {
      toast.error(
        errorMessage(error, "Could not upload the image. Please try again."),
      );
    },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  const syncAuthUser = useSyncAuthUser();

  return useMutation({
    mutationFn: () => profileService.deleteAvatar(),
    onSuccess: (res) => {
      // The CDN purge lags and the browser may hold its own cached copy, so
      // drop the URL from state rather than waiting for it to stop resolving.
      queryClient.setQueryData<MyProfile>(profileKeys.me, (old) =>
        old ? { ...old, profile_image_url: null } : old,
      );
      syncAuthUser({ image: undefined });
      toast.success(res.message ?? "Profile picture removed");
    },
    onError: (error) => {
      toast.error(
        errorMessage(error, "Could not remove the image. Please try again."),
      );
    },
  });
}
