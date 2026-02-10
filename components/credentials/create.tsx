"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SendHorizontal } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
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
import { axiosPostInstance } from "@/lib/api-client"
import { CREATE_ZOOM_CREDENTIAL } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import {
  type CreateZoomCredentialForm,
  type CreateZoomCredentialRequest,
  type CreateZoomCredentialResponse,
  createZoomCredentialFormSchema,
  createZoomCredentialResponseSchema
} from "@/lib/schemas/credentials"

interface CreateCredentialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCredentialDialog({ open, onOpenChange }: CreateCredentialDialogProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const form = useForm<CreateZoomCredentialForm>({
    resolver: zodResolver(createZoomCredentialFormSchema),
    defaultValues: {
      name: "",
      client_id: "",
      client_secret: "",
      include_user_auth: false,
      authorization_code: undefined,
      redirect_uri: undefined
    }
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: CreateZoomCredentialForm) => {
    if (loading) return
    try {
      setLoading(true)

      // Build the request payload (exclude include_user_auth flag)
      const requestData: CreateZoomCredentialRequest = {
        name: data.name,
        client_id: data.client_id,
        client_secret: data.client_secret,
        ...(data.include_user_auth && {
          authorization_code: data.authorization_code,
          redirect_uri: data.redirect_uri
        })
      }

      const response = await axiosPostInstance<
        CreateZoomCredentialRequest,
        CreateZoomCredentialResponse
      >(CREATE_ZOOM_CREDENTIAL, requestData, createZoomCredentialResponseSchema)

      if (!response || !response.success) {
        console.error("Failed to create credential", response)
        throw new Error("Failed to create credential")
      }

      toast.success("Credential created successfully")
      onCancel(false, true)
    } catch (error) {
      console.error("Error creating credential", error)
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setLoading(false)
    }
  }

  const onCancel = (updatedOpen: boolean, nextJsReload?: boolean) => {
    if (updatedOpen || loading) {
      return
    }
    form.reset()
    onOpenChange(updatedOpen)

    // Remove new=true from searchParams when dialog closes
    if (searchParams.get("new") === "true") {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete("new")
      const newUrl = newSearchParams.toString()
        ? `${pathname}?${newSearchParams.toString()}`
        : pathname

      // If nextJsReload is true, we will reload the page using the next/navigation router
      // Otherwise, we will push the new URL to the history stack
      // This is useful to refetch the data from server when needed
      if (!nextJsReload) {
        window.history.pushState(null, "", newUrl)
      } else {
        router.replace(newUrl, { scroll: false })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Add Credential</DialogTitle>
          <DialogDescription>
            Add Zoom OAuth credentials to enable bot authentication for Zoom meetings.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormFields loading={loading} />
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
