"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { axiosPostInstance } from "@/lib/api-client";
import { CREATE_NEW_TEAM } from "@/lib/api-routes";
import { formatCurrency } from "@/lib/currency-helpers";
import { genericError } from "@/lib/errors";
import { PRICING_URL } from "@/lib/external-urls";
import type { PlanInfo } from "@/lib/schemas/settings";
import {
  type CreateNewTeamResponse,
  createNewTeamResponseSchema,
} from "@/lib/schemas/teams";
import {
  type CreateNewTeamFormData,
  CreateNewTeamSchema,
} from "@/lib/validators";
import type { CreateNewTeamRequest } from "@/types/teams.types";

interface CreateNewTeamContentProps {
  plans: PlanInfo[];
  initialTeamName?: string;
  initialPlan?: string;
}

export function CreateNewTeamContent({
  plans,
  initialTeamName,
  initialPlan,
}: CreateNewTeamContentProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<CreateNewTeamFormData>({
    resolver: zodResolver(CreateNewTeamSchema),
    defaultValues: {
      teamName: initialTeamName || "",
      plan: initialPlan || "",
    },
  });

  const onSubmit = async (data: CreateNewTeamFormData) => {
    if (isCreating) return;

    const selectedPlan = plans.find((plan) => plan.type === data.plan);
    if (!selectedPlan) {
      toast.error("Selected plan not found");
      return;
    }

    // Skip if Enterprise (should be handled differently)
    if (selectedPlan.type === "enterprise") {
      toast.info("Please contact sales for Enterprise plans");
      return;
    }

    try {
      setIsCreating(true);

      const response = await axiosPostInstance<
        CreateNewTeamRequest,
        CreateNewTeamResponse
      >(
        CREATE_NEW_TEAM,
        {
          name: data.teamName,
          plan: selectedPlan.type,
          successUrl: `${window.location.origin}/team-created-success`,
          cancelUrl: `${window.location.origin}/create-new-team?teamName=${encodeURIComponent(data.teamName)}&plan=${encodeURIComponent(selectedPlan.type)}`,
          returnUrl: `${window.location.origin}/settings/billing`,
        },
        createNewTeamResponseSchema,
      );

      if (!response?.data) {
        throw new Error("Failed to create team");
      }

      // Redirect to Stripe checkout
      if (response.data.checkoutUrl) {
        toast.success("Redirecting to checkout...");
        window.location.href = response.data.checkoutUrl;
        return;
      }

      // Fallback (should not happen)
      throw new Error("No checkout URL received");
    } catch (error) {
      console.error("Error creating team", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex justify-center">
          <GradientIcon color="var(--color-background)" size="xl">
            <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-lg">
              <Image
                src="/logo-2.svg"
                alt="Meeting BaaS logo"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>
          </GradientIcon>
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Create New Team</h1>
          <p className="text-sm text-muted-foreground">
            Create a new team and choose a subscription plan to get started.
          </p>
        </div>

        <form
          id="create-new-team-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            {/* Team Name Field */}
            <Field>
              <FieldLabel htmlFor="teamName">Team Name</FieldLabel>
              <FieldDescription>
                Enter a name for your team. You can change this later.
              </FieldDescription>
              <Input
                id="teamName"
                type="text"
                placeholder="My Team"
                {...form.register("teamName")}
                aria-invalid={!!form.formState.errors.teamName}
              />
              {form.formState.errors.teamName && (
                <FieldError errors={[form.formState.errors.teamName]} />
              )}
            </Field>

            {/* Plan Selection */}
            <Controller
              name="plan"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid}>
                  <FieldLegend>Subscription Plan</FieldLegend>
                  <FieldDescription>
                    Select a plan that fits your needs. To see a detailed
                    feature list,{" "}
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto"
                      asChild
                    >
                      <a
                        href={PRICING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 has-[>svg]:!px-0"
                      >
                        click here
                        <ExternalLink className="size-3" />
                      </a>
                    </Button>
                  </FieldDescription>
                  <RadioGroup
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  >
                    {plans.map((plan) => (
                      <FieldLabel
                        key={plan.type}
                        htmlFor={`create-new-team-plan-${plan.type}`}
                      >
                        <Field
                          orientation="horizontal"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldContent className="flex-1">
                            <FieldTitle>
                              <span className="capitalize">{plan.name}</span>
                              {plan.price &&
                                ` (${formatCurrency(plan.price, "usd")}/${plan.interval === "month" ? "mo" : "yr"})`}
                            </FieldTitle>
                            <FieldDescription>
                              {plan.type === "enterprise"
                                ? "For teams with specific needs. Contact sales for custom pricing."
                                : plan.features.length > 0
                                  ? plan.features.slice(0, 2).join(", ") +
                                    (plan.features.length > 2 ? "..." : "")
                                  : "Advanced features and support"}
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroupItem
                            value={plan.type}
                            id={`create-new-team-plan-${plan.type}`}
                            aria-invalid={fieldState.invalid}
                          />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldSet>
              )}
            />
          </FieldGroup>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/bots")}
              disabled={isCreating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-new-team-form"
              disabled={isCreating || !form.formState.isValid}
              className="flex-1"
            >
              {isCreating ? (
                <>
                  <Spinner className="size-4" />
                  Creating...
                </>
              ) : (
                "Create Team"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
