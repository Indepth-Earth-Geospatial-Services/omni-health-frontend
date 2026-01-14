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
    const message =
      error.response?.data?.message || error.message || "An error occurred";
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

export const isEmptyValue = (value: any): boolean => {
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
