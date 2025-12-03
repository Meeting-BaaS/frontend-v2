"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { axiosPatchInstance } from "@/lib/api-client";
import { UPDATE_AUTO_REFILL_SETTINGS } from "@/lib/api-routes";
import { formatCurrency } from "@/lib/currency-helpers";
import { genericError } from "@/lib/errors";
import type { TokenPack, UsageStats } from "@/lib/schemas/settings";
import {
  type UpdateAutoRefillSettings,
  updateAutoRefillSettingsSchema,
} from "@/lib/schemas/settings";
import { cn } from "@/lib/utils";

interface AutoRefillTokenFormProps {
  usageStats: UsageStats;
  tokenPacks: TokenPack[];
  tokenPacksLoading: boolean;
  onClose: () => void;
}

export function AutoRefillTokenForm({
  usageStats,
  tokenPacks,
  tokenPacksLoading,
  onClose,
}: AutoRefillTokenFormProps) {
  console.log("usageStats", usageStats);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<UpdateAutoRefillSettings>({
    resolver: zodResolver(updateAutoRefillSettingsSchema),
    defaultValues: {
      enabled: usageStats.plan.autoPurchaseEnabled ?? false,
      threshold: usageStats.plan.autoPurchaseTokenThreshold ?? 0,
      priceId: usageStats.plan.autoPurchasePriceId ?? "",
    },
  });

  const {
    reset,
    watch,
    formState: { isDirty },
  } = form;
  const enabled = watch("enabled");

  useEffect(() => {
    if (!enabled) {
      reset({ enabled: false });
    }
  }, [enabled, reset]);

  const disabledFieldClasses = cn(
    "transition-opacity",
    enabled
      ? "opacity-100 pointer-events-auto"
      : "opacity-30 pointer-events-none",
  );

  // Memoize token packs with calculated prices
  const tokenPacksWithPrices = useMemo(
    () =>
      tokenPacks.map((pack) => {
        // Calculate discounted price client-side (formatCurrency handles cents to dollars conversion)
        const discountMultiplier = 1 - pack.discountPercentage / 100;
        const discountedPrice = Math.round(
          pack.originalPrice * discountMultiplier,
        );
        const perTokenPrice = Math.round(discountedPrice / pack.tokens);
        return {
          ...pack,
          discountedPrice,
          perTokenPrice,
        };
      }),
    [tokenPacks],
  );

  const onSubmit = async (data: UpdateAutoRefillSettings) => {
    if (loading) return;
    setLoading(true);
    try {
      await axiosPatchInstance<UpdateAutoRefillSettings, null>(
        UPDATE_AUTO_REFILL_SETTINGS,
        data,
        undefined, // No response schema expected (204 response)
      );
      toast.success("Auto-refill settings updated successfully");
      onClose();
      // Refresh the page to get updated stats
      router.refresh();
    } catch (error) {
      console.error("Error updating auto-refill settings", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <Controller
            name="enabled"
            control={form.control}
            render={({
              field,
              fieldState,
            }: {
              field: ControllerRenderProps<UpdateAutoRefillSettings, "enabled">;
              fieldState: {
                invalid: boolean;
                error?: { message?: string };
              };
            }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="auto-refill-enabled">
                    Enable Auto-refill
                  </FieldLabel>
                  <FieldDescription>
                    Automatically purchase tokens when balance drops below
                    threshold.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Switch
                  id="auto-refill-enabled"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
        </FieldGroup>

        <FormField
          control={form.control}
          name="threshold"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className={disabledFieldClasses}
            >
              <FieldLabel htmlFor={field.name}>Threshold</FieldLabel>
              <FieldContent>
                <FormControl>
                  <Input
                    id={field.name}
                    type="number"
                    aria-invalid={fieldState.invalid}
                    disabled={!enabled}
                    onChange={(e) =>
                      field.onChange(Number.parseInt(e.target.value, 10))
                    }
                    value={enabled ? field.value || "" : ""}
                  />
                </FormControl>
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : undefined}
                />
                <p className="text-xs text-muted-foreground">
                  Triggers an auto-refill when tokens fall below this threshold.
                  We recommend setting it to a value that is slightly higher
                  than your expected concurrent usage.
                </p>
              </FieldContent>
            </Field>
          )}
        />

        <FormField
          control={form.control}
          name="priceId"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className={disabledFieldClasses}
            >
              <FieldLabel htmlFor={field.name}>Token Pack</FieldLabel>
              <FieldContent>
                <FormControl>
                  {tokenPacksLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Spinner className="size-4" />
                    </div>
                  ) : (
                    <Select
                      value={enabled ? field.value || "" : ""}
                      onValueChange={field.onChange}
                      name={field.name}
                      disabled={!enabled}
                    >
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="w-full flex flex-row [&_span_div]:flex-row [&_span_div]:items-center [&_span_div]:gap-2"
                      >
                        <SelectValue placeholder="Select a token pack" />
                      </SelectTrigger>
                      <SelectContent>
                        {tokenPacksWithPrices.map((pack) => (
                          <SelectItem key={pack.id} value={pack.priceId}>
                            <div className="flex flex-col">
                              <span className="font-medium">{pack.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {pack.tokens} tokens •{" "}
                                {formatCurrency(pack.discountedPrice, "usd")} •{" "}
                                {formatCurrency(pack.perTokenPrice, "usd")}
                                /token
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : undefined}
                />
              </FieldContent>
            </Field>
          )}
        />

        {enabled && (
          <Alert className={disabledFieldClasses}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Auto-purchase requires a default payment method to be set up in
              Stripe. Make sure you have a default payment method configured in
              your billing settings.
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !isDirty}
            aria-busy={loading}
            aria-disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="size-4" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
