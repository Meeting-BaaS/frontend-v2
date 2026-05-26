"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { TranscriptionConfigFields } from "@/components/bots/create/transcription-config-fields";
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
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { axiosPostInstance } from "@/lib/api-client";
import { RETRANSCRIBE_BOT } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import { retranscribeFormSchema } from "@/lib/schemas/bots";
import { cn } from "@/lib/utils";

interface RetranscribeDialogProps {
  botUuid: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RetranscribeDialog({
  botUuid,
  open,
  onOpenChange,
}: RetranscribeDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(retranscribeFormSchema),
    defaultValues: {
      useOverride: false as const,
    },
  });

  const { watch, reset } = form;
  const useOverride = watch("useOverride");

  useEffect(() => {
    if (!useOverride) {
      reset({
        useOverride: false,
      });
    } else {
      reset({
        useOverride: true,
        provider: "gladia",
        api_key: "",
        custom_params: {},
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
    provider?: string;
    api_key?: string;
    custom_params?: Record<string, unknown>;
  }) => {
    if (loading) return;

    try {
      setLoading(true);

      const requestBody = data.useOverride
        ? {
            transcription: {
              provider: data.provider,
              api_key: data.api_key || null,
              custom_params:
                data.custom_params &&
                Object.keys(data.custom_params).length > 0
                  ? data.custom_params
                  : null,
            },
          }
        : null;

      await axiosPostInstance(
        RETRANSCRIBE_BOT(botUuid),
        requestBody,
        undefined,
      );

      toast.success("Retranscription started");
      router.refresh();
      onCancel(false);
    } catch (error) {
      console.error("Error starting retranscription", error);
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
      <DialogContent
        className="sm:max-w-[80vw] max-h-[80vh] flex flex-col"
        showCloseButton={!loading}
      >
        <DialogHeader>
          <DialogTitle>Retranscribe</DialogTitle>
          <DialogDescription>
            Retry transcription for this bot. Optionally override the
            transcription provider.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-y-auto flex-1 min-h-0"
          >
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
                      <FieldLabel htmlFor="use-override-retranscribe">
                        Override transcription provider
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                    <Switch
                      id="use-override-retranscribe"
                      name={field.name}
                      checked={field.value === true}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                      disabled={loading}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup className={disabledFieldClasses}>
              <TranscriptionConfigFields
                control={form.control as never}
                providerName="provider"
                apiKeyName="api_key"
                customParamsName="custom_params"
                disabled={!useOverride}
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
                aria-label={loading ? "Retranscribing" : "Retranscribe"}
              >
                {loading ? (
                  <>
                    <Spinner /> Retranscribing
                  </>
                ) : (
                  <>
                    <RefreshCw /> Retranscribe
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
