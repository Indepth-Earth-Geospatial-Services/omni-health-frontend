import HeaderProps from "@/features/super-admin/components/layouts/HeaderProps";
import StaffPage from "@/features/super-admin/components/pages/AllStaff";

export default function AllStaff() {
  return (
    <>
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <main className="flex min-h-screen flex-col">
          <HeaderProps
            title="Staff Directory"
            description="View and manage healthcare staff across all facilities"
          />
          <StaffPage />
        </main>
      </div>
    </>
  );
}
