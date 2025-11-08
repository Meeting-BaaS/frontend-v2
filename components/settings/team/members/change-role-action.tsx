"use client";

import { Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { TeamMember } from "@/lib/schemas/teams";
import { ChangeRoleDialog } from "./change-role-dialog";

interface ChangeRoleActionProps {
  member: TeamMember;
}

export function ChangeRoleAction({ member }: ChangeRoleActionProps) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    // Prevent changing owner role - there must always be at least one owner
    if (member.role === "owner") {
      toast.error("Changing the owner role is not allowed");
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <DropdownMenuItem onClick={handleClick}>
        <Settings /> Change role
      </DropdownMenuItem>
      <ChangeRoleDialog member={member} open={open} onOpenChange={setOpen} />
    </>
  );
}
