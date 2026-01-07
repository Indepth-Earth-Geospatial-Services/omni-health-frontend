"use client";

import { cn } from "@/lib/utils";

interface StepProgressBarProps {
  maxStep: number;
  currentStep: number;
  className?: string;
  activeColor?: string;
  inactiveColor?: string;
}

export function StepProgressBar({
  maxStep,
  currentStep,
  className = "",
  activeColor = "bg-[#51A199]",
  inactiveColor = "bg-[#E2E4E9]",
}: StepProgressBarProps) {
  const steps = Array.from({ length: maxStep }, (_, i) => i + 1);

  return (
    <div className={cn("w-full", className)}>
      {/* Step bars */}
      <div className="mb-2 flex items-center gap-1">
        {steps.map((step) => (
          <div
            key={step}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              step <= currentStep ? activeColor : inactiveColor,
            )}
          />
        ))}
      </div>

      {/* Step label */}
      <p className="text-[13px] text-[#868C98]">
        Step {currentStep} of {maxStep}
      </p>
    </div>
  );
}
