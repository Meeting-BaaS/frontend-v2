"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SendHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
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
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Form, FormControl, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { axiosPatchInstance } from "@/lib/api-client"
import { UPDATE_MEET_WORKSPACE } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import {
  type MeetWorkspace,
  type MeetWorkspaceSingleResponse,
  meetWorkspaceSingleResponseSchema,
  type UpdateMeetWorkspaceNameForm,
  updateMeetWorkspaceNameFormSchema
} from "@/lib/schemas/meet-workspaces"

interface UpdateWorkspaceDialogProps {
  workspace: MeetWorkspace
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateWorkspaceDialog({
  workspace,
  open,
  onOpenChange
}: UpdateWorkspaceDialogProps) {
  const router = useRouter()
  const form = useForm<UpdateMeetWorkspaceNameForm>({
    resolver: zodResolver(updateMeetWorkspaceNameFormSchema),
    defaultValues: { name: workspace.name }
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: UpdateMeetWorkspaceNameForm) => {
    if (loading) return
    try {
      setLoading(true)

      if (data.name === workspace.name) {
        toast.error("No changes to save")
        return
      }

      const response = await axiosPatchInstance<
        UpdateMeetWorkspaceNameForm,
        MeetWorkspaceSingleResponse
      >(UPDATE_MEET_WORKSPACE(workspace.workspace_id), data, meetWorkspaceSingleResponseSchema)

      if (!response || !response.success) {
        console.error("Failed to update workspace", response)
        throw new Error("Failed to update workspace")
      }

      toast.success("Workspace updated successfully")
      onCancel(false, true)
    } catch (error) {
      console.error("Error updating workspace", error)
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
          <DialogTitle>Update Workspace</DialogTitle>
          <DialogDescription>
            Rename the workspace. To rotate the keypair or re-enable an invalidated workspace, use
            the dedicated actions in the menu.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input
                          {...field}
                          id={field.name}
                          autoComplete="off"
                          aria-invalid={fieldState.invalid}
                          aria-label="Workspace name"
                          maxLength={100}
                          disabled={loading}
                        />
                      </FormControl>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </FieldContent>
                  </Field>
                )}
              />
            </FieldGroup>
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
