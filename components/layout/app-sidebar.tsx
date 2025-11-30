"use client";

import {
  Bot,
  Calendar,
  CalendarClock,
  // ChartColumn,
  KeyRound,
  Logs,
  MessageSquare,
  Settings,
  Shield,
  Users,
  Webhook,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "@/components/layout/nav-user";
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
import type { SessionResponse } from "@/lib/schemas/session";

const items = [
  {
    title: "Bots",
    url: "/bots",
    icon: Bot,
  },
  {
    title: "Scheduled Bots",
    url: "/scheduled-bots",
    icon: CalendarClock,
  },
  {
    title: "Calendars",
    url: "/calendars",
    icon: Calendar,
  },
  // Will be implemented in the future
  // {
  //   title: "Analytics",
  //   url: "/analytics",
  //   icon: ChartColumn,
  // },
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
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

const adminItems = [
  {
    title: "All Bots",
    url: "/admin/bots",
    icon: Bot,
  },
  {
    title: "All Teams",
    url: "/admin/teams",
    icon: Users,
  },
  {
    title: "Support Panel",
    url: "/admin/support",
    icon: MessageSquare,
  },
];

interface AppSidebarProps {
  sessionResponse?: SessionResponse | null;
}

export function AppSidebar({ sessionResponse }: AppSidebarProps) {
  const pathname = usePathname();
  const { open, isMobile } = useSidebar();
  const isAdmin = sessionResponse?.user.role === "admin";

  return (
    <Sidebar collapsible="icon" className="z-30">
      <SidebarHeader>
        <TeamSwitcher />
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
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={{
                      children: "Admin",
                      hidden: open || isMobile,
                    }}
                    className="text-muted-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase">
                        Admin
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {adminItems.map((item) => (
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
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
