"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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
import { ADMIN_PROVISION_TEAM_COMMITMENT, ADMIN_TEAM_COMMITMENT } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import {
  type AdminCommitment,
  type CommitmentFormValues,
  commitmentFormSchema,
  entitlementPlanSchema,
  type ProvisionCommitmentRequest,
  type UpsertCommitmentRequest,
  upsertCommitmentResponseSchema
} from "@/lib/schemas/admin"

interface CommitmentDialogProps {
  teamId: number
  commitment: AdminCommitment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ENTITLEMENT_PLANS = entitlementPlanSchema.options

// An empty or partially-typed field must not become NaN in form state — NaN
// renders literally as "NaN" in the input. Undefined leaves the field blank and
// zod reports it as required on submit.
const numericFieldValue = (raw: string, parse: (value: string) => number) => {
  if (raw === "") {
    return undefined
  }
  const parsed = parse(raw)
  return Number.isNaN(parsed) ? undefined : parsed
}

export function CommitmentDialog({
  teamId,
  commitment,
  open,
  onOpenChange
}: CommitmentDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Editing an existing commitment only re-records its terms — changing the rate
  // would need a fresh Stripe price/subscription, so provisioning is create-only.
  const isEdit = commitment !== null

  const defaultValues: CommitmentFormValues = commitment
    ? {
        mode: "manual",
        monthlyTokens: Number.parseFloat(commitment.monthlyTokens),
        pricePerTokenCents: Number.parseFloat(commitment.pricePerTokenCents),
        monthlyAmountCents: commitment.monthlyAmountCents,
        rollover: commitment.rollover,
        entitlementPlan: commitment.entitlementPlan,
        notes: commitment.notes ?? "",
        stripeSubscriptionId: commitment.stripeSubscriptionId,
        stripePriceId: commitment.stripePriceId,
        collectionMethod: "send_invoice",
        daysUntilDue: 30
      }
    : {
        mode: "provision",
        monthlyTokens: 0,
        pricePerTokenCents: 0,
        monthlyAmountCents: 0,
        rollover: true,
        entitlementPlan: "enterprise",
        notes: "",
        stripeSubscriptionId: "",
        stripePriceId: "",
        collectionMethod: "send_invoice",
        daysUntilDue: 30
      }

  const form = useForm<CommitmentFormValues>({
    resolver: zodResolver(commitmentFormSchema),
    defaultValues
  })

  const mode = useWatch({ control: form.control, name: "mode" })
  const collectionMethod = useWatch({
    control: form.control,
    name: "collectionMethod"
  })
  const monthlyTokens = useWatch({
    control: form.control,
    name: "monthlyTokens"
  })
  const pricePerTokenCents = useWatch({
    control: form.control,
    name: "pricePerTokenCents"
  })
  const monthlyAmountCents = useWatch({
    control: form.control,
    name: "monthlyAmountCents"
  })

  // Provision creates the Stripe price for us, so the charge is simply tokens x rate
  // — derive it and hide the field. Manual mode records an EXISTING subscription
  // whose real amount may be a round figure ($500.00 vs 2632 x $0.19 = $500.08), so
  // there the operator enters it and it must NOT be overwritten. Deriving in both
  // modes would silently rewrite a manual commitment's real amount on edit.
  const derivedAmountCents =
    monthlyTokens > 0 && pricePerTokenCents > 0 ? Math.round(monthlyTokens * pricePerTokenCents) : 0

  useEffect(() => {
    if (mode === "provision") {
      form.setValue("monthlyAmountCents", derivedAmountCents, { shouldValidate: true })
    }
  }, [form, mode, derivedAmountCents])

  const ratePerHour = pricePerTokenCents ? pricePerTokenCents / 100 : 0
  const chargePerMonth = monthlyAmountCents ? monthlyAmountCents / 100 : 0

  const onSubmit = async (data: CommitmentFormValues) => {
    if (loading) return

    try {
      setLoading(true)

      if (data.mode === "provision") {
        const payload: ProvisionCommitmentRequest = {
          monthlyTokens: data.monthlyTokens,
          pricePerTokenCents: data.pricePerTokenCents,
          monthlyAmountCents: data.monthlyAmountCents,
          rollover: data.rollover,
          entitlementPlan: data.entitlementPlan,
          notes: data.notes,
          collectionMethod: data.collectionMethod,
          daysUntilDue: data.daysUntilDue
        }
        await axiosPostInstance(
          ADMIN_PROVISION_TEAM_COMMITMENT(teamId),
          payload,
          upsertCommitmentResponseSchema
        )
        toast.success(
          "Commitment created and Stripe subscription provisioned. First invoice is on its way."
        )
      } else {
        const payload: UpsertCommitmentRequest = {
          monthlyTokens: data.monthlyTokens,
          pricePerTokenCents: data.pricePerTokenCents,
          monthlyAmountCents: data.monthlyAmountCents,
          stripeSubscriptionId: data.stripeSubscriptionId ?? "",
          stripePriceId: data.stripePriceId ?? "",
          rollover: data.rollover,
          entitlementPlan: data.entitlementPlan,
          notes: data.notes
        }
        await axiosPostInstance(
          ADMIN_TEAM_COMMITMENT(teamId),
          payload,
          upsertCommitmentResponseSchema
        )
        toast.success(
          isEdit
            ? "Commitment updated. Entitlement caps re-applied."
            : "Commitment recorded. Entitlement caps applied."
        )
      }

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
    // Reset on open, not close: a save refreshes the page and changes the
    // commitment prop, so values captured at the previous open are stale by now.
    if (open) {
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
          <DialogTitle>{isEdit ? "Edit Commitment" : "Create Commitment"}</DialogTitle>
          <DialogDescription>
            Contract pricing: a fixed monthly token grant at a negotiated rate. 1 token = 1 recorded
            hour. Usage beyond the balance is billed in arrears at the same rate.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              {!isEdit && (
                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="mode">Stripe subscription</FieldLabel>
                      <FieldContent>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={loading}
                        >
                          <FormControl>
                            <SelectTrigger id="mode" className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="provision">Create it for me</SelectItem>
                            <SelectItem value="manual">I already have the IDs</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {mode === "provision"
                            ? "Creates the Stripe price and subscription, then records the commitment. The team needs a Stripe customer."
                            : "Records the terms of a subscription you set up in Stripe yourself."}
                        </p>
                      </FieldContent>
                    </Field>
                  )}
                />
              )}

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
                          onChange={(e) =>
                            field.onChange(numericFieldValue(e.target.value, Number.parseFloat))
                          }
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
                          onChange={(e) =>
                            field.onChange(numericFieldValue(e.target.value, Number.parseFloat))
                          }
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
                  {monthlyTokens.toLocaleString("en-US")} hours at{" "}
                  <span className="font-medium text-foreground">
                    ${ratePerHour.toFixed(2)}/hour
                  </span>{" "}
                  ={" "}
                  <span className="font-medium text-foreground">
                    ${chargePerMonth.toFixed(2)}/month
                  </span>{" "}
                  <span className="text-muted-foreground">
                    ({monthlyAmountCents.toLocaleString("en-US")} cents)
                  </span>
                </p>
              ) : null}

