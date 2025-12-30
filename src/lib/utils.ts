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
