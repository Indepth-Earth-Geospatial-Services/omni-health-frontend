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

const FacilityInventoryChart = ({
  title = "Facility & Inventory Distribution",
  data = [
    { name: "Abua/Odual", facilities: 29, specialists: 45, beds: 59 },
    { name: "Ahoada East", facilities: 28, specialists: 89, beds: 70 },
    { name: "Ahoada West", facilities: 28, specialists: 89, beds: 70 },
    { name: "Akuku-Toru", facilities: 28, specialists: 89, beds: 70 },
    { name: "Andoni", facilities: 28, specialists: 89, beds: 70 },
    { name: "Asari-Toru", facilities: 28, specialists: 89, beds: 70 },
    { name: "Bonny", facilities: 28, specialists: 89, beds: 70 },
    { name: "Degema", facilities: 28, specialists: 89, beds: 70 },
    { name: "Eleme", facilities: 28, specialists: 89, beds: 70 },
    { name: "Emouha", facilities: 9, specialists: 85, beds: 84 },
    { name: "Etche", facilities: 11, specialists: 18, beds: 88 },
    { name: "Gokana", facilities: 46, specialists: 43, beds: 67 },
  ],
}) => {
  return (
    <div className="w-full max-w-5xl rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header Section */}
      <div className="relative mb-6 flex items-end justify-between">
        <div className="relative z-10 w-full">
          <h2 className="mb-1 text-xl font-bold text-gray-900">{title}</h2>
          <div className="flex items-center">
            <div className="h-1 w-12 rounded-full bg-cyan-400"></div>
            <div className="-ml-0.5 h-px w-full bg-gray-200"></div>
          </div>
        </div>
        <button className="text-xs font-semibold tracking-wide text-gray-400 uppercase hover:text-gray-600">
          More
        </button>
      </div>

      {/* Chart Container */}
      {/* We set a dynamic minimum height to accommodate many rows without squashing */}
      <div
        className="w-full font-sans"
        style={{ height: `${Math.max(600, data.length * 60)}px` }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
