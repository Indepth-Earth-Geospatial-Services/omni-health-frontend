"use client";

import { ROLE_LABEL, useAuthStore } from "@/features/auth/auth-store";

export default function HeaderProps({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const role = useAuthStore((s) => s.user?.role);

  return (
    <div className="flex max-w-full flex-col py-2 pb-6">
      {/* Breadcrumb-style "Super Admin / Facility Registry", matching the
          admin header. */}
      <h1 className="flex min-w-0 items-center gap-2 text-xl font-semibold">
        {role && (
          <>
            <span className="shrink-0 text-gray-700">
              {ROLE_LABEL[role] ?? role}
            </span>
            <span aria-hidden className="shrink-0 text-gray-700">
              /
            </span>
          </>
        )}
        <span className="truncate text-gray-700">{title}</span>
      </h1>
      <h2 className="font-dmsans text-[16px] font-normal text-[#525866]">
        {description}
      </h2>
    </div>
  );
}
