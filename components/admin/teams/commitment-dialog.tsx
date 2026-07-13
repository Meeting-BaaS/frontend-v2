"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { axiosPostInstance } from "@/lib/api-client"
import { ADMIN_TEAM_COMMITMENT } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import {
  type AdminCommitment,
  type UpsertCommitmentRequest,
  upsertCommitmentRequestSchema
} from "@/lib/schemas/admin"

interface CommitmentDialogProps {
  teamId: number
  commitment: AdminCommitment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ENTITLEMENT_PLANS = ["payg", "pro", "scale", "enterprise"] as const

// Contract customers pay for tokens through the commitment, not a subscription, so
// they still need top-tier caps. Enterprise is the sane default.
const DEFAULT_VALUES: UpsertCommitmentRequest = {
  monthlyTokens: 0,
  pricePerTokenCents: 0,
  monthlyAmountCents: 0,
  stripeSubscriptionId: "",
  stripePriceId: "",
  rollover: true,
  entitlementPlan: "enterprise",
  notes: ""
}

export function CommitmentDialog({
  teamId,
  commitment,
  open,
  onOpenChange
}: CommitmentDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const defaultValues: UpsertCommitmentRequest = commitment
    ? {
        monthlyTokens: Number.parseFloat(commitment.monthlyTokens),
        pricePerTokenCents: Number.parseFloat(commitment.pricePerTokenCents),
        monthlyAmountCents: commitment.monthlyAmountCents,
        stripeSubscriptionId: commitment.stripeSubscriptionId,
        stripePriceId: commitment.stripePriceId,
        rollover: commitment.rollover,
        entitlementPlan: commitment.entitlementPlan as UpsertCommitmentRequest["entitlementPlan"],
        notes: commitment.notes ?? ""
      }
    : DEFAULT_VALUES

  const form = useForm<UpsertCommitmentRequest>({
    resolver: zodResolver(upsertCommitmentRequestSchema),
    defaultValues
  })

  // Echo the deal back in the units it was negotiated in ($/hour, $/month), so a
  // slipped decimal is obvious before it reaches Stripe.
  const monthlyTokens = useWatch({ control: form.control, name: "monthlyTokens" })
  const pricePerTokenCents = useWatch({
    control: form.control,
    name: "pricePerTokenCents"
  })
  const monthlyAmountCents = useWatch({
    control: form.control,
    name: "monthlyAmountCents"
  })

  const ratePerHour = pricePerTokenCents ? pricePerTokenCents / 100 : 0
  const chargePerMonth = monthlyAmountCents ? monthlyAmountCents / 100 : 0

  const onSubmit = async (data: UpsertCommitmentRequest) => {
    if (loading) return

    try {
      setLoading(true)
      await axiosPostInstance(ADMIN_TEAM_COMMITMENT(teamId), data, undefined)
      toast.success(
        commitment
          ? "Commitment updated. Entitlement caps re-applied."
          : "Commitment created. Entitlement caps applied."
      )
      router.refresh()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving commitment", error)
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset(defaultValues)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-lg max-h-[90vh] overflow-y-auto"
        showCloseButton={!loading}
      >
        <DialogHeader>
          <DialogTitle>{commitment ? "Edit Commitment" : "Create Commitment"}</DialogTitle>
          <DialogDescription>
            Contract pricing: a fixed monthly token grant at a negotiated rate. 1 token = 1 recorded
            hour. Usage beyond the balance is billed in arrears at the same rate. Set the Stripe
            subscription up first — this only records its terms.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <FormField
                control={form.control}
                name="monthlyTokens"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="monthlyTokens">Monthly Tokens (= hours)</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          id="monthlyTokens"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                          disabled={loading}
                        />
                      </FormControl>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </FieldContent>
                  </Field>
                )}
              />
              <FormField
                control={form.control}
                name="pricePerTokenCents"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="pricePerTokenCents">Rate (cents per token)</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.0001"
                          {...field}
                          id="pricePerTokenCents"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                          disabled={loading}
                        />
                      </FormControl>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </FieldContent>
                  </Field>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyAmountCents"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="monthlyAmountCents">Monthly Charge (cents)</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          id="monthlyAmountCents"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))}
                          disabled={loading}
                        />
                      </FormControl>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </FieldContent>
                  </Field>
                )}
              />

              {monthlyTokens > 0 && ratePerHour > 0 ? (
                <p className="text-sm text-muted-foreground">
                  {monthlyTokens.toLocaleString()} hours at{" "}
                  <span className="font-medium text-foreground">
                    ${ratePerHour.toFixed(2)}/hour
                  </span>{" "}
                  ={" "}
                  <span className="font-medium text-foreground">
                    ${chargePerMonth.toFixed(2)}/month
                  </span>
                </p>
              ) : null}

              <FormField
                control={form.control}
                name="stripeSubscriptionId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="stripeSubscriptionId">Stripe Subscription ID</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input
                          {...field}
                          id="stripeSubscriptionId"
                          placeholder="sub_..."
                          disabled={loading}
                        />
                      </FormControl>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </FieldContent>
                  </Field>
                )}
              />
              <FormField
                control={form.control}
                name="stripePriceId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="stripePriceId">Stripe Price ID</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input
                          {...field}
                          id="stripePriceId"
                          placeholder="price_..."
                          disabled={loading}
                        />
                      </FormControl>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </FieldContent>
                  </Field>
                )}
              />
              <FormField
                control={form.control}
                name="entitlementPlan"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="entitlementPlan">Entitlement Caps</FieldLabel>
                    <FieldContent>
                      <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                        <FormControl>
                          <SelectTrigger id="entitlementPlan" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ENTITLEMENT_PLANS.map((plan) => (
                            <SelectItem key={plan} value={plan} className="capitalize">
                              {plan}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Rate limit, bot cap, calendars, retention and BYOK are set from this plan.
                        The team is not charged for it.
                      </p>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </FieldContent>
                  </Field>
                )}
              />
              <FormField
                control={form.control}
                name="rollover"
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldLabel htmlFor="rollover">Rollover</FieldLabel>
                      <p className="text-xs text-muted-foreground">
                        Unused tokens carry forward. Off means the balance resets to the monthly
                        grant each period.
                      </p>
                    </FieldContent>
                    <FormControl>
                      <Switch
                        id="rollover"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loading}
                      />
                    </FormControl>
                  </Field>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="notes">Notes (optional)</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Textarea
                          {...field}
                          id="notes"
                          value={field.value ?? ""}
                          placeholder="Contract reference, who signed it, anything worth knowing later"
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
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading} aria-busy={loading}>
                {loading ? <Spinner /> : "Save Commitment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