              {mode === "manual" && (
                <>
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
                              onChange={(e) =>
                                field.onChange(
                                  numericFieldValue(e.target.value, (v) => Number.parseInt(v, 10))
                                )
                              }
                              disabled={loading}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            The existing subscription's real amount (e.g. a round 50000 = $500.00).
                            Defaults to tokens × rate but keep it matching Stripe.
                          </p>
                          <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                        </FieldContent>
                      </Field>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stripeSubscriptionId"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="stripeSubscriptionId">
                          Stripe Subscription ID
                        </FieldLabel>
                        <FieldContent>
                          <FormControl>
                            <Input
                              {...field}
                              id="stripeSubscriptionId"
                              value={field.value ?? ""}
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
                              value={field.value ?? ""}
                              placeholder="price_..."
                              disabled={loading}
                            />
                          </FormControl>
                          <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                        </FieldContent>
                      </Field>
                    )}
                  />
                </>
              )}

              {mode === "provision" && (
                <>
                  <FormField
                    control={form.control}
                    name="collectionMethod"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="collectionMethod">Collection</FieldLabel>
                        <FieldContent>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={loading}
                          >
                            <FormControl>
                              <SelectTrigger id="collectionMethod" className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="send_invoice">
                                Send invoice (email a hosted invoice)
                              </SelectItem>
                              <SelectItem value="charge_automatically">
                                Charge automatically (card on file)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            {collectionMethod === "charge_automatically"
                              ? "Requires a default payment method on the customer, or provisioning fails."
                              : "No card needed. Stripe emails a payable invoice each period."}
                          </p>
                          <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                        </FieldContent>
                      </Field>
                    )}
                  />
                  {collectionMethod === "send_invoice" && (
                    <FormField
                      control={form.control}
                      name="daysUntilDue"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="daysUntilDue">
                            Payment Terms (days until due)
                          </FieldLabel>
                          <FieldContent>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                id="daysUntilDue"
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    numericFieldValue(e.target.value, (v) => Number.parseInt(v, 10))
                                  )
                                }
                                disabled={loading}
                              />
                            </FormControl>
                            <FieldError
                              errors={fieldState.error ? [fieldState.error] : undefined}
                            />
                          </FieldContent>
                        </Field>
                      )}
                    />
                  )}
                </>
              )}

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
                {loading ? (
                  <Spinner />
                ) : mode === "provision" ? (
                  "Create Subscription"
                ) : (
                  "Save Commitment"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
