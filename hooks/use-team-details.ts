"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_TEAM_DETAILS } from "@/lib/api-routes";
import {
  type TeamDetailsResponse,
  teamDetailsResponseSchema,
} from "@/lib/schemas/teams";

export const TEAM_DETAILS_QUERY_KEY = ["team-details"] as const;

/**
 * React Query hook for fetching team details
 * Uses initial data from QueryClient if available (set in layout-content.tsx)
 * Prevents refetch on mount since initial data is already provided
 */
export function useTeamDetails() {
  return useQuery({
    queryKey: TEAM_DETAILS_QUERY_KEY,
    queryFn: async () => {
      const response = await axiosGetInstance<TeamDetailsResponse>(
        GET_TEAM_DETAILS,
        teamDetailsResponseSchema,
      );
      return response.data;
    },
    refetchOnWindowFocus: true,
    placeholderData: (previousData) => previousData,
    refetchOnMount: false, // Don't refetch on mount since initial data is set in QueryClient
    throwOnError: true, // Caught by the ErrorBoundary
  });
}
