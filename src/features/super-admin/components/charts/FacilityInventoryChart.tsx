"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useFacilitiesInventory } from "../../hooks/useFacilitiesInventory";
import { Spinner } from "@/components/ui/spinner";

interface ChartDataPoint {
  name: string;
  facilities: number;
  specialists: number;
  beds: number;
}

/**
 * Helper function to count all bed-related equipment in a facility's inventory
 * Filters equipment keys that contain 'bed' or 'beds' (case-insensitive)
 */
const countBeds = (
  equipment: Record<string, unknown> | undefined,
): number => {
  if (!equipment) return 0;

  let totalBeds = 0;

  Object.entries(equipment).forEach(([key, value]) => {
    // Check if the key contains 'bed' or 'beds' (case-insensitive)
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

const FacilityInventoryChart = ({
  title = "Top 10 Facility & Inventory Distribution",
}) => {
  const { data: facilitiesData, isLoading, error } = useFacilitiesInventory();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center text-red-500">
        <p>Failed to load facilities inventory data</p>
      </div>
    );
  }

  // Transform data: Get top 10 facilities with specialists and beds
  const chartData: ChartDataPoint[] = (facilitiesData?.facilities || [])
    .slice(0, 10)
    .map((facility) => ({
      name:
        facility.facility_name && facility.facility_name.length > 20
          ? facility.facility_name.substring(0, 20) + "..."
          : facility.facility_name || "Unknown",
      facilities: 1,
      specialists: facility.specialists ? facility.specialists.length : 0,
      beds: countBeds(facility.inventory?.equipment),
    }));
  return (
    <div className="w-full max-w-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header Section */}
      <div className="relative mb-8 flex items-baseline justify-between border-b border-gray-200 pb-2">
        {/* Left Side: Title + Custom Underline */}
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>

          {/* Decorative underline - Push down using mt-2 or mt-3 */}
          {/* <div className="absolute -bottom-[14px] left-0 flex w-full items-center">
            <div className="h-1 w-12 rounded-full bg-cyan-400"></div>
            <div className="ml-[-2px] h-[1px] flex-grow bg-gray-200"></div>
          </div> */}
        </div>

        {/* Right Side: More Button */}
        {/* <button className="text-xs font-semibold tracking-wide text-gray-400 uppercase hover:text-gray-600">
          More
        </button> */}
      </div>

      {/* Chart Container */}
      {/* We set a dynamic minimum height to accommodate many rows without squashing */}
      <div
        className="w-full font-sans"
        style={{ height: `${Math.max(600, chartData.length * 60)}px` }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical" // KEY: Switches to Horizontal Bars
            barGap={4} // Adds slight spacing between bars in a group
            barCategoryGap={20} // Spacing between different locations
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            {/* Grid Lines - Vertical Only to match image */}
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
              stroke="#e5e7eb"
            />

            {/* X Axis - Orientation TOP to match image */}
            <XAxis
              type="number"
              orientation="top"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              domain={[0, 100]}
            />

            {/* Y Axis - Location Names */}
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#111827", fontSize: 13, fontWeight: 500 }}
              width={100} // Give enough space for long names
            />

            <Tooltip
              cursor={{ fill: "#f9fafb" }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />

            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              iconType="square"
              wrapperStyle={{ paddingLeft: "20px" }}
            />

            {/* Series 1: Facilities (Blue) */}
            <Bar
              dataKey="facilities"
              fill="#3b82f6"
              radius={[0, 4, 4, 0]}
              barSize={12}
            >
              <LabelList
                dataKey="facilities"
                position="right"
                fill="#6b7280"
                fontSize={11}
              />
            </Bar>

            {/* Series 2: Specialists (Red) */}
            {/* Note: Based on image, Red appears in the middle of the group */}
            <Bar
              dataKey="specialists"
              fill="#ef4444"
              radius={[0, 4, 4, 0]}
              barSize={12}
            >
              <LabelList
                dataKey="specialists"
                position="right"
                fill="#6b7280"
                fontSize={11}
              />
            </Bar>

            {/* Series 3: Beds (Orange) */}
            <Bar
              dataKey="beds"
              fill="#fbbf24"
              radius={[0, 4, 4, 0]}
              barSize={12}
            >
              <LabelList
                dataKey="beds"
                position="right"
                fill="#6b7280"
                fontSize={11}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FacilityInventoryChart;
