"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { useUser } from "@/hooks/use-user";
import { authClient } from "@/lib/auth-client";
import { genericError, permissionDeniedError } from "@/lib/errors";
import {
  type InviteMemberFormData,
  inviteMemberFormSchema,
} from "@/lib/schemas/teams";

export function InviteMemberDialog() {
  const { activeTeam } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberFormSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: InviteMemberFormData) => {
    if (loading) return;

    try {
      setLoading(true);
      const { error } = await authClient.organization.inviteMember({
        email: data.email,
        role: data.role,
      });

      if (error) {
        console.error("Error inviting member", error);
        toast.error(error.message || genericError);
        return;
      }

      toast.success("Invitation sent successfully");
      form.reset();
      setOpen(false);
      // Refresh the page to show the new invitation in the list
      router.refresh();
    } catch (error) {
      console.error("Error inviting member", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = (updatedOpen: boolean) => {
    if (updatedOpen) {
      if (loading) {
        return;
      }
      if (activeTeam.role === "member") {
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
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your team. The invitee will receive an
            email with instructions to accept the invitation.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <InviteMemberFormFields loading={loading} />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                aria-disabled={loading}
                aria-label={loading ? "Sending" : "Send Invitation"}
              >
                {loading ? (
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
