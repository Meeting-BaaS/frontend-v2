"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { InviteMemberFormFields } from "@/components/settings/team/invite-member-form-fields";
import { Button } from "@/components/ui/button";
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
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { useInviteMember } from "@/hooks/use-member-mutations";
import { useUser } from "@/hooks/use-user";
import { permissionDeniedError } from "@/lib/errors";
import {
  type InviteMemberFormData,
  inviteMemberFormSchema,
  type TeamDetails,
} from "@/lib/schemas/teams";

interface InviteMemberDialogProps {
  allTeams: TeamDetails;
}

export function InviteMemberDialog({ allTeams }: InviteMemberDialogProps) {
  const { activeTeam, setTeamDetails } = useUser();
  const inviteMember = useInviteMember();
  const [open, setOpen] = useState(false);
  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberFormSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  useEffect(() => {
    setTeamDetails(allTeams);
  }, [allTeams, setTeamDetails]);

  const onSubmit = async (data: InviteMemberFormData) => {
    if (inviteMember.isPending) return;

    await inviteMember.mutate({
      email: data.email,
      role: data.role,
      organizationId: activeTeam.id.toString(),
    });

    form.reset();
    setOpen(false);
  };

  const onCancel = (updatedOpen: boolean) => {
    if (updatedOpen) {
      if (inviteMember.isPending) {
        return;
      }
      if (activeTeam.isMember) {
        toast.error(permissionDeniedError);
        return;
      }
    } else if (!updatedOpen) {
      form.reset();
    }
    setOpen(updatedOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full sm:w-auto font-medium">
          <Plus /> Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={!inviteMember.isPending}
      >
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your team. The invitee will receive an
            email with instructions to accept the invitation.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <InviteMemberFormFields loading={inviteMember.isPending} />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={inviteMember.isPending}
                aria-busy={inviteMember.isPending}
                aria-disabled={inviteMember.isPending}
                aria-label={
                  inviteMember.isPending ? "Sending" : "Send Invitation"
                }
              >
                {inviteMember.isPending ? (
                  <>
                    <Spinner /> Sending
                  </>
                ) : (
                  <>
                    <SendHorizontal />
                    Send Invitation
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
