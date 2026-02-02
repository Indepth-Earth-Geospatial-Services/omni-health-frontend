"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";

interface AppointmentHeaderProps {
  onNewAppointment?: () => void;
  onTabChange?: (tab: string) => void;
}

const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  onNewAppointment,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState("new");

  const tabs = [
    { id: "new", label: "New", count: 3 },
    { id: "accepted", label: "Accepted", count: 1 },
    { id: "rescheduled", label: "Rescheduled", count: 1 },
    { id: "completed", label: "Completed", count: 1 },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="w-full bg-white">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        {/* Left side - Tabs */}
        <div className="flex w-full items-center gap-2 overflow-x-auto rounded-lg border-slate-200 bg-gray-100 px-2 py-2 md:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`rounded-sm px-6 py-1 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-slate-900"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Right side - New Appointment Button */}
        <Button
          onClick={onNewAppointment}
          variant="default"
          size="default"
          className="whitespace-nowrap"
        >
          <Plus size={18} />
          New Appointment
        </Button>
      </div>
    </div>
  );
};

export default AppointmentHeader;
