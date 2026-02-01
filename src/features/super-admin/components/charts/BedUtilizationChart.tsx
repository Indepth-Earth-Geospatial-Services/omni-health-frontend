"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useFacilitiesInventory } from "../../hooks/useFacilitiesInventory";
import { Spinner } from "@/components/ui/spinner";

interface LGABedData {
  lga: string;
  beds: number;
  facilities: number;
}

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

// Color palette for the bars
const COLORS = [
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
  "#f97316",
  "#84cc16",
  "#a855f7",
  "#22c55e",
  "#0ea5e9",
  "#d946ef",
  "#eab308",
  "#64748b",
  "#fb7185",
  "#34d399",
  "#a78bfa",
  "#fbbf24",
  "#4ade80",
  "#38bdf8",
];

const BedUtilizationChart = ({
  title = "Bed Distribution by LGA",
}: {
  title?: string;
}) => {
  const { data: facilitiesData, isLoading, error } = useFacilitiesInventory();

  // Process data: Group by LGA and count beds
  const lgaData: LGABedData[] = useMemo(() => {
    if (!facilitiesData?.facilities) return [];

    const lgaMap = new Map<string, { beds: number; facilities: number }>();

    facilitiesData.facilities.forEach((facility) => {
      const lga = facility.facility_lga || "Unknown";
      const beds = countBeds(facility.inventory?.equipment);

      if (lgaMap.has(lga)) {
        const existing = lgaMap.get(lga)!;
        lgaMap.set(lga, {
          beds: existing.beds + beds,
          facilities: existing.facilities + 1,
        });
      } else {
        lgaMap.set(lga, { beds, facilities: 1 });
      }
    });

    // Convert to array and sort by bed count descending
    return Array.from(lgaMap.entries())
      .map(([lga, data]) => ({
        lga: lga.length > 15 ? lga.substring(0, 15) + "..." : lga,
        beds: data.beds,
        facilities: data.facilities,
      }))
      .sort((a, b) => b.beds - a.beds);
  }, [facilitiesData]);

  // Calculate totals for summary
  const totals = useMemo(() => {
    return lgaData.reduce(
      (acc, item) => ({
        beds: acc.beds + item.beds,
        facilities: acc.facilities + item.facilities,
        lgas: acc.lgas + 1,
      }),
      { beds: 0, facilities: 0, lgas: 0 },
    );
  }, [lgaData]);

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-3xl border border-gray-100 bg-white shadow-sm">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-3xl border border-gray-100 bg-white text-red-500 shadow-sm">
        <p>Failed to load bed distribution data</p>
      </div>
    );
  }

  // Fixed height to display all 23 LGAs (40px per LGA bar)
  const chartHeight = Math.max(500, lgaData.length * 40);

  return (
    <div className="w-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Bed counts across all {totals.lgas} Local Government Areas
          </p>
        </div>

        {/* Summary Stats */}
        <div className="flex gap-4">
          <div className="rounded-xl bg-blue-50 px-4 py-2">
            <p className="text-xs font-medium text-blue-600">Total Beds</p>
            <p className="text-lg font-bold text-blue-700">{totals.beds}</p>
          </div>
          <div className="rounded-xl bg-green-50 px-4 py-2">
            <p className="text-xs font-medium text-green-600">Facilities</p>
            <p className="text-lg font-bold text-green-700">
              {totals.facilities}
            </p>
          </div>
          <div className="rounded-xl bg-purple-50 px-4 py-2">
            <p className="text-xs font-medium text-purple-600">LGAs</p>
            <p className="text-lg font-bold text-purple-700">{totals.lgas}</p>
          </div>
        </div>
      </div>

      {/* Chart Container - Full display of all LGAs */}
      <div className="w-full rounded-xl bg-gray-50 p-4">
        <div style={{ height: `${chartHeight}px`, minWidth: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={lgaData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              barCategoryGap={8}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
                stroke="#e5e7eb"
              />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="lga"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#374151", fontSize: 12, fontWeight: 500 }}
                width={120}
              />
              <Tooltip
                cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)",
                  padding: "12px 16px",
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as LGABedData;
                    return (
                      <div className="rounded-xl border-0 bg-white p-3 shadow-xl">
                        <p className="font-semibold text-gray-900">
                          {data.lga}
                        </p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-blue-600">
                              {data.beds}
                            </span>{" "}
                            beds
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-green-600">
                              {data.facilities}
                            </span>{" "}
                            facilities
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="beds" radius={[0, 6, 6, 0]} barSize={24}>
                {lgaData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-500"></span>
          Bed Count
        </span>
        <span className="text-gray-300">|</span>
        <span>Displaying all {totals.lgas} LGAs sorted by bed count</span>
      </div>
    </div>
  );
};

export default BedUtilizationChart;
