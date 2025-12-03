"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/use-user";
import { authClient } from "@/lib/auth-client";
import { genericError } from "@/lib/errors";
import type { InputRole, TeamMember } from "@/lib/schemas/teams";

interface ResendInviteActionProps {
  member: TeamMember;
}

export function ResendInviteAction({ member }: ResendInviteActionProps) {
  const { activeTeam } = useUser();
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (loading || !member.invitationId) return;

    try {
      setLoading(true);

      const { error } = await authClient.organization.inviteMember({
        email: member.email,
        role: member.role as InputRole,
        organizationId: activeTeam.id.toString(),
        resend: true,
      });

      if (error) {
        console.error("Error resending invitation", error);
        toast.error(error.message || genericError);
        return;
      }

      toast.success("Invitation resent successfully");
    } catch (error) {
      console.error("Error resending invitation", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenuItem onClick={handleResend} disabled={loading}>
      {loading ? (
        <>
          <Spinner className="size-4" /> Resending...
        </>
      ) : (
        <>
          <Mail /> Resend invite
        </>
      )}
    </DropdownMenuItem>
  );
}
