"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SendHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { LoginFormFields } from "@/components/microsoft-teams/login-form-fields"
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
import { UPDATE_TEAMS_LOGIN } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import {
  type TeamsLogin,
  type TeamsLoginSingleResponse,
  teamsLoginSingleResponseSchema,
  type UpdateTeamsLoginForm,
  updateTeamsLoginFormSchema
} from "@/lib/schemas/teams-logins"
import type { TeamsWorkspace } from "@/lib/schemas/teams-workspaces"

interface LoginUpdateDialogProps {
  login: TeamsLogin
  workspace: TeamsWorkspace
  open: boolean
  onOpenChange: (open: boolean) => void
}

// PATCH body — a subset of the login fields. email_group: null clears it.
type UpdateTeamsLoginBody = {
  name?: string
  password?: string
  email_group?: string | null
}

export function LoginUpdateDialog({
  login,
  workspace,
  open,
  onOpenChange
}: LoginUpdateDialogProps) {
  const router = useRouter()
  const form = useForm<UpdateTeamsLoginForm>({
    resolver: zodResolver(updateTeamsLoginFormSchema),
    defaultValues: {
      name: login.name,
      password: "",
      email_group: login.email_group ?? ""
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    form.reset({
      name: login.name,
      password: "",
      email_group: login.email_group ?? ""
    })
  }, [open, login.name, login.email_group, form])

  const onSubmit = async (data: UpdateTeamsLoginForm) => {
    if (loading) return
    try {
      setLoading(true)

      const requestData: UpdateTeamsLoginBody = {}
      if (data.name !== undefined && data.name !== "" && data.name !== login.name) {
        requestData.name = data.name
      }
      // password: send only if a new one was entered (blank = keep current).
      if (data.password !== undefined && data.password !== "") {
        requestData.password = data.password
      }
      // email_group: send only if it changed (treating null and "" as equivalent).
      // Send null to clear it (empty string is not a valid email server-side).
      const newGroup = data.email_group ?? ""
      const oldGroup = login.email_group ?? ""
      if (newGroup !== oldGroup) {
        requestData.email_group = newGroup === "" ? null : newGroup
      }

      if (Object.keys(requestData).length === 0) {
        toast.error("No changes to save")
        return
      }

      const response = await axiosPatchInstance<UpdateTeamsLoginBody, TeamsLoginSingleResponse>(
        UPDATE_TEAMS_LOGIN(login.credential_id),
        requestData,
        teamsLoginSingleResponseSchema
      )

      if (!response || !response.success) {
        console.error("Failed to update account", response)
        throw new Error("Failed to update account")
      }

      toast.success("Account updated successfully")
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating account", error)
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
          <DialogTitle>Update Account</DialogTitle>
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
