"use client"

import {
  Bot,
  Calendar,
  CalendarClock,
  // ChartColumn,
  KeyRound,
  Logs,
  MessageSquare,
  Settings,
  ShieldCheck,
  Users,
  Webhook
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { NavUser } from "@/components/layout/nav-user"
import { TeamSwitcher } from "@/components/layout/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import { useConfiguration } from "@/hooks/use-configuration"
import type { SessionResponse } from "@/lib/schemas/session"

const allItems = [
  { title: "Bots", url: "/bots", icon: Bot, featureKey: null },
  {
    title: "Scheduled Bots",
    url: "/scheduled-bots",
    icon: CalendarClock,
    featureKey: null
  },
  {
    title: "Calendars",
    url: "/calendars",
    icon: Calendar,
    featureKey: "calendar"
  },
  {
    title: "Logs",
    url: "/logs",
    icon: Logs,
    featureKey: null
  },
  {
    title: "Webhooks",
    url: "/webhooks",
    icon: Webhook,
    featureKey: "svix"
  },
  {
    title: "API Keys",
    url: "/api-keys",
    icon: KeyRound,
    featureKey: null
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    featureKey: null
  }
]

const adminItems = [
  {
    title: "All Bots",
    url: "/admin/bots",
    icon: Bot
  },
  {
    title: "All Teams",
    url: "/admin/teams",
    icon: Users
  },
  {
    title: "Admins",
    url: "/admin/admins",
    icon: ShieldCheck
  },
  {
    title: "Support Panel",
    url: "/admin/support",
    icon: MessageSquare
  }
]

interface AppSidebarProps {
  sessionResponse?: SessionResponse | null
}

export function AppSidebar({ sessionResponse }: AppSidebarProps) {
  const pathname = usePathname()
  const { open, isMobile } = useSidebar()
  const isAdmin = sessionResponse?.user.role === "admin"
  const { configuration } = useConfiguration()

  const items = useMemo(() => {
    const features = configuration?.features
    if (!features) return allItems
    return allItems.filter((item) => {
      if (!item.featureKey) return true
      if (item.featureKey === "svix") return features.svix
      if (item.featureKey === "calendar") return features.calendar
      return true
    })
  }, [configuration?.features])

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
                      hidden: open || isMobile
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
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.url)}
                      tooltip={{
                        children: item.title,
                        hidden: open || isMobile
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
  )
}
