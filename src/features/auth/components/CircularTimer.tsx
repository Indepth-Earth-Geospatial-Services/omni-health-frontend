"use client";

import { motion } from "framer-motion";

interface CircularTimerProps {
  countdown: number;
  total: number;
}

export function CircularTimer({ countdown, total }: CircularTimerProps) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = (countdown / total) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="h-12 w-12 -rotate-90 transform">
        {/* Background circle */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <motion.circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          className="text-primary"
          initial={{ strokeDasharray: circumference, strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 0.5, ease: "linear" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <span className="absolute text-xs font-semibold text-gray-700">
        {countdown}s
      </span>
    </div>
  );
}
