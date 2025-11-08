"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useLeaveTeam } from "@/hooks/use-member-mutations";
import { useUser } from "@/hooks/use-user";

interface LeaveTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeaveTeamDialog({ open, onOpenChange }: LeaveTeamDialogProps) {
  const leaveTeam = useLeaveTeam();
  const { activeTeam, setNextActiveTeamOrRedirect } = useUser();
  const [confirmText, setConfirmText] = useState("");

  const isConfirmValid = confirmText === "leave";

  const handleLeave = async () => {
    if (!isConfirmValid || leaveTeam.isPending) return;

    await leaveTeam.mutate({
      organizationId: activeTeam.id.toString(),
    });

    // Set next team as active or redirect to create-team
    await setNextActiveTeamOrRedirect("/bots");

    setConfirmText("");
    onOpenChange(false);
  };

  const handleOpenChange = (updatedOpen: boolean) => {
    if (updatedOpen && leaveTeam.isPending) {
      return;
    }
    setConfirmText("");
    onOpenChange(updatedOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={!leaveTeam.isPending}
      >
        <DialogHeader>
          <DialogTitle>Leave Team</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave this team? You will lose access to
            all team data and resources.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLeave();
          }}
          className="space-y-6"
        >
          <Field>
            <FieldLabel htmlFor="confirm-leave">
              Type{" "}
              <Badge
                variant="warning"
                className="flex items-center gap-2 py-1 text-sm"
              >
                leave
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-3 [&_svg]:size-3 [&_svg]:text-foreground"
                  asChild
                >
                  <CopyButton text="leave" />
                </Button>
              </Badge>{" "}
              to confirm:
            </FieldLabel>
            <FieldContent>
              <Input
                id="confirm-leave"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="leave"
                disabled={leaveTeam.isPending}
                aria-required="true"
              />
            </FieldContent>
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={leaveTeam.isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={!isConfirmValid || leaveTeam.isPending}
            >
              {leaveTeam.isPending ? (
                <>
                  <Spinner className="size-4" /> Leaving...
                </>
              ) : (
                "Leave team"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
