import React from "react";

// Reusable Cylinder Bar Component
// Handles the 3D aesthetic using pure CSS/Tailwind
const CylinderBar = ({ label, value, maxValue, colorClass, topColorClass }) => {
  // Calculate height percentage
  const heightPercentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="group relative flex w-12 flex-col items-center sm:w-16">
      {/* Tooltip / Value Label */}
      <span className="mb-2 text-sm font-medium text-gray-600 transition-transform group-hover:-translate-y-1">
        {value}
      </span>

      {/* The Bar Area */}
      <div className="relative flex h-64 w-full items-end">
        {/* Vertical Grid Line (Background helper for alignment) */}
        <div className="absolute inset-x-0 bottom-0 left-1/2 -z-10 h-full border-r border-dashed border-gray-200"></div>

        {/* The 3D Bar */}
        <div
          className="relative mx-auto w-10 transition-all duration-500 ease-out sm:w-12"
          style={{ height: `${heightPercentage}%` }}
        >
          {/* Main Body */}
          <div className={`h-full w-full ${colorClass} opacity-90`}></div>

          {/* Top Cap (The Oval) */}
          <div
            className={`absolute -top-2 h-4 w-full rounded-[100%] ${topColorClass}`}
          ></div>

          {/* Bottom Cap (The Oval - to round the base) */}
          <div
            className={`absolute -bottom-2 h-4 w-full rounded-[100%] ${colorClass}`}
          ></div>
        </div>
      </div>

      {/* X-Axis Label */}
      <span className="mt-4 text-sm font-medium text-gray-500">{label}</span>
    </div>
  );
};

const BedUtilizationChart = ({
  data = [
    { label: "Mon", value: 56 },
    { label: "Tues", value: 64 },
    { label: "Weds", value: 76 },
    { label: "Thurs", value: 78 },
    { label: "Fri", value: 70 },
    { label: "Sat", value: 37 },
    { label: "Sun", value: 45 },
  ],
  title = "Bed Utilization Rate By LGA",
}) => {
  const maxValue = 100; // Fixed max scale based on image
  const yAxisTicks = [0, 20, 40, 60, 80, 100];

  return (
    <div className="w-full max-w-4xl rounded-3xl border border-gray-100 bg-white p-6 font-sans shadow-sm">
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
      <div className="relative flex">
        {/* Y-Axis Labels & Grid */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between text-gray-400">
          {yAxisTicks.reverse().map((tick) => (
            <div key={tick} className="flex w-full items-center">
              <span className="w-8 pr-3 text-right text-sm">{tick}</span>
              <div className="h-[1px] flex-1 border-t border-dashed border-gray-200"></div>
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="z-10 flex w-full justify-between pt-3 pr-2 pb-1 pl-10">
          {data.map((item, index) => (
            <CylinderBar
              key={index}
              label={item.label}
              value={item.value}
              maxValue={maxValue}
              // Tailwind colors matching the image periwinkle blue
              colorClass="bg-[#8b9dfc]"
              topColorClass="bg-[#b5c0fd]"
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <span className="h-3 w-3 rounded-sm bg-[#8b9dfc]"></span>
        <span className="text-sm font-medium text-gray-600">
          Days of the Week
        </span>
      </div>
    </div>
  );
};

export default BedUtilizationChart;
