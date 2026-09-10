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
        className="flex w-full items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-slate-50 sm:px-6"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 sm:h-12 sm:w-12">
            {icon}
          </div>
          <div className="min-w-0 text-left">
            <h3 className="font-geist truncate text-[16px] font-medium text-black sm:text-[18px]">
              {title}
            </h3>
            <p className="font-geist truncate text-xs font-normal text-[#868C98] sm:text-sm">
              {description}
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp size={20} className="shrink-0 text-slate-400" />
        ) : (
          <ChevronDown size={20} className="shrink-0 text-slate-400" />
        )}
      </button>

      {isOpen && <div className="px-4 pb-6 sm:px-6">{children}</div>}
    </div>
  );
}

// Loading skeleton component
export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
}
