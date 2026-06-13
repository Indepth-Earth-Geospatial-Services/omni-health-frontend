import HeaderProps from "@/features/super-admin/components/layouts/HeaderProps";
import Settings from "@/features/super-admin/components/pages/settings";
// import Header from "@/features/admin/components/layout/Header";
export default function SettingsPages() {
  return (
    <>
      {/* <Header name="Facility Registry" /> */}
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <main className="flex min-h-screen flex-col">
          <HeaderProps
            title="Settings"
            description="Configure system preferences and account security"
          />
          <Settings />
        </main>
      </div>
    </>
  );
}
