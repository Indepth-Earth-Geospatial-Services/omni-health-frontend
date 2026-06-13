import HeaderProps from "@/features/super-admin/components/layouts/HeaderProps";
import UserPage from "@/features/super-admin/components/pages/AllUsers";

export default function AllUsers() {
  return (
    <>
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <main className="flex min-h-screen flex-col">
          <HeaderProps
            title="User Management"
            description="Manage system users, roles, and permissions"
          />
          <UserPage />
        </main>
      </div>
    </>
  );
}
