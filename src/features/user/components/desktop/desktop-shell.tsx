"use client";

import { cn } from "@/lib/utils";

export function DesktopShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "!mx-0 !max-w-full flex h-dvh overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
