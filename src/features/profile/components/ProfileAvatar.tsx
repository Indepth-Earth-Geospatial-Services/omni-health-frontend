"use client";

import { useAuthStore } from "@/features/auth/auth-store";
import { cn } from "@/lib/utils";
import { useMyProfile } from "../hooks/useProfile";

interface ProfileAvatarProps {
  className?: string;
  /** Falls back to initials, so keep this readable against the circle size. */
  textClassName?: string;
}

/**
 * The signed-in user's picture, falling back to their initials.
 *
 * Reads the URL from /me rather than the auth store: login never returns a
 * picture, and the store only learns about one when the user uploads during
 * that session — so after a reload the store is empty while /me is not. The
 * query is shared with ProfileModal through React Query, so showing this in
 * the sidebar costs no extra request.
 *
 * Uses a plain <img> on purpose: next/image would need `remotePatterns`
 * widened beyond the single pinned Cloudinary cloud name in next.config.ts.
 */
export function ProfileAvatar({
  className,
  textClassName,
}: ProfileAvatarProps) {
  const user = useAuthStore((state) => state.user);
  const { data: profile } = useMyProfile();

  const imageUrl = profile?.profile_image_url ?? user?.image ?? null;

  const initials =
    user?.first_name && user?.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
      : user?.email?.[0]?.toUpperCase() || "U";

  const fullName =
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "My Account";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={fullName}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "bg-primary/10 text-primary flex shrink-0 items-center justify-center rounded-full font-bold",
        className,
        textClassName,
      )}
    >
      {initials}
    </div>
  );
}
