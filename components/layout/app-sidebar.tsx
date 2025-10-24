"use client";

import {
  Bot,
  Calendar,
  ChartColumn,
  FlaskConical,
  KeyRound,
  Logs,
  Settings,
  Webhook,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { User } from "@/lib/schemas/session";
import type { TeamDetails } from "@/lib/schemas/teams";
import { NavUser } from "./nav-user";

const items = [
  {
    title: "Bots",
    url: "/bots",
    icon: Bot,
  },
  {
    title: "Calendars",
    url: "/calendars",
    icon: Calendar,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: ChartColumn,
  },
  {
    title: "Logs",
    url: "/logs",
    icon: Logs,
  },
  {
    title: "Webhooks",
    url: "/webhooks",
    icon: Webhook,
  },
  {
    title: "API Keys",
    url: "/api-keys",
    icon: KeyRound,
  },
  {
    title: "Playground",
    url: "/playground",
    icon: FlaskConical,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

interface AppSidebarProps {
  user: User;
  teamDetails: TeamDetails;
}

export function AppSidebar({ user, teamDetails }: AppSidebarProps) {
  const pathname = usePathname();
  const { open, isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher teamDetails={teamDetails} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.url)}
                    tooltip={{
                      children: item.title,
                      hidden: open || isMobile,
                    }}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} teamDetails={teamDetails} />
      </SidebarFooter>
    </Sidebar>
  );
}
