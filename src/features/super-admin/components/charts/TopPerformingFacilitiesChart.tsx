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

const TopPerformingFacilitiesChart = ({
  title = "Top 10 Performing Facilities by Rating",
  data = [
    { name: "Choba", value: 36 },
    { name: "Mgbouba", value: 11 },
    { name: "Eleme", value: 57 },
    { name: "Rebisi", value: 10 },
    { name: "Agip", value: 30 },
    { name: "Rumueme", value: 91 },
    { name: "Rukpokwu", value: 15 },
    { name: "Maya", value: 93 },
    { name: "Premiere", value: 45 },
    { name: "Final Cut", value: 79 },
  ],
}) => {
  // Custom Bar color matching your theme (Periwinkle Blue)
  const barColor = "#8b9dfc";
  const hoverColor = "#7180f6";

  return (
    <div className="w-full max-w-5xl rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header Section */}
      <div className="relative mb-8 flex items-end justify-between">
        <div className="relative z-10">
          <h2 className="mb-1 text-xl font-bold text-gray-900">{title}</h2>
          {/* Decorative Underline */}
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
      {/* Height is fixed to ensure bars have room to breathe */}
      <div className="h-[400px] w-full font-sans">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
              domain={[0, 100]} // Force 0-100 scale
              ticks={[0, 20, 40, 60, 80, 100]} // Exact ticks from image
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
            />

            {/* The Bars */}
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]} // Rounded top corners
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={barColor}
                  // Optional: Different color for highest value?
                  // fill={entry.value > 90 ? '#58c789' : barColor}
                />
              ))}

              {/* The Numbers on Top of Bars */}
              <LabelList
                dataKey="value"
                position="top"
                fill="#374151"
                fontSize={12}
                fontWeight={600}
                offset={10}
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
        <span className="text-sm font-medium text-gray-500">2021</span>
      </div>
    </div>
  );
};

export default TopPerformingFacilitiesChart;
