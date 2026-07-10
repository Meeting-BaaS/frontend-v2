"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SendHorizontal } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { CreateTeamsWorkspaceFormFields } from "@/components/microsoft-teams/form-fields"
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
import { CREATE_TEAMS_WORKSPACE } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import {
  type CreateTeamsWorkspaceForm,
  type CreateTeamsWorkspaceRequest,
  createTeamsWorkspaceFormSchema,
  type TeamsWorkspaceSingleResponse,
  teamsWorkspaceSingleResponseSchema
} from "@/lib/schemas/teams-workspaces"

interface CreateTeamsWorkspaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTeamsWorkspaceDialog({
  open,
  onOpenChange
}: CreateTeamsWorkspaceDialogProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const form = useForm<CreateTeamsWorkspaceForm>({
    resolver: zodResolver(createTeamsWorkspaceFormSchema),
    defaultValues: {
      name: "",
      domain: ""
    }
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: CreateTeamsWorkspaceForm) => {
    if (loading) return
    try {
      setLoading(true)

      const requestData: CreateTeamsWorkspaceRequest = {
        name: data.name,
        domain: data.domain
      }

      const response = await axiosPostInstance<
        CreateTeamsWorkspaceRequest,
        TeamsWorkspaceSingleResponse
      >(CREATE_TEAMS_WORKSPACE, requestData, teamsWorkspaceSingleResponseSchema)

      if (!response || !response.success) {
        console.error("Failed to create workspace", response)
        throw new Error("Failed to create workspace")
      }

      toast.success("Workspace created successfully")
      // Navigate to the new workspace's detail page so the customer can add logins.
      router.push(`/microsoft-teams/${response.data.workspace_id}?created=true`)
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating workspace", error)
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setLoading(false)
    }
  }

  const onCancel = (updatedOpen: boolean) => {
    if (updatedOpen || loading) return
    form.reset()
    onOpenChange(updatedOpen)

    if (searchParams.get("new") === "true") {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete("new")
      const newUrl = newSearchParams.toString()
        ? `${pathname}?${newSearchParams.toString()}`
        : pathname
      window.history.pushState(null, "", newUrl)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Add Workspace</DialogTitle>
          <DialogDescription>
            Register a Microsoft 365 tenant. After creation, add the bot accounts (username +
            password) that live under this tenant.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CreateTeamsWorkspaceFormFields loading={loading} />
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
