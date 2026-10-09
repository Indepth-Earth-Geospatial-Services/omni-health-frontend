"use client";
import React from "react";
import Link from "next/link";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  showViewDetails?: boolean;
  detailsHref?: string;
  /** First load: a shimmer in place of the value instead of a dash. */
  isLoading?: boolean;
  /** Refreshing: the current value stays, dimmed, with a small note. */
  isUpdating?: boolean;
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  showViewDetails = true,
  detailsHref,
  isLoading = false,
  isUpdating = false,
}: KPICardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-gray-300">
      {/* Trend and View Details bar — always present for consistent height */}
      <div className="flex min-h-[48px] items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
        {isUpdating ? (
          <span
            className="text-xs font-medium text-gray-400"
            aria-live="polite"
          >
            Updating…
          </span>
        ) : trend ? (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <span>{trend.value}</span>
          </div>
        ) : (
          <div />
        )}

        {showViewDetails && detailsHref ? (
          <Link
            href={detailsHref}
            className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            View details
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Icon and Value */}
      <div className="flex items-center gap-4 px-4 py-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 text-sm font-medium text-gray-600">{title}</div>
          {isLoading ? (
            <div
              aria-label="Loading"
              className="my-1 h-7 w-20 animate-pulse rounded-md bg-gray-200"
            />
          ) : (
            <div
              className={`text-3xl font-bold text-gray-900 transition-opacity ${
                isUpdating ? "opacity-50" : ""
              }`}
            >
              {value}
            </div>
          )}
          {subtitle &&
            (isLoading ? (
              <div className="mt-2 h-3.5 w-32 animate-pulse rounded bg-gray-100" />
            ) : (
              <div className="mt-1 text-sm text-gray-500">{subtitle}</div>
            ))}
        </div>
      </div>
    </div>
  );
}
