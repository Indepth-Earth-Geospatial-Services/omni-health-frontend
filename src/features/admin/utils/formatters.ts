/**
 * Format time string to 12-hour format
 * @param time - Time string in HH:mm format
 * @returns Formatted time string (e.g., "9:00am")
 */
export function formatTime(time: string): string {
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return time;

  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const period = hour >= 12 ? "pm" : "am";

  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;

  return `${hour}:${minute}${period}`;
}

/**
 * Format time range string to 12-hour format
 * @param range - Time range string (e.g., "09:00-17:00")
 * @returns Formatted time range string (e.g., "9:00am - 5:00pm")
 */
export function formatTimeRange(range: string): string {
  if (!range || range === "Closed") return range;

  const parts = range.split("-");
  if (parts.length !== 2) return range;

  const start = formatTime(parts[0].trim());
  const end = formatTime(parts[1].trim());

  return `${start} - ${end}`;
}

/**
 * Format date string to human-readable format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "15 Jan 2024, 14:30")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format specialist name from snake_case to Title Case
 * @param name - Snake case name (e.g., "medical_records_technician")
 * @returns Title case name (e.g., "Medical Records Technician")
 */
export function formatSpecialistName(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Clean and format service name
 * @param service - Service name possibly with quotes
 * @returns Cleaned title case name
 */
export function formatServiceName(service: string): string {
  return service
    .replace(/["""']/g, "")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Generate static map URL for Mapbox
 * @param lat - Latitude
 * @param lon - Longitude
 * @param token - Mapbox access token
 * @returns Static map URL or null if missing params
 */
export function getStaticMapUrl(
  lat: number | undefined,
  lon: number | undefined,
  token: string | undefined
): string | null {
  if (!lat || !lon || !token) return null;
  return `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/${lon},${lat},13,0/600x300@2x?access_token=${token}`;
}
