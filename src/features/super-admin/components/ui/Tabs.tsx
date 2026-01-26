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
    <div className={`flex w-2xl max-w-full items-center py-2 ${className}`}>
      <div className="flex w-4xl gap-2 rounded-lg bg-[#F6F8FA] p-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`rounded-lg px-12 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.value
                ? "bg-[#E2E4E9] text-gray-900"
                : "hover:bg-gray-150 bg-transparent text-[#868C98]"
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
