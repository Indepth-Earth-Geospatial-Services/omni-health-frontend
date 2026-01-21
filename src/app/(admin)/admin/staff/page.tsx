"use client";

import Header from "@/features/admin/components/layout/Header";
import StaffList from "@/features/admin/components/page/Staff";
import { useAuthStore } from "@/store/auth-store";

export default function Staff() {
    const { facilityIds } = useAuthStore();
    const facilityId = facilityIds?.[0] ?? "";

    return (
        <>
            <Header name="Staff Management" />
            <div className="flex-1 overflow-y-auto bg-white p-6">
                <main className="flex min-h-screen flex-col">
                    <StaffList facilityId={facilityId} />
                </main>
            </div>
        </>
    );
}
