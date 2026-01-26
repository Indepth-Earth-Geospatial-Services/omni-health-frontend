import HeaderProps from "@/features/super-admin/components/layouts/HeaderProps";
import MapPage from "@/features/super-admin/components/pages/Map";
// import Header from "@/features/admin/components/layout/Header";
export default function MapPages() {
  return (
    <>
      {/* <Header name="Facility Registry" /> */}
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <main className="flex min-h-screen flex-col">
          <HeaderProps
            title="Map"
            description="System health overview and key metrics"
          />
          <MapPage />
        </main>
      </div>
    </>
  );
}
