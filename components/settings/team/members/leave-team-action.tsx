"use client";

import { UserMinus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import type { TeamMember } from "@/lib/schemas/teams";
import { LeaveTeamDialog } from "./leave-team-dialog";

interface LeaveTeamActionProps {
  members: TeamMember[];
}

export function LeaveTeamAction({ members }: LeaveTeamActionProps) {
  const { activeTeam } = useUser();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    // Count active members (excluding pending invites)
    const activeMembers = members.filter((member) => !member.invitationStatus);
    const activeMemberCount = activeMembers.length;

    // If there's only one active member, they need to delete the team instead
    if (activeMemberCount === 1) {
      toast.error(
        "You are the only member of this team. Please delete the team instead of leaving it.",
      );
      return;
    }

    if (activeTeam.isAdminOrOwner) {
      // Count how many admins/owners exist (excluding pending invites)
      const adminOrOwnerCount = members.filter(
        (member) =>
          !member.invitationStatus &&
          (member.role === "admin" || member.role === "owner"),
      ).length;

      // If there's only one admin/owner (the current user), show toast
      if (adminOrOwnerCount === 1) {
        toast.error(
          "You are the only admin (or owner) of this team. Please promote another member to admin before leaving the team.",
        );
        return;
      }
    }

    // Otherwise, show the regular leave dialog
    setOpen(true);
  };

  return (
    <>
      <DropdownMenuItem
        className="text-destructive hover:!text-destructive hover:!bg-destructive/10"
        onClick={handleClick}
      >
        <UserMinus className="text-destructive" /> Leave team
      </DropdownMenuItem>
      <LeaveTeamDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
