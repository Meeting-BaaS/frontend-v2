import { stripeClient } from "@better-auth/stripe/client";
import {
  adminClient,
  apiKeyClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@/env";
import { AUTH_BASE_PATH } from "@/lib/api-routes";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: env.NEXT_PUBLIC_API_SERVER_BASEURL,
  basePath: AUTH_BASE_PATH,
  plugins: [
    adminClient(),
    organizationClient(),
    apiKeyClient(),
    stripeClient({
      subscription: true,
    }),
  ],
});
