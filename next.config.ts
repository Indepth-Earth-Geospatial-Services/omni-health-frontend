import type { NextConfig } from "next";

// Read from env so the backend URL is never hardcoded — change BACKEND_URL in
// .env to point to a different deployment without touching this file.
// const BACKEND_URL =
//   process.env.BACKEND_URL ??
//   "https://geohealth-backend-85732036737.africa-south1.run.app";

// Stripped of any trailing slash: if the deployed environment's BACKEND_URL
// ever has one (e.g. copy-pasted from a browser address bar into a hosting
// platform's env var config), every destination below would end up with a
// double slash — "https://host//api/v1/facilities" — which routes
// unpredictably (often surfacing as a 405, since it can still match *some*
// handler, just not the one that supports the request's method). This only
// changes behavior when a trailing slash was actually present.
const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/+$/, "");

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL must be defined");
}

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Without this, Next.js redirects away a request's trailing slash before
  // the rewrite below ever sees it. That's harmless for routes the backend
  // exposes both ways, but POST /facilities/ (create) is a distinct FastAPI
  // route from GET /facilities (list) — stripping the slash turns the
  // create request into one against the list-only route, which 405s.
  skipTrailingSlashRedirect: true,

  async rewrites() {
    return [
      // Explicit, non-wildcard rules for the one route that actually needs
      // its trailing slash: FastAPI treats POST /facilities/ (create) and
      // GET /facilities (list) as different routes, and the generic
      // ":path*" wildcard rules below can drop a trailing slash when
      // substituting it into the destination, which silently turned the
      // create request into one against the list-only route (405, since
      // that route has no POST handler). A literal source/destination pair
      // has no wildcard capture to lose the slash from.
      {
        source: "/api/v1/facilities/",
        destination: `${BACKEND_URL}/api/v1/facilities/`,
      },
      {
        source: "/api/backend/facilities/",
        destination: `${BACKEND_URL}/api/v1/facilities/`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
      {
        source: "/api/backend/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },

  // Suppress hydration warnings caused by browser extensions
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
  images: {
    remotePatterns: [
      {
        // Not scoped to a single cloud name's path segment (e.g.
        // "/dw9sbvvab/...") because the backend has switched Cloudinary
        // accounts before without notice — a hardcoded cloud name breaks
        // every existing image again the next time that happens. The
        // hostname restriction to res.cloudinary.com already limits this
        // to Cloudinary's own CDN.
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
