"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const FacilityDistributionChart = ({
  title = "Facility Distribution",
  data = [
    { name: "Healthcare Centres", value: 100, color: "#7180f6" }, // Periwinkle
    { name: "Hospitals", value: 62, color: "#58c789" }, // Mint
    { name: "MPHC", value: 50, color: "#fbb053" }, // Orange
    { name: "Health Posts", value: 28, color: "#00d4ff" }, // Cyan
  ],
}) => {
  // Custom Label Render Function
  // Renders the connector line and the two-line text (Name + Value)
  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, fill, payload, value } = props;

    // Calculate positioning for the label
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        {/* The Connector Line */}
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke="#d1d5db" // Gray-300
          fill="none"
        />
        {/* The Dot at the end of the line */}
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />

        {/* The Label Text */}
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
          dominantBaseline="central"
        >
          {/* Top Line: Name */}
          <tspan
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            dy="-0.4em"
            fill="#6b7280"
            fontSize="12"
            fontWeight="500"
          >
            {payload.name}
          </tspan>
          {/* Bottom Line: Value (Colored) */}
          <tspan
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            dy="1.2em"
            fill={fill}
            fontSize="14"
            fontWeight="bold"
          >
            {value}
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
      <div className="h-80 w-full font-sans">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Define a drop shadow filter to give it a "pop" / depth */}
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur
                  in="SourceAlpha"
                  stdDeviation="3"
                  result="blur"
                />
                <feOffset in="blur" dx="2" dy="4" result="offsetBlur" />
                <feFlood
                  floodColor="rgba(0,0,0,0.15)"
                  floodOpacity="1"
                  result="colorBlur"
                />
                <feComposite
                  in="colorBlur"
                  in2="offsetBlur"
                  operator="in"
                  result="shadow"
                />
                <feMerge>
                  <feMergeNode in="shadow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false} // We draw our own custom line in renderCustomLabel
              label={renderCustomLabel}
              outerRadius={100}
              dataKey="value"
              filter="url(#shadow)" // Apply the shadow filter
              stroke="none" // Remove default white border for cleaner look
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            {/* Optional: Standard Tooltip */}
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

      {/* Custom Legend (Bottom) */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <span
              className="mr-2 h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-sm font-medium text-gray-600">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacilityDistributionChart;
