"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { email, object } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { Form, FormControl, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useInviteMember } from "@/hooks/use-member-mutations"
import { useUser } from "@/hooks/use-user"

const inviteUserFormSchema = object({
  email: email()
})

type InviteUserFormData = { email: string }

interface InviteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function InviteUserDialog({ open, onOpenChange, onSuccess }: InviteUserDialogProps) {
  const { activeTeam } = useUser()
  const inviteMember = useInviteMember()
  const router = useRouter()
  const form = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserFormSchema),
    defaultValues: { email: "" }
  })

  const onSubmit = async (data: InviteUserFormData) => {
    if (inviteMember.isPending) return
    try {
      await inviteMember.mutate({
        email: data.email,
        role: "admin",
        organizationId: activeTeam.id.toString()
      })
      onSuccess()
      form.reset()
      onOpenChange(false)
      router.refresh()
    } catch {
      // useInviteMember already toasts on error
    }
  }

  const onCancel = (nextOpen: boolean) => {
    if (!nextOpen) form.reset()
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md" showCloseButton={!inviteMember.isPending}>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Send an invitation to join. They will get an email with a link to create an account and
            access the app. Once they have signed up, you can change their role to admin if needed.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invite-email">Email</FieldLabel>
                  <FieldContent>
                    <FormControl>
                      <Input
                        id="invite-email"
                        type="email"
                        placeholder="colleague@example.com"
                        autoComplete="email"
                        disabled={inviteMember.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                  </FieldContent>
                </Field>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={inviteMember.isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={inviteMember.isPending}>
                {inviteMember.isPending ? (
                  <>
                    <Spinner className="size-4 mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send invitation"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
