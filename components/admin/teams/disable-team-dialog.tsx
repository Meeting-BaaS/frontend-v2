"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ShieldOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { axiosPostInstance } from "@/lib/api-client"
import { ADMIN_DISABLE_TEAM } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import { type DisableTeamRequest, disableTeamRequestSchema } from "@/lib/schemas/admin"

interface DisableTeamDialogProps {
  teamId: number
  teamName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DisableTeamDialog({ teamId, teamName, open, onOpenChange }: DisableTeamDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<DisableTeamRequest>({
    resolver: zodResolver(disableTeamRequestSchema),
    defaultValues: { reason: "" }
  })

  const onSubmit = async (data: DisableTeamRequest) => {
    if (loading) return
    try {
      setLoading(true)
      await axiosPostInstance(ADMIN_DISABLE_TEAM(teamId), data, undefined)
      toast.success(`Team ${teamName} disabled. All API access is now blocked.`)
      router.refresh()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Error disabling team", error)
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldOff className="size-5 text-destructive" /> Disable {teamName}?
          </DialogTitle>
          <DialogDescription>
            This is the team-level kill switch. It is reversible, but while active it blocks the
            team completely.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <ShieldOff />
          <AlertTitle>Everything stops for this team</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                Every API request (bot creation, retrieval, calendars — the entire API) returns{" "}
                <span className="font-mono">403 TEAM_DISABLED</span>
              </li>
              <li>Scheduled bots are frozen and will not launch</li>
              <li>The team sees a full-width warning across their dashboard</li>
              <li>Bots currently in meetings finish and deliver normally</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <FormField
                control={form.control}
                name="reason"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="disable-reason">Reason (required, audited)</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input
                          id="disable-reason"
                          placeholder="e.g. abuse — repeated ToS violations, pending investigation"
                          aria-invalid={fieldState.invalid}
                          {...field}
                        />
                      </FormControl>
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="destructive" disabled={loading} aria-busy={loading}>
                {loading ? <Spinner /> : "Disable Team"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
