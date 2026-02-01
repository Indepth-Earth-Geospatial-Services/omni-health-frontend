"use client";
import { useMemo } from "react";
import KPIStatsCards from "@/features/admin/components/layout/KPICards";
import { KPISmallCard } from "@/features/admin/components/layout/KPISmallCards";
import { Building2, Calendar, Users, Star, UserCog } from "lucide-react";
import QuickAccessMap from "../layouts/QuickAccessMap";
import MostActiveZonesCard from "../layouts/MostActiveZonesCard";
import AlertsCard from "../layouts/AlertsCard";
import { useAnalyticsOverview } from "@/features/super-admin/hooks/useAnalyticsOverview";
import {
  useSuperAdminStaff,
  useSuperAdminUsers,
} from "@/features/super-admin/hooks/useSuperAdminUsers";

export default function SuperDashboard() {
  // Fetch analytics overview data (Total Facilities, Total Users)
  const { data: analyticsData, isLoading: isLoadingAnalytics } =
    useAnalyticsOverview();

  // Fetch staff data to get total staff count
  const { data: staffData, isLoading: isLoadingStaff } = useSuperAdminStaff(
    1,
    1,
  );

  // Fetch users data to get admin count (users with admin role)
  const { data: usersData, isLoading: isLoadingUsers } = useSuperAdminUsers({
    page: 1,
    limit: 100,
  });

  // Calculate KPI metrics
  const kpiMetrics = useMemo(() => {
    const totalFacilities = analyticsData?.total_facilities ?? 0;
    // Use pagination.total_records for accurate user count (consistent with AllUsers page)
    const totalUsers = usersData?.pagination?.total_records ?? 0;
    const totalStaff = staffData?.pagination?.total_records ?? 0;

    // Count admins (users with role containing 'admin')
    const adminCount =
      usersData?.users?.filter((user) =>
        user.role?.toLowerCase().includes("admin"),
      ).length ?? 0;

    return {
      totalFacilities,
      totalUsers,
      totalStaff,
      adminCount,
    };
  }, [analyticsData, staffData, usersData]);

  const isLoading = isLoadingAnalytics || isLoadingStaff || isLoadingUsers;

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <main className="flex min-h-screen flex-col">
        <div className="mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPIStatsCards
            title="Total Facilities"
            value={isLoading ? "-" : kpiMetrics.totalFacilities}
            subtitle="Healthcare facilities"
            icon={<Building2 size={24} />}
            trend={{ value: "Active", isPositive: true }}
          />
          <KPIStatsCards
            title="Total Users"
            value={isLoading ? "-" : kpiMetrics.totalUsers}
            subtitle="Registered users"
            icon={<Users size={24} />}
            trend={{ value: "Growing", isPositive: true }}
          />
          <KPIStatsCards
            title="Total Staff"
            value={isLoading ? "-" : kpiMetrics.totalStaff}
            subtitle="Medical personnel"
            icon={<Calendar size={24} />}
            trend={{ value: "Active", isPositive: true }}
          />
          <KPIStatsCards
            title="Admins"
            value={isLoading ? "-" : kpiMetrics.adminCount}
            subtitle="System administrators"
            icon={<UserCog size={24} />}
            trend={{ value: "Managing", isPositive: true }}
          />
        </div>
        <div className="p-4">
          <small className="font-dmsans text-[14px] font-semibold text-[#525866]">
            Quick Actions
          </small>
        </div>
        <div className="mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPISmallCard
            value="Add User"
            subtitle="Create Account"
            icon={<Users size={24} />}
            href="/super-admin/allUsers?action=add"
          />
          <KPISmallCard
            value="Change Role"
            subtitle="Assign Permissions"
            icon={<Calendar size={24} />}
            href="/super-admin/allUsers?action=changeRole"
          />
          <KPISmallCard
            value="Suspend Account"
            subtitle="User Access"
            icon={<Users size={24} />}
            href="/super-admin/allUsers?action=suspend"
          />
          <KPISmallCard
            value="Deactivate Account"
            subtitle="Remove Access"
            icon={<Star size={24} />}
            href="/super-admin/allUsers?action=deactivate"
          />
        </div>
        <QuickAccessMap />
        <div className="mt-10 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          <MostActiveZonesCard />
          <AlertsCard />
        </div>
      </main>
    </div>
  );
}
