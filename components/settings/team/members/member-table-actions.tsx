"use client";

import {
  Mail,
  MoreHorizontal,
  Settings,
  Trash2,
  UserMinus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useCancelInvite, useResendInvite } from "@/hooks/use-member-mutations";
import { useMemberTable } from "@/hooks/use-member-table";
import { useUser } from "@/hooks/use-user";
import type { InputRole, TeamMember } from "@/lib/schemas/teams";

interface MemberTableActionsProps {
  member: TeamMember;
  buttonVariant?: "ghost" | "outline" | "default";
}

export function MemberTableActions({
  member,
  buttonVariant = "ghost",
}: MemberTableActionsProps) {
  const { user, activeTeam } = useUser();
  const {
    handleChangeRoleClick,
    handleRemoveMemberClick,
    handleLeaveTeamClick,
  } = useMemberTable();
  const resendInvite = useResendInvite();
  const cancelInvite = useCancelInvite();

  const isCurrentUser = user.email === member.email;
  const isPendingInvite = member.invitationStatus === "pending";

  const onResendInviteClick = () => {
    if (!member.invitationId) return;
    resendInvite.mutate({
      email: member.email,
      role: member.role as InputRole,
      organizationId: activeTeam.id.toString(),
    });
  };

  const onCancelInviteClick = () => {
    if (!member.invitationId) return;
    cancelInvite.mutate({
      invitationId: member.invitationId.toString(),
    });
  };

  // Members can only see actions for themselves
  if (activeTeam.isMember && !isCurrentUser) {
    return null;
  }

  // If it's an invitation (pending), only show actions for admins/owners
  if (isPendingInvite && !activeTeam.isAdminOrOwner) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={buttonVariant} className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isCurrentUser ? (
          <DropdownMenuItem
            className="text-destructive hover:!text-destructive hover:!bg-destructive/10"
            onClick={handleLeaveTeamClick}
          >
            <UserMinus className="text-destructive" /> Leave team
          </DropdownMenuItem>
        ) : isPendingInvite ? (
          <>
            <DropdownMenuItem
              onClick={onResendInviteClick}
              disabled={resendInvite.isPending}
            >
              {resendInvite.isPending ? (
                <>
                  <Spinner className="size-4" /> Resending...
                </>
              ) : (
                <>
                  <Mail /> Resend invite
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive hover:!text-destructive hover:!bg-destructive/10"
              onClick={onCancelInviteClick}
              disabled={cancelInvite.isPending}
            >
              {cancelInvite.isPending ? (
                <>
                  <Spinner className="size-4" /> Canceling...
                </>
              ) : (
                <>
                  <X className="text-destructive" /> Cancel invite
                </>
              )}
            </DropdownMenuItem>
          </>
        ) : (
          activeTeam.isAdminOrOwner && (
            <>
              <DropdownMenuItem onClick={() => handleChangeRoleClick(member)}>
                <Settings /> Change role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive hover:!text-destructive hover:!bg-destructive/10"
                onClick={() => handleRemoveMemberClick(member)}
              >
                <Trash2 className="text-destructive" /> Remove team member
              </DropdownMenuItem>
            </>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
