import type { Metadata } from "next";
import Sidebar from "@/features/admin/components/layout/Sidebar";
import { UnregisterServiceWorker } from "@/features/auth/UnregisterServiceWorker";
import QueryProvider from "@/providers/query.provider";
import { AuthHydration } from "@/features/auth/AuthHydration";
import { AdminSessionGuard } from "@/features/auth/AdminSessionGuard";

export const metadata: Metadata = {
  title: "Omni Health Admin",
  description: "Healthcare facility management dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <AuthHydration>
        <AdminSessionGuard>
          <UnregisterServiceWorker />
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
          </div>
        </AdminSessionGuard>
      </AuthHydration>
    </QueryProvider>
  );
}
