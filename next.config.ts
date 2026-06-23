import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed `output: 'export'` since we migrated to Vercel — static export
  // disables API routes (needed for /api/chat to talk to Claude).
  images: {
    unoptimized: true,
    qualities: [75, 95, 100],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // @ts-ignore - Bypassing strict type check for older ESLint config structure
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;