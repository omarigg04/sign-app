import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // Configuración para Turbopack (dejarlo vacío - react-pdf debería funcionar sin aliases)
  turbopack: {},

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
