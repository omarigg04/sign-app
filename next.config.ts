import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
    };
    return config;
  },
};

export default nextConfig;
