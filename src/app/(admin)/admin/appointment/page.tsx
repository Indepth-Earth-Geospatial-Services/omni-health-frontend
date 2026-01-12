import UserAppointment from "@/features/admin/components/layout/Appointment"
import Header from "@/features/admin/components/layout/Header";

export default function Appointment() {
    return (
        <>
            <Header name="Appointments" />
            <div className="flex-1 overflow-y-auto bg-white p-6">
                <main className="flex min-h-screen flex-col">
                    <UserAppointment />
                </main>
            </div>
        </>
    );
}
