"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const AhoadaWestPieChart = ({
  title = "Ahoada West",
  data = [
    { name: "Orthopedists", value: 71, percentage: "29.46%", color: "#7180f6" }, // Periwinkle Blue
    {
      name: "Dermatologists",
      value: 49,
      percentage: "20.33%",
      color: "#58c789",
    }, // Green
    {
      name: "Gynecologists",
      value: 48,
      percentage: "19.92%",
      color: "#fbb053",
    }, // Orange
    { name: "Neurologists", value: 34, percentage: "14.11%", color: "#00d4ff" }, // Cyan
    {
      name: "Pediatricians",
      value: 26,
      percentage: "10.79%",
      color: "#a78bfa",
    }, // Purple
    { name: "Cardiologists", value: 13, percentage: "5.39%", color: "#3b82f6" }, // Darker Blue
  ],
}) => {
  // Custom Renderer for the labels with "Leader Lines"
  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, fill, payload, value } = props;

    // Geometry calculations to find the start and end points of the line
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);

    const sx = cx + (outerRadius + 5) * cos; // Start of line (near slice)
    const sy = cy + (outerRadius + 5) * sin;

    const mx = cx + (outerRadius + 30) * cos; // Middle "elbow" of line
    const my = cy + (outerRadius + 30) * sin;

    const ex = mx + (cos >= 0 ? 1 : -1) * 20; // End of line (near text)
    const ey = my;

    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        {/* The Connector Line */}
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
          strokeWidth={1}
        />

        {/* The Dot at the end */}
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />

        {/* Line 1: Specialist Name (Gray) */}
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 8}
          y={ey}
          dy={-6}
          textAnchor={textAnchor}
          fill="#4b5563" // Gray-600
          fontSize={12}
          fontWeight={500}
        >
          {payload.name}
        </text>

        {/* Line 2: Value & Percentage (Colored) */}
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 8}
          y={ey}
          dy={12}
          textAnchor={textAnchor}
          fill={fill} // Matches slice color
          fontSize={12}
          fontWeight={700}
        >
          {value}{" "}
          <tspan fill="#9ca3af" fontWeight={400} fontSize={11}>
            {payload.percentage}
          </tspan>
        </text>
      </g>
    );
  };

  return (
    <div className="w-full max-w-3xl rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
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
      <div className="h-96 w-full font-sans">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false} // Disable default lines, we draw our own
              label={renderCustomLabel} // Use our custom renderer
              outerRadius={110} // Size of the pie
              dataKey="value"
              stroke="none"
              paddingAngle={1} // Slight gap between slices for visual clarity
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <span
              className="mr-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-xs font-medium text-gray-500">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AhoadaWestPieChart;
