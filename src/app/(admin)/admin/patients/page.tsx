import Header from "@/features/admin/components/layout/Header";
// import PatientTables from "@/features/admin/components/layout/PatientTables"

export default function Patients() {
    return (
        <>
            <Header name="Patients & Appointments" />
            <div className="flex-1 overflow-y-auto bg-white p-6">
                <main className="flex min-h-screen flex-col">
                    {/* <PatientTables /> */}
                </main>
            </div>
        </>
    );
}
