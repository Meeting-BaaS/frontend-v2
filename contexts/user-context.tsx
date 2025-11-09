"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  TEAM_DETAILS_QUERY_KEY,
  useTeamDetails,
} from "@/hooks/use-team-details";
import { authClient } from "@/lib/auth-client";
import { genericError } from "@/lib/errors";
import type { Session, User } from "@/lib/schemas/session";
import type { TeamDetails } from "@/lib/schemas/teams";

type ActiveTeam = TeamDetails[number] & {
  isMember: boolean;
  isAdminOrOwner: boolean;
};

interface UserContextType {
  user: User;
  session: Session;
  teamDetails: TeamDetails;
  setTeamDetails: (teamDetails: TeamDetails) => void;
  updateActiveTeam: (updates: Partial<ActiveTeam>) => void;
  updateUser: (updates: Partial<User>) => void;
  activeTeam: ActiveTeam;
  setActiveTeam: (
    team: TeamDetails[number],
    redirectToAfterSetActive?: string,
  ) => Promise<void>;
  setNextActiveTeamOrRedirect: (
    redirectToAfterSetActive?: string,
  ) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export function UserProvider({
  children,
  user: initialUser,
  session,
  teamDetails: initialTeamDetails,
}: Readonly<{
  children: React.ReactNode;
  user: User;
  session: Session;
  teamDetails: TeamDetails;
}>) {
  const [user, setUser] = useState<User>(initialUser);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [teamDetails, setTeamDetails] =
    useState<TeamDetails>(initialTeamDetails);

  // Initialize activeTeam from initialTeamDetails
  const getActiveTeam = useCallback((teams: TeamDetails): ActiveTeam | null => {
    const team = teams.find((team) => team.isActive);
    if (!team) {
      return null;
    }
    // Add computed properties for role checks
    return {
      ...team,
      isMember: team.role === "member",
      isAdminOrOwner: team.role === "admin" || team.role === "owner",
    };
  }, []);

  const [activeTeam, setActiveTeamState] = useState<ActiveTeam | null>(() =>
    getActiveTeam(initialTeamDetails),
  );

  // Sync with React Query to get updates from other tabs/windows/changes from other users
  const { data: queryTeamDetails, refetch: refetchTeamDetails } =
    useTeamDetails();

  const updateActiveTeam = useCallback((updates: Partial<ActiveTeam>) => {
    setActiveTeamState((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Set a team as active and invalidate React Query cache
   */
  const setActiveTeam = useCallback(
    async (team: TeamDetails[number], redirectToAfterSetActive = "/bots") => {
      try {
        const { error: setActiveError } =
          await authClient.organization.setActive({
            organizationId: team.id.toString(),
            organizationSlug: team.slug,
          });

        if (setActiveError) {
          console.error("API Error setting active team", setActiveError);
          toast.error(setActiveError.message || genericError);
          throw new Error(setActiveError.message || genericError);
        }

        // Refresh the session cache with the new organization information
        await authClient.getSession({
          query: {
            disableCookieCache: true,
          },
        });

        // Invalidate React Query cache and force refetch
        // First invalidate to mark as stale, then explicitly refetch to ensure it happens
        queryClient.invalidateQueries({
          queryKey: TEAM_DETAILS_QUERY_KEY,
        });
        // Explicitly refetch to ensure it happens even if already fetching
        await refetchTeamDetails();
        router.push(redirectToAfterSetActive);
      } catch (error) {
        console.error("Error setting active team", error);
        throw error;
      }
    },
    [queryClient, router, refetchTeamDetails],
  );

  /**
   * Set the next available team as active, or redirect to create-team if none available
   */
  const setNextActiveTeamOrRedirect = useCallback(
    async (redirectToAfterSetActive?: string) => {
      const currentActiveTeam = teamDetails.find((team) => team.isActive);
      const nextTeam = teamDetails.find(
        (team) => team.id !== currentActiveTeam?.id,
      );

      if (!nextTeam) {
        router.push("/create-default-team");
        return;
      }

      try {
        await setActiveTeam(nextTeam, redirectToAfterSetActive);
      } catch {
        // If setting active team fails, redirect to create-team
        router.push("/create-default-team");
      }
    },
    [teamDetails, setActiveTeam, router],
  );

  // Update context state when React Query data changes (e.g., from window focus refetch)
  useEffect(() => {
    if (queryTeamDetails) {
      setTeamDetails(queryTeamDetails);
      const newActiveTeam = getActiveTeam(queryTeamDetails);
      setActiveTeamState(newActiveTeam);

      // If there's no active team, set next team as active or redirect to create-team
      if (!newActiveTeam) {
        setNextActiveTeamOrRedirect();
      }
    }
  }, [queryTeamDetails, getActiveTeam, setNextActiveTeamOrRedirect]);

  // Update activeTeam when teamDetails changes (from local updates like updateTeam)
  useEffect(() => {
    const newActiveTeam = getActiveTeam(teamDetails);
    setActiveTeamState(newActiveTeam);

    // If there's no active team, set next team as active or redirect to create-team
    if (!newActiveTeam) {
      setNextActiveTeamOrRedirect();
    }
  }, [teamDetails, getActiveTeam, setNextActiveTeamOrRedirect]);

  // Ensure activeTeam is never null in the context (throw error if it is, which should never happen)
  if (!activeTeam) {
    // This should only happen briefly during redirect, but we need to provide a fallback
    // The useEffect will handle the redirect, but we need to satisfy TypeScript
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        session,
        teamDetails,
        updateActiveTeam,
        setTeamDetails,
        updateUser,
        activeTeam,
        setActiveTeam,
        setNextActiveTeamOrRedirect,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
