"use client";
import { useState } from "react";
import KPIStatsCards from "@/features/admin/components/layout/KPICards";
import { Calendar, Pen, Users } from "lucide-react";
// import StaffList from "@/features/admin/components/page/Staff";
import StaffTableHeader from "@/features/super-admin/components/layouts/StaffTableHeader";
import Tabs from "@/features/super-admin/components/ui/Tabs";
import { useAuthStore } from "@/store/auth-store";
import UserAndRoleList from "../layouts/UserAndRoleList";
import { useSuperAdminUsers } from "../../hooks/useSuperAdminUsers";

export default function AllUserPage() {
  const { facilityIds } = useAuthStore();
  const facilityId = facilityIds?.[0] ?? "";
  const [activeTab, setActiveTab] = useState("user-directory");

  // Fetch all users for KPI calculations (using a large limit to get all users)
  const { data: allUsersData } = useSuperAdminUsers(1, 100);

  const tabs = [
    { label: "User Directory", value: "user-directory" },
    { label: "Roles & Permissions", value: "roles-permissions" },
  ];

  // Calculate KPI metrics
  const totalUsers = allUsersData?.pagination?.total_records ?? 0;
  const activeUsers =
    allUsersData?.users?.filter((user) => user.is_active).length ?? 0;
  const totalSuperAdmins =
    allUsersData?.users?.filter((user) => user.role === "super_admin").length ??
    0;

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <main className="flex min-h-screen flex-col">
        <div className="mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPIStatsCards
            title="Total Users"
            value={totalUsers}
            subtitle=""
            icon={<Users size={24} />}
            trend={{ value: "20%", isPositive: true }}
          />
          <KPIStatsCards
            title="Active Users"
            value={activeUsers}
            subtitle=""
            icon={<Users size={24} />}
            trend={{ value: "2% Decrease", isPositive: false }}
          />
          <KPIStatsCards
            title="Pending Approvals"
            value={1}
            subtitle=""
            icon={<Calendar size={24} />}
            trend={{ value: "80%", isPositive: true }}
          />
          <KPIStatsCards
            title="Super Admins"
            value={totalSuperAdmins}
            subtitle=""
            icon={<Calendar size={24} />}
            trend={{ value: "80%", isPositive: true }}
          />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Conditionally render content based on active tab */}
        {activeTab === "user-directory" && (
          <>
            <StaffTableHeader
              title="Users List"
              searchPlaceholder="Search users..."
              onSearch={(value) => console.log(value)}
              buttonLabel="Add New User"
              onButtonClick={() => console.log("Add new user")}
              showGenderFilter={true}
              onGenderFilter={() => console.log("Filter by gender")}
              showStatusFilter={true}
              onStatusFilter={() => console.log("Filter by status")}
              showExport={true}
              onExport={() => console.log("Export users")}
            />
            <UserAndRoleList />
          </>
        )}

        {activeTab === "roles-permissions" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-lg text-black">Super Admin Permissions</p>
                <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-black px-6 py-2">
                  <Pen size={16} className="text-slate-500" />
                  <span>Edit</span>
                </button>
              </div>
              <div>
                <div className="space-y-6">
                  {/* User Details */}
                  <div className="space-y-4">
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>View all facilities</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>Approve/reject facilities</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>Annotate & request remediation</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>View audit logs</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>Configure system settings</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>Export reports</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>Manage integrations</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-lg text-black">Facility Admin</p>
                <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-black px-6 py-2">
                  <Pen size={16} className="text-slate-500" />
                  <span>Edit</span>
                </button>
              </div>
              <div>
                <div className="space-y-6">
                  {/* User Details */}
                  <div className="space-y-4">
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>View all facilities</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>Approve/reject facilities</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>Annotate & request remediation</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>View audit logs</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>Configure system settings</p>
                      <p className="text-red text-sm">Denied</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>Export reports</p>
                      <p className="text-primary text-sm">Granted</p>
                    </div>
                    <div className="mt-1 flex justify-between rounded-lg border border-gray-200 bg-[#E2E4E9] p-2.5 text-sm font-medium text-[#868C98]">
                      <p>Manage integrations</p>
                      <p className="text-red text-sm">Denied</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
