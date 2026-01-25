/**
 * Format date using native Intl API
 */
export function formatDate(
  dateString: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    return new Intl.DateTimeFormat("en-GB", options || defaultOptions).format(date);
  } catch {
    return "N/A";
  }
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeDate(dateString: string | Date): string {
  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (diffInSeconds < 60) return rtf.format(-diffInSeconds, "second");
    if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
    if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
    if (diffInSeconds < 604800) return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
    if (diffInSeconds < 2592000) return rtf.format(-Math.floor(diffInSeconds / 604800), "week");
    if (diffInSeconds < 31536000) return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
    
    return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
  } catch {
    return "N/A";
  }
}