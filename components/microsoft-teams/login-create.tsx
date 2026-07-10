"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SendHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
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
import { axiosPostInstance } from "@/lib/api-client"
import { CREATE_TEAMS_LOGIN } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import {
  type CreateTeamsLoginForm,
  type CreateTeamsLoginRequest,
  createTeamsLoginFormSchema,
  type TeamsLoginSingleResponse,
  teamsLoginSingleResponseSchema
} from "@/lib/schemas/teams-logins"

interface LoginCreateDialogProps {
  workspaceId: string
  workspaceDomain: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginCreateDialog({
  workspaceId,
  workspaceDomain,
  open,
  onOpenChange
}: LoginCreateDialogProps) {
  const router = useRouter()
  const form = useForm<CreateTeamsLoginForm>({
    resolver: zodResolver(createTeamsLoginFormSchema),
    defaultValues: {
      workspace_id: workspaceId,
      name: "",
      email: "",
      password: "",
      email_group: undefined
    }
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: CreateTeamsLoginForm) => {
    if (loading) return
    try {
      setLoading(true)

      const requestData: CreateTeamsLoginRequest = {
        workspace_id: data.workspace_id,
        name: data.name,
        email: data.email,
        password: data.password,
        ...(data.email_group ? { email_group: data.email_group } : {})
      }

      const response = await axiosPostInstance<CreateTeamsLoginRequest, TeamsLoginSingleResponse>(
        CREATE_TEAMS_LOGIN,
        requestData,
        teamsLoginSingleResponseSchema
      )

      if (!response || !response.success) {
        console.error("Failed to create account", response)
        throw new Error("Failed to create account")
      }

      toast.success("Account created successfully")
      form.reset()
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error creating account", error)
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
          <DialogTitle>Add Account</DialogTitle>
          <DialogDescription>
            Register a Microsoft 365 account that bots can sign in as. The account must be exempt
            from MFA and captcha so the bot can authenticate unattended.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <LoginFormFields loading={loading} workspaceDomain={workspaceDomain} />
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
                    Save
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
