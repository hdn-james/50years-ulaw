import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Increase limits for large image uploads
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },

  // Configure external image domains for press thumbnails
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
