"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/use-user";
import { axiosPatchInstance } from "@/lib/api-client";
import { UPDATE_BILLING_EMAIL } from "@/lib/api-routes";
import { genericError, permissionDeniedError } from "@/lib/errors";
import {
  type UpdateBillingEmail,
  updateBillingEmailSchema,
} from "@/lib/schemas/settings";

interface BillingEmailFormProps {
  defaultEmail: string | null;
}

export function BillingEmailForm({ defaultEmail }: BillingEmailFormProps) {
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const { activeTeam } = useUser();

  const form = useForm<UpdateBillingEmail>({
    resolver: zodResolver(updateBillingEmailSchema),
    defaultValues: {
      email: defaultEmail ?? "",
    },
  });

  const isDirty = form.formState.isDirty;

  const onSubmit = async (data: UpdateBillingEmail) => {
    if (activeTeam.isMember) {
      toast.error(permissionDeniedError);
      return;
    }

    if (isUpdatingEmail) return;
    try {
      setIsUpdatingEmail(true);
      await axiosPatchInstance<UpdateBillingEmail, null>(
        UPDATE_BILLING_EMAIL,
        data,
      );

      // Reset form to show new email
      form.reset({
        email: data.email,
      });

      toast.success("Billing email updated successfully");
    } catch (error) {
      console.error("Error updating billing email", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Field>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className="md:!w-1/2 lg:!w-2/5"
            {...form.register("email")}
            aria-invalid={!!form.formState.errors.email}
          />
          {form.formState.errors.email && (
            <FieldDescription className="text-destructive">
              {form.formState.errors.email.message}
            </FieldDescription>
          )}
        </Field>
        <Button
          type="submit"
          size="sm"
          disabled={isUpdatingEmail || !isDirty}
          className="w-full sm:w-fit"
        >
          {isUpdatingEmail ? (
            <>
              <Spinner /> Updating...
            </>
          ) : (
            "Update email"
          )}
        </Button>
      </form>
    </Form>
  );
}
