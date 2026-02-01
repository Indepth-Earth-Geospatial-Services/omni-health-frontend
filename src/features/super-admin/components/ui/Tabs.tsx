"use client";

import React from "react";

export interface TabItem {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  return (
    // Removed fixed w-116 and max-w-200.
    // Uses w-fit to wrap content size, or you can use w-full to fill parent.
    <div className={`flex w-fit items-center py-2 ${className}`}>
      {/* - Removed fixed width (w-4xl).
         - Added 'flex-wrap' for safety on very small screens (optional).
         - 'bg-[#F6F8FA]' wraps all buttons.
      */}
      <div className="flex w-full items-center gap-2 rounded-lg bg-[#F6F8FA] p-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            // Changed px-12 to px-4 or px-6 for better spacing on variable widths
            // Added whitespace-nowrap to prevent label breaking
            className={`flex-1 rounded-lg px-6 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.value
                ? "bg-[#E2E4E9] text-gray-900 shadow-sm"
                : "bg-transparent text-[#868C98] hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
