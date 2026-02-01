"use client";

import React from "react";

interface KPICardProps {
  title?: string;
  value?: string | number;
  className?: string;
}

const TotalBedsCard: React.FC<KPICardProps> = ({
  title = "Total Beds",
  value = "28,922",
  className = "",
}) => {
  return (
    <div
      className={`flex w-full max-w-xs flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ${className}`}
    >
      <h3 className="mb-2 text-base font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default TotalBedsCard;
