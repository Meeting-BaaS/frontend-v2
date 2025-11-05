"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { usePlans } from "@/hooks/use-plans";
import { useUser } from "@/hooks/use-user";
import { authClient } from "@/lib/auth-client";
import { genericError } from "@/lib/errors";

interface RestorePlanDialogProps {
  open: boolean;
  planName: string;
  subscriptionId: string | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RestorePlanDialog({
  open,
  planName,
  subscriptionId,
  onOpenChange,
  onSuccess,
}: RestorePlanDialogProps) {
  const [loading, setLoading] = useState(false);
  const { refetch } = usePlans();
  const { teamDetails } = useUser();

  const handleRestore = async () => {
    if (loading || !subscriptionId) return;

    try {
      setLoading(true);

      // Get the active team ID for referenceId
      const teamId = teamDetails.find((team) => team.isActive)?.id;

      const { data, error } = await authClient.subscription.restore({
        subscriptionId,
        referenceId: teamId?.toString(),
      });

      if (error || !data) {
        throw new Error(error?.message || "Failed to restore subscription");
      }

      // Refetch plans to update current plan status
      await refetch();

      toast.success("Subscription restored successfully");
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error restoring subscription", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = (updatedOpen: boolean) => {
    if (updatedOpen || loading) {
      return;
    }
    onOpenChange(updatedOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Restore {planName} Plan</DialogTitle>
          <DialogDescription className="sr-only">
            Confirm restoration of your subscription
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <p>
              Are you sure you want to restore your <strong>{planName}</strong>{" "}
              plan?
            </p>
            <p className="text-sm text-muted-foreground">
              Your subscription will continue to renew automatically. You'll be
              charged at the end of your current billing period.
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleRestore}
            disabled={loading}
            aria-busy={loading}
            aria-disabled={loading}
            aria-label={loading ? "Restoring..." : "Restore Plan"}
          >
            {loading ? (
              <>
                <Spinner /> Restoring...
              </>
            ) : (
              "Restore Plan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
