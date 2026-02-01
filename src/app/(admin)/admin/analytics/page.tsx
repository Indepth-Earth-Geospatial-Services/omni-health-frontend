import AnalyticsPage from "@/features/admin/components/page/Analytics";
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
