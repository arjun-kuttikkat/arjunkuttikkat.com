import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    unoptimized: process.env.NODE_ENV === "development"
  },
  serverExternalPackages: ["next-mdx-remote", "@mdx-js/mdx"]
};

export default nextConfig;
