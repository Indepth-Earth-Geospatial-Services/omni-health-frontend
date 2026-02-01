"use client";
import { useMemo, useState } from "react";
import KPIStatsCards from "@/features/admin/components/layout/KPICards";
import { Users, Building2, Bed, TrendingUp } from "lucide-react";
import BedUtilizationChart from "../charts/BedUtilizationChart";
import { useAnalyticsOverview } from "@/features/super-admin/hooks/useAnalyticsOverview";
import { useFacilitiesInventory } from "@/features/super-admin/hooks/useFacilitiesInventory";
import FacilityDistribution3DPie from "../charts/FacilityDistribution3DPie";
import Tabs from "../ui/Tabs";
import FacilityInventoryChart from "../charts/FacilityInventoryChart";
import FacilityGeographicDistributionChart from "../charts/FacilityGeographicDistributionChart";
import AhoadaWestPieChart from "../charts/AhoadaWestPieChart";
import TopPerformingFacilitiesChart from "../charts/TopPerformingFacilitiesChart";
import AnalyticsSmallKPI from "../layouts/AnalyticsSmallKPI";

/**
 * Helper function to count all bed-related equipment in a facility's inventory
 * Filters equipment keys that contain 'bed' or 'beds' (case-insensitive)
 */
const countBeds = (equipment: Record<string, unknown> | undefined): number => {
  if (!equipment) return 0;

  let totalBeds = 0;

  Object.entries(equipment).forEach(([key, value]) => {
    if (key.toLowerCase().includes("bed")) {
      if (Array.isArray(value)) {
        totalBeds += value.length;
      } else if (typeof value === "number") {
        totalBeds += value;
      } else if (value) {
        totalBeds += 1;
      }
    }
  });

  return totalBeds;
};

export default function AnalyticsPage() {
  // ========== TAB STATE ==========
  const [activeTab, setActiveTab] = useState("Overview");
  // Fetch analytics overview data (KPIs)
  const { data: analyticsData, isLoading: isLoadingAnalytics } =
    useAnalyticsOverview();

  // Fetch facilities inventory data for bed counts
  const { data: facilitiesData, isLoading: isLoadingFacilities } =
    useFacilitiesInventory();

  // tabs to switch between different analytics views (if needed in future)
  const tabsConfig = [
    { label: "Overview", value: "Overview" },
    { label: "Facility Performance", value: "Facility Performance" },
    { label: "Inventory & Resources", value: "Inventory & Resources" },
    // { label: "Geographic Distribution", value: "Geographic Distribution" },
  ];

  // Calculate KPI metrics from analytics endpoint
  const kpiMetrics = useMemo(() => {
    const totalFacilities = analyticsData?.total_facilities ?? 0;
    const totalUsers = analyticsData?.total_users ?? 0;
    const totalReviews = analyticsData?.total_reviews ?? 0;

    // Calculate total beds across all facilities
    const totalBeds = (facilitiesData?.facilities || []).reduce(
      (sum, facility) => sum + countBeds(facility.inventory?.equipment),
      0,
    );

    // Calculate average reviews per facility
    const avgReviewsPerFacility =
      totalFacilities > 0 ? Math.round(totalReviews / totalFacilities) : 0;

    return {
      totalFacilities,
      totalUsers,
      totalReviews,
      totalBeds,
      avgReviewsPerFacility,
    };
  }, [analyticsData, facilitiesData]);

  const isLoading = isLoadingAnalytics || isLoadingFacilities;

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
            title="Total Reviews"
            value={isLoading ? "-" : kpiMetrics.totalReviews}
            subtitle={`${kpiMetrics.avgReviewsPerFacility} per facility`}
            icon={<TrendingUp size={24} />}
            trend={{ value: "Positive", isPositive: true }}
          />
          <KPIStatsCards
            title="Total Beds"
            value={isLoading ? "-" : kpiMetrics.totalBeds}
            subtitle="Across all facilities"
            icon={<Bed size={24} />}
            trend={{ value: "Available", isPositive: true }}
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

        {activeTab === "Overview" && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <BedUtilizationChart />
            </div>
          </div>
        )}

        {activeTab === "Facility Performance" && (
          <TopPerformingFacilitiesChart />
        )}
        {activeTab === "Inventory & Resources" && (
          <>
            {/* <AnalyticsSmallKPI title="Total staff" value={546} /> */}
            <FacilityInventoryChart />
          </>
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
