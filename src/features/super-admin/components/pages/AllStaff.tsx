"use client";
import KPIStatsCards from "@/features/admin/components/layout/KPICards";
import { Users } from "lucide-react";
import StaffTable from "@/features/super-admin/components/layouts/StaffTable";

export default function StaffPage() {
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
        <StaffTable />
      </main>
    </div>
  );
}
