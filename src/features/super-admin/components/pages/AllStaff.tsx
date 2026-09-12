"use client";
import KPIStatsCards from "@/features/admin/components/layout/KPICards";
import { Users, Building2 } from "lucide-react";
import StaffTable from "@/features/super-admin/components/layouts/StaffTable";
import { useSuperAdminStaff } from "@/features/super-admin/hooks/useSuperAdminUsers";
import { useAnalyticsOverview } from "@/features/super-admin/hooks/useAnalyticsOverview";

export default function StaffPage() {
  // Only pagination.total_records is needed, so ask for the smallest page the
  // API will return rather than a full one.
  const { data: staffData, isLoading: isLoadingStaff } = useSuperAdminStaff(
    1,
    1,
  );

  // The facility count comes from the analytics KPI endpoint — the same source
  // the dashboard uses. The previous approach fetched up to 1000 facilities
  // just to read a total off the response, which was slow enough that the
  // cards sat on "-" indefinitely.
  const { data: analyticsData, isLoading: isLoadingAnalytics } =
    useAnalyticsOverview();

  const totalStaff = staffData?.pagination?.total_records ?? 0;
  const totalFacilities = analyticsData?.total_facilities ?? 0;

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <main className="flex min-h-screen flex-col">
        <div className="mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {/* Each card tracks its own request, so a slow one never holds up
              a value that has already arrived. */}
          <KPIStatsCards
            title="Total Staff"
            value={isLoadingStaff ? "-" : totalStaff}
            subtitle="Medical personnel"
            icon={<Users size={24} />}
          />
          <KPIStatsCards
            title="Total Facilities"
            value={isLoadingAnalytics ? "-" : totalFacilities}
            subtitle="Healthcare facilities"
            icon={<Building2 size={24} />}
          />
        </div>
        <StaffTable />
      </main>
    </div>
  );
}
