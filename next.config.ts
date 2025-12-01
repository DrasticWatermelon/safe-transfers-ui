import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Configure base path if deploying to a repository (not custom domain)
  // Uncomment and set to your repo name if deploying to username.github.io/repo-name
  // basePath: '/safe-transfers-ui',
  // assetPrefix: '/safe-transfers-ui/',
};

export default nextConfig;
