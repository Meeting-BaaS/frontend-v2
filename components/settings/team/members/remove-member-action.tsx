"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { TeamMember } from "@/lib/schemas/teams";
import { RemoveMemberDialog } from "./remove-member-dialog";

interface RemoveMemberActionProps {
  member: TeamMember;
}

export function RemoveMemberAction({ member }: RemoveMemberActionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenuItem
        className="text-destructive hover:!text-destructive hover:!bg-destructive/10"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="text-destructive" /> Remove team member
      </DropdownMenuItem>
      <RemoveMemberDialog member={member} open={open} onOpenChange={setOpen} />
    </>
  );
}
