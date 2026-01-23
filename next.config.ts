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

const securityHeaders = [
  {
    // Prevent XSS attacks
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    // Prevent MIME type sniffing
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Prevent clickjacking
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Control referrer information
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // DNS prefetch control
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    // Strict Transport Security (HTTPS only)
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    // Permissions Policy (formerly Feature-Policy)
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: process.env.IMAGE_HOST,
        protocol: "https",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
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
