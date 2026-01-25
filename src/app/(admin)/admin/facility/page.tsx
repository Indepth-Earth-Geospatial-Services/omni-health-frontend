// import PatientTables from "@/components/layout/PatientTables";
import Header from "@/features/admin/components/layout/Header";
import FacilityProfile from "@/features/admin/components/page/Facility";

export default function Facility() {
    return (
        <>
            <Header name="Facility Profile" />
            <div className="flex-1 overflow-y-auto bg-white p-6">
                <main className="flex min-h-screen flex-col">
                    <FacilityProfile />
                </main>
            </div>
        </>
    );
}
