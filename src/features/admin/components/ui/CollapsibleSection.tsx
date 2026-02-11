"use client";

import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
}

export function CollapsibleSection({
  title,
  description,
  icon,
  isOpen,
  onToggle,
  children,
  className = "",
  maxHeight,
}: CollapsibleSectionProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border-2 border-slate-200 bg-white ${className}`}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
            {icon}
          </div>
          <div className="text-left">
            <h3 className="font-geist text-[18px] font-medium text-black">
              {title}
            </h3>
            <p className="font-geist text-sm font-normal text-[#868C98]">
              {description}
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp size={20} className="text-slate-400" />
        ) : (
          <ChevronDown size={20} className="text-slate-400" />
        )}
      </button>

      {isOpen && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

// Loading skeleton component
export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
}
