"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/client";

interface DownloadOptions {
  endpoint: string;
  params?: Record<string, string | string[]>;
  filename: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseFileDownloadReturn {
  isDownloading: boolean;
  download: (options: DownloadOptions) => Promise<void>;
  error: string | null;
}

/**
 * Hook to handle file downloads from API
 * @returns Object with download state and function
 */
export function useFileDownload(): UseFileDownloadReturn {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = useCallback(async (options: DownloadOptions) => {
    const { endpoint, params, filename, onSuccess, onError } = options;
    setIsDownloading(true);
    setError(null);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v));
          } else {
            queryParams.append(key, value);
          }
        });
      }

      const url = queryParams.toString()
        ? `${endpoint}?${queryParams.toString()}`
        : endpoint;

      const response = await apiClient.get(url, {
        responseType: "blob",
      });

      // Create download link
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      onSuccess?.();
    } catch (err: any) {
      let errorMessage = "Failed to download file. Please try again.";

      if (err.response?.status === 422) {
        errorMessage = "Invalid parameters. Please check your selection.";
      } else if (err.response?.status === 404) {
        errorMessage = "No records found matching your criteria.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.message?.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);
      onError?.(new Error(errorMessage));
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return {
    isDownloading,
    download,
    error,
  };
}
