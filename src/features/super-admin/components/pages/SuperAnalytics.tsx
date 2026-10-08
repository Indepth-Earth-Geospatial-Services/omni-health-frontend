"use client";
import { useMemo, useState } from "react";
import KPIStatsCards from "@/features/admin/components/layout/KPICards";
import { Users, Building2, TrendingUp } from "lucide-react";
import { useAnalyticsOverview } from "@/features/super-admin/hooks/useAnalyticsOverview";
import { useSuperAdminUsers } from "@/features/super-admin/hooks/useSuperAdminUsers";
import FacilityDistribution3DPie from "../charts/FacilityDistribution3DPie";
import Tabs from "../ui/Tabs";
import FacilityGeographicDistributionChart from "../charts/FacilityGeographicDistributionChart";
import AhoadaWestPieChart from "../charts/AhoadaWestPieChart";
import TopPerformingFacilitiesChart from "../charts/TopPerformingFacilitiesChart";
import AnalyticsSmallKPI from "../layouts/AnalyticsSmallKPI";

export default function AnalyticsPage() {
  // ========== TAB STATE ==========
  const [activeTab, setActiveTab] = useState("Facility Performance");
  // Fetch analytics overview data (KPIs)
  const { data: analyticsData, isLoading: isLoadingAnalytics } =
    useAnalyticsOverview();

  // Fetch users data for accurate user count (consistent with other pages)
  const { data: usersData, isLoading: isLoadingUsers } = useSuperAdminUsers({
    page: 1,
    limit: 1,
  });

  // tabs to switch between different analytics views (if needed in future)
  const tabsConfig = [
    { label: "Facility Performance", value: "Facility Performance" },
    // { label: "Geographic Distribution", value: "Geographic Distribution" },
  ];

  // Calculate KPI metrics from analytics endpoint
  const kpiMetrics = useMemo(() => {
    const totalFacilities = analyticsData?.total_facilities ?? 0;
    const totalUsers = analyticsData?.total_users ?? 0;
    const totalReviews = analyticsData?.total_reviews ?? 0;

    // Calculate average reviews per facility
    const avgReviewsPerFacility =
      totalFacilities > 0 ? Math.round(totalReviews / totalFacilities) : 0;

    return {
      totalFacilities,
      totalUsers,
      totalReviews,
      avgReviewsPerFacility,
    };
  }, [analyticsData]);

  const isLoading = isLoadingAnalytics;

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <main className="flex min-h-screen flex-col">
        <div className="mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            title="Total Reviews"
            value={isLoading ? "-" : kpiMetrics.totalReviews}
            subtitle={`${kpiMetrics.avgReviewsPerFacility} per facility`}
            icon={<TrendingUp size={24} />}
            trend={{ value: "Positive", isPositive: true }}
          />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs
            tabs={tabsConfig}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {activeTab === "Facility Performance" && (
          <TopPerformingFacilitiesChart />
        )}

        {/* {activeTab === "Geographic Distribution" && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <FacilityGeographicDistributionChart />
              <AhoadaWestPieChart />
            </div>
          </div>
        )} */}
      </main>
    </div>
  );
}
