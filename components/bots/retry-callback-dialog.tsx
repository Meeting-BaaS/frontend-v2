"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { axiosPostInstance } from "@/lib/api-client";
import { RETRY_CALLBACK } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import { retryCallbackFormSchema } from "@/lib/schemas/bots";
import { cn } from "@/lib/utils";

interface RetryCallbackDialogProps {
  botUuid: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RetryCallbackDialog({
  botUuid,
  open,
  onOpenChange,
}: RetryCallbackDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(retryCallbackFormSchema),
    defaultValues: {
      useOverride: false,
    },
  });

  const { watch, reset } = form;
  const useOverride = watch("useOverride");

  useEffect(() => {
    if (!useOverride) {
      reset({
        url: "",
        method: "POST",
        secret: "",
      });
    }
  }, [useOverride, reset]);

  const disabledFieldClasses = cn(
    "transition-opacity",
    useOverride
      ? "opacity-100 pointer-events-auto"
      : "opacity-30 pointer-events-none",
  );

  const onSubmit = async (data: {
    useOverride: boolean;
    url?: string;
    method?: "POST" | "PUT";
    secret?: string;
  }) => {
    if (loading) return;

    try {
      setLoading(true);

      // If useOverride is false, send null to use bot's original callback config
      // Otherwise, send the callback config with the provided values
      const requestBody = data.useOverride
        ? {
            url: data.url,
            method: data.method,
            secret: data.secret || null,
          }
        : null;

      await axiosPostInstance(
        RETRY_CALLBACK(botUuid),
        requestBody,
        undefined, // No response schema expected
      );

      toast.success("Callback retried successfully");
      router.refresh();
      onCancel(false);
    } catch (error) {
      console.error("Error retrying callback", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = (updatedOpen: boolean) => {
    if (updatedOpen && loading) {
      return;
    }
    reset({
      useOverride: false,
    });
    onOpenChange(updatedOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Retry Callback</DialogTitle>
          <DialogDescription>
            Retry sending the callback for this bot. You can optionally override
            the callback configuration.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Controller
                name="useOverride"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor="use-override">
                        Override callback configuration
                      </FieldLabel>
                      <FieldDescription>
                        If enabled, you can provide custom callback URL, method,
                        and secret. If disabled, the bot&apos;s original
                        callback configuration will be used.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                    <Switch
                      id="use-override"
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <FormField
                control={form.control}
                name="url"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className={disabledFieldClasses}
                  >
                    <FieldLabel htmlFor="callback-url">
                      Callback URL <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input
                          id="callback-url"
                          type="url"
                          placeholder="https://example.com/webhook"
                          {...field}
                          disabled={loading || !useOverride}
                          value={useOverride ? field.value || "" : ""}
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
                name="method"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className={disabledFieldClasses}
                  >
                    <FieldLabel htmlFor="callback-method">
                      HTTP Method
                    </FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Select
                          value={useOverride ? field.value || "POST" : ""}
                          onValueChange={field.onChange}
                          disabled={loading || !useOverride}
                        >
                          <SelectTrigger
                            id="callback-method"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                          </SelectContent>
                        </Select>
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
                name="secret"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className={disabledFieldClasses}
                  >
                    <FieldLabel htmlFor="callback-secret">
                      HMAC Secret (optional)
                    </FieldLabel>
                    <FieldDescription>
                      Custom HMAC secret to be sent in the{" "}
                      <code className="text-xs">x-mb-secret</code> header. If
                      not provided, no secret header will be sent.
                    </FieldDescription>
                    <FieldContent>
                      <FormControl>
                        <Input
                          id="callback-secret"
                          type="text"
                          placeholder="Your HMAC secret"
                          {...field}
                          disabled={loading || !useOverride}
                          value={useOverride ? field.value || "" : ""}
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
              <Button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                aria-disabled={loading}
                aria-label={loading ? "Retrying" : "Retry callback"}
              >
                {loading ? (
                  <>
                    <Spinner /> Retrying
                  </>
                ) : (
                  <>
                    <RefreshCw /> Retry callback
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
