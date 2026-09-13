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
  /** Extra controls (e.g. an Edit/Save button) rendered in the header, next
   *  to the chevron — outside the toggle click target so they don't also
   *  open/close the section. */
  headerAction?: React.ReactNode;
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
  headerAction,
}: CollapsibleSectionProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border-2 border-slate-200 bg-white ${className}`}
      style={maxHeight ? { maxHeight } : undefined}
    >
      {/* A plain div (not a button) so headerAction can hold real buttons of
          its own without nesting <button> inside <button>. */}
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-slate-50 sm:px-6"
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
        <div className="flex shrink-0 items-center gap-2">
          {headerAction}
          {isOpen ? (
            <ChevronUp size={20} className="shrink-0 text-slate-400" />
          ) : (
            <ChevronDown size={20} className="shrink-0 text-slate-400" />
          )}
        </div>
      </div>

      {isOpen && <div className="px-4 pb-6 sm:px-6">{children}</div>}
    </div>
  );
}

// Loading skeleton component
export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
}
