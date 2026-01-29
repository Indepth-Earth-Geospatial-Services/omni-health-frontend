"use client";

import { ComparisonResult } from "../hooks/useFacilityComparison";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface ComparisonRowProps {
  result: ComparisonResult;
  isLoading: boolean;
  error: boolean;
}

export function ComparisonRow({ result, isLoading, error }: ComparisonRowProps) {
  const { key, label, valueA, valueB, winner } = result;

  const displayValue = (value: any) => {
    if (Array.isArray(value)) {
      return `${value.length} items`;
    }
    return value;
  };

  const isLocationDependent = key === "travel_time" || key === "distance";

  if (isLocationDependent) {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-1 py-3 text-center text-xs text-[#868C98]">
          <HelpCircle className="h-4 w-4" />
          Enable location for insights
        </div>
      );
    }
    if (isLoading) {
      return (
        <div className="flex justify-center py-3">
          <Spinner />
        </div>
      );
    }
  }

  return (
    <div className="flex items-center justify-between py-3">
      <div
        className={cn(
          "w-1/3 text-left font-semibold text-[#343434]",
          winner === "A" && "text-primary",
        )}
      >
        {displayValue(valueA)}
      </div>
      <div className="w-1/3 text-center text-sm text-[#868C98]">{label}</div>
      <div
        className={cn(
          "w-1/3 text-right font-semibold text-[#343434]",
          winner === "B" && "text-primary",
        )}
      >
        {displayValue(valueB)}
      </div>
    </div>
  );
}
