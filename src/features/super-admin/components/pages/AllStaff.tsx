"use client";
import { useMemo } from "react";
import KPIStatsCards from "@/features/admin/components/layout/KPICards";
import { Users, Building2, UserCheck, TrendingUp } from "lucide-react";
import StaffTable from "@/features/super-admin/components/layouts/StaffTable";
import {
  useSuperAdminStaff,
  useFacilities,
} from "@/features/super-admin/hooks/useSuperAdminUsers";

export default function StaffPage() {
  // Fetch all staff for KPI calculations (using a large limit to get all staff)
  const { data: allStaffData, isLoading: isLoadingStaff } = useSuperAdminStaff(
    1,
    1000,
  );

  // Fetch all facilities for KPI calculations
  const { data: facilitiesData, isLoading: isLoadingFacilities } =
    useFacilities({ limit: 1000 });

  // Calculate KPI metrics
  const kpiMetrics = useMemo(() => {
    const totalStaff = allStaffData?.pagination?.total_records ?? 0;
    const totalFacilities =
      facilitiesData?.pagination?.total_records ??
      facilitiesData?.facilities?.length ??
      0;

    // Calculate active staff
    const activeStaff =
      allStaffData?.staff?.filter((staff) => staff.is_active).length ?? 0;

    // Calculate average staff per facility
    const avgStaffPerFacility =
      totalFacilities > 0 ? Math.round(totalStaff / totalFacilities) : 0;

    // Calculate staff distribution ratio (Staff:Facility)
    const staffDistribution =
      totalFacilities > 0
        ? `${Math.round(totalStaff / totalFacilities)}:1`
        : "0:1";

    // Calculate growth percentage (mock data - replace with actual historical data if available)
    // This would typically come from comparing current month vs previous month
    const staffGrowthPercentage = 4; // Mock: 4% growth this month

    return {
      totalStaff,
      activeStaff,
      totalFacilities,
      avgStaffPerFacility,
      staffDistribution,
      staffGrowthPercentage,
    };
  }, [allStaffData, facilitiesData]);

  const isLoading = isLoadingStaff || isLoadingFacilities;

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <main className="flex min-h-screen flex-col">
        <div className="mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPIStatsCards
            title="Total Staff"
            value={isLoading ? "-" : kpiMetrics.totalStaff}
            subtitle={`${kpiMetrics.staffGrowthPercentage}% This month`}
            icon={<Users size={24} />}
            trend={{
              value: `${kpiMetrics.staffGrowthPercentage}%`,
              isPositive: kpiMetrics.staffGrowthPercentage > 0,
            }}
          />
          <KPIStatsCards
            title="Avg. Staff Per Facility"
            value={isLoading ? "-" : kpiMetrics.avgStaffPerFacility}
            subtitle={
              kpiMetrics.totalFacilities > 0
                ? `${kpiMetrics.totalStaff} staff / ${kpiMetrics.totalFacilities} facilities`
                : ""
            }
            icon={<UserCheck size={24} />}
            trend={{ value: "Stable", isPositive: true }}
          />
          <KPIStatsCards
            title="Total Facilities"
            value={isLoading ? "-" : kpiMetrics.totalFacilities}
            subtitle=""
            icon={<Building2 size={24} />}
            trend={{ value: "80%", isPositive: true }}
          />
          <KPIStatsCards
            title="Staff Distribution"
            value={isLoading ? "-" : kpiMetrics.staffDistribution}
            subtitle={`Avg: ${kpiMetrics.avgStaffPerFacility} per facility`}
            icon={<TrendingUp size={24} />}
            trend={{ value: "Stable", isPositive: true }}
          />
        </div>
        <StaffTable />
      </main>
    </div>
  );
}
