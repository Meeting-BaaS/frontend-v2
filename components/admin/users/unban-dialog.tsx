"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/users/confirm-dialog";
import { authClient } from "@/lib/auth-client";
import { genericError } from "@/lib/errors";
import type { TeamMember } from "@/lib/schemas/teams";

interface UsersUnbanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember;
  onSuccess: () => void;
}

export function UsersUnbanDialog({
  open,
  onOpenChange,
  member,
  onSuccess,
}: UsersUnbanDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (member.userId == null) return;
    setLoading(true);
    try {
      const { error } = await authClient.admin.unbanUser({
        userId: String(member.userId),
      });
      if (error) throw new Error(error.message);
      toast.success("User unbanned");
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to unban user", err);
      toast.error(err instanceof Error ? err.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Unban user"
      description={`Are you sure you want to unban ${member.email}? They will be able to sign in again.`}
      confirmLabel="Yes, unban"
      onConfirm={handleConfirm}
      loading={loading}
    />
  );
}
