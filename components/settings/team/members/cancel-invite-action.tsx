"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { genericError } from "@/lib/errors";
import type { TeamMember } from "@/lib/schemas/teams";

interface CancelInviteActionProps {
  member: TeamMember;
}

export function CancelInviteAction({ member }: CancelInviteActionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (loading || !member.invitationId) return;

    try {
      setLoading(true);

      const { error } = await authClient.organization.cancelInvitation({
        invitationId: member.invitationId?.toString() ?? "",
      });

      if (error) {
        console.error("Error canceling invitation", error);
        toast.error(error.message || genericError);
        return;
      }

      toast.success("Invitation canceled successfully");
      router.refresh();
    } catch (error) {
      console.error("Error canceling invitation", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenuItem
      className="text-destructive hover:!text-destructive hover:!bg-destructive/10"
      onClick={handleCancel}
      disabled={loading}
    >
      {loading ? (
        <>
          <Spinner className="size-4" /> Canceling...
        </>
      ) : (
        <>
          <X className="text-destructive" /> Cancel invite
        </>
      )}
    </DropdownMenuItem>
  );
}
