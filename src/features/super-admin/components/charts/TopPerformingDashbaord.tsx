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
} from "recharts";
import { useFacilitiesAnalytics } from "../../hooks/useFacilitiesAnalytics";
import { Spinner } from "@/components/ui/spinner";

interface ChartDataPoint {
  facility_name: string;
  average_rating: number;
  review_count: number;
  staff_count: number;
}

export const TopPerformingFacilitiesChart = () => {
  const { data, isLoading, error } = useFacilitiesAnalytics();

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
        <p>Failed to load facilities analytics</p>
      </div>
    );
  }

  // Get top 10 facilities sorted by rating (data should already be sorted by backend)
  const chartData: ChartDataPoint[] = (data || [])
    .slice(0, 10)
    .map((facility) => ({
      facility_name:
        facility.facility_name.length > 15
          ? facility.facility_name.substring(0, 15) + "..."
          : facility.facility_name,
      average_rating: parseFloat(facility.average_rating.toFixed(1)),
      review_count: facility.review_count,
      staff_count: facility.staff_count,
    }));

  return (
    <div className="h-96 w-full rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Top 10 Performing Facilities by Rating
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="facility_name"
            angle={-45}
            textAnchor="end"
            height={120}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{
              value: "Rating & Count",
              angle: -90,
              position: "insideLeft",
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "0.375rem",
            }}
            formatter={(value) => {
              if (typeof value === "number") {
                return value.toFixed(1);
              }
              return value;
            }}
            labelFormatter={(label) => `Facility: ${label}`}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            height={40}
            formatter={(value) => {
              if (value === "average_rating") return "Avg Rating (out of 5)";
              if (value === "review_count") return "Review Count";
              if (value === "staff_count") return "Staff Count";
              return value;
            }}
          />
          <Bar dataKey="average_rating" fill="#3b82f6" name="average_rating" />
          <Bar dataKey="review_count" fill="#10b981" name="review_count" />
          <Bar dataKey="staff_count" fill="#f59e0b" name="staff_count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
