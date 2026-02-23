"use client";

import ServerErrorPage from "@/features/auth/pages/server-error-page";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ServerErrorPage reset={reset} />;
}
