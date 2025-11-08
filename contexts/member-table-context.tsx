"use client";

import { createContext, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import type { TeamMember } from "@/lib/schemas/teams";

interface DialogState<T = TeamMember> {
  open: boolean;
  member: T | null;
}

interface MemberTableContextType {
  // Dialog states - only one dialog can be open at a time
  changeRoleDialog: DialogState;
  removeMemberDialog: DialogState;
  leaveTeamDialog: DialogState<never>; // Leave team doesn't need a member
  // Actions with validation
  handleChangeRoleClick: (member: TeamMember) => void;
  handleRemoveMemberClick: (member: TeamMember) => void;
  handleLeaveTeamClick: () => void;
  closeAllDialogs: () => void;
}

export const MemberTableContext = createContext<
  MemberTableContextType | undefined
>(undefined);

interface MemberTableProviderProps {
  children: React.ReactNode;
  members: TeamMember[];
}

/**
 * Context provider for member table actions
 * Manages dialog state to avoid mounting all dialogs for each row
 * Contains validation logic for member operations
 */
export function MemberTableProvider({
  children,
  members,
}: MemberTableProviderProps) {
  const { activeTeam } = useUser();
  const [changeRoleDialog, setChangeRoleDialog] = useState<DialogState>({
    open: false,
    member: null,
  });
  const [removeMemberDialog, setRemoveMemberDialog] = useState<DialogState>({
    open: false,
    member: null,
  });
  const [leaveTeamDialog, setLeaveTeamDialog] = useState<DialogState<never>>({
    open: false,
    member: null,
  });

  const handleChangeRoleClick = (member: TeamMember) => {
    // Prevent changing owner role - there must always be at least one owner
    if (member.role === "owner") {
      toast.error(
        "Cannot change owner role. There must always be at least one owner in the team.",
      );
      return;
    }
    // Atomic update - set both open and member together
    setChangeRoleDialog({ open: true, member });
  };

  const handleRemoveMemberClick = (member: TeamMember) => {
    // Atomic update - set both open and member together
    setRemoveMemberDialog({ open: true, member });
  };

  const handleLeaveTeamClick = () => {
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
    setLeaveTeamDialog({ open: true, member: null });
  };

  const closeAllDialogs = () => {
    setChangeRoleDialog({ open: false, member: null });
    setRemoveMemberDialog({ open: false, member: null });
    setLeaveTeamDialog({ open: false, member: null });
  };

  return (
    <MemberTableContext.Provider
      value={{
        changeRoleDialog,
        removeMemberDialog,
        leaveTeamDialog,
        handleChangeRoleClick,
        handleRemoveMemberClick,
        handleLeaveTeamClick,
        closeAllDialogs,
      }}
    >
      {children}
    </MemberTableContext.Provider>
  );
}
