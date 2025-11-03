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
import { axiosPatchInstance } from "@/lib/api-client";
import { UPDATE_BILLING_EMAIL } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  type UpdateBillingEmail,
  updateBillingEmailSchema,
} from "@/lib/schemas/settings";

interface BillingEmailFormProps {
  defaultEmail: string | null;
}

export function BillingEmailForm({ defaultEmail }: BillingEmailFormProps) {
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  const form = useForm<UpdateBillingEmail>({
    resolver: zodResolver(updateBillingEmailSchema),
    defaultValues: {
      email: defaultEmail ?? "",
    },
  });

  const isDirty = form.formState.isDirty;

  const onSubmit = async (data: UpdateBillingEmail) => {
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
            {...form.register("email")}
            aria-invalid={!!form.formState.errors.email}
          />
          {form.formState.errors.email && (
            <FieldDescription className="text-destructive">
              {form.formState.errors.email.message}
            </FieldDescription>
          )}
        </Field>
        <Button type="submit" size="sm" disabled={isUpdatingEmail || !isDirty}>
          {isUpdatingEmail ? (
            <>
              <Spinner /> Updating...
            </>
          ) : (
            "Update Email"
          )}
        </Button>
      </form>
    </Form>
  );
}
