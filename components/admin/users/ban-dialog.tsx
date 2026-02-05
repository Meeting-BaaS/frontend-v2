"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/users/confirm-dialog";
import { authClient } from "@/lib/auth-client";
import { genericError } from "@/lib/errors";
import type { TeamMember } from "@/lib/schemas/teams";

interface UsersBanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember;
  onSuccess: () => void;
}

export function UsersBanDialog({
  open,
  onOpenChange,
  member,
  onSuccess,
}: UsersBanDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (member.userId == null) return;
    setLoading(true);
    try {
      const { error } = await authClient.admin.banUser({
        userId: String(member.userId),
      });
      if (error) throw new Error(error.message);
      toast.success("User banned");
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to ban user", err);
      toast.error(err instanceof Error ? err.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Ban user"
      description={`Are you sure you want to ban ${member.email}? They will not be able to sign in and their sessions will be revoked.`}
      confirmLabel="Yes, ban"
      variant="destructive"
      onConfirm={handleConfirm}
      loading={loading}
    />
  );
}
