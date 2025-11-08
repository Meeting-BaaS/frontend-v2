"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { TeamAvatar } from "@/components/ui/team-avatar";
import { useUser } from "@/hooks/use-user";
import type { TeamDetails } from "@/lib/schemas/teams";

export function TeamSwitcher() {
  const { activeTeam, teamDetails, setActiveTeam } = useUser();
  const { isMobile, open } = useSidebar();

  const onTeamClick = async (team: TeamDetails[number]) => {
    if (team.id === activeTeam.id) return;

    await setActiveTeam(team);
    // Error is already handled in setActiveTeam
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {activeTeam.logo ? (
                <div className="relative flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg border">
                  <Image
                    src={activeTeam.logo}
                    alt={activeTeam.name}
                    fill
                    sizes="32px"
                    priority
                    className="object-cover"
                  />
                </div>
              ) : (
                <TeamAvatar
                  name={activeTeam.name}
                  size="md"
                  className="size-8"
                />
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {activeTeam.region}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-full min-w-56"
            style={{ width: "var(--radix-popper-anchor-width)" }}
            align="start"
            side={isMobile || open ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {teamDetails.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => onTeamClick(team)}
                className="gap-2 p-1"
              >
                {team.logo ? (
                  <div className="relative flex size-6 items-center justify-center overflow-hidden rounded-md border">
                    <Image
                      src={team.logo}
                      alt={team.name}
                      fill
                      sizes="24px"
                      className="object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <TeamAvatar name={team.name} size="sm" className="size-6" />
                )}
                {team.name}
                {team.plan !== "payg" && (
                  <Badge variant="outline" className="capitalize">
                    {team.plan}
                  </Badge>
                )}
                {team.isActive && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>
            ))}
            {/* Only show add team button if there are less than 10 teams. Backend only allows up to 10 teams per user. */}
            {teamDetails.length < 10 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-1" asChild>
                  <Link href="/create-new-team">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                      <Plus className="size-4" />
                    </div>
                    <div className="text-muted-foreground font-medium">
                      Add team
                    </div>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
