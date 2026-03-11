import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['typeorm', 'better-sqlite3'],
  },
};

export default nextConfig;
