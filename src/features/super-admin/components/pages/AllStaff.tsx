"use client";
import KPIStatsCards from "@/features/admin/components/layout/KPICards";
import { Users } from "lucide-react";
import StaffList from "@/features/admin/components/page/Staff";
import { useAuthStore } from "@/store/auth-store";
// import StaffTableHeader from "@/features/super-admin/components/layouts/StaffTableHeader";

export default function StaffPage() {
  const { facilityIds } = useAuthStore();
  const facilityId = facilityIds?.[0] ?? "";

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <main className="flex min-h-screen flex-col">
        <div className="mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPIStatsCards
            title="Total Staff"
            value={33}
            subtitle="4% This month"
            icon={<Users size={24} />}
            trend={{ value: "20%", isPositive: true }}
          />
          <KPIStatsCards
            title="Average Staff per facility"
            value={24}
            subtitle=""
            icon={<Users size={24} />}
            trend={{ value: "2% Decrease", isPositive: false }}
          />
          <KPIStatsCards
            title="Total Facilities"
            value={302}
            subtitle="+0.5%"
            icon={<Users size={24} />}
            trend={{ value: "80%", isPositive: true }}
          />
          <KPIStatsCards
            title="Staff Distribution"
            value={"24:1"}
            subtitle=""
            icon={<Users size={24} />}
            trend={{ value: "80%", isPositive: true }}
          />
        </div>
        {/* <StaffTableHeader title="Staff List" /> */}
        <StaffList facilityId={facilityId} title="Staff List" />
      </main>
    </div>
  );
}
