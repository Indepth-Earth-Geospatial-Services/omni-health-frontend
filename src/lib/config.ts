export interface Config {
  API_BASE_URL: string;
}

const config: Config = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}`
    : "https://omni-health-backend.onrender.com/api/v1",
};

export default config;
