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

const FacilityGeographicDistributionChart = ({
  title = "Facility Geographic Distribution",
  data = [
    { name: "Abua/Odual", value: 76 },
    { name: "Ahoada East", value: 56 }, // Special Teal Color
    { name: "Ahoada West", value: 76 },
    { name: "Akuku-Toru", value: 37 },
    { name: "Andoni", value: 56 },
    { name: "Asari-Toru", value: 56 },
    { name: "Bonny", value: 78 },
    { name: "Degema", value: 56 },
    { name: "Eleme", value: 37 },
    { name: "Emouha", value: 64 },
    { name: "Etche", value: 76 },
    { name: "Gokana", value: 37 },
    { name: "Ikwerre", value: 37 },
  ],
}) => {
  // Define colors based on the image
  const defaultColor = "#8b9dfc"; // Periwinkle Blue
  const highlightColor = "#63b3a4"; // Teal/Green for Ahoada East
  const trackColor = "#eef2ff"; // Very light blue for the background track

  // Custom Y-Axis Tick to handle conditional coloring
  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const isHighlight = payload.value === "Ahoada East";

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={-10} // Offset from the axis line
          y={0}
          dy={4} // Vertically center
          textAnchor="end"
          fill={isHighlight ? highlightColor : "#374151"} // Conditional Color
          fontSize={13}
          fontWeight={500}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full max-w-4xl rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
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
      {/* Dynamic height prevents squashing if you add more rows */}
      <div
        className="w-full font-sans"
        style={{ height: `${Math.max(600, data.length * 50)}px` }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
            barSize={24} // Thickness of the bars
          >
            {/* Grid Lines - Vertical Only */}
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
              stroke="#e5e7eb"
            />

            {/* X Axis - Top Orientation */}
            <XAxis
              type="number"
              orientation="top"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
            />

            {/* Y Axis - Custom Tick Component */}
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={<CustomYAxisTick />} // Use our custom renderer
              width={100}
            />

            <Tooltip
              cursor={{ fill: "transparent" }} // Disable default gray hover bar
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />

            {/* The Bar with Background Track */}
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]} // Rounded right edges
              background={{ fill: trackColor, radius: 4 }} // The light gray/blue full-width track
            >
              {/* Conditional Coloring for Bars */}
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.name === "Ahoada East" ? highlightColor : defaultColor
                  }
                />
              ))}

              {/* Value Label (e.g. 76) positioned right of the bar */}
              <LabelList
                dataKey="value"
                position="right"
                fill="#4b5563"
                fontSize={13}
                fontWeight={500}
                offset={10}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Legend */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <span
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: defaultColor }}
        ></span>
        <span className="text-sm font-medium text-gray-500">2023</span>
      </div>
    </div>
  );
};

export default FacilityGeographicDistributionChart;
