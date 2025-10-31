import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/contexts/user-context";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_SESSION, GET_TEAM_DETAILS } from "@/lib/api-routes";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";
import {
  type TeamDetailsResponse,
  teamDetailsResponseSchema,
} from "@/lib/schemas/teams";

export const metadata: Metadata = {
  title: "Dashboard | Meeting BaaS",
  description: "Meeting BaaS Dashboard",
};

export default async function HomeLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Redirect if user is not logged in
  const cookieStore = await cookies();
  const session = await axiosGetInstance<SessionResponse>(
    GET_SESSION,
    sessionResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );
  if (!session) {
    // Important: This is allowed to pass through
    // Because the expectation is that each individual page will handle the redirection
    // And will have a session check on the page itself
    // As per Next.js, that is the correct approach
    return children;
  }

  const teamDetails = await axiosGetInstance<TeamDetailsResponse>(
    GET_TEAM_DETAILS,
    teamDetailsResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  return (
    <UserProvider
      user={session.user}
      session={session.session}
      teamDetails={teamDetails.data}
    >
      <SidebarProvider
        style={
          {
            "--sidebar-width": "15.5rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar user={session.user} teamDetails={teamDetails.data} />
        <main className="flex flex-col w-full h-screen">
          <AppHeader />
          <div className="flex-1 overflow-y-auto px-4 md:px-10 lg:px-20 py-8">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </UserProvider>
  );
}
