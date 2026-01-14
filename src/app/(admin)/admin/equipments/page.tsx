import Header from "@/features/admin/components/layout/Header";
import Equipments from "@/features/admin/feature/Equipments";

export default function EquipmentsPage() {
    return (
        <>
            <Header name="Equipments & Facility" />
            <div className="flex-1 overflow-y-auto bg-white p-6">
                <main className="flex min-h-screen flex-col">
                    <Equipments />
                </main>
            </div>
        </>
    )
}