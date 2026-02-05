"use client";

import { MoreHorizontal, UserX } from "lucide-react";
import { useState } from "react";
import { UsersBanDialog } from "@/components/admin/users/ban-dialog";
import { UsersUnbanDialog } from "@/components/admin/users/unban-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TeamMember } from "@/lib/schemas/teams";

interface UsersTableActionsProps {
  member: TeamMember;
  onSuccess: () => void;
  buttonVariant?: "ghost" | "outline" | "default";
}

export function UsersTableActions({
  member,
  onSuccess,
  buttonVariant = "ghost",
}: UsersTableActionsProps) {
  const [openBan, setOpenBan] = useState(false);
  const [openUnban, setOpenUnban] = useState(false);

  const isPending = member.invitationId != null;
  const canBanUnban = member.userId != null && !isPending;
  const isBanned = member.banned === true;

  if (!canBanUnban) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={buttonVariant} className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isBanned ? (
            <DropdownMenuItem onClick={() => setOpenUnban(true)}>
              <UserX /> Unban user
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="text-destructive hover:text-destructive! hover:bg-destructive/10!"
              onClick={() => setOpenBan(true)}
            >
              <UserX className="text-destructive" /> Ban user
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {openBan && (
        <UsersBanDialog
          open={openBan}
          onOpenChange={setOpenBan}
          member={member}
          onSuccess={onSuccess}
        />
      )}
      {openUnban && (
        <UsersUnbanDialog
          open={openUnban}
          onOpenChange={setOpenUnban}
          member={member}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
