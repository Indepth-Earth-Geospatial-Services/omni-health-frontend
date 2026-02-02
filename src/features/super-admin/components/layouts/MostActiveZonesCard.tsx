"use client";

import { useMemo } from "react";
import { Shield, CheckCircle2 } from "lucide-react";
import { useFacilities } from "@/features/super-admin/hooks/useSuperAdminUsers";

interface ZoneItem {
  name: string;
  value: number;
  color: string;
  width: string;
}

const MostActiveZonesCard = () => {
  // Fetch all facilities
  const { data } = useFacilities({ page: 1, limit: 1000 });

  // Calculate counts by facility category
  const zones: ZoneItem[] = useMemo(() => {
    const facilities = data?.facilities || [];

    // Count facilities by category (using includes for flexible matching)
    const healthPostCount = facilities.filter((f) => {
      const category = f.facility_category?.toLowerCase() || "";
      return category.includes("health post") || category === "health post";
    }).length;

    const healthClinicCount = facilities.filter((f) => {
      const category = f.facility_category?.toLowerCase() || "";
      // Match "clinic" or "cottage" (excluding model/mphc to avoid double counting)
      return (
        (category.includes("clinic") || category.includes("cottage")) &&
        !category.includes("model") &&
        !category.includes("mphc")
      );
    }).length;

    const mphcCount = facilities.filter((f) => {
      const category = f.facility_category?.toLowerCase() || "";
      return category.includes("model") || category.includes("mphc");
    }).length;

    // Find max value for percentage calculation
    const maxValue = Math.max(healthPostCount, healthClinicCount, mphcCount, 1);

    return [
      {
        name: "Health Post",
        value: healthPostCount,
        color: "bg-orange-400",
        width: `${Math.round((healthPostCount / maxValue) * 100)}%`,
      },
      {
        name: "Health Clinic",
        value: healthClinicCount,
        color: "bg-purple-600",
        width: `${Math.round((healthClinicCount / maxValue) * 100)}%`,
      },
      {
        name: "Model Primary HealthCentre (MPHC)",
        value: mphcCount,
        color: "bg-blue-500",
        width: `${Math.round((mphcCount / maxValue) * 100)}%`,
      },
    ];
  }, [data]);

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 font-sans shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-900">
          <Shield className="h-5 w-5" strokeWidth={2} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Most Active Zones</h3>
      </div>

      {/* List Container */}
      <div className="flex flex-col gap-6">
        {zones.map((zone, index) => (
          <div key={index} className="flex flex-col gap-2">
            {/* Row: Icon + Name + Value */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4 text-gray-800"
                  strokeWidth={2}
                />
                <span className="text-sm font-medium text-gray-900">
                  {zone.name}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {zone.value}
              </span>
            </div>

            {/* Progress Bar Track */}
            <div className="h-2 w-full rounded-full bg-gray-50">
              {/* Colored Progress Fill */}
              <div
                className={`h-full rounded-full ${zone.color}`}
                style={{ width: zone.width }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostActiveZonesCard;
