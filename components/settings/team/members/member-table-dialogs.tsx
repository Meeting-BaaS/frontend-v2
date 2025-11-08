"use client";

import { useMemberTable } from "@/hooks/use-member-table";
import { ChangeRoleDialog } from "./change-role-dialog";
import { LeaveTeamDialog } from "./leave-team-dialog";
import { RemoveMemberDialog } from "./remove-member-dialog";

/**
 * Component that renders all member table dialogs based on context state
 * This ensures only one set of dialogs is mounted for the entire table
 */
export function MemberTableDialogs() {
  const {
    changeRoleDialog,
    removeMemberDialog,
    leaveTeamDialog,
    closeAllDialogs,
  } = useMemberTable();

  return (
    <>
      {changeRoleDialog.member && (
        <ChangeRoleDialog
          member={changeRoleDialog.member}
          open={changeRoleDialog.open}
          onOpenChange={(open) => {
            if (!open) closeAllDialogs();
          }}
        />
      )}
      {removeMemberDialog.member && (
        <RemoveMemberDialog
          member={removeMemberDialog.member}
          open={removeMemberDialog.open}
          onOpenChange={(open) => {
            if (!open) closeAllDialogs();
          }}
        />
      )}
      <LeaveTeamDialog
        open={leaveTeamDialog.open}
        onOpenChange={(open) => {
          if (!open) closeAllDialogs();
        }}
      />
    </>
  );
}
