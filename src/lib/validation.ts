/**
 * Input sanitization utilities for healthcare application
 * Prevents XSS and injection attacks
 */

const DANGEROUS_PATTERNS = [
  /<script[^>]*>[\s\S]*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
];

export function sanitizeInput(input: string): string {
  let sanitized = input.trim();

  // Remove dangerous patterns
  DANGEROUS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Encode HTML entities
  return sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function validateLocation(location: string): boolean {
  if (!location || location.length < 2) return false;
  if (location.length > 100) return false;

  // Allow alphanumeric, spaces, commas, periods only
  return /^[a-zA-Z0-9\s,.-]+$/.test(location);
}
