import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // Enable Turbopack explicitly
    turbo: {},
  },
};

export default nextConfig;
