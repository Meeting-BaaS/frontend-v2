"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { User } from "@/lib/schemas/session";
import type { TeamDetails } from "@/lib/schemas/teams";

interface LayoutContentProps {
  user: User;
  teamDetails: TeamDetails;
  children: ReactNode;
}

export function LayoutContent({
  user,
  teamDetails,
  children,
}: LayoutContentProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "15.5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} teamDetails={teamDetails} />
      <main className="flex flex-col w-full h-screen">
        <AppHeader />
        <div className="flex-1 overflow-y-auto px-4 md:px-10 lg:px-20 py-8">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
