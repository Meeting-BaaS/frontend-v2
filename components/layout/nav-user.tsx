"use client";

import {
  CircleUserRound,
  EllipsisVertical,
  Fish,
  ListCheck,
  LogOut,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";
import { authClient } from "@/lib/auth-client";
import { genericError } from "@/lib/errors";
import type { TeamDetails } from "@/lib/schemas/teams";
import type { Theme } from "@/types/common.types";

const higherPlanMap: Record<TeamDetails[number]["plan"], string | null> = {
  payg: "pro",
  pro: "scale",
  scale: "enterprise",
  enterprise: null,
};

export function NavUser() {
  const { isMobile, open } = useSidebar();
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const { user, activeTeam } = useUser();
  const higherPlan = useMemo(
    () => higherPlanMap[activeTeam?.plan ?? "payg"],
    [activeTeam],
  );

  const handleSignOut = async () => {
    const signedOut = await authClient.signOut();
    if (!signedOut) {
      toast.error(genericError);
      return;
    }
    const redirectSearchParams = new URLSearchParams();
    redirectSearchParams.set("redirectTo", pathname);
    window.location.href = `/sign-in?${redirectSearchParams.toString()}`;
  };

  const handleChangeTheme = async (theme: Theme) => {
    function update() {
      setTheme(theme);
    }

    if (document.startViewTransition && theme !== resolvedTheme) {
      document.documentElement.style.viewTransitionName = "theme-transition";
      await document.startViewTransition(update).finished;
      document.documentElement.style.viewTransitionName = "";
    } else {
      update();
    }
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
              <Avatar
                className={`transition-all duration-300 ease-in-out ${open ? "size-6" : "size-8"}`}
              >
                <AvatarImage src={user.image ?? ""} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-baas-primary-500 via-baas-primary-700 to-baas-black text-white font-bold">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-full min-w-56"
            style={{ width: "var(--radix-popper-anchor-width)" }}
            side={isMobile || open ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs font-normal truncate">
              <span className="truncate">{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/settings?page=account">
                  <CircleUserRound />
                  My Account
                  <DropdownMenuShortcut>M</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              {activeTeam?.plan !== "enterprise" && (
                <DropdownMenuItem asChild>
                  <Link href="/settings?page=upgrade">
                    <Sparkles />
                    Upgrade to {higherPlan}
                    <DropdownMenuShortcut>U</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() =>
                  handleChangeTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
              >
                {resolvedTheme === "dark" ? <Sun /> : <Moon />}
                Toggle Theme
                <DropdownMenuShortcut>T</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/onboarding">
                  <ListCheck />
                  Onboarding
                  <DropdownMenuShortcut>O</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/support-center">
                  <Fish />
                  Support Center
                  <DropdownMenuShortcut>S</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
