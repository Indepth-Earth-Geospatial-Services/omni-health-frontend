export interface Config {
  API_BASE_URL: string;
}

const config: Config = {
  // Always use the Next.js rewrite proxy path so browser requests never hit
  // the backend directly (avoids CORS). The rewrite in next.config.ts forwards
  // /api/v1/* → https://omni-health-backend.onrender.com/api/v1/* server-side.
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? "/api/v1",
};

export default config;
