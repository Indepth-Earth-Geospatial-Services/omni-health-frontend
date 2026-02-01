"use client";

import { useMemo } from "react";
import {
  Activity,
  ChevronUp,
  TriangleAlert,
  MoreVertical,
  Info,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useNotifications } from "@/features/super-admin/hooks/useNotifications";
import type { Notification } from "@/features/super-admin/services/super-admin.service";

// Helper function to format time as relative
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Get icon and colors based on notification type
function getTypeStyles(type: Notification["type"]) {
  switch (type) {
    case "critical":
      return {
        icon: <TriangleAlert className="h-5 w-5 text-red-500" />,
        badgeClass:
          "border-red-200 bg-red-50 text-red-600",
        label: "Critical",
      };
    case "warning":
      return {
        icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
        badgeClass:
          "border-amber-200 bg-amber-50 text-amber-600",
        label: "Warning",
      };
    case "info":
    default:
      return {
        icon: <Info className="h-5 w-5 text-blue-500" />,
        badgeClass:
          "border-blue-200 bg-blue-50 text-blue-600",
        label: "Info",
      };
  }
}

const AlertsCard = () => {
  const user = useAuthStore((state) => state.user);
  const { data: notifications, isLoading, isError } = useNotifications(user?.user_id);

  // Get only unread or recent notifications (limit to 5)
  const displayedAlerts = useMemo(() => {
    if (!notifications) return [];
    return notifications.slice(0, 5);
  }, [notifications]);

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 font-sans shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-900 shadow-sm">
            <Activity className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">Alerts</h3>
            {notifications && notifications.length > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                {notifications.length}
              </span>
            )}
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <ChevronUp className="h-5 w-5" />
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-500">Loading alerts...</span>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <p className="text-sm text-red-600">Failed to load notifications</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && displayedAlerts.length === 0 && (
        <div className="py-8 text-center">
          <Activity className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">No alerts at this time</p>
        </div>
      )}

      {/* Alerts List */}
      {!isLoading && !isError && displayedAlerts.length > 0 && (
        <div className="flex flex-col gap-4">
          {displayedAlerts.map((alert) => {
            const typeStyles = getTypeStyles(alert.type);
            return (
              <div
                key={alert.id}
                className={`flex flex-col rounded-xl border border-gray-100 bg-white p-4 transition-colors hover:bg-gray-50 ${
                  !alert.is_read ? "border-l-4 border-l-blue-500" : ""
                }`}
              >
                {/* Top Row: Icon, Title, Badge, Menu */}
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Type Icon */}
                    <div className="shrink-0">{typeStyles.icon}</div>

                    {/* Title & Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-900">
                        {alert.title}
                      </h4>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${typeStyles.badgeClass}`}
                      >
                        {typeStyles.label}
                      </span>
                    </div>
                  </div>

                  {/* Kebab Menu */}
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                {/* Description */}
                <p className="mb-3 pl-8 text-sm leading-relaxed text-gray-500">
                  {alert.message}
                </p>

                {/* Timestamp */}
                <p className="pl-8 text-xs font-medium text-gray-400">
                  {formatRelativeTime(alert.created_at)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Button */}
      <button className="mt-6 w-full rounded-xl bg-gray-50 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100">
        View All Alerts
      </button>
    </div>
  );
};

export default AlertsCard;
