import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Configure base path for repository deployment (only in production)
  basePath: isProd ? '/safe-transfers-ui' : '',
  assetPrefix: isProd ? '/safe-transfers-ui/' : '',

  // External packages that shouldn't be bundled
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
};

export default nextConfig;
