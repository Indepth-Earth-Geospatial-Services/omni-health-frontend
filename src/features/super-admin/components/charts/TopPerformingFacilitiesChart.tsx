"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import { useFacilitiesAnalytics } from "../../hooks/useFacilitiesAnalytics";
import { Spinner } from "@/components/ui/spinner";

const TopPerformingFacilitiesChart = ({
  title = "Top 10 Performing Facilities by Rating",
}) => {
  // Fetch real data from endpoint
  const { data: facilitiesData, isLoading, error } = useFacilitiesAnalytics();

  // Custom Bar color matching your theme (Periwinkle Blue)
  const barColor = "#8b9dfc";
  const hoverColor = "#7180f6";

  // Transform endpoint data to chart format (top 10)
  const chartData = (facilitiesData || [])
    .filter(
      (facility) =>
        facility &&
        facility.average_rating !== null &&
        facility.average_rating !== undefined,
    )
    .slice(0, 10)
    .map((facility) => ({
      name:
        facility.facility_name && facility.facility_name.length > 20
          ? facility.facility_name.substring(0, 20) + "..."
          : facility.facility_name || "Unknown",
      value: facility.average_rating
        ? parseFloat(facility.average_rating.toFixed(1))
        : 0,
      review_count: facility.review_count || 0,
      staff_count: facility.staff_count || 0,
      full_name: facility.facility_name || "Unknown",
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-96 items-center justify-center">
          <Spinner />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex h-96 items-center justify-center text-red-500">
          <p>Failed to load facilities analytics</p>
        </div>
      )}

      {/* Chart Container */}
      {!isLoading && !error && (
        <>
          {/* Height is fixed to ensure bars have room to breathe */}
          <div className="h-[400px] w-full font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 10,
                  left: -20, // Negative margin pulls the axis closer to the edge
                  bottom: 0,
                }}
                barSize={40} // Sets a fixed, modern width for bars
              >
                {/* Dashed Grid Lines (Horizontal only) */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />

                {/* X Axis - Facility Names */}
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
                  dy={10} // Push labels down slightly
                />

                {/* Y Axis - Numbers */}
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  domain={[0, 5]} // Rating scale 0-5
                  ticks={[0, 1, 2, 3, 4, 5]} // Rating ticks
                />

                {/* Tooltip for interactivity */}
                <Tooltip
                  cursor={{ fill: "#f3f4f6" }} // Highlight background on hover
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    padding: "8px 12px",
                  }}
                  formatter={(value, name) => {
                    if (
                      name === "value" &&
                      value !== null &&
                      value !== undefined &&
                      typeof value === "number"
                    ) {
                      return [
                        parseFloat(String(value)).toFixed(1),
                        "Avg Rating",
                      ];
                    }
                    return [value || 0, name];
                  }}
                />

                {/* The Bars */}
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]} // Rounded top corners
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColor} />
                  ))}

                  {/* The Numbers on Top of Bars */}
                  <LabelList
                    dataKey="value"
                    position="top"
                    fill="#374151"
                    fontSize={12}
                    fontWeight={600}
                    offset={10}
                    formatter={(value) =>
                      value !== null && value !== undefined
                        ? parseFloat(value).toFixed(1)
                        : "0"
                    }
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Footer Legend */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: barColor }}
            ></span>
            <span className="text-sm font-medium text-gray-500">
              Average Rating (out of 5)
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default TopPerformingFacilitiesChart;
