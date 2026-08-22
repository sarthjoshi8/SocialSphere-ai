import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Required for Three.js / react-three-fiber
    config.externals = config.externals || [];
    return config;
  },
  turbopack: {},
  // Allow pdfjs-dist canvas dependency
  serverExternalPackages: [],
};

export default nextConfig;
