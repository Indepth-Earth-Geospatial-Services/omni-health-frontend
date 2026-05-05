import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJWT, isTokenExpired } from "@/lib/token";
import {
  AUTH_COOKIE_NAME,
  AUTH_DATA_COOKIE_NAME,
  getRoleDashboard,
} from "@/lib/auth-constants";

const PROTECTED_ROUTES = {
  admin: {
    path: "/admin",
    allowedRoles: ["admin", "super_admin"],
  },
  superAdmin: {
    path: "/super-admin",
    allowedRoles: ["super_admin"],
  },
};

// Public pages — accessible without authentication
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/verify-email",
  "/",
  "/user",
  "/help",
  "/facilities",
  "/compare-facilities",
  "/explore-facilities",
];

/**
 * Resolve the user's role.
 * Primary: decode from the JWT (backend may or may not include a `role` claim).
 * Fallback: read from AUTH_DATA_COOKIE_NAME that login() writes, because
 * the backend returns role in the API response body — not always in the JWT.
 */
function getUserRole(request: NextRequest, token: string): string | null {
  // 1. Try JWT first
  const jwtRole = (decodeJWT(token)?.role as string) ?? null;
  if (jwtRole) return jwtRole;

  // 2. Fall back to the role cookie written by auth-store login()
  const raw = request.cookies.get(AUTH_DATA_COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    const data = JSON.parse(decodeURIComponent(raw));
    return (data?.role as string) ?? null;
  } catch {
    return null;
  }
}

/**
 * Redirect and clear both auth cookies so a stale/expired token never
 * causes an infinite redirect loop on subsequent requests.
 */
function redirectAndClearCookies(destination: URL): NextResponse {
  const response = NextResponse.redirect(destination);
  response.cookies.set(AUTH_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  response.cookies.set(AUTH_DATA_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and internal Next.js paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // Token present but expired → clear cookies and redirect to login
  if (token && isTokenExpired(token)) {
    return redirectAndClearCookies(new URL("/login", request.url));
  }

  const isAuthenticated = !!token;
  const userRole = token ? getUserRole(request, token) : null;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Unauthenticated → allow public routes, redirect protected routes to login
  if (!isAuthenticated) {
    if (isPublicRoute) return NextResponse.next();
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Authenticated — enforce role-based access ─────────────────────────────

  // /admin requires admin or super_admin
  if (pathname.startsWith(PROTECTED_ROUTES.admin.path)) {
    if (!PROTECTED_ROUTES.admin.allowedRoles.includes(userRole ?? "")) {
      return NextResponse.redirect(
        new URL(getRoleDashboard(userRole ?? undefined), request.url),
      );
    }
  }

  // /super-admin requires super_admin only
  if (pathname.startsWith(PROTECTED_ROUTES.superAdmin.path)) {
    if (!PROTECTED_ROUTES.superAdmin.allowedRoles.includes(userRole ?? "")) {
      return NextResponse.redirect(
        new URL(getRoleDashboard(userRole ?? undefined), request.url),
      );
    }
  }

  // Authenticated user on /login or /register → redirect to their dashboard
  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.redirect(
      new URL(getRoleDashboard(userRole ?? undefined), request.url),
    );
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
