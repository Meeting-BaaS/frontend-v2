"use client";

import { useState } from "react";
import { toast } from "sonner";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/use-user";
import { axiosDeleteInstance } from "@/lib/api-client";
import { DELETE_TEAM } from "@/lib/api-routes";
import { genericError, permissionDeniedError } from "@/lib/errors";

interface DeleteTeamDialogProps {
  teamName: string;
}

export function DeleteTeamDialog({ teamName }: DeleteTeamDialogProps) {
  const { activeTeam, setNextActiveTeamOrRedirect } = useUser();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfirmValid = confirmText === teamName;

  const handleDelete = async () => {
    if (!isConfirmValid || isDeleting) return;

    try {
      setIsDeleting(true);
      await axiosDeleteInstance(DELETE_TEAM);

      toast.success("Team deleted successfully");

      // Set next team as active or redirect to create-team
      await setNextActiveTeamOrRedirect("/bots");
    } catch (error) {
      console.error("Error deleting team", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setIsDeleting(false);
      setOpen(false);
      setConfirmText("");
    }
  };

  const handleOpenChange = (updatedOpen: boolean) => {
    if (updatedOpen) {
      if (isDeleting) {
        return;
      }
      if (activeTeam.isMember) {
        toast.error(permissionDeniedError);
        return;
      }
    }
    setOpen(updatedOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="w-full sm:w-fit">
          Delete team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" showCloseButton={!isDeleting}>
        <DialogHeader>
          <DialogTitle>Delete Team</DialogTitle>
          <DialogDescription>
            This will permanently delete the team &quot;{teamName}&quot; and all
            its associated data. All team members will lose access to this team.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDelete();
          }}
          className="space-y-6"
        >
          <Field>
            <FieldLabel htmlFor="confirm-delete">
              Type{" "}
              <Badge
                variant="warning"
                className="flex items-center gap-2 py-1 text-sm"
              >
                {teamName}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-3 [&_svg]:size-3 [&_svg]:text-foreground"
                  asChild
                >
                  <CopyButton text={teamName} />
                </Button>
              </Badge>{" "}
              to confirm:
            </FieldLabel>
            <FieldContent>
              <Input
                id="confirm-delete"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={teamName}
                disabled={isDeleting}
                aria-required="true"
              />
            </FieldContent>
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={!isConfirmValid || isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spinner className="size-4" /> Deleting...
                </>
              ) : (
                "Delete team"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
