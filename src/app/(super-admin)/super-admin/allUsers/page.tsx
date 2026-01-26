"use client";

import UserPage from "@/features/super-admin/components/pages/AllUsers";

export default function AllUsers() {
  return (
    <>
      {/* <Header name="Facility Registry" /> */}
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <main className="flex min-h-screen flex-col">
          <UserPage />
        </main>
      </div>
    </>
  );
}
