import QuickStatsHeader from "../layout/QuickStatsHeader";
import KPIStatsCards from "../layout/KPICards";
import AnalyticsCharts from "../charts/AnalyticsCharts";
import { Users } from "lucide-react";

export default function Analytics() {
  return (
    <>
      <QuickStatsHeader />
      <div className="mb-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPIStatsCards
          title="Today's Patient"
          value={127}
          icon={<Users size={24} />}
          trend={{ value: "20%", isPositive: true }}
        />
        <KPIStatsCards
          title="Available Beds"
          value={29}
          icon={<Users size={24} />}
          trend={{ value: "2% Decrease", isPositive: false }}
        />
        <KPIStatsCards
          title="Pending Appointments"
          value={17}
          icon={<Users size={24} />}
          trend={{ value: "80%", isPositive: true }}
        />
        <KPIStatsCards
          title="Completion Rate"
          value={94}
          icon={<Users size={24} />}
          trend={{ value: "80%", isPositive: true }}
        />
      </div>
      <AnalyticsCharts />
    </>
  );
}
