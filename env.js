import { createEnv } from "@t3-oss/env-nextjs";
import { email, string, url } from "zod";

export const env = createEnv({
  server: {
    // Server-side environment variables go here
    // Add any server-only env vars in the future
  },
  client: {
    // Client-side environment variables (must be prefixed with NEXT_PUBLIC_)
    NEXT_PUBLIC_FRONTEND_BASEURL: url().default("http://localhost:3000"),
    NEXT_PUBLIC_API_SERVER_BASEURL: url().default("http://localhost:3001"),
    NEXT_PUBLIC_SUPPORT_EMAIL: email().default("support@meetingbaas.com"),
    NEXT_PUBLIC_DEFAULT_BOT_IMAGE: string().optional(),
  },
  runtimeEnv: {
    // Map environment variables to their actual values
    NEXT_PUBLIC_FRONTEND_BASEURL: process.env.NEXT_PUBLIC_FRONTEND_BASEURL,
    NEXT_PUBLIC_API_SERVER_BASEURL: process.env.NEXT_PUBLIC_API_SERVER_BASEURL,
    NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
    NEXT_PUBLIC_DEFAULT_BOT_IMAGE: process.env.NEXT_PUBLIC_DEFAULT_BOT_IMAGE,
  },
});
