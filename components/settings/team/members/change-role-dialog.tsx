"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateMemberRole } from "@/hooks/use-member-mutations";
import { useUser } from "@/hooks/use-user";
import type { TeamMember } from "@/lib/schemas/teams";
import {
  type InviteMemberFormData,
  inviteMemberFormSchema,
} from "@/lib/schemas/teams";

interface ChangeRoleDialogProps {
  member: TeamMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeRoleDialog({
  member,
  open,
  onOpenChange,
}: ChangeRoleDialogProps) {
  const { activeTeam } = useUser();
  const updateMemberRole = useUpdateMemberRole();

  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberFormSchema),
    defaultValues: {
      email: member.email,
      // This is just a fail safe. This popup wouldn't open for an owner.
      role: member.role === "owner" ? "admin" : member.role,
    },
  });

  const onSubmit = async (data: InviteMemberFormData) => {
    if (updateMemberRole.isPending) return;

    await updateMemberRole.mutate({
      role: data.role,
      memberId: member.id?.toString() ?? member.email,
      organizationId: activeTeam.id.toString(),
    });

    form.reset();
    onOpenChange(false);
  };

  const handleOpenChange = (updatedOpen: boolean) => {
    if (updatedOpen && updateMemberRole.isPending) {
      return;
    }
    form.reset();
    onOpenChange(updatedOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={!updateMemberRole.isPending}
      >
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>
            Update the role for this team member.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <InviteMemberFormFields
              loading={updateMemberRole.isPending}
              emailReadonly
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={updateMemberRole.isPending}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={updateMemberRole.isPending}
                aria-busy={updateMemberRole.isPending}
                aria-disabled={updateMemberRole.isPending}
              >
                {updateMemberRole.isPending ? (
                  <>
                    <Spinner className="size-4" /> Updating...
                  </>
                ) : (
                  "Update Role"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
