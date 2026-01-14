import AnalyticsPage from "@/features/admin/components/layout/Analytics";
import Header from "@/features/admin/components/layout/Header";
export default function Analytics() {
    return (
        <>
            <Header name="Appointments" />
            <div className="flex-1 overflow-y-auto bg-white p-6">
                <main className="flex min-h-screen flex-col">
                    <AnalyticsPage />
                </main>
            </div>
        </>
    );
}