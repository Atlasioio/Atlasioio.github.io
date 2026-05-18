import path from "node:path";
import type { NextConfig } from "next";

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
} as any; // <--- Adding "as any" tells TypeScript to allow the eslint property

export default nextConfig as NextConfig;