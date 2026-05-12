"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SendHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { LoginFormFields } from "@/components/google-workspaces/login-form-fields"
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
import { Form } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { axiosPatchInstance } from "@/lib/api-client"
import { UPDATE_MEET_LOGIN } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import {
  type MeetLogin,
  type MeetLoginSingleResponse,
  meetLoginSingleResponseSchema,
  type UpdateMeetLoginForm,
  updateMeetLoginFormSchema
} from "@/lib/schemas/meet-logins"
import type { MeetWorkspace } from "@/lib/schemas/meet-workspaces"

interface LoginUpdateDialogProps {
  login: MeetLogin
  workspace: MeetWorkspace
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginUpdateDialog({
  login,
  workspace,
  open,
  onOpenChange
}: LoginUpdateDialogProps) {
  const router = useRouter()
  const form = useForm<UpdateMeetLoginForm>({
    resolver: zodResolver(updateMeetLoginFormSchema),
    defaultValues: {
      name: login.name,
      email_group: login.email_group ?? ""
    }
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: UpdateMeetLoginForm) => {
    if (loading) return
    try {
      setLoading(true)

      const requestData: UpdateMeetLoginForm = {}
      if (data.name !== undefined && data.name !== login.name) {
        requestData.name = data.name
      }
      // email_group: send only if it actually changed (treating null and "" as equivalent).
      const newGroup = data.email_group ?? ""
      const oldGroup = login.email_group ?? ""
      if (newGroup !== oldGroup) {
        requestData.email_group = newGroup
      }

      if (Object.keys(requestData).length === 0) {
        toast.error("No changes to save")
        return
      }

      const response = await axiosPatchInstance<UpdateMeetLoginForm, MeetLoginSingleResponse>(
        UPDATE_MEET_LOGIN(login.credential_id),
        requestData,
        meetLoginSingleResponseSchema
      )

      if (!response || !response.success) {
        console.error("Failed to update login", response)
        throw new Error("Failed to update login")
      }

      toast.success("Login updated successfully")
      onCancel(false, true)
    } catch (error) {
      console.error("Error updating login", error)
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setLoading(false)
    }
  }

  const onCancel = (updatedOpen: boolean, refresh?: boolean) => {
    if (updatedOpen || loading) return
    form.reset()
    onOpenChange(updatedOpen)
    if (refresh) router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Update Login</DialogTitle>
          <DialogDescription>
            Update <strong>{login.email}</strong>. Email and parent workspace are immutable — delete
            and recreate to change them.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <LoginFormFields loading={loading} mode="edit" workspaceDomain={workspace.domain} />
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
                aria-label={loading ? "Saving" : "Save"}
              >
                {loading ? (
                  <>
                    <Spinner /> Saving
                  </>
                ) : (
                  <>
                    <SendHorizontal />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
