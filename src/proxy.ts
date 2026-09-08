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
  // Invitees have no account yet — the token in the link is their credential.
  "/accept-invite",
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
 * Tokens minted by the invite-accept endpoint carry the Python enum's repr as
 * the role claim — "UserRole.admin" instead of "admin". That value matches no
 * known role, so an invited admin gets refused at /admin and bounced to the
 * plain-user dashboard. Strip the prefix so either form resolves correctly.
 *
 * Remove once the backend serialises `role.value` in every token.
 */
function normalizeRole(role: string | null | undefined): string | null {
  if (!role) return null;
  const prefix = "UserRole.";
  return role.startsWith(prefix) ? role.slice(prefix.length) : role;
}

/**
 * Resolve the user's role.
 * Primary: decode from the JWT (backend may or may not include a `role` claim).
 * Fallback: read from AUTH_DATA_COOKIE_NAME that login() writes, because
 * the backend returns role in the API response body — not always in the JWT.
 */
function getUserRole(request: NextRequest, token: string): string | null {
  // 1. Try JWT first
  const jwtRole = normalizeRole(decodeJWT(token)?.role as string | undefined);
  if (jwtRole) return jwtRole;

  // 2. Fall back to the role cookie written by auth-store login()
  const raw = request.cookies.get(AUTH_DATA_COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    const data = JSON.parse(decodeURIComponent(raw));
    return normalizeRole(data?.role as string | undefined);
  } catch {
    return null;
  }
}

/**
 * Drop both auth cookies so a stale/expired token never causes an infinite
 * redirect loop on subsequent requests.
 */
function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.set(AUTH_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  response.cookies.set(AUTH_DATA_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return response;
}

function redirectAndClearCookies(destination: URL): NextResponse {
  return clearAuthCookies(NextResponse.redirect(destination));
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

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Token present but expired → the stale cookies go either way, but a public
  // page still has to render. Access tokens last 15 minutes, so anyone who
  // signed in earlier in this browser carries an expired one; bouncing them to
  // login here would break invite links and every other public page.
  if (token && isTokenExpired(token)) {
    if (isPublicRoute) return clearAuthCookies(NextResponse.next());
    return redirectAndClearCookies(new URL("/login", request.url));
  }

  const isAuthenticated = !!token;
  const userRole = token ? getUserRole(request, token) : null;

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
