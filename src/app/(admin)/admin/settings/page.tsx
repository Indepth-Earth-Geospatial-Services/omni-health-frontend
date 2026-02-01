import Header from "@/features/admin/components/layout/Header";
import SettingsPage from "@/features/admin/components/page/Settings";

export default function Settings() {
  return (
    <>
      <Header name="Settings" />
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <main className="flex min-h-screen flex-col">
          <SettingsPage />
        </main>
      </div>
    </>
  );
}
