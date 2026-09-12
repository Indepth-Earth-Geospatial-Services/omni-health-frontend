"use client";

import React from "react";

export interface TabItem {
  label: string;
  value: string;
}

export type TabsSize = "sm" | "md" | "lg" | "xl";

/** Preset widths for the tab group. "full" (the default) stretches to fill
 *  the parent — the original behavior — everything else fixes it to a size
 *  that reads better with just a couple of short labels. */
const WIDTH_CLASS: Record<TabsSize | "full", string> = {
  sm: "w-64", // 256px
  md: "w-80", // 320px
  lg: "w-96", // 384px
  xl: "w-[30rem]", // 480px
  full: "w-full",
};

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
  /** Fixes the tab group to a preset width instead of stretching to fill its
   *  parent. Omit to keep the original full-width behavior. */
  size?: TabsSize;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  size,
}) => {
  const widthClass = WIDTH_CLASS[size ?? "full"];

  return (
    <div className={`flex items-center py-2 ${className}`}>
      <div className={`flex items-center gap-2 rounded-lg bg-[#F6F8FA] p-2 ${widthClass}`}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            // flex-1 divides the container's width evenly across tabs;
            // items-center + justify-center keeps the label centered both
            // ways inside that share, regardless of which size is picked.
            className={`flex flex-1 items-center justify-center rounded-lg px-6 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${
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
