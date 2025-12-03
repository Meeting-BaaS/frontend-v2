"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { axiosPostInstance } from "@/lib/api-client";
import { ADMIN_UPDATE_RATE_LIMITS } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  type UpdateRateLimitsRequest,
  updateRateLimitsRequestSchema,
} from "@/lib/schemas/admin";

interface RateLimitsDialogProps {
  teamId: number;
  currentLimits: {
    rateLimitPerSecond: number;
    dailyBotCap: number;
    calendarIntegrationsLimit: number;
    dataRetentionDays: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RateLimitsDialog({
  teamId,
  currentLimits,
  open,
  onOpenChange,
}: RateLimitsDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateRateLimitsRequest>({
    resolver: zodResolver(updateRateLimitsRequestSchema),
    defaultValues: currentLimits,
  });

  const onSubmit = async (data: UpdateRateLimitsRequest) => {
    if (loading) return;

    try {
      setLoading(true);
      await axiosPostInstance(
        ADMIN_UPDATE_RATE_LIMITS(teamId),
        data,
        undefined,
      );
      toast.success("Rate limits updated successfully");
      router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating rate limits", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Update Rate Limits</DialogTitle>
          <DialogDescription>
            Update the rate limits for this team. Changes will be applied
            immediately.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <FormField
                control={form.control}
                name="rateLimitPerSecond"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="rateLimitPerSecond">
                      Rate Limit (per second)
                    </FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          id="rateLimitPerSecond"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value, 10))
                          }
                          disabled={loading}
                        />
                      </FormControl>
                      <FieldError
                        errors={
                          fieldState.error ? [fieldState.error] : undefined
                        }
                      />
                    </FieldContent>
                  </Field>
                )}
              />
              <FormField
                control={form.control}
                name="dailyBotCap"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="dailyBotCap">Daily Bot Cap</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          id="dailyBotCap"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value, 10))
                          }
                          disabled={loading}
                        />
                      </FormControl>
                      <FieldError
                        errors={
                          fieldState.error ? [fieldState.error] : undefined
                        }
                      />
                    </FieldContent>
                  </Field>
                )}
              />
              <FormField
                control={form.control}
                name="calendarIntegrationsLimit"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="calendarIntegrationsLimit">
                      Calendar Integrations Limit
                    </FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          id="calendarIntegrationsLimit"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value, 10))
                          }
                          disabled={loading}
                        />
                      </FormControl>
                      <FieldError
                        errors={
                          fieldState.error ? [fieldState.error] : undefined
                        }
                      />
                    </FieldContent>
                  </Field>
                )}
              />
              <FormField
                control={form.control}
                name="dataRetentionDays"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="dataRetentionDays">
                      Data Retention Days
                    </FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          id="dataRetentionDays"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value, 10))
                          }
                          disabled={loading}
                        />
                      </FormControl>
                      <FieldError
                        errors={
                          fieldState.error ? [fieldState.error] : undefined
                        }
                      />
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
                {loading ? <Spinner /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
