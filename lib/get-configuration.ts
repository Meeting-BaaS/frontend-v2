import { cache } from "react";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_CONFIGURATION } from "@/lib/api-routes";
import {
  type ConfigurationResponse,
  configurationResponseSchema,
} from "@/lib/schemas/configuration";

/**
 * Cached server-side fetch for frontend configuration (feature flags, selfHosted).
 * Safe to call from layout and pages; deduplicated per request.
 */
export const getConfiguration = cache(
  async (): Promise<ConfigurationResponse | null> => {
    try {
      return await axiosGetInstance<ConfigurationResponse>(
        GET_CONFIGURATION,
        configurationResponseSchema,
      );
    } catch (error) {
      console.error("Failed to fetch configuration:", error);
      return null;
    }
  },
);
