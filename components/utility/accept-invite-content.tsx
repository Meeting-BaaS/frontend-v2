"use client";

import { isDateBefore } from "@/lib/date-helpers";
import type { InvitationResponse } from "@/lib/schemas/teams";
import { AcceptInviteForm } from "./accept-invite-form";
import { AcceptInviteNotFound } from "./accept-invite-not-found";

interface AcceptInviteContentProps {
  invitation: InvitationResponse;
}

export function AcceptInviteContent({ invitation }: AcceptInviteContentProps) {
  // Check if invitation is valid (pending status and not expired)
  const isExpired = isDateBefore(
    invitation.data.expiresAt,
    new Date().toISOString(),
  );
  const isInvalidStatus = invitation.data.status !== "pending";

  if (isExpired || isInvalidStatus) {
    return <AcceptInviteNotFound />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Accept Invite</h1>
          <p className="text-sm text-muted-foreground">
            {invitation.data.inviterEmail} invited you to join the{" "}
            <strong>{invitation.data.organizationName}</strong> team. To accept
            the invite, please click the button below.
          </p>
        </div>
        <AcceptInviteForm invitationId={invitation.data.id} />
      </div>
    </div>
  );
}
