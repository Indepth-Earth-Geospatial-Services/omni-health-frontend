"use client";

import StaffPage from "@/features/super-admin/components/pages/AllStaff";

export default function AllStaff() {
  return (
    <>
      {/* <Header name="Facility Registry" /> */}
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <main className="flex min-h-screen flex-col">
          <StaffPage />
        </main>
      </div>
    </>
  );
}
