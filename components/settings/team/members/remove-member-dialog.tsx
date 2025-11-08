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
import { useRemoveMember } from "@/hooks/use-member-mutations";
import { useUser } from "@/hooks/use-user";
import type { TeamMember } from "@/lib/schemas/teams";

interface RemoveMemberDialogProps {
  member: TeamMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RemoveMemberDialog({
  member,
  open,
  onOpenChange,
}: RemoveMemberDialogProps) {
  const { activeTeam } = useUser();
  const removeMember = useRemoveMember();
  const [confirmText, setConfirmText] = useState("");

  const isConfirmValid = confirmText === "remove";

  const handleRemove = async () => {
    if (!isConfirmValid || removeMember.isPending) return;

    await removeMember.mutate({
      memberId: member.id?.toString() ?? member.email,
      organizationId: activeTeam.id.toString(),
    });

    setConfirmText("");
    onOpenChange(false);
  };

  const handleOpenChange = (updatedOpen: boolean) => {
    if (updatedOpen && removeMember.isPending) {
      return;
    }
    setConfirmText("");
    onOpenChange(updatedOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={!removeMember.isPending}
      >
        <DialogHeader>
          <DialogTitle>Remove Team Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove <strong>{member.email}</strong> from
            this team? They will lose access to all team data and resources.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRemove();
          }}
          className="space-y-6"
        >
          <Field>
            <FieldLabel htmlFor="confirm-remove">
              Type{" "}
              <Badge
                variant="warning"
                className="flex items-center gap-2 py-1 text-sm"
              >
                remove
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-3 [&_svg]:size-3 [&_svg]:text-foreground"
                  asChild
                >
                  <CopyButton text="remove" />
                </Button>
              </Badge>{" "}
              to confirm:
            </FieldLabel>
            <FieldContent>
              <Input
                id="confirm-remove"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="remove"
                disabled={removeMember.isPending}
                aria-required="true"
              />
            </FieldContent>
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={removeMember.isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={!isConfirmValid || removeMember.isPending}
            >
              {removeMember.isPending ? (
                <>
                  <Spinner className="size-4" /> Removing...
                </>
              ) : (
                "Remove member"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
