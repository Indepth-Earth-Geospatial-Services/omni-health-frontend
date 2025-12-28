import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "https://omni-health-backend.onrender.com/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
