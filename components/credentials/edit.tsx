"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SendHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { FormFields } from "@/components/credentials/form-fields"
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
import { UPDATE_ZOOM_CREDENTIAL } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import {
  type UpdateZoomCredentialForm,
  type UpdateZoomCredentialResponse,
  updateZoomCredentialFormSchema,
  updateZoomCredentialResponseSchema,
  type ZoomCredential
} from "@/lib/schemas/credentials"

interface EditCredentialDialogProps {
  credential: ZoomCredential
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCredentialDialog({
  credential,
  open,
  onOpenChange
}: EditCredentialDialogProps) {
  const router = useRouter()
  const form = useForm<UpdateZoomCredentialForm>({
    resolver: zodResolver(updateZoomCredentialFormSchema),
    defaultValues: {
      name: credential.name,
      client_id: "",
      client_secret: "",
      authorization_code: "",
      redirect_uri: ""
    }
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: UpdateZoomCredentialForm) => {
    if (loading) return
    try {
      setLoading(true)

      // Filter out empty strings and unchanged values - only send fields that have changed
      // Note: Zod schema already trims all string fields
      const requestData: UpdateZoomCredentialForm = {}
      // Only include name if it's different from current
      if (data.name && data.name !== credential.name) {
        requestData.name = data.name
      }
      if (data.client_id) requestData.client_id = data.client_id
      if (data.client_secret) requestData.client_secret = data.client_secret
      if (data.authorization_code) requestData.authorization_code = data.authorization_code
      if (data.redirect_uri) requestData.redirect_uri = data.redirect_uri

      // Check if there's anything to update
      if (Object.keys(requestData).length === 0) {
        toast.error("No changes to save")
        return
      }

      const response = await axiosPatchInstance<
        UpdateZoomCredentialForm,
        UpdateZoomCredentialResponse
      >(
        UPDATE_ZOOM_CREDENTIAL(credential.credential_id),
        requestData,
        updateZoomCredentialResponseSchema
      )

      if (!response || !response.success) {
        console.error("Failed to update credential", response)
        throw new Error("Failed to update credential")
      }

      toast.success("Credential updated successfully")
      onCancel(false, true)
    } catch (error) {
      console.error("Error updating credential", error)
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setLoading(false)
    }
  }

  const onCancel = (updatedOpen: boolean, refresh?: boolean) => {
    if (updatedOpen || loading) {
      return
    }
    form.reset()
    onOpenChange(updatedOpen)

    if (refresh) {
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Edit Credential</DialogTitle>
          <DialogDescription>
            Update the Zoom credential &quot;{credential.name}&quot;. Leave fields blank to keep
            current values.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormFields loading={loading} mode="edit" />
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
