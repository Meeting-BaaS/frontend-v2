"use client";

import { useQueryClient } from "@tanstack/react-query";
import { parseISO, subDays } from "date-fns";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TEAM_DETAILS_QUERY_KEY } from "@/hooks/use-team-details";
import { authClient } from "@/lib/auth-client";
import {
  formatFutureRelativeDate,
  formatISODateString,
} from "@/lib/date-helpers";
import { genericError } from "@/lib/errors";
import type { Invitation } from "@/lib/schemas/account";

interface PendingInvitesProps {
  invitations: Invitation[];
}

export function PendingInvites({ invitations }: PendingInvitesProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [loadingInvitationId, setLoadingInvitationId] = useState<string | null>(
    null,
  );

  const handleAccept = async (invitation: Invitation) => {
    if (loadingInvitationId) return;

    try {
      setLoadingInvitationId(invitation.id);
      const { error } = await authClient.organization.acceptInvitation({
        invitationId: invitation.id,
      });

      if (error) {
        toast.error(error.message || genericError);
        return;
      }

      // Set the newly joined team as active
      const { error: setActiveError } = await authClient.organization.setActive(
        {
          organizationId: invitation.teamId,
          organizationSlug: invitation.teamSlug,
        },
      );

      if (setActiveError) {
        console.error("Error setting active team", setActiveError);
        toast.error(setActiveError.message || genericError);
        // Still continue even if setActive fails - the user can switch teams manually
      }

      // Refetch team details to update team switcher
      await queryClient.invalidateQueries({
        queryKey: TEAM_DETAILS_QUERY_KEY,
      });
      await queryClient.refetchQueries({
        queryKey: TEAM_DETAILS_QUERY_KEY,
      });
      router.refresh();
      toast.success("Invitation accepted successfully");
    } catch (error) {
      console.error("Error accepting invitation", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoadingInvitationId(null);
    }
  };

  const handleReject = async (invitation: Invitation) => {
    if (loadingInvitationId) return;

    try {
      setLoadingInvitationId(invitation.id);
      const { error } = await authClient.organization.rejectInvitation({
        invitationId: invitation.id,
      });

      if (error) {
        toast.error(error.message || genericError);
        return;
      }

      toast.success("Invitation rejected");
      router.refresh(); // Refresh to show updated invitations
    } catch (error) {
      console.error("Error rejecting invitation", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoadingInvitationId(null);
    }
  };

  if (invitations.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">No pending invitations.</p>
      </div>
    );
  }

  // Calculate invited date (7 days before expiration, or use createdAt if available)
  const getInvitedDate = (invitation: Invitation): string => {
    // Invitations expire in 7 days, so calculate invite date
    const expiresAt = parseISO(invitation.expiresAt);
    const invitedDate = subDays(expiresAt, 7);
    return formatISODateString(invitedDate.toISOString());
  };

  return (
    <div className="flex flex-col gap-4">
      {invitations.map((invitation) => (
        <div
          key={invitation.id}
          className="flex items-center justify-between border rounded-lg p-4 gap-4"
        >
          <div className="flex-1">
            <div className="font-medium">{invitation.teamName}</div>
            <div className="text-sm text-muted-foreground">
              Invited on {getInvitedDate(invitation)} by{" "}
              {invitation.inviterEmail}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Expires {formatFutureRelativeDate(invitation.expiresAt)}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReject(invitation)}
                disabled={loadingInvitationId === invitation.id}
              >
                {loadingInvitationId === invitation.id ? (
                  <Spinner className="size-4" />
                ) : (
                  <>
                    <X className="size-4" /> Reject
                  </>
                )}
              </Button>
              <Button
                size="sm"
                onClick={() => handleAccept(invitation)}
                disabled={loadingInvitationId === invitation.id}
              >
                {loadingInvitationId === invitation.id ? (
                  <Spinner className="size-4" />
                ) : (
                  <>
                    <Check className="size-4" /> Accept
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
