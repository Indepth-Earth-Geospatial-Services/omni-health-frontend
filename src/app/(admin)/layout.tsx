"use client";

import "../globals.css";
import Sidebar from "@/features/admin/components/layout/Sidebar";
import { UnregisterServiceWorker } from "@/components/UnregisterServiceWorker";
import QueryProvider from "@/providers/query.provider";
import { AuthHydration } from "@/components/AuthHydration";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const sidebarConfig = getSidebarConfig("admin");

  return (
    <QueryProvider>
      <AuthHydration>
        <UnregisterServiceWorker />
        <>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar - Fixed width */}
            <Sidebar />
            {/* Main Content Area - This will render your pages */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {children}
            </div>
          </div>
        </>
      </AuthHydration>
    </QueryProvider>
  );
}
