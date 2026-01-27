import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://omni-health-backend.onrender.com/api/v1/:path*",
      },
      {
        source: "/api/backend/:path*",
        destination: "https://omni-health-backend.onrender.com/api/v1/:path*",
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
      new URL("https://res.cloudinary.com/dhnrr0ny3/image/upload/**"),
    ],
  },
};

export default nextConfig;
