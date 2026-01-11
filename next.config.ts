import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false,  // Disabled due to Prisma + Turbopack issues

  // Configuración para Turbopack
  turbopack: {
    root: __dirname,
  },

  // Exclude Prisma from optimization to avoid Turbopack minification issues
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },

  // Configuración para Webpack cuando se usa --webpack
  webpack: (config) => {
    // Configuración para react-pdf
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
    };

    return config;
  },
};

export default nextConfig;
