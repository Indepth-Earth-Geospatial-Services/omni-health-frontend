import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cookie name for auth token
const AUTH_COOKIE_NAME = "omni_health_token";
const AUTH_DATA_COOKIE_NAME = "omni_health_auth_data";

// Route protection configuration
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

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/verify-email",
  "/",
  "/user",
];

/**
 * Decode JWT token to extract payload (without verification)
 * Note: This only decodes, it doesn't verify the signature
 * The backend should verify the token on API calls
 */
function decodeJWT(token: string): { role?: string; exp?: number } | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 */
function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;

  // Check if token expires in the next 5 seconds
  return Date.now() >= payload.exp * 1000 - 5000;
}

/**
 * Get user role from auth data cookie
 */
function getUserRole(request: NextRequest): string | null {
  const authDataCookie = request.cookies.get(AUTH_DATA_COOKIE_NAME);
  if (!authDataCookie?.value) return null;

  try {
    const authData = JSON.parse(authDataCookie.value);
    return authData.role || null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // Static files
  ) {
    return NextResponse.next();
  }

  // Get auth token from cookie
  const tokenCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const token = tokenCookie?.value;

  // Check if user is authenticated
  const isAuthenticated = token && !isTokenExpired(token);

  // Get user role
  const userRole = getUserRole(request);

  // Check if current path is a public route
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If not authenticated and trying to access protected route
  if (!isAuthenticated) {
    // Allow access to public routes
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Redirect to login for protected routes
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated - check role-based access

  // Check admin routes
  if (pathname.startsWith(PROTECTED_ROUTES.admin.path)) {
    if (!PROTECTED_ROUTES.admin.allowedRoles.includes(userRole || "")) {
      // User doesn't have admin access - redirect based on their role
      if (userRole === "user") {
        return NextResponse.redirect(new URL("/user", request.url));
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Check super-admin routes
  if (pathname.startsWith(PROTECTED_ROUTES.superAdmin.path)) {
    if (!PROTECTED_ROUTES.superAdmin.allowedRoles.includes(userRole || "")) {
      // User doesn't have super-admin access - redirect based on their role
      if (userRole === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      if (userRole === "user") {
        return NextResponse.redirect(new URL("/user", request.url));
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If authenticated user tries to access login/register, redirect to their dashboard
  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    if (userRole === "super_admin") {
      return NextResponse.redirect(new URL("/super-admin/staff", request.url));
    }
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/user", request.url));
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
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
