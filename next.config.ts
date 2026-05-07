import type { NextConfig } from "next";

// Read from env so the backend URL is never hardcoded — change BACKEND_URL in
// .env to point to a different deployment without touching this file.
const BACKEND_URL =
  process.env.BACKEND_URL ??
  "https://omni-health-backend-85732036737.africa-south1.run.app";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
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
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dw9sbvvab/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
