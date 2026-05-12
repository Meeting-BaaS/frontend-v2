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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Form, FormControl, FormField } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { axiosPatchInstance } from "@/lib/api-client"
import { UPDATE_MEET_WORKSPACE } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import {
  type MeetWorkspace,
  type MeetWorkspaceSingleResponse,
  meetWorkspaceSingleResponseSchema,
  type RotateMeetWorkspaceKeypairForm,
  rotateMeetWorkspaceKeypairFormSchema
} from "@/lib/schemas/meet-workspaces"

interface RotateWorkspaceKeypairDialogProps {
  workspace: MeetWorkspace
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RotateWorkspaceKeypairDialog({
  workspace,
  open,
  onOpenChange
}: RotateWorkspaceKeypairDialogProps) {
  const router = useRouter()
  const form = useForm<RotateMeetWorkspaceKeypairForm>({
    resolver: zodResolver(rotateMeetWorkspaceKeypairFormSchema),
    defaultValues: { cert_pem: "", private_key_pem: "" }
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: RotateMeetWorkspaceKeypairForm) => {
    if (loading) return
    try {
      setLoading(true)

      const response = await axiosPatchInstance<
        RotateMeetWorkspaceKeypairForm,
        MeetWorkspaceSingleResponse
      >(UPDATE_MEET_WORKSPACE(workspace.workspace_id), data, meetWorkspaceSingleResponseSchema)

      if (!response || !response.success) {
        console.error("Failed to rotate keypair", response)
        throw new Error("Failed to rotate keypair")
      }

      toast.success("Keypair rotated successfully")
      onCancel(false, true)
    } catch (error) {
      console.error("Error rotating keypair", error)
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
          <DialogTitle>Rotate Keypair</DialogTitle>
          <DialogDescription>
            Replace the certificate and private key for <strong>{workspace.name}</strong>. Upload
            the new certificate to Google Admin Console at the same time — bots will fail to sign in
            until the certs match on both sides.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <FormField
                control={form.control}
                name="cert_pem"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Certificate (PEM)</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Textarea
                          {...field}
                          id={field.name}
                          rows={6}
                          aria-invalid={fieldState.invalid}
                          placeholder="-----BEGIN CERTIFICATE-----..."
                          aria-label="Certificate PEM"
                          disabled={loading}
                          className="font-mono text-xs"
                        />
                      </FormControl>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </FieldContent>
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name="private_key_pem"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Private Key (PEM)</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Textarea
                          {...field}
                          id={field.name}
                          rows={6}
                          aria-invalid={fieldState.invalid}
                          placeholder="-----BEGIN PRIVATE KEY-----..."
                          aria-label="Private key PEM"
                          disabled={loading}
                          className="font-mono text-xs"
                        />
                      </FormControl>
                      <FieldDescription>
                        Never echoed back in any response. Stored encrypted at rest.
                      </FieldDescription>
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
                aria-label={loading ? "Rotating" : "Rotate Keypair"}
              >
                {loading ? (
                  <>
                    <Spinner /> Rotating
                  </>
                ) : (
                  <>
                    <SendHorizontal />
                    Rotate Keypair
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
