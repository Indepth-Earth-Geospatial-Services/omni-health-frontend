"use client";

import "../globals.css";
import Sidebar from "@/features/admin/components/layout/Sidebar";
import { UnregisterServiceWorker } from "@/components/UnregisterServiceWorker";
import QueryProvider from "@/providers/query.provider";
import { AuthHydration } from "@/components/AuthHydration";
import MainHeader from "@/features/super-admin/components/layouts/mainHeader";
// import { getSidebarConfig } from "@/features/admin/components/config/ConfigSidebar";
import { Toaster } from "sonner";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const sidebarConfig = getSidebarConfig("super_admin"); // ✅ Super admin config

  return (
    <QueryProvider>
      <AuthHydration>
        <UnregisterServiceWorker />
        <div className="flex h-screen overflow-hidden">
          {/* ✅ Super Admin Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* ✅ Sticky header with search + LGA filter */}
            <MainHeader className="sticky top-0 z-10" />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50">
              {children}
            </main>
          </div>
        </div>
        <Toaster position="top-right" closeButton />
      </AuthHydration>
    </QueryProvider>
  );
}