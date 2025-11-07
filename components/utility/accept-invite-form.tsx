"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { genericError } from "@/lib/errors";

interface AcceptInviteFormProps {
  invitationId: string;
}

export function AcceptInviteForm({ invitationId }: AcceptInviteFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<"accept" | "reject" | null>(null);

  const handleAccept = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setAction("accept");
      const { error } = await authClient.organization.acceptInvitation({
        invitationId,
      });

      if (error) {
        console.error("Error accepting invitation", error);
        toast.error(error.message || genericError);
        return;
      }

      toast.success("Invitation accepted successfully");
      router.push("/bots");
    } catch (error) {
      console.error("Error accepting invitation", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  const handleReject = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setAction("reject");
      const { error } = await authClient.organization.rejectInvitation({
        invitationId,
      });

      if (error) {
        console.error("Error rejecting invitation", error);
        toast.error(error.message || genericError);
        return;
      }

      toast.success("Invitation rejected");
      router.push("/bots");
    } catch (error) {
      console.error("Error rejecting invitation", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        onClick={handleAccept}
        disabled={loading}
        className="flex-1"
        aria-busy={loading && action === "accept"}
        aria-disabled={loading}
      >
        {loading && action === "accept" ? (
          <>
            <Spinner /> Joining...
          </>
        ) : (
          "Join team"
        )}
      </Button>
      <Button
        onClick={handleReject}
        disabled={loading}
        variant="outline"
        className="flex-1"
        aria-busy={loading && action === "reject"}
        aria-disabled={loading}
      >
        {loading && action === "reject" ? (
          <>
            <Spinner /> Canceling...
          </>
        ) : (
          "Cancel invite"
        )}
      </Button>
    </div>
  );
}
