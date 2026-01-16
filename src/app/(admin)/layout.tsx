// app/(admin)/layout.tsx (Admin Layout)
import type { Metadata } from "next";
import "../globals.css";
import Sidebar from "@/features/admin/components/layout/Sidebar";
import { UnregisterServiceWorker } from "@/components/UnregisterServiceWorker";
import QueryProvider from "@/providers/query.provider";

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
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <UnregisterServiceWorker />
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar - Fixed width */}
            <Sidebar />
            {/* Main Content Area - This will render your pages */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {children}
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
