"use client";

import Header from "@/features/admin/components/layout/Header";
import Equipments from "@/features/admin/components/page/Equipments";
import { useAuthStore } from "@/store/auth-store";

export default function EquipmentsPage() {
    const { facilityIds } = useAuthStore();
    const facilityId = facilityIds?.[0] ?? "";

    return (
        <>
            <Header name="Equipments & Facility" />
            <div className="flex-1 overflow-y-auto bg-white p-6">
                <main className="flex min-h-screen flex-col">
                    <Equipments facilityId={facilityId} />
                </main>
            </div>
        </>
    )
}