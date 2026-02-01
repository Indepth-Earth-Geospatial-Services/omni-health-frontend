import HeaderProps from "@/features/super-admin/components/layouts/HeaderProps";
import SuperDashbaord from "@/features/super-admin/components/pages/SuperDashbaord";
// import Header from "@/features/admin/components/layout/Header";
export default function dashboard() {
  return (
    <>
      {/* <Header name="Facility Registry" /> */}
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <main className="flex min-h-screen flex-col">
          <HeaderProps
            title="Global Dashboard"
            description="System health overview and key metrics"
          />
          <SuperDashbaord />
        </main>
      </div>
    </>
  );
}
