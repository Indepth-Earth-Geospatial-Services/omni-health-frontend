"use client";

import EquipmentPage from "@/features/super-admin/components/pages/AllEquipments";

export default function AllUsers() {
  return (
    <>
      {/* <Header name="Facility Registry" /> */}
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <main className="flex min-h-screen flex-col">
          <EquipmentPage />
        </main>
      </div>
    </>
  );
}
