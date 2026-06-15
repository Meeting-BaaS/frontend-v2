"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SendHorizontal } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { CreateWorkspaceFormFields } from "@/components/google-workspaces/form-fields"
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
import { CREATE_MEET_WORKSPACE } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import {
  type CreateMeetWorkspaceForm,
  type CreateMeetWorkspaceRequest,
  createMeetWorkspaceFormSchema,
  type MeetWorkspaceSingleResponse,
  meetWorkspaceSingleResponseSchema
} from "@/lib/schemas/meet-workspaces"

interface CreateWorkspaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateWorkspaceDialog({ open, onOpenChange }: CreateWorkspaceDialogProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const form = useForm<CreateMeetWorkspaceForm>({
    resolver: zodResolver(createMeetWorkspaceFormSchema),
    defaultValues: {
      name: "",
      domain: "",
      generate_keypair: true,
      cert_pem: undefined,
      private_key_pem: undefined
    }
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: CreateMeetWorkspaceForm) => {
    if (loading) return
    try {
      setLoading(true)

      const requestData: CreateMeetWorkspaceRequest = data.generate_keypair
        ? { name: data.name, domain: data.domain, generate_keypair: true }
        : {
            name: data.name,
            domain: data.domain,
            cert_pem: data.cert_pem ?? "",
            private_key_pem: data.private_key_pem ?? ""
          }

      const response = await axiosPostInstance<
        CreateMeetWorkspaceRequest,
        MeetWorkspaceSingleResponse
      >(CREATE_MEET_WORKSPACE, requestData, meetWorkspaceSingleResponseSchema)

      if (!response || !response.success) {
        console.error("Failed to create workspace", response)
        throw new Error("Failed to create workspace")
      }

      toast.success("Workspace created successfully")
      // Drop the `new` query param and navigate to the new workspace's detail page
      // so the customer immediately sees the cert PEM to upload to Google Admin.
      router.push(`/google-workspaces/${response.data.workspace_id}?created=true`)
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
            Register a Google Workspace for SAML SSO authentication. After creation, you&apos;ll
            need to upload the returned certificate to your Google Admin Console.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CreateWorkspaceFormFields loading={loading} />
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
