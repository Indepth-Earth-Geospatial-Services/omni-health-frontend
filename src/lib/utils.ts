import { Facility } from "@/types";
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

export const formatDate = (dateString: string | Date | undefined): string => {
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

//eslint-disable-next-line @typescript-eslint/no-explicit-any
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

/**
 * Generates initials from a given name string.
 * E.g., "Lagos University Teaching Hospital" -> "LUTH"
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

/**
 * Factory function to normalize Facility data.
 * Ensures all nested objects and arrays are initialized to prevent runtime errors.
 */
export const getFacilityDefaults = (facility?: Partial<Facility>): Facility => {
  return {
    facility_id: facility?.facility_id ?? "",
    hfr_id: facility?.hfr_id ?? "",
    facility_name: facility?.facility_name ?? "Unknown Facility",
    facility_category: facility?.facility_category ?? "Healthcare Facility",
    facility_lga: facility?.facility_lga ?? "",
    town: facility?.town ?? "",
    address: facility?.address ?? "No address provided",

    // Metrics
    avg_daily_patients: facility?.avg_daily_patients ?? 0,
    doctor_patient_ratio: facility?.doctor_patient_ratio ?? 0,
    average_rating: facility?.average_rating ?? 0,
    total_reviews: facility?.total_reviews ?? 0,

    // Arrays
    services_list: facility?.services_list ?? [],
    specialists: facility?.specialists ?? [],
    image_urls: facility?.image_urls ?? [],

    // Complex Objects
    inventory: {
      equipment: {
        refrigerators: facility?.inventory?.equipment?.refrigerators ?? 0,
        sphygmomanometers:
          facility?.inventory?.equipment?.sphygmomanometers ?? 0,
        stethoscopes: facility?.inventory?.equipment?.stethoscopes ?? 0,
      },
      infrastructure: {
        baby_cots: facility?.inventory?.infrastructure?.baby_cots ?? 0,
        delivery_beds: facility?.inventory?.infrastructure?.delivery_beds ?? 0,
        inpatient_beds:
          facility?.inventory?.infrastructure?.inpatient_beds ?? 0,
        resuscitation_beds:
          facility?.inventory?.infrastructure?.resuscitation_beds ?? 0,
      },
    },

    contact_info: {
      email: facility?.contact_info?.email ?? "N/A",
      phone: facility?.contact_info?.phone ?? "N/A",
    },

    working_hours: {
      monday: facility?.working_hours?.monday ?? "Closed",
      tuesday: facility?.working_hours?.tuesday ?? "Closed",
      wednesday: facility?.working_hours?.wednesday ?? "Closed",
      thursday: facility?.working_hours?.thursday ?? "Closed",
      friday: facility?.working_hours?.friday ?? "Closed",
      saturday: facility?.working_hours?.saturday ?? "Closed",
      sunday: facility?.working_hours?.sunday ?? "Closed",
      emergency: facility?.working_hours?.emergency ?? "Not Available",
    },

    // Metadata & Location
    last_updated: facility?.last_updated
      ? new Date(facility.last_updated)
      : new Date(),
    lat: facility?.lat ?? 0,
    lon: facility?.lon ?? 0,
    road_distance_meters: facility?.road_distance_meters ?? 0,
    travel_time_minutes: facility?.travel_time_minutes ?? 0,
    route_geometry: {
      coordinates: facility?.route_geometry?.coordinates ?? [],
    },
  };
};
