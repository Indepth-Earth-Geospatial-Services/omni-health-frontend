export interface Config {
  API_BASE_URL: string;
}

const config: Config = {
  // NEXT_PUBLIC_API_URL is set to "/api/v1" in .env.
  // Next.js rewrites /api/v1/* → real backend URL server-side (see next.config.ts).
  // This keeps all browser requests same-origin and eliminates CORS entirely.
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? "/api/v1",
};

export default config;
