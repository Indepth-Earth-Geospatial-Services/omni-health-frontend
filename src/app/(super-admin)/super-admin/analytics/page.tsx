import HeaderProps from "@/features/super-admin/components/layouts/HeaderProps";
import AnalyticsPage from "@/features/super-admin/components/pages/SuperAnalytics";
// import Header from "@/features/admin/components/layout/Header";
export default function Registry() {
  return (
    <>
      {/* <Header name="Facility Registry" /> */}
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <main className="flex min-h-screen flex-col">
          <HeaderProps
            title="Analytics Dashboard"
            description="Manage and monitor Analytics of healthcare facilities"
          />
          <AnalyticsPage />
        </main>
      </div>
    </>
  );
}
