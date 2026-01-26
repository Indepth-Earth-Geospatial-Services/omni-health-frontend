import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Generic error handler
export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    // ✅ ENHANCED: Handle multiple error formats from backend
    let message = "An error occurred";

    if (error.response?.data) {
      const data = error.response.data;

      // Format 1: { detail: "Error message" } - Most common
      if (typeof data.detail === "string") {
        message = data.detail;
      }
      // Format 2: { detail: [{ msg: "Error", loc: [...], type: "..." }] } - Validation errors
      else if (Array.isArray(data.detail) && data.detail.length > 0) {
        const firstError = data.detail[0];
        message = firstError.msg || firstError.message || message;
      }
      // Format 3: { message: "Error message" }
      else if (data.message) {
        message = data.message;
      }
      // Format 4: Direct string
      else if (typeof data === "string") {
        message = data;
      }
      // Fallback to axios error message
      else if (error.message) {
        message = error.message;
      }
    } else if (error.message) {
      message = error.message;
    }

    console.warn("ERROR MESSAGE", message);
    const statusCode = error.response?.status;
    const code = error.response?.data?.code;

    return new ApiError(message, statusCode, code);
  }

  if (error instanceof ApiError) {
    return error;
  }

  return new ApiError("An unexpected error occurred");
}

export const formatRating = (rating: number | undefined): string => {
  if (rating === undefined || rating === null) return "N/A";
  return rating.toFixed(1);
};

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "Recently";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Recently";
  }
};

export const getToday = (): string => {
  return new Date().toLocaleString("en-us", { weekday: "long" }).toLowerCase();
};

export const isEmptyValue = (value: unknown): boolean => {
  if (value === undefined || value === null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  return false;
};

export const getWorkingHoursForDisplay = (
  workingHours: Record<string, string> = {},
): string => {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  for (const day of days) {
    if (workingHours[day] && workingHours[day] !== "Closed") {
      return workingHours[day];
    }
  }
  return "N/A";
};

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(
  userLat: number,
  userLon: number,
  facilityLat: number,
  facilityLon: number,
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (userLat * Math.PI) / 180;
  const φ2 = (facilityLat * Math.PI) / 180;
  const Δφ = ((facilityLat - userLat) * Math.PI) / 180;
  const Δλ = ((facilityLon - userLon) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Format distance for display
 */
export function formatDistance(distanceInMeters: number): string {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)}m`;
  }
  return `${(distanceInMeters / 1000).toFixed(1)}km`;
}
