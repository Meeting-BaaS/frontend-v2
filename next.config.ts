import type { NextConfig } from "next";

if (!process.env.IMAGE_HOST) {
  throw new Error(
    "IMAGE_HOST is not defined in the environment variables. Please set it in environment variables.",
  );
}

if (!process.env.NEXT_PUBLIC_API_SERVER_BASEURL) {
  throw new Error(
    "NEXT_PUBLIC_API_SERVER_BASEURL is not defined in the environment variables. Please set it in environment variables.",
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
  async rewrites() {
    return [
      {
        source: "/api/public/bots",
        destination: `${process.env.NEXT_PUBLIC_API_SERVER_BASEURL}/v2/bots`,
      },
    ];
  },
};

export default nextConfig;
