import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Configure base path for repository deployment
  basePath: '/safe-transfers-ui',
  assetPrefix: '/safe-transfers-ui/',

  // External packages that shouldn't be bundled
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
};

export default nextConfig;
