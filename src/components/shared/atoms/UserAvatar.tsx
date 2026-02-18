import { getUserInitials } from "@/lib/utils";
import Image from "next/image";

/**
 * A secure, reusable Avatar component.
 * @param {Object} user - The user object containing first_name, last_name, and image.
 */
export const UserAvatar = ({ user }) => {
  const hasImage = !!user?.image;

  return (
    <div
      className={`relative flex size-full shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 font-medium text-slate-600`}
      aria-label={
        hasImage ? "Profile picture" : `Initials for ${user?.first_name}`
      }
    >
      {hasImage ? (
        <Image
          src={user.image}
          alt={`${user?.first_name} profile`}
          fill
          className="object-cover"
        />
      ) : (
        <span className="text-sm">{getUserInitials(user) || "JD"}</span>
      )}
    </div>
  );
};
