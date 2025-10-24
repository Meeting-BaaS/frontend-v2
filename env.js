import { createEnv } from "@t3-oss/env-nextjs";
import { url } from "zod";

export const env = createEnv({
  server: {
    // Server-side environment variables go here
    // Add any server-only env vars in the future
  },
  client: {
    // Client-side environment variables (must be prefixed with NEXT_PUBLIC_)
    NEXT_PUBLIC_FRONTEND_BASEURL: url().default("http://localhost:3000"),
    NEXT_PUBLIC_API_SERVER_BASEURL: url().default("http://localhost:3001"),
  },
  runtimeEnv: {
    // Map environment variables to their actual values
    NEXT_PUBLIC_FRONTEND_BASEURL: process.env.NEXT_PUBLIC_FRONTEND_BASEURL,
    NEXT_PUBLIC_API_SERVER_BASEURL: process.env.NEXT_PUBLIC_API_SERVER_BASEURL,
  },
});
