/**
 * JWT token utilities — edge-runtime safe (uses only atob + JSON.parse).
 * This is the single source of truth for token decoding and expiry checks.
 * Import from here instead of duplicating logic in auth-store, client, or proxy.
 */

export interface JWTPayload {
  role?: string;
  exp?: number;
  sub?: string;
  [key: string]: unknown;
}

/**
 * Decode a JWT token payload without verifying the signature.
 * Signature verification is the backend's responsibility.
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64)) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Returns true if the token is expired or cannot be decoded.
 * Uses a 5-second buffer so we treat near-expired tokens as expired
 * and avoid sending a request that will 401 immediately.
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000 - 5000;
}
