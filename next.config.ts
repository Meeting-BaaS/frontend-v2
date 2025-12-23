import type { NextConfig } from "next";

if (!process.env.IMAGE_HOST) {
  throw new Error(
    "IMAGE_HOST is not defined in the environment variables. Please set it in environment variables.",
  );
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: process.env.IMAGE_HOST,
        protocol: "https",
      },
    ],
  },
  allowedDevOrigins: ["localhost", "127.0.0.1", "dashboard.gmeetrecorder.com"],
};

export default nextConfig;
