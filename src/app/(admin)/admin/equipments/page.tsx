import Header from "@/features/admin/components/layout/Header";
import Equipments from "@/features/admin/feature/Equipments";

// TODO: Replace with actual facility ID from auth/context
const FACILITY_ID = "75588a51-efc2-4754-ad08-7726ff976664";

export default function EquipmentsPage() {
    return (
        <>
            <Header name="Equipments & Facility" />
            <div className="flex-1 overflow-y-auto bg-white p-6">
                <main className="flex min-h-screen flex-col">
                    <Equipments facilityId={FACILITY_ID} />
                </main>
            </div>
        </>
    )
}