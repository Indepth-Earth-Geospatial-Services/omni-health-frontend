import Header from "@/features/admin/components/layout/Header";
import StaffList from "@/features/admin/components/layout/Staff";

export default function Patients() {
    return (
        <>
            <Header name="Patients & Appointments" />
            <div className="flex-1 overflow-y-auto bg-white p-6">
                <main className="flex min-h-screen flex-col">
                    <StaffList />
                </main>
            </div>
        </>
    );
}
