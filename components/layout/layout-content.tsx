"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PlansProvider } from "@/contexts/plans-context";
import { SupportDialogProvider } from "@/contexts/support-dialog-context";
import { UserProvider } from "@/contexts/user-context";
import { TEAM_DETAILS_QUERY_KEY } from "@/hooks/use-team-details";
import type { SessionResponse } from "@/lib/schemas/session";
import type { TeamDetails } from "@/lib/schemas/teams";

interface LayoutContentProps {
  children: ReactNode;
  sessionResponse: SessionResponse;
  teamDetails: TeamDetails;
  sidebarState: boolean;
}

export function LayoutContent({
  children,
  sessionResponse,
  teamDetails,
  sidebarState,
}: LayoutContentProps) {
  // Create QueryClient and set initial data for team details
  // This prevents the initial fetch when useTeamDetails hook is used
  // Using useMemo to ensure QueryClient is only created once per component instance
  const queryClient = useMemo(() => {
    const client = new QueryClient();
    // Set initial data for team details query
    client.setQueryData(TEAM_DETAILS_QUERY_KEY, teamDetails);
    return client;
  }, [teamDetails]);

  // Just a safety check to prevent undefined errors. This should never happen.
  if (!sessionResponse) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider
        user={sessionResponse.user}
        session={sessionResponse.session}
        teamDetails={teamDetails}
      >
        <PlansProvider>
          <SupportDialogProvider>
            <SidebarProvider
              style={
                {
                  "--sidebar-width": "15.5rem",
                } as React.CSSProperties
              }
              defaultOpen={sidebarState}
            >
              <AppSidebar />
              <main className="flex flex-col w-full h-screen">
                <AppHeader />
                <div className="flex-1 overflow-y-auto px-4 md:px-10 lg:px-20 py-8">
                  {children}
                </div>
              </main>
            </SidebarProvider>
          </SupportDialogProvider>
        </PlansProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
